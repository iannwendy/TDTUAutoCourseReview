// Script xử lý trang đánh giá TDTU
console.log('TDTU Survey Handler loaded');

// Function to get delay from parent window
function getSurveyDelay() {
    let delay = 2000; // Default 2 seconds
    
    // Try to get delay from parent window (content script)
    try {
        if (window.parent && window.parent.currentDelay) {
            delay = window.parent.currentDelay;
            console.log('Got delay from parent window:', delay);
        } else if (window.currentDelay) {
            delay = window.currentDelay;
            console.log('Got delay from current window:', delay);
        } else if (window.top && window.top.currentDelay) {
            delay = window.top.currentDelay;
            console.log('Got delay from top window:', delay);
        }
    } catch (error) {
        console.log('Could not access parent delay, using default:', delay);
    }
    
    return delay;
}

// Get delay - initialize before using in functions
let surveyDelay = getSurveyDelay();
console.log('Using survey delay:', surveyDelay);

// Biến để tracking cuộn mượt - Tăng tốc độ lên
let isScrolling = false;
let scrollSpeed = 200; // Giảm từ 800ms xuống 200ms cho tốc độ nhanh hơn

// Kiểm tra trang hiện tại và xử lý tương ứng
if (window.location.href.includes('teaching-quality-survey.tdtu.edu.vn')) {
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageHandler);
    } else {
        initPageHandler();
    }
}

// TDTU Survey Auto-fill Script
console.log('TDTU Survey script loaded');

function initPageHandler() {
    const currentUrl = window.location.href;
    console.log('Current URL:', currentUrl);
    
    if (currentUrl.includes('Survey.aspx')) {
        // Trang khảo sát
        console.log('Đang ở trang Survey.aspx - Bắt đầu tự động điền với cuộn mượt');
        setTimeout(() => {
            autoFillSurveyWithSmoothScroll();
        }, surveyDelay);
        
    } else if (currentUrl.includes('Result.aspx')) {
        // Trang kết quả
        console.log('Đang ở trang Result.aspx - Tìm nút Tiếp tục đánh giá');
        setTimeout(() => {
            clickTiepTucDanhGia();
        }, surveyDelay);
        
    } else if (currentUrl.includes('choosesurvey.aspx')) {
        // Trang chọn môn - thông báo đã hoàn thành 1 môn
        console.log('Đã quay lại trang chọn môn - Hoàn thành 1 môn học');
        // Content script chính sẽ xử lý tiếp
    }
}

function autoFillSurveyWithSmoothScroll() {
    console.log('Bắt đầu tự động điền form đánh giá với cuộn mượt');
    
    try {
        // Tìm tất cả radio buttons (thường là câu hỏi đánh giá)
        const radioGroups = findRadioGroups();
        
        if (radioGroups.length === 0) {
            console.log('Không tìm thấy radio buttons để đánh giá');
            // Có thể là trang khác, thử tìm nút tiếp tục
            setTimeout(() => {
                clickTiepTuc();
            }, 1000);
            return;
        }
        
        console.log(`Tìm thấy ${radioGroups.length} nhóm câu hỏi - Bắt đầu cuộn mượt nhanh`);
        
        // Cuộn đến đầu trang trước khi bắt đầu
        smoothScrollToTop();
        
        // Điền từng nhóm câu hỏi với cuộn mượt
        processQuestionsWithSmoothScroll(radioGroups);
        
    } catch (error) {
        console.error('Lỗi khi tự động điền form:', error);
    }
}

function processQuestionsWithSmoothScroll(radioGroups) {
    let currentIndex = 0;
    
    function processNextQuestion() {
        if (currentIndex >= radioGroups.length) {
            // Đã hoàn thành tất cả câu hỏi, cuộn đến cuối trang
            console.log('Đã hoàn thành tất cả câu hỏi, cuộn đến cuối trang');
            setTimeout(() => {
                smoothScrollToBottom(() => {
                    // Sau khi cuộn đến cuối, click "Tiếp tục"
                    setTimeout(() => {
                        clickTiepTuc();
                    }, 500);
                });
            }, 200);
            return;
        }
        
        const group = radioGroups[currentIndex];
        const questionNumber = currentIndex + 1;
        
        // Điền câu hỏi
        fillRadioGroupWithScroll(group, questionNumber, () => {
            // Sau khi điền xong câu hỏi này, chuyển sang câu tiếp theo
            currentIndex++;
            setTimeout(processNextQuestion, scrollSpeed);
        });
    }
    
    // Bắt đầu xử lý từ câu hỏi đầu tiên
    processNextQuestion();
}

