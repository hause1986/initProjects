@echo off
set day=%date:~0,2%
set month=%date:~3,2%
set year=%date:~6,4%
set hour=%time:~0,2%
set minute=%time:~3,2%

:: Убираем пробелы у часа (если время 0:05 → " 0:05")
if "%hour:~0,1%"==" " set hour=0%hour:~1,1%

set datetime=%day%.%month%.%year% %hour%:%minute%
set dirgit=%cd%

git -C "%dirgit%" add . --all
git -C "%dirgit%" commit -m "Auto commit[ %datetime% ]"
git -C "%dirgit%" push origin master -f

pause