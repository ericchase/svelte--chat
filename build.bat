@echo off
pnpm build
REM Copy Fly.io Specific Files to Build Directory
Powershell -Command "Copy-Item -Path .\\build-fly.io\\* -Destination .\\build\\"