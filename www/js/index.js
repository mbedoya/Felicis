
//Database Object
var db = null;
var myDbUpdates = null;
var myDbRecipes = null;
var myDbProfile = null;

//User
var user = { name: "", email: "" };

var connections = { webServer: "http://54.187.2.0" };

var updatesChecked = false;

function initialize(){

    $.mobile.loading( 'show', {
        text: 'Initializing...',
        textVisible: true,
        theme: 'a',
        html: ""
    });

    db = new database_js();
    db.initialize();

    if (db.dbSupport){

        myDbUpdates = new db_updates_js(db);
        myDbRecipes = new db_recipes_js(db);
        myDbProfile = new db_profile_js(db);

        //checking if profile exists
        myDbProfile.getAll(function(tx, rs){

            $.mobile.loading( 'hide' );

            if (rs.rows.length){

                user.name = rs.rows.item(0)['name'];
                user.email = rs.rows.item(0)['email'];
                $.mobile.changePage("#pagewelcome", {transition: "none"});

                return;
            }else{
                $.mobile.changePage("#pageregistration", {transition: "none"});
            }
        });
    }else{

        $.mobile.loading( 'hide' );
        $.mobile.changePage("#pageregistration", {transition: "none"});
    }
}

$(document).ready(function(){

    initialize();

    $( document ).on( "pageinit", "#pageregistration", function() {


    });

    $( document ).on( "pageinit", "#pageprofile", function() {

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
            text: 'Getting new recipes...',
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

        //Show name of user
        $("#hello #username").html(user.name);
        showRecipes();
    });


    $( document ).on( "pageshow", "#pagewelcome", function() {

        if(!updatesChecked){

            updatesChecked = true;

            $.mobile.loading( 'show', {
                text: 'Checking for updates...',
                textVisible: true,
                theme: 'a',
                html: ""
            });

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
                        $("#popupError").popup('open');
                        setTimeout($("#popupError").popup('close'), 3000);

                        console.log("error getting updates");
                    }
                })
                    .then( function ( response ) {

                        $.mobile.loading('hide');

                        if (response.length){
                            $.each( response, function ( i, val ) {
                                applyUpdate();
                            });
                        }

                    });

            });

        }

    });

    $("#mythcontent").on("swipe",function(){
        $("#mythtitle").html("Next Myth");
        $(this).html("My Description");
    });

    $("#myths li a").on("click", function(){
        $.mobile.changePage("#pagemyths", {transition: "none"});
    });

    $("#registrationbutton").on("click", function(){

        $.mobile.loading( 'show', {
            text: 'Saving...',
            textVisible: true,
            theme: 'a',
            html: ""
        });

        user.name = $("#pageregistration #personname").val();
        user.email = $("#pageregistration #email").val();

        myDbProfile.insert(user.name, user.email);

        $.mobile.loading( 'hide' );
        $.mobile.changePage("#pagewelcome", {transition: "none"});

    });

});

/* MOBILE INTERACTION */

function onNotificationGCM(e) {
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                console.log("Regid " + e.regid);
                //alert('registration id = '+e.regid);

                $("#registrationid").val(e.regid);
            }
            break;

        case 'message':
            // this is the actual push notification. its format depends on the data model from the push server
            alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;

        case 'error':
            alert('GCM error = '+e.msg);
            break;

        default:
            alert('An unknown GCM event has occurred');
            break;
    }
}

//It gets mobile events
var index_js = function(){

    var aplicacion;
    var pushNotification;

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

        //GCM Project 500486635893
        //App Server key AIzaSyAw5zkQI8plPyxOjeY-nw3UUODTQd9Nzv8
        pushNotification = window.plugins.pushNotification;
        pushNotification.register(aplicacion.sender.onNotificationSuccess, aplicacion.sender.onNotificationError,{"senderID":"500486635893","ecb":"onNotificationGCM"});
    }

    this.onNotificationSuccess = function(result) {
        alert('Callback Success! Result = '+result);
    }

    this.onNotificationError = function(error) {
        alert('pusherror:' + error);
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