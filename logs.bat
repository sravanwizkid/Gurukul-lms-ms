@echo off
echo Fetching Cloud Run logs...

gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=gurukul-sm-api" ^
--limit=50 ^
--format="table(timestamp,severity,textPayload,httpRequest.requestUrl,httpRequest.status)" ^
--order=desc

echo Log fetch completed.
pause 