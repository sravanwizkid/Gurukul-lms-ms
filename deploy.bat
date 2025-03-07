@echo off
echo Deploying to Cloud Run...

gcloud run deploy gurukul-sm-api ^
--image asia-south1-docker.pkg.dev/gurukul-lms-ms/gurukul-repo/gurukul-sm-api ^
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