#!/bin/bash

# Start Backend Server with Visible Logs
# Run this: ./start-backend.sh

echo "========================================"
echo "🚀 STARTING BACKEND SERVER"
echo "========================================"
echo ""
echo "📋 All logs will appear below!"
echo "   Keep this terminal visible."
echo ""
echo "🔍 When you submit a tour, watch for:"
echo "   🚨 TOUR CREATION ERROR DETECTED"
echo "   ❌ Error messages"
echo ""
echo "========================================"
echo ""

cd server
npm start

