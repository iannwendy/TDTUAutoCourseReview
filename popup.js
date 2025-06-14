// Lưu trữ trạng thái extension
let isRunning = false;

document.addEventListener('DOMContentLoaded', function() {
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

    // Kiểm tra trạng thái hiện tại
    checkCurrentStatus();
    
    // Cập nhật UI ban đầu
    updateDelaySelection();
});

function loadSettings() {
    chrome.storage.sync.get(['delay', 'autoStart'], function(result) {
        const delay = result.delay !== undefined ? result.delay : 1; // Mặc định 1 giây
        const autoStart = result.autoStart !== false;
        
        // Set delay radio button
        const delayRadio = document.querySelector(`input[name="delay"][value="${delay}"]`);
        if (delayRadio) {
            delayRadio.checked = true;
        }
        
        // Set auto start checkbox
        document.getElementById('autoStart').checked = autoStart;
        
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
    
    // Gửi message đến content script để bắt đầu
    const selectedDelay = document.querySelector('input[name="delay"]:checked');
    const delay = selectedDelay ? parseFloat(selectedDelay.value) : 1;
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'start',
            delay: delay
        }, function(response) {
            if (chrome.runtime.lastError) {
                updateStatus('stopped', 'Lỗi: Không thể kết nối với trang web');
                resetButtons();
            }
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
    statusDiv.textContent = `Trạng thái: ${message}`;
}

function updateProgress(current, total) {
    const progressSpan = document.getElementById('progress');
    const progressFill = document.getElementById('progressFill');
    
    progressSpan.textContent = `${current}/${total}`;
    
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