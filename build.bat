@echo off
pnpm build
REM Copy Fly.io Specific Files to Build Directory
Powershell -Command "Get-ChildItem .\\build-fly.io\\ | Remove-Item -Recurse"
Powershell -Command "Get-ChildItem .\\build\\ | Copy-Item -Destination .\\build-fly.io\\ -Recurse"
Powershell -Command "Get-ChildItem .\\fly.io-files\\ | Copy-Item -Destination .\\build-fly.io\\ -Recurse"