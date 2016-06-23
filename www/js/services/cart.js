app.service('cart', function () {

    self.payable = 0;


    function getBalance() {
        return 100;
    }

    function getUnitPrice() {
        return 2;
    }

    function getTotalCompanies() {
        return 50;
    }

    function setPayable(amount){
        self.payable = amount;
    }

    function getPayable(){
        return self.payable;
    }


    return {
        getBalance: getBalance,
        getUnitPrice: getUnitPrice,
        getTotalCompanies:getTotalCompanies,
        setPayable:setPayable,
        getPayable:getPayable
    };
});
