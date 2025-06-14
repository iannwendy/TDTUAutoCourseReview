// Lưu trữ trạng thái extension
let isRunning = false;

// Loading screen functions
function checkAndShowLoadingScreen() {
    // Get current session timestamp
    const currentTime = Date.now();
    
    // Check if this is first open after Chrome startup
    chrome.storage.session.get(['lastExtensionOpen'], function(result) {
        const lastOpen = result.lastExtensionOpen || 0;
        const timeDiff = currentTime - lastOpen;
        
        // If more than 30 seconds have passed or no previous record, consider it a new Chrome session
        if (timeDiff > 30000 || lastOpen === 0) {
            showLoadingScreen();
        } else {
            hideLoadingScreen();
        }
        
        // Update last open time
        chrome.storage.session.set({ lastExtensionOpen: currentTime });
    });
}

function showLoadingScreen() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        // First load the saved theme to apply correct colors
        chrome.storage.sync.get(['theme'], function(result) {
            const theme = result.theme || 'ocean';
            applyThemeToLoading(theme);
            
            // Show loading screen
            loadingOverlay.style.display = 'flex';
            loadingOverlay.classList.remove('fade-out');
            
            // Hide after 1 second
            setTimeout(() => {
                hideLoadingScreen();
            }, 500);
        });
    }
}

function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const container = document.querySelector('.container');
    
    if (loadingOverlay) {
        // Start fading out loading screen
        loadingOverlay.classList.add('fade-out');
        
        // After a delay, show the main container with smooth animation
        setTimeout(() => {
            if (container) {
                container.classList.add('loaded');
            }
        }, 100);
        
        // Hide loading overlay after animation completes
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 400); // tối ưu theo hiệu ứng nhanh hơn
    }
}

function applyThemeToLoading(theme) {
    const body = document.body;
    // Remove all theme classes first
    body.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest', 'theme-cosmic');
    
    // Add the selected theme class if not ocean (default)
    if (theme !== 'ocean') {
        body.classList.add(`theme-${theme}`);
    }
}

// Helper functions - định nghĩa trước khi sử dụng
function switchTheme(theme) {
    const body = document.body;
    
    // Remove all theme classes
    body.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest', 'theme-cosmic');
    
    // Add the selected theme class
    if (theme !== 'ocean') {
        body.classList.add(`theme-${theme}`);
    }
    
    // Add smooth transition effect
    body.style.transition = 'background 0.8s ease-in-out';
    
    // Remove transition after animation completes
    setTimeout(() => {
        body.style.transition = '';
    }, 800);
    
    console.log('Theme switched to:', theme);
}

function createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('div');
    const size = Math.max(rect.width, rect.height);
    
    ripple.className = 'click-ripple';
    ripple.style.width = ripple.style.height = '0px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

function showFeedback(message) {
    const feedback = document.createElement('div');
    feedback.className = 'success-feedback';
    feedback.textContent = message;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

function addButtonEffects() {
    // Add ripple effect to all buttons
    document.querySelectorAll('.button, .theme-btn').forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if this is the first time opening extension after Chrome startup
    checkAndShowLoadingScreen();

    // Khởi tạo elements
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const statusDiv = document.getElementById('status');
    const progressSpan = document.getElementById('progress');
    const progressFill = document.getElementById('progressFill');
    const delayOptions = document.querySelectorAll('input[name="delay"]');
    const autoStartCheckbox = document.getElementById('autoStart');
    
    // Modal elements
    const aboutModal = document.getElementById('aboutModal');
    const closeModal = document.getElementById('closeModal');
    const githubLink = document.getElementById('githubLink');
    const instagramLink = document.getElementById('instagramLink');

    // Tải cài đặt từ storage
    loadSettings();

    // Event listeners
    startBtn.addEventListener('click', startAutoReview);
    stopBtn.addEventListener('click', stopAutoReview);
    settingsBtn.addEventListener('click', openSettings);
    autoStartCheckbox.addEventListener('change', saveSettings);
    
    // Modal event listeners
    closeModal.addEventListener('click', function() {
        aboutModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    aboutModal.addEventListener('click', function(e) {
        if (e.target === aboutModal) {
            aboutModal.style.display = 'none';
        }
    });
    
    // Social links
    githubLink.addEventListener('click', function(e) {
        e.preventDefault();
        chrome.tabs.create({ url: 'https://github.com/iannwendy' });
    });
    
    instagramLink.addEventListener('click', function(e) {
        e.preventDefault();
        chrome.tabs.create({ url: 'https://instagram.com/iannwendy' });
    });
    
    // Event listeners cho delay options
    delayOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateDelaySelection();
            saveSettings();
        });
    });
    
    // Event listeners cho delay option labels
    document.querySelectorAll('.delay-option').forEach(label => {
        label.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            updateDelaySelection();
            saveSettings();
        });
    });
    
    // Theme switcher event listeners
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            switchTheme(theme);
            
            // Update active state
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Save theme preference
            chrome.storage.sync.set({ theme: theme });
        });
    });

    // Kiểm tra trạng thái hiện tại
    checkCurrentStatus();
    
    // Cập nhật UI ban đầu
    updateDelaySelection();
    
    // Add button effects
    addButtonEffects();
});

