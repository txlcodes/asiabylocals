#!/bin/bash

# Script to copy city images from "abl homepage" folders to public folder
# Usage: ./copy-city-images.sh

SOURCE_DIR="/Users/talhanawaz/Desktop/abl homepage"
TARGET_DIR="/Users/talhanawaz/Desktop/asiabylocals/public"

# Array of cities
cities=(
  "phuket"
  "chiang-mai"
  "hanoi"
  "ho-chi-minh-city"
  "beijing"
  "shanghai"
  "manila"
  "cebu"
  "siem-reap"
  "kathmandu"
  "yangon"
  "colombo"
  "yogyakarta"
  "penang"
  "busan"
)

echo "🖼️  Copying city images..."
echo ""

for city in "${cities[@]}"; do
  city_folder="$SOURCE_DIR/$city"
  target_file="$TARGET_DIR/${city}-hero.jpg"
  
  if [ -d "$city_folder" ]; then
    # Find first image file in the folder
    image_file=$(find "$city_folder" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.avif" \) | head -1)
    
    if [ -n "$image_file" ]; then
      cp "$image_file" "$target_file"
      echo "✅ Copied $city image: $(basename "$image_file") → ${city}-hero.jpg"
    else
      echo "⏳ No image found for $city (will use placeholder)"
    fi
  else
    echo "⏳ Folder not found: $city"
  fi
done

echo ""
echo "✨ Done! Images copied to public folder."



