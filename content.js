// Biến global cho extension
let isAutoReviewRunning = false;
let reviewTimeout = null;
let currentDelay = 1000; // mặc định 1 giây
let reviewProgress = { current: 0, total: 0 };

// Khởi tạo khi content script load
console.log('Auto Course Review Extension loaded for TDTU');

// Lắng nghe messages từ popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case 'start':
            startAutoReview(request.delay * 1000);
            sendResponse({success: true});
            break;
        case 'stop':
            stopAutoReview();
            sendResponse({success: true});
            break;
        case 'getStatus':
            sendResponse({
                isRunning: isAutoReviewRunning,
                current: reviewProgress.current,
                total: reviewProgress.total
            });
            break;
    }
});

function startAutoReview(delay = 1000) {
    if (isAutoReviewRunning) {
        console.log('Auto review đã đang chạy');
        return;
    }

    isAutoReviewRunning = true;
    currentDelay = delay;
    
    console.log('Bắt đầu auto review TDTU với delay:', delay);
    
    // Tìm tất cả các môn học cần đánh giá
    findTDTUReviewElements();
    
    // Bắt đầu quá trình tự động
    if (reviewProgress.total > 0) {
        processNextTDTUReview();
    } else {
        console.log('Không tìm thấy môn học nào cần đánh giá');
        console.log('Không tìm thấy môn học nào cần đánh giá hoặc tất cả đã được đánh giá');
    }
}

function stopAutoReview() {
    isAutoReviewRunning = false;
    if (reviewTimeout) {
        clearTimeout(reviewTimeout);
        reviewTimeout = null;
    }
    console.log('Đã dừng auto review');
}

function findTDTUReviewElements() {
    // Tìm table môn học
    const table = document.getElementById('gvMonHoc');
    if (!table) {
        console.log('Không tìm thấy bảng môn học');
        reviewProgress.total = 0;
        return;
    }

    // Tìm tất cả các hàng môn học (bỏ qua header)
    const rows = table.querySelectorAll('tr.normal, tr.alternate');
    let pendingReviews = [];

    rows.forEach((row, index) => {
        // Tìm cột trạng thái (cột thứ 7, index 6)
        const statusCell = row.cells[6];
        if (statusCell) {
            const statusText = statusCell.textContent.trim();
            console.log(`Hàng ${index + 1}: ${statusText}`);
            
            // Kiểm tra nếu chưa đánh giá
            if (statusText.includes('Chưa đánh giá') || statusText.includes('Not yet')) {
                // Tìm nút "Chọn" trong cột cuối
                const chooseCell = row.cells[7];
                console.log(`Hàng ${index + 1} - Tìm nút Chọn trong cell:`, chooseCell);
                
                // Thử nhiều cách tìm nút Chọn
                let chooseLink = null;
                
                if (chooseCell) {
                    // Cách 1: Tìm thẻ a
                    chooseLink = chooseCell.querySelector('a');
                    console.log(`Hàng ${index + 1} - Tìm thấy thẻ a:`, chooseLink);
                    
                    // Cách 2: Tìm theo href chứa __doPostBack
                    if (!chooseLink) {
                        chooseLink = chooseCell.querySelector('a[href*="__doPostBack"]');
                        console.log(`Hàng ${index + 1} - Tìm thấy link __doPostBack:`, chooseLink);
                    }
                    
                    // Cách 3: Tìm theo text content
                    if (!chooseLink) {
                        const allLinks = chooseCell.querySelectorAll('a');
                        for (const link of allLinks) {
                            if (link.textContent.includes('Chọn') || link.textContent.includes('Choose')) {
                                chooseLink = link;
                                console.log(`Hàng ${index + 1} - Tìm thấy link theo text:`, chooseLink);
                                break;
                            }
                        }
                    }
                }
                
                if (chooseLink) {
                    // Lấy thông tin môn học
                    const subjectName = row.cells[2] ? row.cells[2].textContent.trim() : 'Unknown';
                    const teacher = row.cells[5] ? row.cells[5].textContent.trim() : 'Unknown';
                    
                    console.log(`Hàng ${index + 1} - Link details:`, {
                        href: chooseLink.href,
                        onclick: chooseLink.onclick,
                        textContent: chooseLink.textContent,
                        innerHTML: chooseLink.innerHTML
                    });
                    
                    pendingReviews.push({
                        row: row,
                        link: chooseLink,
                        subjectName: subjectName,
                        teacher: teacher,
                        index: index + 1
                    });
                    
                    console.log(`Tìm thấy môn cần đánh giá: ${subjectName} - ${teacher}`);
                } else {
                    console.log(`Hàng ${index + 1} - Không tìm thấy nút Chọn`);
                }
            } else if (statusText.includes('Đã đánh giá') || statusText.includes('Completed')) {
                console.log(`Môn học đã được đánh giá, bỏ qua`);
            }
        }
    });

    // Cập nhật total nhưng giữ nguyên current nếu đang chạy
    const oldCurrent = reviewProgress.current;
    reviewProgress.total = pendingReviews.length;
    
    // Chỉ reset current nếu chưa bắt đầu hoặc đã hoàn thành
    if (!isAutoReviewRunning || oldCurrent >= pendingReviews.length) {
        reviewProgress.current = 0;
    } else {
        reviewProgress.current = oldCurrent; // Giữ nguyên vị trí hiện tại
    }
    
    // Lưu danh sách để xử lý
    window.tdtuReviewElements = pendingReviews;
    
    console.log(`Tìm thấy ${pendingReviews.length} môn học cần đánh giá (đang ở vị trí ${reviewProgress.current})`);
    updateProgress();
}

