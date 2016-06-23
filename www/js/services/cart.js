app.service('cart', function () {

    self.payable = 0;
    self.totalCompanies = 50;
    self.unitPrice = 2;

    function getBalance() {
        return window.localStorage.getItem('balance') || 0;
    }

    function getUnitPrice() {
        return self.unitPrice;
    }

    function setUnitPrice(price){
        self.unitPrice =  price;
    }

    function getTotalCompanies() {
        return self.totalCompanies;
    }

    function setTotalCompanies(total){
        self.totalCompanies = total;
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
        setUnitPrice:setUnitPrice,
        getTotalCompanies:getTotalCompanies,
        setTotalCompanies:setTotalCompanies,
        setPayable:setPayable,
        getPayable:getPayable
    };
});
