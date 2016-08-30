app.service('notificationMessage', function ($rootScope) {

    function processNotification(data) {
        console.log("notification push",data);
        $rootScope.$emit("receivedNotification", data);
    }

    return {
        processNotification: processNotification
    };
});