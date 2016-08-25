app.service('notificationMessage', function ($q) {

    function processNotification(data) {
        console.log("notification push",data);
    }

    return {
        processNotification: processNotification
    };
});