function loadSettings() {
    chrome.storage.sync.get(['delay', 'autoStart', 'theme'], function(result) {
        const delay = result.delay !== undefined ? result.delay : 1; // Mặc định 1 giây
        const autoStart = result.autoStart !== false;
        const theme = result.theme || 'ocean'; // Mặc định ocean theme
        
        // Set delay radio button
        const delayRadio = document.querySelector(`input[name="delay"][value="${delay}"]`);
        if (delayRadio) {
            delayRadio.checked = true;
        }
        
        // Set auto start checkbox
        document.getElementById('autoStart').checked = autoStart;
        
        // Set theme
        switchTheme(theme);
        const themeBtn = document.querySelector(`[data-theme="${theme}"]`);
        if (themeBtn) {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            themeBtn.classList.add('active');
        }
        
        updateDelaySelection();
    });
}

function saveSettings() {
    const selectedDelay = document.querySelector('input[name="delay"]:checked');
    const delay = selectedDelay ? parseFloat(selectedDelay.value) : 1;
    const autoStart = document.getElementById('autoStart').checked;
    
    chrome.storage.sync.set({
        delay: delay,
        autoStart: autoStart
    });
    
    console.log('Settings saved:', { delay, autoStart });
}

function updateDelaySelection() {
    // Cập nhật visual selection cho delay options
    document.querySelectorAll('.delay-option').forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio.checked) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

function startAutoReview() {
    isRunning = true;
    updateStatus('running', 'Đang quét môn học...');
    
    // Disable start button, enable stop button
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
    
    // Get delay from storage to ensure we use the saved value
    chrome.storage.sync.get(['delay'], function(result) {
        const delay = result.delay || 1; // Use stored delay or default to 1
        console.log('Using delay from storage:', delay);
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'start',
                delay: delay // Send delay in seconds, content.js will convert to milliseconds
            }, function(response) {
                if (chrome.runtime.lastError) {
                    updateStatus('stopped', 'Lỗi: Không thể kết nối với trang web');
                    resetButtons();
                }
            });
        });
    });
}

function stopAutoReview() {
    isRunning = false;
    updateStatus('stopped', 'Đã dừng');
    resetButtons();
    
    // Gửi message đến content script để dừng
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'stop'
        });
    });
}

function resetButtons() {
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
}

function openSettings() {
    // Hiển thị modal About
    const aboutModal = document.getElementById('aboutModal');
    aboutModal.style.display = 'block';
}

function updateStatus(type, message) {
    const statusDiv = document.getElementById('status');
    statusDiv.className = `status ${type}`;
    
    let icon = '';
    switch(type) {
        case 'idle':
            icon = '<i class="fas fa-circle-check" style="margin-right: 8px;"></i>';
            break;
        case 'running':
            icon = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>';
            break;
        case 'stopped':
            icon = '<i class="fas fa-circle-xmark" style="margin-right: 8px;"></i>';
            break;
        default:
            icon = '<i class="fas fa-circle-info" style="margin-right: 8px;"></i>';
    }
    
    statusDiv.innerHTML = `${icon}Trạng thái: ${message}`;
}

function updateProgress(current, total) {
    const progressSpan = document.getElementById('progress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.querySelector('.progress-text');
    
    progressSpan.textContent = `${current}/${total}`;
    
    // Add loading animation when in progress
    if (current < total && total > 0) {
        progressText.classList.add('loading');
    } else {
        progressText.classList.remove('loading');
    }
    
    // Cập nhật progress bar
    if (total > 0) {
        const percentage = (current / total) * 100;
        progressFill.style.width = `${percentage}%`;
    } else {
        progressFill.style.width = '0%';
    }
}

function checkCurrentStatus() {
    // Kiểm tra xem có đang chạy trên tab hiện tại không
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'getStatus'}, function(response) {
                if (chrome.runtime.lastError) {
                    // Không thể kết nối với content script
                    updateStatus('idle', 'Sẵn sàng');
                    resetButtons();
                    return;
                }
                
                if (response && response.isRunning) {
                    isRunning = true;
                    updateStatus('running', 'Đang chạy...');
                    updateProgress(response.current || 0, response.total || 0);
                    document.getElementById('startBtn').disabled = true;
                    document.getElementById('stopBtn').disabled = false;
                } else {
                    updateStatus('idle', 'Sẵn sàng');
                    resetButtons();
                }
            });
        }
    });
}

// Lắng nghe messages từ content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateProgress') {
        updateProgress(request.current, request.total);
        
        // Cập nhật status message dựa trên tiến độ
        if (request.current < request.total) {
            updateStatus('running', `Đang xử lý môn ${request.current + 1}/${request.total}`);
        }
    } else if (request.action === 'completed') {
        updateStatus('idle', 'Hoàn thành tất cả môn học! 🎉');
        isRunning = false;
        resetButtons();
        
        // Show celebration effect
        showFeedback('🎉 Hoàn thành! Tất cả môn học đã được đánh giá!');
        
        // Trigger celebration animation
        document.body.classList.add('celebration');
        setTimeout(() => {
            document.body.classList.remove('celebration');
        }, 2000);
        
        // Reset progress bar sau 3 giây
        setTimeout(() => {
            updateProgress(0, 0);
            updateStatus('idle', 'Sẵn sàng');
        }, 3000);
    } else if (request.action === 'error') {
        updateStatus('stopped', 'Có lỗi xảy ra');
        isRunning = false;
        resetButtons();
    }
}); 