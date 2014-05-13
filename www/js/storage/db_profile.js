/**
 * Created by USUARIO on 08/05/2014.
 */

//Database handling
var db_profile_js = function(db){

    var myDb = db;

    this.insert = function(name, email,mongoid,pushid){
        myDb.executeCommand("INSERT INTO profile (name,email,mongoid,pushnotificationid) VALUES ('"+ name + "','" + email + "','" + mongoid + "','" + pushid + "');", nullDataHandler, errorHandler);
        console.log("profile inserted");
    }

    this.delete = function(){
        myDb.executeCommand("DELETE FROM profile;", nullDataHandler, errorHandler);

        console.log("recipes deleted");
    }

    this.getAll = function(dataHandler){
        myDb.executeSelect("SELECT id, name, email FROM profile;", dataHandler, errorHandler);
    }

    function nullDataHandler(transaction, results) {

        console.log("null handler recipes");
    }

    function errorHandler(transaction, error){

        console.log("recipes db error " + error.message);
    }
}