function fillRadioGroupWithScroll(radioGroup, questionNumber, callback) {
    if (radioGroup.length === 0) {
        callback();
        return;
    }
    
    // Chọn rating cao nhất (thường là "Rất hài lòng" hoặc điểm cao nhất)
    const selectedIndex = radioGroup.length - 1; // Chọn option cuối (cao nhất)
    const selectedRadio = radioGroup[selectedIndex];
    
    try {
        // Cuộn mượt đến câu hỏi hiện tại
        smoothScrollToElement(selectedRadio, () => {
            // Sau khi cuộn đến, click chọn đáp án
            selectedRadio.click();
            console.log(`Câu hỏi ${questionNumber}: Đã chọn option ${selectedIndex + 1}/${radioGroup.length} (Rating cao nhất)`);
            
            // Highlight câu hỏi đã chọn
            highlightSelectedOption(selectedRadio);
            
            // Gọi callback để tiếp tục câu hỏi tiếp theo
            callback();
        });
        
    } catch (error) {
        console.error(`Lỗi khi chọn câu hỏi ${questionNumber}:`, error);
        callback();
    }
}

function smoothScrollToTop() {
    console.log('🔝 Cuộn mượt đến đầu trang');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function smoothScrollToElement(element, callback) {
    if (!element) {
        callback();
        return;
    }
    
    // Tìm container của element để scroll đến
    let container = element.closest('tr') || element.closest('div.question') || element.closest('.form-group') || element.parentElement;
    
    // Tính toán vị trí để scroll
    const elementRect = container.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const middle = absoluteElementTop - (window.innerHeight / 3); // Cuộn để element ở 1/3 màn hình
    
    window.scrollTo({
        top: Math.max(0, middle),
        behavior: 'smooth'
    });
    
    // Chờ cuộn hoàn thành rồi gọi callback - Giảm thời gian chờ
    setTimeout(callback, scrollSpeed * 0.4); // Giảm từ 60% xuống 40% để nhanh hơn
}

function smoothScrollToBottom(callback) {
    console.log('⬇️ Cuộn mượt đến cuối trang');
    
    // Tính toán chiều cao trang
    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    );
    
    window.scrollTo({
        top: documentHeight,
        behavior: 'smooth'
    });
    
    // Chờ cuộn hoàn thành - Giảm thời gian chờ
    setTimeout(() => {
        console.log('✅ Đã cuộn đến cuối trang');
        if (callback) callback();
    }, scrollSpeed * 0.8); // Giảm từ 1.5 xuống 0.8
}

function autoFillSurvey() {
    console.log('Bắt đầu tự động điền form đánh giá (legacy function)');
    
    try {
        // Tìm tất cả radio buttons (thường là câu hỏi đánh giá)
        const radioGroups = findRadioGroups();
        
        if (radioGroups.length === 0) {
            console.log('Không tìm thấy radio buttons để đánh giá');
            // Có thể là trang khác, thử tìm nút tiếp tục
            setTimeout(() => {
                clickTiepTuc();
            }, 1000);
            return;
        }
        
        console.log(`Tìm thấy ${radioGroups.length} nhóm câu hỏi`);
        
        // Điền từng nhóm câu hỏi với tốc độ nhanh hơn
        radioGroups.forEach((group, index) => {
            setTimeout(() => {
                fillRadioGroup(group, index + 1);
            }, index * 200); // Giảm từ 300ms xuống 200ms để phù hợp với tốc độ mới
        });
        
        // Tự động click "Tiếp tục" sau khi điền xong với thời gian ngắn hơn
        setTimeout(() => {
            clickTiepTuc();
        }, radioGroups.length * 200 + 1000); // Giảm delay tổng thể
        
    } catch (error) {
        console.error('Lỗi khi tự động điền form:', error);
    }
}

function clickTiepTuc() {
    console.log('Tìm kiếm nút "Tiếp tục"...');
    
    // Tìm nút "Tiếp tục" với ID btnTiepTuc
    const btnTiepTuc = document.getElementById('btnTiepTuc');
    
    if (btnTiepTuc) {
        console.log('Tìm thấy nút "Tiếp tục", sẽ click sau 500ms...');
        
        // Highlight nút
        btnTiepTuc.style.border = '3px solid #ff9800';
        btnTiepTuc.style.boxShadow = '0 0 10px #ff9800';
        
        setTimeout(() => {
            try {
                btnTiepTuc.click();
                console.log('Đã click nút "Tiếp tục"');
            } catch (error) {
                console.error('Lỗi khi click "Tiếp tục":', error);
            }
        }, 500); // Fixed 500ms delay instead of surveyDelay
        
    } else {
        console.log('Không tìm thấy nút "Tiếp tục"');
        // Thử tìm các selector khác
        const alternativeSelectors = [
            'input[name="btnTiepTuc"]',
            'input[value*="Tiếp tục"]',
            'input[value*="Next"]',
            'button:contains("Tiếp tục")'
        ];
        
        let found = false;
        for (const selector of alternativeSelectors) {
            const btn = document.querySelector(selector);
            if (btn) {
                console.log(`Tìm thấy nút với selector: ${selector}`);
                setTimeout(() => btn.click(), 500); // Fixed 500ms delay
                found = true;
                break;
            }
        }
        
        if (!found) {
            console.log('Không tìm thấy nút "Tiếp tục"');
        }
    }
}

