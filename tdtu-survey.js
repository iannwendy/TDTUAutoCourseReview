// Script xử lý trang đánh giá TDTU
console.log('TDTU Survey Handler loaded');

// Kiểm tra trang hiện tại và xử lý tương ứng
if (window.location.href.includes('teaching-quality-survey.tdtu.edu.vn')) {
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageHandler);
    } else {
        initPageHandler();
    }
}

function initPageHandler() {
    const currentUrl = window.location.href;
    console.log('Khởi tạo handler cho trang:', currentUrl);
    
    if (currentUrl.includes('Survey.aspx')) {
        // Trang đánh giá chính
        console.log('Đang ở trang Survey.aspx - Bắt đầu điền form');
        setTimeout(() => {
            autoFillSurvey();
        }, 2000);
        
    } else if (currentUrl.includes('Result.aspx')) {
        // Trang kết quả
        console.log('Đang ở trang Result.aspx - Tìm nút Tiếp tục đánh giá');
        setTimeout(() => {
            clickTiepTucDanhGia();
        }, 2000);
        
    } else if (currentUrl.includes('choosesurvey.aspx')) {
        // Trang chọn môn - thông báo đã hoàn thành 1 môn
        console.log('Đã quay lại trang chọn môn - Hoàn thành 1 môn học');
        // Content script chính sẽ xử lý tiếp
    }
}

function autoFillSurvey() {
    console.log('Bắt đầu tự động điền form đánh giá');
    
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
        
        // Điền từng nhóm câu hỏi
        radioGroups.forEach((group, index) => {
            setTimeout(() => {
                fillRadioGroup(group, index + 1);
            }, index * 300); // Giảm delay xuống 300ms
        });
        
        // Tự động click "Tiếp tục" sau khi điền xong
        setTimeout(() => {
            clickTiepTuc();
        }, radioGroups.length * 300 + 1500);
        
    } catch (error) {
        console.error('Lỗi khi tự động điền form:', error);
    }
}

function clickTiepTuc() {
    console.log('Tìm kiếm nút "Tiếp tục"...');
    
    // Tìm nút "Tiếp tục" với ID btnTiepTuc
    const btnTiepTuc = document.getElementById('btnTiepTuc');
    
    if (btnTiepTuc) {
        console.log('Tìm thấy nút "Tiếp tục", sẽ click sau 2 giây...');
        
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
        }, 2000);
        
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
                setTimeout(() => btn.click(), 2000);
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
        console.log('Tìm thấy nút "Tiếp tục đánh giá", sẽ click sau 2 giây...');
        
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
        }, 2000);
        
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
                setTimeout(() => btn.click(), 2000);
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
    
    // Chọn rating cao nhất (thường là "Rất hài lòng" hoặc điểm cao nhất)
    const selectedIndex = radioGroup.length - 1; // Chọn option cuối (cao nhất)
    
    try {
        radioGroup[selectedIndex].click();
        console.log(`Câu hỏi ${questionNumber}: Đã chọn option ${selectedIndex + 1}/${radioGroup.length}`);
        
        // Highlight câu hỏi đã chọn
        highlightSelectedOption(radioGroup[selectedIndex]);
        
    } catch (error) {
        console.error(`Lỗi khi chọn câu hỏi ${questionNumber}:`, error);
    }
}

function highlightSelectedOption(radioElement) {
    // Tìm container của radio button để highlight
    let container = radioElement.closest('tr') || radioElement.closest('div') || radioElement.parentElement;
    
    if (container) {
        container.style.backgroundColor = '#e8f5e8';
        container.style.border = '1px solid #4CAF50';
        
        // Xóa highlight sau 1 giây
        setTimeout(() => {
            container.style.backgroundColor = '';
            container.style.border = '';
        }, 1000);
    }
} 