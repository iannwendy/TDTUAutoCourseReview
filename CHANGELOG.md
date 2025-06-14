# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2025-06-14

### ✨ New Features
- **Loading Screen Animation**: Added beautiful loading screen that appears on Chrome startup
  - Glass morphism design matching the main UI
  - Theme-aware colors that adapt to selected theme
  - 1-second duration with smooth fade animations
  - Session-based detection (30-second threshold)
- **Official TDTU Logo Integration**: Replaced Font Awesome icons with official TDTU logo
  - High-quality PNG logo in loading screen and header
  - Proper scaling and positioning for all screen sizes
  - Maintained glass morphism background effects

### 🐛 Critical Bug Fixes
- **Fixed Delay Settings Persistence**: Resolved issue where settings didn't persist after page refresh (F5)
- **Corrected Default Delay**: Changed default from 2 seconds to 1 second as intended
- **Fixed Extension Ignoring User Settings**: Extension now properly uses user-selected delay values
- **Resolved JavaScript Hoisting Error**: Fixed `ReferenceError: Cannot access 'surveyDelay' before initialization`

### ⚡ Performance Improvements
- **Optimized Button Click Delays**: Reduced "Tiếp tục" button delays from 2000ms to 500ms for faster navigation
- **Enhanced Delay Propagation**: Improved delay value passing between popup → content script → survey script
- **Better Error Handling**: Added comprehensive error logging and fallback mechanisms

### 🎨 UI/UX Enhancements
- **Updated Branding**: Changed title to "TDTU Auto Course Review" for better identification
- **Improved Logo Organization**: Moved all logo files to `icons/` directory for better project structure
- **Enhanced Loading Experience**: Loading screen now applies user's selected theme automatically
- **Better Visual Feedback**: Improved status messages and progress indicators

### 🔧 Technical Improvements
- **Code Organization**: Reorganized JavaScript functions for better maintainability
- **Storage API Enhancement**: Better use of `chrome.storage.sync` for settings persistence
- **Cross-Script Communication**: Improved message passing between extension components
- **Session Management**: Added `chrome.storage.session` for loading screen logic

### 📁 File Structure Changes
- Moved `logo.png` and `TDTU_logo.png` to `icons/` directory
- Updated all image references to use correct paths
- Better organization of extension assets

## [2.0.0] - 2024-06-13

### 🎨 Major UI/UX Redesign
- **BREAKING**: Complete interface redesign with modern aesthetics
- Implemented **Glass Morphism** design with backdrop blur effects
- Added dynamic **gradient backgrounds** with smooth animations
- Redesigned all buttons with enhanced hover effects and micro-interactions

### ✨ New Features
- **Theme Switcher**: 4 beautiful themes (Ocean Blue, Sunset Orange, Forest Green, Cosmic Purple)
- **Advanced Animations**: 
  - Floating logo animation
  - Ripple click effects (Material Design inspired)
  - Status pulse animations
  - Progress bar shimmer effects
  - Container glow effects
- **Visual Feedback System**:
  - Success notifications for theme changes
  - Celebration animations on task completion
  - Shake animations for errors
  - Loading dots for progress text

### 🔧 Improvements
- **Typography**: Upgraded to SF Pro Display font family
- **Icons**: Integrated FontAwesome 6.4.0 for all UI elements
- **Form Controls**: Custom-designed radio buttons and checkboxes with animations
- **Color Scheme**: Modern color palette with better contrast and accessibility
- **Spacing**: Improved spacing and visual hierarchy throughout the interface
- **Responsiveness**: Better layout adaptation and smooth transitions

### 🐛 Bug Fixes
- Fixed `ReferenceError: switchTheme is not defined`
- Resolved function hoisting issues in JavaScript
- Fixed modal overlay and backdrop effects
- Improved error handling for theme switching

### 🎯 Performance
- Optimized CSS animations with `cubic-bezier` timing functions
- Reduced motion preferences support (`prefers-reduced-motion`)
- Lazy loading for complex animations
- Efficient DOM manipulation for ripple effects

### 📱 User Experience
- **Particle Effects**: Subtle floating particles in background
- **Smooth Transitions**: All state changes now have smooth 0.3-0.8s transitions
- **Hover States**: Enhanced hover feedback for all interactive elements
- **Click Feedback**: Immediate visual response to all user interactions
- **Theme Persistence**: User theme preferences are saved and restored

### 🛠️ Technical Changes
- Restructured JavaScript for better organization
- Added helper functions for common UI operations
- Improved CSS architecture with better variable usage
- Enhanced cross-browser compatibility
- Better error handling and debugging

---

## [1.0.0] - 2024-06-12

### Initial Release
- Basic auto course review functionality
- Simple UI with basic styling
- Core extension features for TDTU course evaluation
- Basic settings and progress tracking 