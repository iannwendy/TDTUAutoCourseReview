#!/bin/bash

echo "🚀 Chuyển đổi sang React Frontend cho Auto Course Review Extension"
echo "=================================================================="

# Backup original files
echo "📦 Backup các file gốc..."
if [ ! -d "original-backup" ]; then
    mkdir original-backup
    cp popup.html original-backup/
    cp popup.js original-backup/
    echo "✅ Đã backup popup.html và popup.js"
else
    echo "ℹ️  Backup đã tồn tại"
fi

# Build React version
echo "🔨 Build React version..."
cd react-popup
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build React thành công!"
    
    # Copy built files to root
    echo "📋 Copy files từ React build..."
    cp dist/popup.html ../
    cp dist/popup.js ../
    
    # Copy images directory if it exists
    if [ -d "dist/images" ]; then
        cp -r dist/images ../
        echo "📸 Đã copy thư mục images"
    fi
    
    echo "🎉 Hoàn thành! Extension đã được chuyển sang React frontend."
    echo ""
    echo "📝 Để test:"
    echo "1. Mở Chrome và vào chrome://extensions/"
    echo "2. Reload extension hoặc load unpacked từ thư mục gốc"
    echo ""
    echo "🔄 Để quay lại phiên bản cũ, chạy: ./switch-to-original.sh"
else
    echo "❌ Build React thất bại!"
    exit 1
fi 