@echo off
cd /d "%~dp0"
rem (EmuScape) the engine is in the folder: no Node.js needed
if exist "node_modules\electron\dist\electron.exe" (
  start "" "node_modules\electron\dist\electron.exe" "%~dp0." --windowed
  exit /b 0
)
if not exist node_modules call npm install
call npm start -- --windowed
