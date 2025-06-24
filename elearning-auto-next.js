// Auto Next Button Clicker for TDTU elearning-ability
console.log('TDTU elearning Auto Next extension loaded');

let autoNextEnabled = false;
let autoNextInterval = null;
let clickCount = 0;
let isButtonFound = false;

// Kiểm tra xem có đang ở trang Unit/Index không
function isCorrectPage() {
    const currentUrl = window.location.href;
    const targetUrl = 'https://elearning-ability.tdtu.edu.vn/Unit/Index/';
    
    // Kiểm tra chính xác URL
    const isCorrect = currentUrl.includes('/Unit/Index/');
    console.log(`Kiểm tra URL: ${currentUrl} - Có khớp với Unit/Index/: ${isCorrect}`);
    
    return isCorrect;
}

// Khởi tạo khi DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoNext);
} else {
    initAutoNext();
}

// Lắng nghe messages từ popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case 'toggleAutoNext':
            if (request.enabled) {
                startAutoNext();
            } else {
                stopAutoNext();
            }
            sendResponse({success: true, enabled: autoNextEnabled});
            break;
        case 'getAutoNextStatus':
            sendResponse({
                enabled: autoNextEnabled,
                clickCount: clickCount,
                buttonFound: isButtonFound
            });
            break;
    }
});

function initAutoNext() {
    console.log('Initializing Auto Next for elearning-ability.tdtu.edu.vn');
    
    // Kiểm tra xem có đang ở trang Unit/Index không
    if (!isCorrectPage()) {
        console.log('Không phải trang Unit/Index, không kích hoạt Auto Next');
        return;
    }
    
    // Load cài đặt từ storage
    chrome.storage.sync.get(['autoNextEnabled'], (result) => {
        if (result.autoNextEnabled !== false) { // Mặc định bật
            startAutoNext();
        }
    });
    
    // Theo dõi thay đổi DOM
    observeDOM();
}

function startAutoNext() {
    if (autoNextEnabled) {
        console.log('Auto Next đã đang chạy');
        return;
    }
    
    // Kiểm tra xem có đang ở trang Unit/Index không
    if (!isCorrectPage()) {
        console.log('Không phải trang Unit/Index, không thể bắt đầu Auto Next');
        return;
    }
    
    autoNextEnabled = true;
    console.log('Bắt đầu Auto Next với interval 200ms cho trang Unit/Index');
    
    // Bắt đầu tìm và click nút
    autoNextInterval = setInterval(() => {
        findAndClickNextButton();
    }, 200); // Click mỗi 200ms như yêu cầu
    
    // Thông báo cho popup
    notifyPopup();
}

function stopAutoNext() {
    if (!autoNextEnabled) {
        console.log('Auto Next đã dừng');
        return;
    }
    
    autoNextEnabled = false;
    
    if (autoNextInterval) {
        clearInterval(autoNextInterval);
        autoNextInterval = null;
    }
    
    console.log('Đã dừng Auto Next');
    
    // Thông báo cho popup
    notifyPopup();
}

function findAndClickNextButton() {
    // Kiểm tra xem vẫn còn ở trang Unit/Index không
    if (!isCorrectPage()) {
        console.log('Đã rời khỏi trang Unit/Index, dừng Auto Next');
        stopAutoNext();
        return;
    }
    
    // Tìm nút với selector chính xác
    const nextButton = document.querySelector('button#btnNext.btn.ed_btn.pull-right.ed_orange');
    
    if (nextButton) {
        isButtonFound = true;
        
        // Kiểm tra nút có hiển thị và có thể click không
        const isVisible = nextButton.offsetParent !== null;
        const isEnabled = !nextButton.disabled;
        
        if (isVisible && isEnabled) {
            try {
                // Highlight nút trước khi click (tạo hiệu ứng visual)
                highlightButton(nextButton);
                
                // Click nút
                nextButton.click();
                clickCount++;
                
                console.log(`✅ Đã click nút Next lần thứ ${clickCount}`);
                
                // Thông báo cho popup về việc click thành công
                notifyPopup();
                
            } catch (error) {
                console.error('Lỗi khi click nút Next:', error);
            }
        } else {
            console.log('🔍 Nút Next tồn tại nhưng không thể click (disabled hoặc ẩn)');
        }
    } else {
        isButtonFound = false;
        // Thử tìm với các selector thay thế
        const alternativeSelectors = [
            '#btnNext',
            'button.btn.ed_btn.pull-right.ed_orange',
            'button[id*="btnNext"]',
            'button.ed_orange:contains("Next")',
            'button.ed_orange:contains("Tiếp")'
        ];
        
        for (const selector of alternativeSelectors) {
            const altButton = document.querySelector(selector);
            if (altButton) {
                console.log(`🔍 Tìm thấy nút với selector thay thế: ${selector}`);
                isButtonFound = true;
                
                if (altButton.offsetParent !== null && !altButton.disabled) {
                    try {
                        highlightButton(altButton);
                        altButton.click();
                        clickCount++;
                        console.log(`✅ Đã click nút thay thế lần thứ ${clickCount}`);
                        notifyPopup();
                    } catch (error) {
                        console.error('Lỗi khi click nút thay thế:', error);
                    }
                }
                break;
            }
        }
    }
}

function highlightButton(button) {
    // Tạo hiệu ứng highlight
    const originalStyle = {
        boxShadow: button.style.boxShadow,
        transform: button.style.transform,
        transition: button.style.transition
    };
    
    // Thêm hiệu ứng
    button.style.transition = 'all 0.2s ease';
    button.style.boxShadow = '0 0 15px rgba(255, 165, 0, 0.8)';
    button.style.transform = 'scale(1.05)';
    
    // Xóa hiệu ứng sau 150ms
    setTimeout(() => {
        button.style.boxShadow = originalStyle.boxShadow;
        button.style.transform = originalStyle.transform;
        button.style.transition = originalStyle.transition;
    }, 150);
}

function observeDOM() {
    // Theo dõi thay đổi DOM để phát hiện nút mới xuất hiện
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Kiểm tra xem có nút Next mới không
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const nextButton = node.querySelector ? 
                            node.querySelector('button#btnNext.btn.ed_btn.pull-right.ed_orange') : 
                            (node.id === 'btnNext' && node.tagName === 'BUTTON' ? node : null);
                        
                        if (nextButton) {
                            console.log('🆕 Phát hiện nút Next mới trong DOM');
                            isButtonFound = true;
                            notifyPopup();
                        }
                    }
                });
            }
        });
    });
    
    // Bắt đầu observe
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function notifyPopup() {
    // Gửi thông báo cập nhật đến popup
    chrome.runtime.sendMessage({
        action: 'autoNextUpdate',
        enabled: autoNextEnabled,
        clickCount: clickCount,
        buttonFound: isButtonFound
    }).catch(() => {
        // Ignore errors if popup is not open
    });
}

// Lưu trạng thái khi thay đổi
function saveSettings() {
    chrome.storage.sync.set({
        autoNextEnabled: autoNextEnabled
    });
}

// Lắng nghe khi trang được unload
window.addEventListener('beforeunload', () => {
    saveSettings();
}); 