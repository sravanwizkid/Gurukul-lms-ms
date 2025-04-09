@echo off
echo Building and testing StudentMate API...

gcloud builds submit --config cloudbuild.yaml

echo Build and test process completed.
pause 