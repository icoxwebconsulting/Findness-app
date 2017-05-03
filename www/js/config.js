app.config(function ($ionicConfigProvider) {
    // Enable Native Scrolling on Android
    $ionicConfigProvider.platform.android.scrolling.jsScrolling(false);
    $ionicConfigProvider.scrolling.jsScrolling(false);
});
