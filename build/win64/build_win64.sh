#!/bin/sh
echo "Building NanoCell $version for Win64"
rm -r ./tmp
mkdir ./tmp
mkdir ./tmp/win64
cp -r $nwjsWin64/* ./tmp/win64
cp -r ../src/* ./tmp/win64
cp ../src/logo/nanocell.ico ./tmp/win64/nanocell.ico
cd ./tmp/win64/
ResourceHacker.exe -open nw.exe  -save nw.exe -action addoverwrite -res nanocell.ico -mask ICONGROUP,IDR_MAINFRAME
mv nw.exe NanoCell.exe
cd ../../



iscc -dMyAppVersion=$version -o./preProd ./win64/setup.iss


