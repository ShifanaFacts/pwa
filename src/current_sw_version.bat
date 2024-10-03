echo|set /p="#" >> current_sw_version.txt
echo|set /p="/* SW Version: " >> build\service-worker.js
type current_sw_version.txt >> build\service-worker.js
echo|set /p=" | Created: "  >> build\service-worker.js
echo|set /p=%date% >> build\service-worker.js
echo|set /p=" " >> build\service-worker.js
echo|set /p=%time% >> build\service-worker.js
echo|set /p=" */" >> build\service-worker.js
cd build
set zipFileName=PWA_Build_%date::=%_%time:~0,2%-%time:~3,2%-%time:~6,2%.zip
set zipFileName=%zipFileName: =0%
tar.exe -a -c -f %zipFileName% static index.html service-worker.js precache*.js asset-manifest.json
explorer.exe /select,%zipFileName%
cd..
EXIT /B 0