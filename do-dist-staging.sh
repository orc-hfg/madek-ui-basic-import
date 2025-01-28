#!/bin/sh

npm run builderr
rsync -avz dist/* alex@dev.madek.hfg-karlsruhe.de:/srv/staging/madek-basic-import/dist/
