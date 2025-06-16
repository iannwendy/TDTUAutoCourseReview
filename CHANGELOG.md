# Changelog

All notable changes to TDTU Auto Course Review Extension will be documented in this file.

## [3.1.0] - 2025-01-08

### 🚀 Enhanced Smooth Scrolling Experience

#### ✨ Added
- **Enhanced smooth scrolling** for Survey.aspx page with 4x faster performance
- **Intelligent auto-scroll** that follows evaluation progress question by question
- **Smooth scroll to top** before starting evaluation
- **Smooth scroll to bottom** after completing all questions
- **Visual feedback animations** with improved highlight effects
- **Responsive scroll positioning** that centers questions at 1/3 viewport height

#### ⚡ Performance Improvements
- **Reduced scroll speed** from 800ms to 200ms (4x faster)
- **Optimized timing** for scroll callbacks (60% → 40% wait time)
- **Faster highlight duration** from 2s to 1.5s
- **Improved legacy function** performance (300ms → 200ms delays)
- **Reduced scroll-to-bottom timing** from 1.5x to 0.8x scroll speed

#### 🎨 UI/UX Improvements
- **Removed cluttered text indicators** (eliminated "✅ 6/6" icons)
- **Cleaner console output** (removed unnecessary scroll position logs)
- **Streamlined animations** focusing on visual effects only
- **Enhanced highlight effects** with better transitions
- **Responsive design** that adapts to different screen sizes

#### 🔧 Technical Enhancements
- **Dynamic script injection** for better performance
- **Improved error handling** for scroll operations
- **Better cross-page navigation** handling
- **Enhanced focus event** detection
- **Optimized DOM manipulation** for smoother animations

#### 📱 Compatibility
- **Updated manifest** to support web accessible resources
- **Enhanced content script** coordination
- **Improved background service** worker integration
- **Better React popup** integration support

### 🏗️ Infrastructure
- **Updated documentation** with English Video Introduction section
- **Improved README** structure and content organization
- **Enhanced code comments** for better maintainability
- **Streamlined build process** compatibility

---

## [2.2.0] - 2025-01-07

### ✨ Added
- Initial smooth scrolling functionality for Survey.aspx
- Basic scroll animations and highlight effects
- Enhanced user experience with visual feedback

### 🔧 Improved
- Better form detection and processing
- Enhanced error handling for survey pages
- Improved page transition handling

---

## [2.1.0] - 2024-12-XX

### ✨ Added
- React + TypeScript modern UI
- Glass morphism design effects
- Multiple theme support
- Enhanced performance with Webpack 5

---

## [2.0.0] - 2024-11-XX

### 🚀 Major Release
- Complete rewrite with modern architecture
- Manifest V3 support
- Enhanced automation capabilities
- Improved reliability and performance

---

## [1.x.x] - 2024-XX-XX

### 🎯 Initial Releases
- Basic course evaluation automation
- Simple popup interface
- Core functionality implementation

---

**Legend:**
- 🚀 Major features
- ✨ New features
- ⚡ Performance improvements
- 🎨 UI/UX improvements
- 🔧 Technical improvements
- 🐛 Bug fixes
- 📱 Compatibility updates
- 🏗️ Infrastructure changes 