/**
 * Created by USUARIO on 04/04/2014.
 */
var app = function(sender) {

    this.sender = sender;

    //Listado de Eventos
    this.EVENTO_LISTO = 'deviceready';
    this.EVENTO_BOTON_MENU = 'menubutton';
    this.EVENTO_BOTON_ATRAS = 'backbutton';

    this.inicializar = function(callback) {
        document.addEventListener(this.EVENTO_LISTO, callback, false);
    }

    this.escucharEvento = function(evento,callback){
        document.addEventListener(evento, callback, false);
    }

};