function processNextTDTUReview() {
    if (!isAutoReviewRunning || reviewProgress.current >= reviewProgress.total) {
        completeReview();
        return;
    }
    
    const currentReview = window.tdtuReviewElements[reviewProgress.current];
    
    if (!currentReview) {
        console.error('Không tìm thấy thông tin môn học tại vị trí:', reviewProgress.current);
        reviewProgress.current++;
        processNextTDTUReview();
        return;
    }
    
    try {
        console.log(`Đang xử lý môn ${reviewProgress.current + 1}/${reviewProgress.total}: ${currentReview.subjectName}`);
        
        // Highlight hàng đang xử lý
        highlightCurrentRow(currentReview.row);
        
        // Debug thông tin nút "Chọn"
        console.log('Thông tin nút Chọn:', {
            link: currentReview.link,
            href: currentReview.link ? currentReview.link.href : 'N/A',
            onclick: currentReview.link ? currentReview.link.onclick : 'N/A',
            tagName: currentReview.link ? currentReview.link.tagName : 'N/A'
        });
        
        // Debug thông tin form và ASP.NET
        const form = document.forms[0] || document.querySelector('form');
        console.log('Form info:', {
            form: form,
            formAction: form ? form.action : 'N/A',
            formMethod: form ? form.method : 'N/A',
            hasEventTarget: form ? !!form.querySelector('input[name="__EVENTTARGET"]') : false,
            hasEventArgument: form ? !!form.querySelector('input[name="__EVENTARGUMENT"]') : false,
            hasDoPostBack: typeof window.__doPostBack === 'function'
        });
        
        // Thử nhiều cách click
        let clickSuccess = false;
        
        // Cách 1: Thử trigger __doPostBack trực tiếp trước (ưu tiên cao nhất cho ASP.NET)
        if (currentReview.link && currentReview.link.href && currentReview.link.href.includes('__doPostBack')) {
            try {
                console.log('Thử tìm và execute __doPostBack function...');
                
                // Parse parameters từ href
                const hrefContent = currentReview.link.href;
                const match = hrefContent.match(/__doPostBack\('([^']+)','([^']+)'\)/);
                
                if (match) {
                    const eventTarget = match[1]; // 'gvMonHoc'
                    const eventArgument = match[2]; // 'Select$X'
                    
                    console.log(`Trying to execute __doPostBack('${eventTarget}', '${eventArgument}')`);
                    
                    // Kiểm tra xem __doPostBack có tồn tại không
                    if (typeof window.__doPostBack === 'function') {
                        window.__doPostBack(eventTarget, eventArgument);
                        clickSuccess = true;
                        console.log('✅ __doPostBack function thành công');
                    } else {
                        console.log('__doPostBack function không tồn tại, thử tìm form và submit...');
                        
                        // Tìm form và trigger submit với hidden fields
                        const form = document.forms[0] || document.querySelector('form');
                        if (form) {
                            // Tạo hoặc cập nhật hidden fields
                            let eventTargetField = form.querySelector('input[name="__EVENTTARGET"]');
                            let eventArgumentField = form.querySelector('input[name="__EVENTARGUMENT"]');
                            
                            if (!eventTargetField) {
                                eventTargetField = document.createElement('input');
                                eventTargetField.type = 'hidden';
                                eventTargetField.name = '__EVENTTARGET';
                                form.appendChild(eventTargetField);
                            }
                            
                            if (!eventArgumentField) {
                                eventArgumentField = document.createElement('input');
                                eventArgumentField.type = 'hidden';
                                eventArgumentField.name = '__EVENTARGUMENT';
                                form.appendChild(eventArgumentField);
                            }
                            
                            // Set values
                            eventTargetField.value = eventTarget;
                            eventArgumentField.value = eventArgument;
                            
                            console.log('Submitting form with:', {
                                eventTarget: eventTarget,
                                eventArgument: eventArgument
                            });
                            
                            // Submit form
                            form.submit();
                            clickSuccess = true;
                            console.log('✅ Form submit thành công');
                        }
                    }
                }
            } catch (e) {
                console.log('❌ __doPostBack/Form submit thất bại:', e.message);
            }
        }
        
        // Cách 2: Click trực tiếp (fallback)
        if (!clickSuccess && currentReview.link) {
            try {
                console.log('Thử click trực tiếp...');
                currentReview.link.click();
                clickSuccess = true;
                console.log('✅ Click trực tiếp thành công');
            } catch (e) {
                console.log('❌ Click trực tiếp thất bại:', e.message);
            }
        }
        
        // Cách 3: Dispatch click event với các options khác nhau
        if (!clickSuccess && currentReview.link) {
            try {
                console.log('Thử dispatch click event...');
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    detail: 1,
                    button: 0,
                    buttons: 1
                });
                currentReview.link.dispatchEvent(clickEvent);
                clickSuccess = true;
                console.log('✅ Dispatch click event thành công');
            } catch (e) {
                console.log('❌ Dispatch click event thất bại:', e.message);
            }
        }
        
        // Cách 4: Trigger mousedown và mouseup events
        if (!clickSuccess && currentReview.link) {
            try {
                console.log('Thử trigger mouse events...');
                
                // Mousedown
                const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                currentReview.link.dispatchEvent(mouseDownEvent);
                
                // Mouseup
                const mouseUpEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                currentReview.link.dispatchEvent(mouseUpEvent);
                
                // Click
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                currentReview.link.dispatchEvent(clickEvent);
                
                clickSuccess = true;
                console.log('✅ Mouse events sequence thành công');
            } catch (e) {
                console.log('❌ Mouse events sequence thất bại:', e.message);
            }
        }
        
        // Cách 5: Focus và trigger keyboard events
        if (!clickSuccess && currentReview.link) {
            try {
                console.log('Thử focus và keyboard events...');
                
                currentReview.link.focus();
                
                // Enter key
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    bubbles: true,
                    cancelable: true
                });
                currentReview.link.dispatchEvent(enterEvent);
                
                clickSuccess = true;
                console.log('✅ Keyboard events thành công');
            } catch (e) {
                console.log('❌ Keyboard events thất bại:', e.message);
            }
        }
        
        if (clickSuccess) {
            console.log(`✅ Đã click chọn môn: ${currentReview.subjectName} - ${currentReview.teacher}`);
            
            reviewProgress.current++;
            updateProgress();
            
            // QUAN TRỌNG: Chờ chuyển trang, không tiếp tục duyệt
            console.log('Đang chờ chuyển sang trang đánh giá...');
            
            // Chờ và kiểm tra xem có chuyển trang không
            setTimeout(() => {
                if (window.location.href.includes('Survey.aspx')) {
                    console.log('✅ Đã chuyển sang trang Survey.aspx');
                    // Trang Survey.aspx sẽ được xử lý bởi tdtu-survey.js
                } else if (window.location.href.includes('choosesurvey.aspx')) {
                    console.log('⚠️ Vẫn ở trang chọn môn, có thể có lỗi hoặc môn đã được đánh giá');
                    // Tiếp tục môn tiếp theo
                    processNextTDTUReview();
                } else {
                    console.log('🔄 Chuyển sang trang khác:', window.location.href);
                }
            }, 3000); // Tăng thời gian chờ lên 3 giây
            
        } else {
            console.error('❌ Không thể click nút Chọn bằng bất kỳ cách nào');
            // Bỏ qua môn này và tiếp tục
            reviewProgress.current++;
            setTimeout(() => {
                processNextTDTUReview();
            }, 1000);
        }
        
    } catch (error) {
        console.error('Lỗi khi xử lý môn học:', error);
        console.error('Có lỗi xảy ra: ' + error.message);
        // Bỏ qua môn này và tiếp tục
        reviewProgress.current++;
        setTimeout(() => {
            processNextTDTUReview();
        }, 1000);
    }
}

