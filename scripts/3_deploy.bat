call env

cd..

@echo "Deploying"
plink %IP% -l %USER% -pw %PASS% rm -rf %DEST%; mkdir %DEST%;
pscp -r -pw %PASS% %SRC%/** %USER%@%IP%:%DEST%
pause