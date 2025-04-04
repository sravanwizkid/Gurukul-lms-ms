@echo off
echo Fetching detailed Cloud Run logs...

gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=gurukul-sm-api" ^
--format="table(timestamp,severity,textPayload)" ^
--limit=20 ^
--order=desc

echo Log fetch completed.
pause 