function highlightCurrentRow(row) {
    // Xóa highlight cũ
    const previousHighlight = document.querySelector('.auto-review-highlight');
    if (previousHighlight) {
        previousHighlight.classList.remove('auto-review-highlight');
    }
    
    // Thêm highlight mới
    row.style.backgroundColor = '#ffeb3b';
    row.style.border = '2px solid #ff9800';
    row.classList.add('auto-review-highlight');
}

function waitForReturnToChoosePage() {
    // Kiểm tra định kỳ xem có quay lại trang chọn môn không
    const checkInterval = setInterval(() => {
        if (!isAutoReviewRunning) {
            clearInterval(checkInterval);
            return;
        }
        
        if (window.location.href.includes('choosesurvey.aspx')) {
            clearInterval(checkInterval);
            console.log('Đã quay lại trang chọn môn, tiếp tục xử lý');
            
            // Cập nhật lại danh sách môn học (có thể có thay đổi trạng thái)
            setTimeout(() => {
                findTDTUReviewElements();
                // Tiếp tục từ vị trí hiện tại (không reset current)
                if (reviewProgress.current < reviewProgress.total) {
                    console.log(`Tiếp tục xử lý môn ${reviewProgress.current + 1}/${reviewProgress.total}`);
                    processNextTDTUReview();
                } else {
                    console.log('Đã hoàn thành tất cả môn học');
                    completeReview();
                }
            }, 2000);
        }
    }, 2000);
    
    // Timeout sau 60 giây nếu không quay lại (tăng thời gian chờ)
    setTimeout(() => {
        clearInterval(checkInterval);
        if (isAutoReviewRunning) {
            console.log('Timeout chờ quay lại trang chọn môn sau 60 giây');
        }
    }, 60000);
}

