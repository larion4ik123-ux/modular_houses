#!/bin/zsh
cd "/Users/luvlarion4ik/Desktop/Work/ModularHouse" || exit 1
PORT=4173
URL="http://127.0.0.1:${PORT}/index.html"

echo "Starting preview server at ${URL}"
python3 -m http.server "${PORT}" >/tmp/modular-houses-preview.log 2>&1 &
SERVER_PID=$!
sleep 1
open "${URL}"

echo ""
echo "Preview is open in your browser."
echo "If you want to stop the server later, run:"
echo "kill ${SERVER_PID}"
echo ""
echo "Log file: /tmp/modular-houses-preview.log"
