#!/bin/sh
echo "Building NanoCell $version for OSX"
rm -r ./tmp
mkdir ./tmp
mkdir ./tmp/osx
mkdir ./tmp/osx/NanoCell.app
cp -r $nwjsOSX/* ./tmp/osx/NanoCell.app


mkdir ./tmp/osx/NanoCell.app/Contents/Resources/app.nw
cp -r ../src/* ./tmp/osx/NanoCell.app/Contents/Resources/app.nw

mv ./tmp/osx/NanoCell.app/Contents/Resources/app.nw/logo/nanocell.icns ./tmp/osx/NanoCell.app/Contents/Resources/app.icns
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Libraries/libGLESv2.dylib
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Helpers/app_mode_loader
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Libraries/libvk_swiftshader.dylib
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Libraries/libswiftshader_libGLESv2.dylib
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/XPCServices/AlertNotificationService.xpc/Contents/MacOS/AlertNotificationService
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/am.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/ar.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/bg.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/bn.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/el.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/fa.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/gu.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/hi.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/kn.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/ml.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/mr.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/ru.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/sr.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/ta.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/te.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/th.lproj/locale.pak
rm "./tmp/osx/NanoCell.app/Contents/Frameworks/nwjs Framework.framework/"Versions/*/Resources/uk.lproj/locale.pak
find . -name *.pak.info -type f -delete


chmode -R 777 ./tmp/osx

mkisofs  -J -R -o tmp/nanocell_osx_v$version.dmg -mac-name -V NanoCell -apple -dir-mode 777 -file-mode 777 ./tmp/osx

tar -czvf preProd/nanocell_osx_v$version.tar.gz tmp/nanocell_osx_v$version.dmg