// Thêm listener để detect khi quay lại trang chọn môn
window.addEventListener('focus', function() {
    // Khi tab được focus lại, kiểm tra URL
    if (isAutoReviewRunning && window.location.href.includes('choosesurvey.aspx')) {
        console.log('Tab được focus và đang ở trang chọn môn');
        // Có thể đã hoàn thành 1 môn và quay lại
        setTimeout(() => {
            if (isAutoReviewRunning) {
                console.log('Tiếp tục xử lý môn tiếp theo...');
                findTDTUReviewElements();
                if (reviewProgress.current < reviewProgress.total) {
                    processNextTDTUReview();
                } else {
                    completeReview();
                }
            }
        }, 3000);
    }
});

// Legacy functions để tương thích với các trang đánh giá khác
function findReviewElements() {
    // Kiểm tra xem có phải trang TDTU không
    if (window.location.href.includes('teaching-quality-survey.tdtu.edu.vn')) {
        findTDTUReviewElements();
        return;
    }
    
    // Logic cũ cho các trang khác
    const reviewForms = document.querySelectorAll('.review-form, .rating-form, form[name*="review"]');
    const radioGroups = document.querySelectorAll('input[type="radio"][name*="rating"], input[type="radio"][name*="review"]');
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name*="rating"], input[type="checkbox"][name*="review"]');
    const selects = document.querySelectorAll('select[name*="rating"], select[name*="review"]');
    
    let allElements = [];
    
    const radioGroupNames = new Set();
    radioGroups.forEach(radio => {
        if (!radioGroupNames.has(radio.name)) {
            radioGroupNames.add(radio.name);
            const groupElements = document.querySelectorAll(`input[type="radio"][name="${radio.name}"]`);
            allElements.push({
                type: 'radio',
                name: radio.name,
                elements: Array.from(groupElements)
            });
        }
    });
    
    checkboxes.forEach(checkbox => {
        allElements.push({
            type: 'checkbox',
            element: checkbox
        });
    });
    
    selects.forEach(select => {
        allElements.push({
            type: 'select',
            element: select
        });
    });
    
    reviewProgress.total = allElements.length;
    reviewProgress.current = 0;
    
    window.reviewElements = allElements;
    
    console.log(`Tìm thấy ${allElements.length} elements để đánh giá`);
    updateProgress();
}

