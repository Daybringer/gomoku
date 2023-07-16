#! /bin/bash

# Workaround for dokku deployment


shopt -s extglob

set -o errexit # preventing the removal of whole directory
# better way might be throwing errors https://www.redhat.com/sysadmin/bash-error-handling

cd server

yarn install --ignore-engines

yarn build-new

cd ..

cd dist


rm -r !(".git"|"Procfile")

cd ..

mv server/dist/* dist/

cp server/package.json dist/

cp server/yarn.lock dist/

cd client

yarn install --ignore-engines

yarn build


