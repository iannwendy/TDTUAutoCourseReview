#!/bin/bash

echo "🔄 Chuyển về phiên bản HTML/JS gốc"
echo "=================================="

if [ -d "original-backup" ]; then
    echo "📋 Khôi phục files gốc..."
    cp original-backup/popup.html ./
    cp original-backup/popup.js ./
    
    # Remove React-specific directories
    if [ -d "images" ]; then
        rm -rf images
        echo "🗑️  Đã xóa thư mục images"
    fi
    
    echo "✅ Đã khôi phục về phiên bản HTML/JS gốc!"
    echo ""
    echo "📝 Để test:"
    echo "1. Mở Chrome và vào chrome://extensions/"
    echo "2. Reload extension"
    echo ""
    echo "🚀 Để chuyển lại sang React, chạy: ./switch-to-react.sh"
else
    echo "❌ Không tìm thấy backup files!"
    echo "Vui lòng chạy ./switch-to-react.sh trước để tạo backup."
    exit 1
fi 