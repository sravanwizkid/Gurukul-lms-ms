@echo off
echo Fetching detailed Cloud Run logs...

gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=studentmate-api" ^
  --format="table(timestamp,severity,jsonPayload.message,textPayload)" ^
  --limit=50 ^
  --order=desc

echo Log fetch completed.
pause 