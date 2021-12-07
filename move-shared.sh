set -o errexit

rm -r client/src/shared
rm -r server/src/shared
cp -r shared client/src
cp -r shared server/src

echo "Done"
