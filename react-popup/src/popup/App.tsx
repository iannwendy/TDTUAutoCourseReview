import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import tdtuLogo from '../assets/TDTU_logo.png';

interface Status {
  type: 'idle' | 'running' | 'stopped';
  message: string;
}

interface Progress {
  current: number;
  total: number;
}

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<Status>({ type: 'idle', message: 'Sẵn sàng' });
  const [progress, setProgress] = useState<Progress>({ current: 0, total: 0 });
  const [delay, setDelay] = useState(1);
  const [autoStart, setAutoStart] = useState(true);
  const [theme, setTheme] = useState('ocean');
  const [showLoading, setShowLoading] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  // Elearning Kỹ Năng states
  const [autoNextEnabled, setAutoNextEnabled] = useState(false);
  const [autoNextClickCount, setAutoNextClickCount] = useState(0);
  const [autoNextButtonFound, setAutoNextButtonFound] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
    checkAndShowLoadingScreen();
    checkCurrentStatus();
    loadAutoNextSettings();
    checkAutoNextStatus();
    
    // Listen for messages from content script
    const messageListener = (request: any, sender: any, sendResponse: any) => {
      if (request.action === 'updateProgress') {
        setProgress({ current: request.current, total: request.total });
        
        if (request.current < request.total) {
          setStatus({ type: 'running', message: `Đang xử lý môn ${request.current + 1}/${request.total}` });
        }
      } else if (request.action === 'completed') {
        setStatus({ type: 'idle', message: 'Hoàn thành tất cả môn học! 🎉' });
        setIsRunning(false);
        showFeedback('🎉 Hoàn thành! Tất cả môn học đã được đánh giá!');
        
        // Reset progress after 3 seconds
        setTimeout(() => {
          setProgress({ current: 0, total: 0 });
          setStatus({ type: 'idle', message: 'Sẵn sàng' });
        }, 3000);
      } else if (request.action === 'error') {
        setStatus({ type: 'stopped', message: 'Có lỗi xảy ra' });
        setIsRunning(false);
      } else if (request.action === 'autoNextUpdate') {
        // Update Auto Next status
        setAutoNextEnabled(request.enabled);
        setAutoNextClickCount(request.clickCount);
        setAutoNextButtonFound(request.buttonFound);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const checkAndShowLoadingScreen = () => {
    const currentTime = Date.now();
    
    chrome.storage.session.get(['lastExtensionOpen'], (result) => {
      const lastOpen = result.lastExtensionOpen || 0;
      const timeDiff = currentTime - lastOpen;
      
      if (timeDiff > 30000 || lastOpen === 0) {
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
        }, 1000);
      }
      
      chrome.storage.session.set({ lastExtensionOpen: currentTime });
    });
  };

  const loadSettings = () => {
    chrome.storage.sync.get(['delay', 'autoStart', 'theme'], (result) => {
      setDelay(result.delay !== undefined ? result.delay : 1);
      setAutoStart(result.autoStart !== false);
      setTheme(result.theme || 'ocean');
    });
  };

  const saveSettings = () => {
    chrome.storage.sync.set({
      delay: delay,
      autoStart: autoStart
    });
  };

  const switchTheme = (newTheme: string) => {
    setTheme(newTheme);
    chrome.storage.sync.set({ theme: newTheme });
  };

  const loadAutoNextSettings = () => {
    chrome.storage.sync.get(['autoNextEnabled'], (result) => {
      setAutoNextEnabled(result.autoNextEnabled !== false);
    });
  };

  const checkAutoNextStatus = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0] && tabs[0].url?.includes('elearning-ability.tdtu.edu.vn')) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'getAutoNextStatus'}, (response) => {
          if (chrome.runtime.lastError) {
            // Extension not loaded on this page
            return;
          }
          
          if (response) {
            setAutoNextEnabled(response.enabled);
            setAutoNextClickCount(response.clickCount);
            setAutoNextButtonFound(response.buttonFound);
          }
        });
      }
    });
  };

  const toggleAutoNext = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0] && tabs[0].url?.includes('elearning-ability.tdtu.edu.vn')) {
        const newEnabled = !autoNextEnabled;
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleAutoNext',
          enabled: newEnabled
        }, (response) => {
          if (chrome.runtime.lastError) {
            showFeedback('❌ Không thể kết nối với trang elearning!');
            return;
          }
          
          if (response && response.success) {
            setAutoNextEnabled(response.enabled);
            chrome.storage.sync.set({ autoNextEnabled: response.enabled });
            showFeedback(response.enabled ? '✅ Đã bật Auto Next!' : '⏹️ Đã tắt Auto Next!');
          }
        });
      } else {
        showFeedback('⚠️ Vui lòng truy cập trang elearning-ability.tdtu.edu.vn/Unit/Index/!');
      }
    });
  };

  const startAutoReview = () => {
    setIsRunning(true);
    setStatus({ type: 'running', message: 'Đang quét môn học...' });
    
    chrome.storage.sync.get(['delay'], (result) => {
      const currentDelay = result.delay || 1;
      
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'start',
          delay: currentDelay
        }, (response) => {
          if (chrome.runtime.lastError) {
            setStatus({ type: 'stopped', message: 'Lỗi: Không thể kết nối với trang web' });
            setIsRunning(false);
          }
        });
      });
    });
  };

  const stopAutoReview = () => {
    setIsRunning(false);
    setStatus({ type: 'stopped', message: 'Đã dừng' });
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'stop'
      });
    });
  };

  const checkCurrentStatus = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'getStatus'}, (response) => {
          if (chrome.runtime.lastError) {
            setStatus({ type: 'idle', message: 'Sẵn sàng' });
            setIsRunning(false);
            return;
          }
          
          if (response && response.isRunning) {
            setIsRunning(true);
            setStatus({ type: 'running', message: 'Đang chạy...' });
            setProgress({ current: response.current || 0, total: response.total || 0 });
          } else {
            setStatus({ type: 'idle', message: 'Sẵn sàng' });
            setIsRunning(false);
          }
        });
      }
    });
  };

  const showFeedback = (message: string) => {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.className = 'success-feedback';
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 2000);
  };

  const handleDelayChange = (newDelay: number) => {
    setDelay(newDelay);
    chrome.storage.sync.set({ delay: newDelay });
  };

  const handleAutoStartChange = (checked: boolean) => {
    setAutoStart(checked);
    chrome.storage.sync.set({ autoStart: checked });
  };

  const getStatusIcon = () => {
    switch(status.type) {
      case 'idle':
        return <i className="fas fa-circle-check" style={{marginRight: '8px'}}></i>;
      case 'running':
        return <i className="fas fa-spinner fa-spin" style={{marginRight: '8px'}}></i>;
      case 'stopped':
        return <i className="fas fa-circle-xmark" style={{marginRight: '8px'}}></i>;
      default:
        return <i className="fas fa-circle-info" style={{marginRight: '8px'}}></i>;
    }
  };

  const progressPercentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <div className={`app ${theme !== 'ocean' ? `theme-${theme}` : ''}`}>
      {/* Loading Screen */}
      {showLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-logo">
              <img src={tdtuLogo} alt="TDTU Logo" className="logo-image" />
            </div>
            <div className="loading-text">Auto Course Review</div>
            <div className="loading-subtitle">TDTU Extension</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container">
        <div className="header">
          <div className="logo">
            <img src={tdtuLogo} alt="TDTU Logo" className="logo-image" />
          </div>
          <div className="title">
            <h1>Auto Course Review</h1>
            <p>TDTU Extension</p>
          </div>
        </div>

        {/* Status */}
        <div className={`status ${status.type}`}>
          {getStatusIcon()}
          Trạng thái: {status.message}
        </div>

        {/* Progress */}
        <div className="progress-container">
          <div className="progress-text">
            <span>Tiến độ: </span>
            <span id="progress">{progress.current}/{progress.total}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{width: `${progressPercentage}%`}}
            ></div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="controls">
          <button 
            className="button start-btn" 
            onClick={startAutoReview}
            disabled={isRunning}
          >
            <i className="fas fa-play"></i>
            Bắt đầu
          </button>
          <button 
            className="button stop-btn" 
            onClick={stopAutoReview}
            disabled={!isRunning}
          >
            <i className="fas fa-stop"></i>
            Dừng lại
          </button>
        </div>

        {/* Settings */}
        <div className="settings">
          <h3>Cài đặt</h3>
          
          {/* Delay Options */}
          <div className="setting-group">
            <label>Thời gian chờ giữa các môn:</label>
            <div className="delay-options">
              {[0.5, 1, 2, 3].map((delayValue) => (
                <label 
                  key={delayValue}
                  className={`delay-option ${delay === delayValue ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="delay"
                    value={delayValue}
                    checked={delay === delayValue}
                    onChange={() => handleDelayChange(delayValue)}
                  />
                  <span className="delay-text">{delayValue}s</span>
                </label>
              ))}
            </div>
          </div>

          {/* Auto Start */}
          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={autoStart}
                onChange={(e) => handleAutoStartChange(e.target.checked)}
              />
              <span className="checkmark"></span>
              Tự động bắt đầu khi mở extension
            </label>
          </div>
        </div>

        {/* Elearning Kỹ Năng Feature */}
        <div className="auto-next-section">
          <h3>
            <i className="fas fa-forward"></i>
            Elearning Kỹ Năng
          </h3>
          
          {/* Elearning Kỹ Năng Status */}
          <div className={`auto-next-status ${autoNextEnabled ? 'active' : 'inactive'}`}>
            <div className="status-indicator">
              {autoNextEnabled ? (
                <i className="fas fa-play-circle"></i>
              ) : (
                <i className="fas fa-pause-circle"></i>
              )}
              <span>
                {autoNextEnabled ? 'Đang hoạt động' : 'Tạm dừng'}
              </span>
            </div>
            
            <div className="status-details">
              <div className="status-item">
                <i className="fas fa-mouse-pointer"></i>
                <span>Đã click: {autoNextClickCount} lần</span>
              </div>
              <div className="status-item">
                <i className={`fas fa-search ${autoNextButtonFound ? 'text-success' : 'text-warning'}`}></i>
                <span>
                  {autoNextButtonFound ? 'Nút Next: Tìm thấy' : 'Nút Next: Không tìm thấy'}
                </span>
              </div>
            </div>
          </div>

          {/* Elearning Kỹ Năng Control */}
          <div className="auto-next-controls">
            <button 
              className={`auto-next-toggle ${autoNextEnabled ? 'stop' : 'start'}`}
              onClick={toggleAutoNext}
            >
              {autoNextEnabled ? (
                <>
                  <i className="fas fa-stop"></i>
                  Tắt Auto Next
                </>
              ) : (
                <>
                  <i className="fas fa-play"></i>
                  Bật Auto Next
                </>
              )}
            </button>
          </div>

          <div className="auto-next-info">
            <i className="fas fa-info-circle"></i>
            <span>Tự động hoàn thành khoá học Online trên trang Elearning Kỹ Năng</span>
          </div>
        </div>

        {/* Theme Switcher */}
        <div className="theme-switcher">
          <h3>Chủ đề</h3>
          <div className="theme-options">
            {[
              { name: 'ocean', label: 'Đại dương', icon: 'fa-water' },
              { name: 'sunset', label: 'Hoàng hôn', icon: 'fa-sun' },
              { name: 'forest', label: 'Rừng xanh', icon: 'fa-tree' },
              { name: 'cosmic', label: 'Vũ trụ', icon: 'fa-star' }
            ].map((themeOption) => (
              <button
                key={themeOption.name}
                className={`theme-btn ${theme === themeOption.name ? 'active' : ''}`}
                data-theme={themeOption.name}
                onClick={() => switchTheme(themeOption.name)}
                title={themeOption.label}
              >
                <i className={`fas ${themeOption.icon}`}></i>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <button className="settings-btn" onClick={() => setShowAboutModal(true)}>
            <i className="fas fa-info-circle"></i>
            Về extension
          </button>
        </div>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Về Auto Course Review</h2>
              <button className="close-btn" onClick={() => setShowAboutModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="about-logo">
                <img src={tdtuLogo} alt="TDTU Logo" className="logo-image" />
              </div>
              <h3>Auto Course Review Extension</h3>
              <p>© 2025 Bao Minh-Nguyen Co., Ltd.</p>
              <p className="copyright-sub">All Rights Reserved.</p>
              <p>Extension tự động đánh giá chất lượng môn học cho sinh viên TDTU</p>
              
              <div className="features">
                <h4>Tính năng:</h4>
                <ul>
                  <li><i className="fas fa-edit"></i> Tự động điền form đánh giá</li>
                  <li><i className="fas fa-graduation-cap"></i> Tự động hoàn thành học Online các môn Kỹ năng</li>
                  <li><i className="fas fa-palette"></i> Hỗ trợ nhiều chủ đề giao diện</li>
                  <li><i className="fas fa-clock"></i> Tùy chỉnh thời gian chờ</li>
                  <li><i className="fas fa-chart-line"></i> Theo dõi tiến độ real-time</li>
                </ul>
              </div>

              <div className="social-links">
                <h4>Liên hệ:</h4>
                <div className="links">
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      chrome.tabs.create({ url: 'https://github.com/iannwendy' });
                    }}
                    className="social-link github"
                  >
                    <i className="fab fa-github"></i>
                    GitHub
                  </a>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      chrome.tabs.create({ url: 'https://facebook.com/iannwendy2' });
                    }}
                    className="social-link facebook"
                  >
                    <i className="fab fa-facebook"></i>
                    Facebook
                  </a>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      chrome.tabs.create({ url: 'https://instagram.com/iannwendy' });
                    }}
                    className="social-link instagram"
                  >
                    <i className="fab fa-instagram"></i>
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App; 