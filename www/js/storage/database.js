/**
 * Created by USUARIO on 07/05/2014.
 */

//Database handling
var database_js = function(){

    this.dbSupport = false;
    this.supportError = "";
    var felicisDB = null;

    this.initialize = function() {

        try {
            if (window.openDatabase) {

                var shortName = 'FelicisDB';
                var version = '1.0';
                var displayName = 'Felicis Database';
                var maxSize = 100000; //  bytes
                felicisDB = openDatabase(shortName, version, displayName, maxSize);

                console.log("database opened");

                createTables();

                this.dbSupport = true;
            } else {

                this.supportError = "Databases are not supported in this browser";
            }
        } catch (e) {

            if (e == 2) {
                // Version number mismatch.
                this.supportError = "Invalid database version.";
            } else {
                this.supportError = "Unknown error " + e + ".";
            }

            return;
        }
    }

    this.executeCommand = function(command, nullHandler, errorHandler){
        felicisDB.transaction(
            function (transaction) {
                var data = [name];
                transaction.executeSql(command, [], nullHandler, errorHandler);
            }
        );
    }

    this.executeSelect = function(command, dataHandler, errorHandler){
        felicisDB.transaction(
            function (transaction) {
                var data = [name];
                transaction.executeSql(command, [], dataHandler, errorHandler);
            }
        );
    }

    this.insertUpdate = function(name){
        felicisDB.transaction(
            function (transaction) {
                var data = [name];
                transaction.executeSql("INSERT INTO myupdate (name) VALUES (?)", [data[0]], nullDataHandler, errorHandler);

                console.log("inserted");
            }
        );
    }

    var createTables = function(){

        felicisDB.transaction(
            function (transaction) {

                /*
                transaction.executeSql('drop TABLE IF EXISTS myupdate;');
                transaction.executeSql('drop TABLE IF EXISTS recipe;');
                */

                transaction.executeSql('CREATE TABLE IF NOT EXISTS myupdate (id INTEGER PRIMARY KEY, name TEXT, date NUMERIC);', [], nullDataHandler, errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS recipe (id INTEGER PRIMARY KEY, name TEXT, description TEXT);', [], nullDataHandler, errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY, name TEXT, email TEXT, password TEXT);', [], nullDataHandler, errorHandler);


                console.log("tables created");

            });
    }

    this.getAll = function(){
        felicisDB.transaction(
            function (transaction) {
                transaction.executeSql("SELECT name FROM myupdate;", [], dataSelectHandler, errorHandler);
            }
        );
    }

    function nullDataHandler(transaction, results) {

        console.log("null handler");
    }

    function dataSelectHandler(transaction, results){

        console.log("rows: " + results.rows.length);
    }

    function errorHandler(transaction, error){

        console.log("db error " + error);
    }

}
