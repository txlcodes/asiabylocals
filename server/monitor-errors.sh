#!/bin/bash

# Error Monitoring Script
# This script helps you see errors in real-time

echo "🔍 Monitoring Backend Errors..."
echo "Press Ctrl+C to stop"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Color codes for better visibility
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Monitor the backend process output
# This will show errors as they happen
tail -f /dev/null 2>&1 | while read line; do
    if echo "$line" | grep -q "❌\|ERROR\|Error\|error"; then
        echo -e "${RED}$line${NC}"
    elif echo "$line" | grep -q "⚠️\|WARN\|Warning"; then
        echo -e "${YELLOW}$line${NC}"
    elif echo "$line" | grep -q "✅\|SUCCESS\|Success"; then
        echo -e "${GREEN}$line${NC}"
    else
        echo "$line"
    fi
done