function processNextReview() {
    // Kiểm tra xem có phải trang TDTU không
    if (window.location.href.includes('teaching-quality-survey.tdtu.edu.vn')) {
        processNextTDTUReview();
        return;
    }
    
    // Logic cũ cho các trang khác
    if (!isAutoReviewRunning || reviewProgress.current >= reviewProgress.total) {
        completeReview();
        return;
    }
    
    const currentElement = window.reviewElements[reviewProgress.current];
    
    try {
        processReviewElement(currentElement);
        reviewProgress.current++;
        updateProgress();
        
        reviewTimeout = setTimeout(() => {
            processNextReview();
        }, currentDelay);
        
    } catch (error) {
        console.error('Lỗi khi xử lý element:', error);
        console.error('Có lỗi xảy ra: ' + error.message);
    }
}

function processReviewElement(elementData) {
    switch(elementData.type) {
        case 'radio':
            const radios = elementData.elements;
            if (radios.length > 0) {
                const selectedIndex = getPreferredRatingIndex(radios.length);
                radios[selectedIndex].click();
                console.log(`Đã chọn radio ${elementData.name}: option ${selectedIndex + 1}`);
            }
            break;
            
        case 'checkbox':
            if (!elementData.element.checked) {
                elementData.element.click();
                console.log('Đã tick checkbox:', elementData.element.name);
            }
            break;
            
        case 'select':
            const select = elementData.element;
            if (select.options.length > 1) {
                const selectedIndex = getPreferredRatingIndex(select.options.length - 1) + 1;
                select.selectedIndex = selectedIndex;
                select.dispatchEvent(new Event('change'));
                console.log(`Đã chọn select ${select.name}: option ${selectedIndex}`);
            }
            break;
    }
}

function getPreferredRatingIndex(totalOptions) {
    return totalOptions - 1; // Chọn rating cao nhất
}

function updateProgress() {
    chrome.runtime.sendMessage({
        action: 'updateProgress',
        current: reviewProgress.current,
        total: reviewProgress.total
    });
}

function completeReview() {
    isAutoReviewRunning = false;
    console.log('Hoàn thành auto review');
    
    // Xóa highlight
    const highlight = document.querySelector('.auto-review-highlight');
    if (highlight) {
        highlight.style.backgroundColor = '';
        highlight.style.border = '';
        highlight.classList.remove('auto-review-highlight');
    }
    
    chrome.runtime.sendMessage({
        action: 'completed'
    });
}

// Auto start nếu được cấu hình
chrome.storage.sync.get(['autoStart'], function(result) {
    if (result.autoStart && window.location.href.includes('teaching-quality-survey.tdtu.edu.vn')) {
        setTimeout(() => {
            if (!isAutoReviewRunning) {
                console.log('Auto start đã được bật cho TDTU, bắt đầu tự động...');
                startAutoReview();
            }
        }, 3000);
    }
}); 