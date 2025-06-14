# 🎓 TDTU Auto Course Review Extension

A modern Chrome extension designed to automatically fill out course evaluation forms for Ton Duc Thang University (TDTU) students with a beautiful, contemporary interface featuring official TDTU branding.

![Extension Preview](https://img.shields.io/badge/Chrome-Extension-green?style=for-the-badge&logo=googlechrome)
![Version](https://img.shields.io/badge/Version-2.1.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![UI](https://img.shields.io/badge/UI-Modern%20Glass%20Morphism-purple?style=for-the-badge)

## ✨ Features

### 🤖 Core Automation
- 🚀 **Automatic Course Scanning**: Automatically detects unevaluated courses
- ⚡ **Multiple Speed Options**: Choose from 0.5s, 1s, 2s, or 3s delays
- 🎯 **Smart Form Filling**: Automatically fills evaluation forms with highest ratings
- 🔄 **Multi-page Handling**: Seamlessly handles Survey.aspx and Result.aspx pages
- 📊 **Progress Tracking**: Visual progress bar with real-time status updates
- 💾 **Persistent Settings**: Your preferences are saved and restored automatically

### 🎨 Modern UI/UX
- 🌟 **Loading Screen Animation**: Beautiful startup animation with TDTU branding
- 🏛️ **Official TDTU Logo**: Integrated official university logo throughout the interface
- 🎭 **Glass Morphism Design**: Modern translucent interface with backdrop blur effects
- 🌈 **4 Beautiful Themes**: Ocean Blue, Sunset Orange, Forest Green, Cosmic Purple
- ✨ **Advanced Animations**: Ripple effects, floating animations, celebration effects
- 🎯 **Visual Feedback System**: Success notifications and smooth transitions

### ⚡ Performance & Reliability
- 🔧 **Fixed Settings Persistence**: No more lost settings after page refresh
- 🎛️ **Proper Delay Handling**: Extension now correctly uses your selected timing
- 🚀 **Optimized Navigation**: Faster button clicks (500ms) for quicker processing
- 🛡️ **Enhanced Error Handling**: Better error detection and recovery

## 🛠️ Installation

### Method 1: Load Unpacked Extension (Recommended)

1. **Download the extension**:
   ```bash
   git clone https://github.com/iannwendy/TDTUAutoCourseReview.git
   cd TDTUAutoCourseReview
   ```

2. **Open Chrome Extensions**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

3. **Load the extension**:
   - Click "Load unpacked"
   - Select the downloaded folder
   - Extension will appear in your toolbar

### Method 2: Manual Download

1. Download the ZIP file from this repository
2. Extract to a folder
3. Follow steps 2-3 from Method 1

## 🚀 Usage

1. **Navigate to TDTU Course Evaluation**:
   - Go to `teaching-quality-survey.tdtu.edu.vn/choosesurvey.aspx`
   - Login with your student credentials

2. **Configure Extension**:
   - Click the extension icon in Chrome toolbar
   - Choose your preferred processing speed:
     - **Instant (0s)**: Fastest processing
     - **Fast (0.5s)**: Quick with minimal delay
     - **Normal (1s)**: Balanced speed (default)
     - **Slow (2s)**: Safest option

3. **Start Auto Review**:
   - Click "Bắt đầu tự động đánh giá" (Start Auto Review)
   - Watch the progress bar as it processes each course
   - Extension will automatically handle all pages

4. **Monitor Progress**:
   - Real-time status updates
   - Visual progress tracking
   - Automatic completion notification

## 📋 How It Works

The extension follows this workflow:

```
choosesurvey.aspx → Survey.aspx → Result.aspx → Back to choosesurvey.aspx
       ↓               ↓            ↓                    ↓
   Scan courses    Fill forms   Click continue      Next course
```

1. **Course Detection**: Scans the course table for "Chưa đánh giá" (Not evaluated) status
2. **Form Navigation**: Clicks "Chọn" (Choose) buttons to enter evaluation forms
3. **Auto-Fill**: Fills all rating fields with highest values (5 stars)
4. **Page Transitions**: Automatically handles "Tiếp tục" (Continue) buttons
5. **Loop Process**: Returns to course list and processes next course

## ⚙️ Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| Processing Speed | Delay between actions | 1 second |
| Auto Start | Start automatically when page loads | Enabled |

## 🔧 Technical Details

### File Structure
```
TDTUAutoCourseReview/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── content.js             # Main automation logic
├── tdtu-survey.js         # Survey form handling
├── background.js          # Service worker
├── icons/                 # Extension icons and logos
│   ├── icon16.png         # Extension icons
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon64.png
│   ├── icon128.png
│   ├── logo.png           # Original logo
│   └── TDTU_logo.png      # Official TDTU logo
├── CHANGELOG.md           # Version history
└── README.md              # This file
```

### Key Technologies
- **Manifest V3**: Latest Chrome extension standard
- **Content Scripts**: DOM manipulation and form automation
- **Service Worker**: Background processing
- **Chrome Storage API**: Settings persistence
- **Modern CSS**: Gradient designs and animations

## 🛡️ Privacy & Security

- ✅ **No Data Collection**: Extension doesn't collect or store personal data
- ✅ **Local Processing**: All operations happen locally in your browser
- ✅ **Minimal Permissions**: Only requests necessary permissions
- ✅ **Open Source**: Full source code available for review

## 🐛 Troubleshooting

### Common Issues

**Extension not working?**
- Ensure you're on the correct TDTU evaluation page
- Check if you're logged in to your student account
- Try refreshing the page and restarting the extension

**"Content Security Policy" errors?**
- This is normal for some websites
- Try using "Normal (1s)" or "Slow (2s)" speed options

**Extension popup not opening?**
- Reload the extension in `chrome://extensions/`
- Make sure the extension is enabled

## 📝 Changelog

For detailed changelog, see [CHANGELOG.md](CHANGELOG.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**@iannwendy**
- 🔗 GitHub: [@iannwendy](https://github.com/iannwendy)
- 📸 Instagram: [@iannwendy](https://instagram.com/iannwendy)

## ⚠️ Disclaimer

This extension is created for educational purposes and to help TDTU students efficiently complete their course evaluations. Please use responsibly and in accordance with your university's policies.

---

<div align="center">
  <p>Made with ❤️ for TDTU students</p>
  <p>⭐ Star this repo if it helped you!</p>
</div> 
