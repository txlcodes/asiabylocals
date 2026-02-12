#!/bin/bash

echo "🔍 Checking if backend server is running on port 3001..."

# Check if port 3001 is in use
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "✅ Port 3001 is in use"
    PID=$(lsof -ti:3001)
    echo "   Process ID: $PID"
    
    # Test if server is responding
    echo "🧪 Testing server health endpoint..."
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ Server is responding!"
        curl -s http://localhost:3001/api/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3001/api/health
    else
        echo "❌ Server is NOT responding - it may have crashed"
        echo "   Killing process $PID..."
        kill $PID
        sleep 2
        echo "   Starting server..."
        cd server && node server.js &
        sleep 3
        echo "   Testing again..."
        curl -s http://localhost:3001/api/health
    fi
else
    echo "❌ Port 3001 is NOT in use - server is not running"
    echo "🚀 Starting server..."
    cd server && node server.js &
    sleep 3
    echo "🧪 Testing server..."
    curl -s http://localhost:3001/api/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3001/api/health
fi
