@echo off
echo Building and Deploying to Cloud Run...

:: Build using Cloud Build
gcloud builds submit --tag asia-south1-docker.pkg.dev/gurukul-lms-ms/gurukul-repo/gurukul-sm-api:latest

:: Deploy to Cloud Run
gcloud run deploy gurukul-sm-api ^
--image asia-south1-docker.pkg.dev/gurukul-lms-ms/gurukul-repo/gurukul-sm-api:latest ^
--platform managed ^
--region asia-south1 ^
--allow-unauthenticated ^
--port=3000

echo Deployment completed.
pause 