#!/bin/bash

# Script to start backend with visible logs
# Run this: ./start-with-logs.sh

echo "========================================"
echo "🚀 STARTING BACKEND SERVER"
echo "========================================"
echo ""
echo "📋 This terminal will show ALL errors!"
echo "   Keep this window visible while testing."
echo ""
echo "🔍 When you submit a tour, watch for:"
echo "   🚨 TOUR CREATION ERROR DETECTED"
echo "   ❌ Error messages"
echo ""
echo "========================================"
echo ""
echo "Starting server..."
echo ""

cd "$(dirname "$0")"
npm start

