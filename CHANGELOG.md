# Changelog

All notable changes to this project will be documented in this file.

## [3.1.0] - 2025-12-20

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

## [3.0.0] - 2025-06-15

### 🚀 MAJOR RELEASE: React + TypeScript Conversion
- **BREAKING**: Complete frontend rewrite from vanilla HTML/CSS/JS to React 18 + TypeScript
- **Modern Architecture**: Implemented component-based architecture with React hooks
- **Type Safety**: Full TypeScript integration with custom Chrome API definitions
- **Build System**: Webpack 5 configuration with asset optimization and hot reloading

### ✨ New Features
- **React Components**: Modular component structure (App.tsx, index.tsx)
- **TypeScript Support**: Type-safe development with chrome.d.ts definitions
- **Modern Build Pipeline**: Automated build and deployment scripts
- **Asset Management**: Webpack-based image and resource handling
- **Development Tools**: Hot reloading and development server support

### 🎨 UI/UX Enhancements
- **Rounded Design**: Consistent 24px border-radius throughout the interface
- **TDTU Logo Integration**: Official TDTU logo replacing Font Awesome icons
- **Smooth Animations**: Enhanced hover effects and transitions
- **Social Media Links**: Improved social media buttons with hover animations
- **Modal Improvements**: Better spacing, scrolling, and visual hierarchy
- **Loading Screen**: Rounded loading screen matching main container design

### 🔧 Technical Improvements
- **Component Architecture**: Reusable React components with proper state management
- **Build Optimization**: 210KB optimized bundle with tree shaking
- **Asset Pipeline**: Automatic image optimization and copying
- **Development Workflow**: Streamlined development with npm scripts
- **Code Organization**: Separated concerns with TypeScript modules
- **Error Handling**: Improved error boundaries and TypeScript error checking

### 📁 Project Structure Changes
- Added `react-popup/` directory with complete React application
- Implemented `webpack.config.js` for build configuration
- Added `tsconfig.json` for TypeScript compilation
- Created `package.json` with React 18 and development dependencies
- Added build automation scripts (`switch-to-react.sh`, `switch-to-original.sh`)

### 🛠️ Development Experience
- **Hot Reloading**: Instant feedback during development
- **TypeScript IntelliSense**: Enhanced IDE support and autocomplete
- **Component DevTools**: React DevTools compatibility
- **Build Warnings**: Comprehensive build-time error checking
- **Asset Optimization**: Automatic image compression and bundling

### 🎯 Performance
- **Bundle Size**: Optimized 210KB production bundle
- **Loading Speed**: Faster initial load with code splitting
- **Memory Usage**: Efficient React rendering and state management
- **Animation Performance**: Hardware-accelerated CSS animations

### 🔄 Migration Notes
- **Backward Compatibility**: Original HTML/CSS files preserved for fallback
- **Seamless Transition**: Identical functionality with improved architecture
- **Settings Preservation**: All user settings and preferences maintained
- **Extension Behavior**: No changes to core automation logic

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

## [2.0.0] - 2025-06-13

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

## [1.0.0] - 2025-06-12

### Initial Release
- Basic auto course review functionality
- Simple UI with basic styling
- Core extension features for TDTU course evaluation
- Basic settings and progress tracking 