# abort on errors
set -e

vue ui &

cd server

npm run dev