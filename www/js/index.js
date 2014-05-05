
$("li.item a").on("click", function(e){
    console.log("selected");
});

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
                url: "http://www.mocky.io/v2/5367ab02d6b7c4040bd1ce47",
                dataType: "jsonp",
                crossDomain: true,
                data: {},
                success: function(){
                    alert("ok");
                },
                error: function(){
                    alert("error");
                }
            })
            .then( function ( response ) {

                    alert('resp');

                    $.each( response, function ( i, val ) {
                        html += "<li class='.item'><a href='#' >" + val.name + "</a></li>";
                    });
                    $ul.html( html );
                    $ul.listview( "refresh" );
                    $ul.trigger( "updatelayout");
            });
        }
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