angular.module('app').service('transactionStorage', function ($q, sqliteDatastore, DATETIME_FORMAT_CONF) {

    var sqlDateTimeFormat = DATETIME_FORMAT_CONF.dateTimeFormat;
    
    function saveTransaction(transaction){
        var deferred = $q.defer();

        var query = 'INSERT INTO transaction (id_registered, operator, reference, status, amount, created, updated) VALUES(?,?,?,?,?,?,?)';
        var values = [
            transaction.id_registered,
            transaction.operator,
            transaction.reference,
            transaction.status,
            transaction.amount,
            moment().format(sqlDateTimeFormat),
            moment().format(sqlDateTimeFormat)
        ];

        sqliteDatastore.execute(query, values).then(function (resp) {
            deferred.resolve(resp.insertId);
        }).catch(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    
    return {
        saveTransaction: saveTransaction
    }
});