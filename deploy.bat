@echo off
echo Cleaning up local files...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"
if exist "dist" rmdir /s /q "dist"
del /s *.bak

echo Installing dependencies...
call npm install

echo Building with Cloud Build...
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,14%

gcloud builds submit --tag asia-south1-docker.pkg.dev/gurukul-lms-ms/gurukul-repo/gurukul-sm-api:%TIMESTAMP% ^
--timeout=1800s

echo Cleaning up old revisions...
gcloud run revisions delete --platform managed --region asia-south1 --quiet $(gcloud run revisions list --platform managed --region asia-south1 --service gurukul-sm-api --format="value(name)")

echo Deploying new revision...
gcloud run deploy gurukul-sm-api ^
--image asia-south1-docker.pkg.dev/gurukul-lms-ms/gurukul-repo/gurukul-sm-api:%TIMESTAMP% ^
--platform managed ^
--region asia-south1 ^
--allow-unauthenticated ^
--set-env-vars="NODE_ENV=production,DB_NAME=glms1,DB_USER=postgres,DB_PASSWORD=postgres123" ^
--add-cloudsql-instances="gurukul-lms-ms:asia-south1:gurukul-postgres" ^
--service-account="gurukul-sm-api@gurukul-lms-ms.iam.gserviceaccount.com" ^
--timeout=600 ^
--cpu=1 ^
--memory=512Mi ^
--min-instances=0 ^
--max-instances=10 ^
--port=3000 ^
--cpu-boost

echo Deployment completed.
pause 