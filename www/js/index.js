
//Database Object
var db = null;
var myDbUpdates = null;
var myDbRecipes = null;

var connections = { webServer: "http://54.187.147.191" };

$( document ).on( "pageinit", "#pageregistration", function() {

    $( "#petbreed" ).on( "filterablebeforefilter", function ( e, data ) {

        var $ul = $( this ),
            $input = $( data.input ),
            value = $input.val(),
            html = "";
        $ul.html( "" );

        if ( value && value.length > 2 ) {

            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
            $ul.listview( "refresh" );
            $.ajax({
                url: connections.webServer + "/breed/search",
                dataType: "json",
                type: "POST",
                data: { text: value },
                success: function(data){

                },
                error: function(a, b, c){
                    alert("Error getting breeds, please check internet connection");
                }
            })
            .then( function ( response ) {
                    $.each( response, function ( i, val ) {
                        html += "<li class='.item'><a href='#' >" + val.name + "</a></li>";
                    });
                    $ul.html( html );
                    $ul.listview( "refresh" );
                    $ul.trigger( "updatelayout");

                    $( "#petbreed li a").on("click", function (){
                        $input.val($(this).html());
                        $ul.html( "" );
                    });
            });
        }
    });
});

function showRecipes(){

    var $ul = $( "#recipes" );
    $ul.html( "" );
    var html = "";

    myDbRecipes.getAll(function(tx, rs){

        for (var i=0; i<rs.rows.length; i++) {
            var row = rs.rows.item(i);
            html += "<li ><a href='#' >" + row['name'] + "</a></li>";
        }

        $ul.html( html );
        $ul.listview( "refresh" );
        $ul.trigger( "updatelayout");

    });

    console.log("recipes shown");
}

function applyUpdate(updateName){

    $.mobile.loading( 'show', {
        text: 'Getting recipes...',
        textVisible: true,
        theme: 'a',
        html: ""
    });

    //Get Recipes
    $.ajax({
        url: connections.webServer + "/recipe/get",
        dataType: "json",
        type: "POST",
        data: { },
        success: function(data){

        },
        error: function(a, b, c){
            $.mobile.loading('hide');
            showRecipes();
            alert("Error getting recipes, please check internet connection");
        }
    })
        .then( function ( response ) {

            $.mobile.loading('hide');

            if (response.length){

                //Delete old recipes
                myDbRecipes.delete();
                $.each( response, function ( i, val ) {
                    myDbRecipes.insert(val.name, val.description);
                    console.log("inserting recipe " + val.name);
                });
            }
             //insert update record
             myDbUpdates.insert(updateName, null);

            showRecipes();
        });

}

$( document ).on( "pageinit", "#pagewelcome", function() {


    $.mobile.loading( 'show', {
        text: 'Checking for updates...',
        textVisible: true,
        theme: 'a',
        html: ""
    });

    db = new database_js();
    db.initialize();
    myDbUpdates = new db_updates_js(db);
    myDbRecipes = new db_recipes_js(db);

    var numberOfUpdates = 0;

    //Check for local updates
    myDbUpdates.getAll(function(tx, rs){

        console.log("updates");

        numberOfUpdates = rs.rows.length;

        //Check for online updates
        $.ajax({
            url: connections.webServer + "/update/search",
            dataType: "json",
            type: "POST",
            data: { updatesApplied: numberOfUpdates },
            success: function(data){

            },
            error: function(a, b, c){
                $.mobile.loading('hide');
                showRecipes();
                alert("Error getting updates, please check internet connection");
            }
        })
            .then( function ( response ) {

                $.mobile.loading('hide');

                if (response.length){
                    $.each( response, function ( i, val ) {
                        applyUpdate();
                    });
                }else{
                    showRecipes();
                }

            });

    });

});

$(document).ready(function(){

    function welcome(){

        $.mobile.changePage("#pagewelcome", {transition: "none"});
        $.mobile.loading( 'hide' );
    }

    $("#registrationbutton").on("click", function(){

        $.mobile.loading( 'show', {
            text: 'Saving...',
            textVisible: true,
            theme: 'a',
            html: ""
        });

        setTimeout(welcome, 2000);

    });

});

/* MOBILE INTERACTION */

//It gets mobile events
var index_js = function(){

    var aplicacion;

    this.start = function(){

        aplicacion = new app(this);
        aplicacion.inicializar(aplicacion.sender.onDispositivoListo);
    }

    //Método invocado cuando el dispositivo esté listo
    this.onDispositivoListo = function(e){

        //Iniciarlizar los eventos cuando el dispositivo esté listo
        //Evento Menú
        //aplicacion.escucharEvento(aplicacion.EVENTO_BOTON_MENU, aplicacion.sender.onBotonMenuPresionado);
        //Evento Botón Atrás
        //aplicacion.escucharEvento(aplicacion.EVENTO_BOTON_ATRAS, aplicacion.sender.onBotonAtrasPresionado);
    }

    //Método que se invoca cuando se presiona el botón Menú
    this.onBotonMenuPresionado = function (e) {
        if (navigator.notification) {
            navigator.notification.alert('Soy Eus', null, 'Hello', 'OK');
        } else {
            alert('Soy Eus');
        }
    }

    //Método que se invoca cuando se presiona el botón atrás
    this.onBotonAtrasPresionado = function (e) {
        if (navigator.notification) {
            navigator.notification.alert('Atrás', null, 'Hello', 'OK');
        } else {
            alert('Atrás Alert');
        }
    }
}