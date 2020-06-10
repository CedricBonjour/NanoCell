#!/bin/sh
export version="1.0.0"
export nwjsWin64=~/nwjs/nwjs_v0.46.1/nwjs-v0.46.1-win-x64
export nwjsOSX=~/nwjs/nwjs_v0.46.1/nwjs-v0.46.1-osx-x64/nwjs.app
export icon=../src/logo/nanocell.ico
sed -i "23s/.*/$version/" ../src/about.html 


#./win64/build_win64.sh
./osx/build_osx.sh