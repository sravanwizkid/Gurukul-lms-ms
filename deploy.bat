@echo off
echo Deploying to Cloud Run...

gcloud run deploy studentmate-api ^
  --image us-central1-docker.pkg.dev/gurukul-lms-ms/studentmate-repo/studentmate-api:latest ^
  --platform managed ^
  --region us-central1 ^
  --allow-unauthenticated ^
  --port=3000 ^
  --add-cloudsql-instances="gurukul-lms-ms:asia-south1:gurukul-postgres" ^
  --service-account="studentmate-api@gurukul-lms-ms.iam.gserviceaccount.com" ^
  --set-env-vars=NODE_ENV=production,DB_NAME=glms1,DB_USER=postgres,DB_PASSWORD=postgres123,CLOUD_SQL_CONNECTION_NAME=gurukul-lms-ms:asia-south1:gurukul-postgres ^
  --min-instances=1 ^
  --memory=512Mi ^
  --cpu=1 ^
  --concurrency=80

echo Deployment completed.
pause 