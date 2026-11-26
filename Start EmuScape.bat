@echo off
cd /d "%~dp0"
rem (EmuScape) the engine is in the folder: no Node.js needed
if exist "node_modules\electron\dist\electron.exe" (
  start "" "node_modules\electron\dist\electron.exe" "%~dp0."
  exit /b 0
)
if exist "Instalar EmuScape.bat" (
  call "Instalar EmuScape.bat"
  exit /b
)
if not exist node_modules (
  echo Installing EmuScape the first time. This takes a minute...
  call npm install
)
call npm start
