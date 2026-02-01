#!/bin/bash

echo "🛑 Stopping any existing server on port 3001..."

# Find and kill process on port 3001
PID=$(lsof -ti:3001)
if [ ! -z "$PID" ]; then
    echo "   Found process $PID on port 3001, killing it..."
    kill $PID
    sleep 2
    echo "   ✅ Process killed"
else
    echo "   No process found on port 3001"
fi

echo ""
echo "🚀 Starting server..."
node server.js
