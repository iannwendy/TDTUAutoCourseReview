// Background service worker for Auto Course Review Extension
console.log('Auto Course Review Background Script loaded');

// Xử lý khi extension được cài đặt
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed:', details.reason);
    
    // Cấu hình mặc định
    chrome.storage.sync.set({
        delay: 2,
        autoStart: true,
        preferredRating: 'highest' // highest, middle, random
    });
    
    // Tạo context menu (click chuột phải)
    chrome.contextMenus.create({
        id: 'startAutoReview',
        title: 'Bắt đầu tự động đánh giá',
        contexts: ['page']
    });
    
    chrome.contextMenus.create({
        id: 'stopAutoReview',
        title: 'Dừng tự động đánh giá',
        contexts: ['page']
    });
});

// Xử lý messages từ content script và popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);
    
    switch(request.action) {
        case 'log':
            console.log('Content Script Log:', request.message);
            break;
        case 'notification':
            // Chỉ log thay vì hiển thị notification
            console.log('Notification:', request.title, '-', request.message);
            break;
        case 'updateProgress':
            console.log(`Progress: ${request.current}/${request.total}`);
            break;
        case 'completed':
            console.log('Hoàn thành tự động đánh giá tất cả môn học!');
            break;
        case 'error':
            console.log('Lỗi:', request.message);
            break;
        default:
            console.log('Unknown action:', request.action);
    }
});

// Xử lý khi click context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch(info.menuItemId) {
        case 'startAutoReview':
            chrome.tabs.sendMessage(tab.id, {
                action: 'start',
                delay: 2000
            });
            break;
        case 'stopAutoReview':
            chrome.tabs.sendMessage(tab.id, {
                action: 'stop'
            });
            break;
    }
});

// Xử lý khi tab được update (reload, navigate)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Có thể thêm logic để detect trang đánh giá và tự động bắt đầu
        console.log('Tab updated:', tab.url);
    }
});

// Xử lý shortcut keys nếu có
if (chrome.commands) {
    chrome.commands.onCommand.addListener((command) => {
        switch(command) {
            case 'start-auto-review':
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'start',
                        delay: 2000
                    });
                });
                break;
            case 'stop-auto-review':
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'stop'
                    });
                });
                break;
        }
    });
} 