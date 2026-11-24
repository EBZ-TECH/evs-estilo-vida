@echo off
set "PATH=%ProgramFiles%\nodejs;%SystemRoot%;%SystemRoot%\System32;%SystemRoot%\System32\Wbem"
cd /d "%~dp0\.."
node node_modules\typescript\lib\tsc.js -b
node node_modules\vite\bin\vite.js build
