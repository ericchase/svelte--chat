@echo off
REM Deploys to Fly.io
REM Note that you must have created the app via `fly launch` for your account.
PUSHD .\\build-fly.io\\
fly deploy
POPD
PAUSE