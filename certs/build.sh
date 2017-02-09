#!/usr/bin/env bash

export ANDROID_HOME=/opt/android-sdk/

if [ "$1" = "release" ]
then
    echo "BUILDING RELEASE"
    gulp && ionic build android --release
    cd certs
    rm Findness.apk
    echo 'iY88bR62' | jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore ../platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name
    /opt/android-sdk/build-tools/23.0.3/zipalign -v 4 ../platforms/android/build/outputs/apk/android-release-unsigned.apk Findness.apk
    cd ..
else
    echo "BUILDING DEVELOP"
    gulp && ionic build android
fi