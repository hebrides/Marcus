#!/usr/bin/env bash
# Serves the Stoic Reader dev site.
#   run.sh          -> picks a free port
#   run.sh 8776     -> serves on port 8776
# Writes the chosen port to web/.dev-port so playwright can point at it.

set -euo pipefail
cd "$(dirname "$0")"

if [ $# -gt 0 ]; then
    PORT="$1"
else
    PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("",0)); print(s.getsockname()[1]); s.close()')"
fi

echo "$PORT" > .dev-port
echo "Serving http://localhost:$PORT"
exec python3 -m http.server "$PORT"