function clickTiepTucDanhGia() {
    console.log('Tìm kiếm nút "Tiếp tục đánh giá"...');
    
    // Tìm nút "Tiếp tục đánh giá" với ID btnTiepTucDanhGia
    const btnTiepTucDanhGia = document.getElementById('btnTiepTucDanhGia');
    
    if (btnTiepTucDanhGia) {
        console.log('Tìm thấy nút "Tiếp tục đánh giá", sẽ click sau 500ms...');
        
        // Highlight nút
        btnTiepTucDanhGia.style.border = '3px solid #4CAF50';
        btnTiepTucDanhGia.style.boxShadow = '0 0 10px #4CAF50';
        
        setTimeout(() => {
            try {
                btnTiepTucDanhGia.click();
                console.log('Đã click nút "Tiếp tục đánh giá"');
            } catch (error) {
                console.error('Lỗi khi click "Tiếp tục đánh giá":', error);
            }
        }, 500); // Fixed 500ms delay instead of surveyDelay
        
    } else {
        console.log('Không tìm thấy nút "Tiếp tục đánh giá"');
        // Thử tìm các selector khác
        const alternativeSelectors = [
            'input[name="btnTiepTucDanhGia"]',
            'input[value*="Tiếp tục đánh giá"]',
            'input[value*="Continue"]',
            'button:contains("Tiếp tục đánh giá")'
        ];
        
        let found = false;
        for (const selector of alternativeSelectors) {
            const btn = document.querySelector(selector);
            if (btn) {
                console.log(`Tìm thấy nút với selector: ${selector}`);
                setTimeout(() => btn.click(), 500); // Fixed 500ms delay
                found = true;
                break;
            }
        }
        
        if (!found) {
            console.log('Không tìm thấy nút "Tiếp tục đánh giá"');
        }
    }
}

function findRadioGroups() {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    const groups = {};
    
    radioButtons.forEach(radio => {
        if (radio.name) {
            if (!groups[radio.name]) {
                groups[radio.name] = [];
            }
            groups[radio.name].push(radio);
        }
    });
    
    return Object.values(groups);
}

function fillRadioGroup(radioGroup, questionNumber) {
    if (radioGroup.length === 0) return;
    
    // Chọn rating cao nhất (thường là "Rất hài lòng" hoặc điểm cao nhất) - Option cao nhất
    const selectedIndex = radioGroup.length - 1; // Chọn option cuối (cao nhất)
    
    try {
        radioGroup[selectedIndex].click();
        console.log(`Câu hỏi ${questionNumber}: Đã chọn option ${selectedIndex + 1}/${radioGroup.length} (Rating cao nhất)`);
        
        // Highlight câu hỏi đã chọn
        highlightSelectedOption(radioGroup[selectedIndex]);
        
        // Cuộn mượt đến câu hỏi vừa chọn (cho legacy function)
        smoothScrollToElementBasic(radioGroup[selectedIndex]);
        
    } catch (error) {
        console.error(`Lỗi khi chọn câu hỏi ${questionNumber}:`, error);
    }
}

function smoothScrollToElementBasic(element) {
    if (!element) return;
    
    try {
        // Tìm container của element để scroll đến
        let container = element.closest('tr') || element.closest('div.question') || element.closest('.form-group') || element.parentElement;
        
        // Cuộn mượt đến element
        container.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    } catch (error) {
        console.log('Không thể cuộn đến element:', error);
    }
}

function highlightSelectedOption(radioElement) {
    // Tìm container của radio button để highlight
    let container = radioElement.closest('tr') || radioElement.closest('div') || radioElement.parentElement;
    
    if (container) {
        // Hiệu ứng highlight đẹp và mượt mà
        container.style.backgroundColor = '#e8f5e8';
        container.style.border = '2px solid #4CAF50';
        container.style.borderRadius = '4px';
        container.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
        container.style.transform = 'scale(1.02)';
        container.style.transition = 'all 0.3s ease';
        
        // Xóa highlight sau 1.5 giây (giảm từ 2 giây để phù hợp với tốc độ nhanh hơn)
        setTimeout(() => {
            container.style.backgroundColor = '';
            container.style.border = '';
            container.style.borderRadius = '';
            container.style.boxShadow = '';
            container.style.transform = '';
        }, 1500); // Giảm từ 2000ms xuống 1500ms
    }
} 