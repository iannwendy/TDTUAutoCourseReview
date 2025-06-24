# Changelog

All notable changes to TDTU Auto Course Review Extension will be documented in this file.

## [3.1.0] - 2025-06-24

### ✨ New Features
- **Auto Next for E-learning**: Added intelligent auto-next functionality for TDTU e-learning platform
  - Automatically clicks "Next" button on Unit/Index pages (every 200ms)
  - Smart URL detection - only activates on `elearning-ability.tdtu.edu.vn/Unit/Index/` pages
  - Real-time status monitoring with click counter and button detection
  - Automatic stop when navigating away from Unit/Index pages

### 🎯 Smart Learning Features  
- **Targeted Automation**: Auto-next only works on actual learning content pages, not homepage
- **Visual Feedback**: Button highlighting with orange glow effect before clicking
- **Safety Checks**: Validates button visibility and enabled state before clicking
- **Multiple Selectors**: Fallback button detection with alternative CSS selectors

### 🔧 Technical Improvements
- **URL Validation**: Added `isCorrectPage()` function for precise page targeting
- **Enhanced Error Handling**: Better logging and error recovery for button interactions
- **Performance Optimization**: Efficient DOM observation and button detection
- **Clean Code Architecture**: Modular functions for better maintainability

### 📱 UI/UX Enhancements
- **Updated About Modal**: Added "Tự động hoàn thành học Online các môn Kỹ năng" feature description
- **Better User Guidance**: Clear messaging about required page URL in popup notifications
- **Status Indicators**: Real-time display of Auto Next status, click count, and button detection
- **Graduation Cap Icon**: Added appropriate icon for e-learning features

### 🛠️ Extension Management
- **Auto Start/Stop**: Automatic activation on correct pages and deactivation when leaving
- **Settings Persistence**: Auto Next preferences saved across browser sessions
- **Cross-Component Communication**: Seamless popup-content script messaging
- **Build System**: Updated React build process with latest changes

### 📈 Performance Improvements (Previous Updates)
- Enhanced smooth scrolling for Survey.aspx page
- Auto-scroll following evaluation progress
- Visual feedback animations with highlight effects
- Responsive scroll positioning at 1/3 viewport height
- Reduced scroll speed from 800ms to 200ms (4x faster)
- Optimized timing and callback performance
- Improved DOM manipulation efficiency

## [3.0.0] - 2025-06-15

### Added
- Enhanced smooth scrolling for Survey.aspx page
- Auto-scroll following evaluation progress
- Visual feedback animations with highlight effects
- Responsive scroll positioning at 1/3 viewport height

### Performance
- Reduced scroll speed from 800ms to 200ms (4x faster)
- Optimized timing and callback performance
- Improved DOM manipulation efficiency

### UI/UX
- Removed "✅ 6/6" text indicators for cleaner interface
- Streamlined console output
- Enhanced highlight animations

### Technical
- Dynamic script injection for better performance
- Improved error handling and cross-page navigation
- Updated manifest for web accessible resources
- English documentation updates

## [2.2.0] - 2025-06-15

### Added
- Initial smooth scrolling functionality
- Basic scroll animations and visual feedback

### Improved
- Form detection and processing
- Error handling for survey pages

## [2.1.0] - 2025-06-14

### Added
- React + TypeScript modern UI
- Glass morphism design
- Multiple theme support
- Webpack 5 performance enhancements

## [2.0.0] - 2025-06-13

### Major Release
- Complete rewrite with modern architecture
- Manifest V3 support
- Enhanced automation capabilities

## [1.x.x] - 2025-06-12

### Initial Releases
- Basic course evaluation automation
- Simple popup interface
- Core functionality 