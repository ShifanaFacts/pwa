echo|set /p="#" >> current_sw_version.txt
echo|set /p="/* SW Version: " >> build\service-worker.js
type current_sw_version.txt >> build\service-worker.js
echo|set /p=" | Created: "  >> build\service-worker.js
echo|set /p=%date% >> build\service-worker.js
echo|set /p=" " >> build\service-worker.js
echo|set /p=%time% >> build\service-worker.js
echo|set /p=" */" >> build\service-worker.js
cd build
set zipFileName=PWA_Build_%date:/=%_%time::=%.zip
set zipFileName=%zipFileName: =0%
tar.exe -a -c -f %zipFileName% static xtrascripts index.html service-worker*  asset-manifest.json   
explorer.exe /select,%zipFileName%
cd..
EXIT /B 0