/**
 * Created by USUARIO on 10/04/2014.
 */

var ajax = function() {

    this.TIPO_PETICION_GET = "GET";
    this.TIPO_PETICION_POST = "POST";

    this.TIPO_DATO_JSONP = "jsonp";

    this.invocarMetodo = function(url, tipoPeticion, tipoDato, datos, callbackExito, callbackError) {

        $.ajax({
            type: tipoPeticion,
            dataType: tipoDato,
            url: url,
            data: datos,
            success: callbackExito,
            error: callbackError
        });
    }

};

