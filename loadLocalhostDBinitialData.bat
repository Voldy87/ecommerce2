cd /d D:/andre/mongo/
start mongod --dbpath data
cd /d mongomart/initialDbData/
timeout /t 10
for /r %%i in (*.json) do (
mongoimport --drop -d unrealmart -c  %%~ni %%i
)
exit

