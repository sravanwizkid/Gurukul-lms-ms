@echo off
echo Building Docker image...
gcloud builds submit --tag us-central1-docker.pkg.dev/gurukul-lms-ms/studentmate-repo/studentmate-api:latest
echo Build completed.
pause 