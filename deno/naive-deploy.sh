#!/usr/bin/env bash

# Exit on errors, undefined variables, and failed commands in pipelines.
set -euo pipefail

REPO="git@github.com:you/my-app.git"
BRANCH="main"
APP_DIR="$HOME/my-app"
APP_NAME="my-app"

echo "==> Checking Deno..."

if deno --version >/dev/null 2>&1; then
  echo "    Deno already installed: $(deno --version | head -n 1)"
else
  echo "    Deno not found. Installing..."
  curl -fsSL https://deno.land/install.sh | sh
  export PATH="$HOME/.deno/bin:$PATH"
  echo "    Deno installed: $(deno --version | head -n 1)"
fi

echo "==> Stopping $APP_NAME..."
sudo systemctl stop "$APP_NAME" || true

echo "==> Checking repository..."

if [ ! -d "$APP_DIR/.git" ]; then
  echo "    Repository not found. Cloning..."
  git clone --branch "$BRANCH" "$REPO" "$APP_DIR"
else
  echo "    Repository found. Pulling latest..."
  git -C "$APP_DIR" pull --ff-only origin "$BRANCH"
fi

echo "==> Building client..."
cd "$APP_DIR/client"
deno task build

echo "==> Starting $APP_NAME..."
sudo systemctl start "$APP_NAME"

echo "==> Deployment complete!"
