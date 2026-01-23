#!/bin/bash

# Script to set up Things to Do in Agra images
# Usage: ./setup-things-to-do-images.sh <image1> <image2> <image3> <image4>

TARGET_DIR="public/things-to-do"

# Create directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Check if 4 images provided
if [ $# -ne 4 ]; then
    echo "Usage: $0 <image1> <image2> <image3> <image4>"
    echo ""
    echo "Example:"
    echo "  $0 ~/Downloads/taj-mahal.jpg ~/Downloads/agra-fort.jpg ~/Downloads/baby-taj.jpg ~/Downloads/fatehpur-sikri.jpg"
    exit 1
fi

# Copy images with correct names
cp "$1" "$TARGET_DIR/agra-taj-mahal-sunrise.jpg"
cp "$2" "$TARGET_DIR/agra-fort.jpg"
cp "$3" "$TARGET_DIR/agra-baby-taj.jpg"
cp "$4" "$TARGET_DIR/agra-fatehpur-sikri.jpg"

echo "✅ Images copied successfully!"
echo ""
echo "Files created:"
ls -lh "$TARGET_DIR"/*.jpg



