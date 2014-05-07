/**
 * Created by USUARIO on 07/05/2014.
 */

//Database handling
var db_recipes_js = function(db){

    var myDb = db;

    this.insert = function(name, description){
        myDb.executeCommand("INSERT INTO recipe (name,description) VALUES ('"+ name + "','" + description + "');", nullDataHandler, errorHandler);

        console.log("recipe inserted");
    }

    this.delete = function(){
        myDb.executeCommand("DELETE FROM recipe;", nullDataHandler, errorHandler);

        console.log("recipes deleted");
    }

    this.getAll = function(dataHandler){
        myDb.executeSelect("SELECT id, name, description FROM recipe;", dataHandler, errorHandler);
    }

    function nullDataHandler(transaction, results) {

        console.log("null handler recipes");
    }

    function errorHandler(transaction, error){

        console.log("recipes db error " + error.message);
    }
}