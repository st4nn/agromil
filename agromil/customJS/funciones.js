var Usuario = null;

$(document).on("ready", function()
    {
        Usuario = JSON.parse(localStorage.getItem('reg_agromil'));

        if (Usuario == null || Usuario == undefined)
        {
            $.aplicacion.cerrarSesion();
        }
        $.aplicacion.cargarHeader(function()
            {
              
              if(typeof iniciarModulo !== 'undefined' &&  $.isFunction(iniciarModulo)) {
                  iniciarModulo();
              }

                $("#lblCerrarSesion").click(function(evento)
                {
                  evento.preventDefault();
                  $.aplicacion.cerrarSesion();
                });
            });
    });


var aplicacion = function()
{
    this.cargarHeader = function(callback)
    {
        callback = callback || function(){};
        $.get("header.html", function(data) 
        {
            $("#header").html(data);
            callback();
        });        
    },

    this.cerrarSesion = function()
    {
        delete localStorage.reg_agromil;
        window.location.replace("index.html");
    }
};

$.aplicacion = new aplicacion();


$.fn.generarDatosEnvio = function(restricciones, callback)
{
  if (callback === undefined)
    {callback = function(){};}

    var obj = $(this).find(".guardar");
  var datos = {};
  datos['Usuario'] = Usuario.id;

  $.each(obj, function(index, val) 
  {
    var idObj = $(val).attr("id");
    if (idObj != undefined)
    {
        if ($(val).attr("type") == "checkbox")
        {
            datos[idObj.replace(restricciones, "")] = $(val).is(":checked");
        } else
        {
            datos[idObj.replace(restricciones, "")] = $(val).val();
        }
    }
  });
  datos = JSON.stringify(datos);  

  callback(datos);
}

$.fn.cargarDatosConf = function(Pagina, callback, datos, no_reset)
{
  if (callback === undefined)
    {callback = function(){};}

    if (no_reset === undefined)
    {no_reset = false}

    var obj = this;

  datos = datos || {Usuario: Usuario.id};
  datos.Usuario = Usuario.id;

  if (!no_reset)
  {
    $(obj).find("option").remove();
  }

  $.post('server/php/proyecto/' + Pagina + '.php', datos, function(data, textStatus, xhr) 
  {
    if (data != 0)
    {
        $(obj).llenarCombo(data, callback);
    }
  }, "json").fail(function()
  {
    Mensaje("Error", "No hay conexión al Servidor, por favor actualice la página", "danger");
  });
}

$.fn.llenarCombo = function(data, callback)
{
  if (callback === undefined)
    {callback = function(){};}

  var elemento = $(this);
      var tds = "";
      $.each(data, function(index, val) 
      {
         tds += '<option value="' + val.id + '">' + val.Nombre + '</option>';
      });
  elemento.append(tds);
  callback();
}

function Mensaje(Titulo, Mensaje, Tipo, vFrom, vAlign)
{
    if (Tipo == undefined)
    {
        Tipo = "success";
    }

    vFrom = vFrom || 'top';
    vAlign = vAlign || 'right'

    $.growl({
        message: Mensaje
    },{
        type: Tipo,
        allow_dismiss: false,
        label: 'Cancel',
        className: 'btn-xs btn-inverse',
        placement: {
            from: vFrom,
            align: vAlign
        },
        delay: 2500,
        animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
        },
        offset: {
            x: 30,
            y: 30
        }
    });
}

function priAlert(Titulo, Mensaje, Tipo)
{
  swal({
              title: Titulo,
              text: Mensaje,
              type: tipo,
              timer: 2000,
              showConfirmButton: false
          });
}


function readURL(input, idObj) 
{
    var Nombre = input.value.replace("C:\\fakepath\\", "");
  
    if (input.files && input.files[0]) 
    {
        var reader = new FileReader();
        /*
        reader.onload = function (e) 
        {
           auditoria_AgregarSoporte(idObj, e.target.result, Nombre, 0);       
        }
        */
        reader.readAsDataURL(input.files[0]);
    }
}

function abrirURL(url)
{
  var win = window.open(url, "_blank", "directories=no, location=no, menubar=no, resizable=yes, scrollbars=yes, statusbar=no, tittlebar=no");
  win.focus();
}

function obtenerFecha()
{
  var f = new Date();
  return f.getFullYear() + "-" + CompletarConCero(f.getMonth() +1, 2) + "-" + CompletarConCero(f.getDate(), 2) + " " + CompletarConCero(f.getHours(), 2) + ":" + CompletarConCero(f.getMinutes(), 2) + ":" + CompletarConCero(f.getSeconds(), 2);
}
function obtenerPrefijo()
{
  var f = new Date();
  return f.getFullYear() + CompletarConCero(f.getMonth() +1, 2) + CompletarConCero(f.getDate(), 2) + CompletarConCero(f.getHours(), 2) + CompletarConCero(f.getMinutes(), 2) + CompletarConCero(f.getSeconds(), 2) + CompletarConCero(Usuario.id, 3);
}
function CompletarConCero(n, length)
{
   n = n.toString();
   while(n.length < length) n = "0" + n;
   return n;
}

function calcularTiempoPublicacion(fecha)
{
    fecha = new Date(fecha.replace(" ", "T") + "Z");
    var fechaActual = new Date();
    
    var tiempo = fecha.getTime();
    var tiempoActual = fechaActual.getTime();

    var diferencia = tiempoActual-tiempo;

    diferencia = parseInt(((diferencia/1000)/60)-300);

    var respuesta = "";
    if (diferencia < 2)
    {
      respuesta = "hace un momento";
    } else
    {
      if (diferencia < 60)
      {
        respuesta = "hace " + diferencia + " minutos";
      } else
      {
          if (diferencia < 120)
          {
            respuesta = "hace " + 1 + " hora";
          } else
          {
            if (diferencia < 1440)
            {
              respuesta = "hace " + parseInt(diferencia/60) + " horas";
            } else
            {
              if (diferencia < 43200)
              {
                respuesta = "hace " + parseInt(diferencia/60/24) + " dias";
              } else
              {
                respuesta = "hace " + parseInt(diferencia/60/24/30) + " meses";
              }
            }
          }
      }
    }

    return respuesta;
}

$.fn.iniciarSelectRemoto = function(script, delay, minimo)
{
  if (script != "" && script != undefined && script != null)
  {
    delay = delay || 300;
    minimo = minimo || 3;

    $(this).select2({
        ajax: {
          url: "server/php/proyecto/select2/" + script + ".php",
          dataType: 'json',
          delay: delay,
          data: function (params) {
            return {
              q: params.term, // search term
              page: params.page
            };
          },
          processResults: function (data, params) {
            return {
              results: data.items
            };
          },
          cache: true
        },
      language: "es",
      escapeMarkup: function (markup) { return markup; }, 
      minimumInputLength: minimo,
      templateResult: function(dato) { return dato.name;  },
      templateSelection : function(dato)  { return dato.name;   }
    });
  }
}