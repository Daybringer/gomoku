#! /bin/bash

# Workaround for dokku deployment

shopt -s extglob

cd server 

yarn install

yarn build-less

cd ..

cd dist

rm -r !(".git"|"Procfile")

cd ..

mv server/dist/* dist/

cp server/package.json dist/

cp server/yarn.lock dist/

cd client

yarn install

yarn build



