app.factory('sqliteDatastore', function ($q, APP_STORE_CONF) {

    var db;

    function getDbExist() {
        return window.localStorage.getItem('db_exist') || null;
    }

    function setDbExist(dbExist) {
        window.localStorage.setItem('db_exist', dbExist);
    }

    function openDatabase() {
        var deferred = $q.defer();

        try {
            if (!APP_STORE_CONF.webStore) {
                db = window.sqlitePlugin.openDatabase({name: "findness", location: 1}, function () {
                    //success
                    deferred.resolve(true);
                }, function (e) {
                    //error
                    deferred.reject(e);
                });
            } else {
                db = window.openDatabase('findness', '1.0', 'findness database', 2 * 1024 * 1024);
                deferred.resolve(true);
            }
        } catch (e) {
            deferred.reject(e);
        }

        return deferred.promise;
    }

    function createTableTransactions() {
        var query = 'CREATE TABLE IF NOT EXISTS transactions (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' + //
            'id_registered TEXT,' + //
            'operator INTEGER NOT NULL,' + //paypal 2, stripe 3
            'reference TEXT,' + //
            'status INT,' + //0 no realizada, 1 efectiva, 2 negada
            'amount REAL NOT NULL,' +
            'comment TEXT,' + //error u otro
            'created DATETIME,' + //
            'updated DATETIME)';
        return execute(query);
    }

    function createTableBalance() {
        var query = 'CREATE TABLE IF NOT EXISTS balance (' +
            'balance REAL DEFAULT 0,' +
            'created DATETIME,' + //
            'updated DATETIME)';
        return execute(query);
    }

    function createTableMapRoute() {
        var query = 'CREATE TABLE IF NOT EXISTS map_route (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' + //
            'transport TEXT,' + //
            'status INT,' + //
            'created DATETIME,' + //
            'updated DATETIME)';
        return execute(query);
    }

    function createTableMapRoutePath() {
        var query = 'CREATE TABLE IF NOT EXISTS map_route_path (' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' + //
            'id_map_route INT,' +
            'transport TEXT,' + //
            'status INT,' + //
            'start_point TEXT,' +
            'end_point TEXT,' +
            'created DATETIME,' + //
            'updated DATETIME)';
        return execute(query);
    }

    function createTableEnterprises() {
        var query = 'CREATE TABLE IF NOT EXISTS enterprises (' +
            'id INTEGER PRIMARY KEY,' + //
            'id_external INTEGER NOT NULL,' +
            'social_reason TEXT,' + //
            'social_object TEXT,' +
            'latitude TEXT,' +
            'longitude TEXT,' +
            'created DATETIME,' + //
            'updated DATETIME)';
        return execute(query);
    }

    function createTables() {
        $q.all([
            createTableTransactions(),
            createTableBalance(),
            createTableMapRoute(),
            createTableMapRoutePath(),
            createTableEnterprises()
        ]).then(function (value) {
            setDbExist(true);
        }, function (reason) {
            // Error callback where reason is the value of the first rejected promise
        });
    }

    function execute(query, values) {
        if (!values) {
            values = [];
        }
        var deferred = $q.defer();

        function exec() {
            db.transaction(function (tx) {
                tx.executeSql(query, values, function (tx, result) {
                        deferred.resolve(result);
                    },
                    function (transaction, error) {
                        deferred.reject(error);
                    });
            });
        }

        if (!db) {
            openDatabase()
                .then(function () {
                    exec();
                });
        } else {
            exec();
        }

        return deferred.promise;
    }

    function initDb() {
        openDatabase();
        if (!getDbExist()) {
            createTables();
        } else {
        }
    }

    return {
        execute: execute,
        initDb: initDb
    };
});
