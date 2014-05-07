/**
 * Created by USUARIO on 07/05/2014.
 */

//Database handling
var db_updates_js = function(db){

    var myDb = db;

    this.insert = function(name, date){
        myDb.executeCommand("INSERT INTO myupdate (name,date) VALUES ('"+ name + "','" + date + "');", nullDataHandler, errorHandler);
    }

    this.getAll = function(dataHandler){
        myDb.executeSelect("SELECT id, name, date FROM myupdate;", dataHandler, errorHandler);
    }

    function nullDataHandler(transaction, results) {

        console.log("null handler updates");
    }

    function errorHandler(transaction, error){

        console.log("updates db error " + error.message);
    }
}