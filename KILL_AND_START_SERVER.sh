#!/bin/bash

echo "🛑 Killing any process on port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "   No process found"
sleep 2

echo ""
echo "🚀 Starting server..."
cd /Users/talhanawaz/Desktop/asiabylocals-latest/server
node server.js
