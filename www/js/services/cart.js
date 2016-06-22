app.service('cart', function () {

    function getBalance() {
        return 100;
    }

    function getUnitPrice() {
        return 1;
    }

    function getTotalCompany() {
        return 50;
    }


    return {
        getBalance: getBalance,
        getUnitPrice: getUnitPrice,
        getTotalCompany:getTotalCompany
    };
});
