var files;

$(document).on("ready", function()
{

});


$.fn.iniciarObjArchivos = function(parametros)
{
	var idObj = $(this).attr("id").replace("cnt", "");
	var tds = "";
	tds += '<div class="card">';
        tds += '<div class="card-header">';
            tds += '<h4 class="card-title">Archivos</h4>';
        tds += '</div>';
        tds += '<div class="card-body card-padding form-horizontal">';
            tds += '<div class="row">';
                tds += '<div id="cnt' + idObj + '_DivArchivo" class="fileinput fileinput-new col-sm-12">';
                    tds += '<span class="btn btn-primary btn-file btn-block waves-effect">';
                        tds += '<span class="fileinput-new">Agregar Archivo</span>';
                        tds += '<input id="txt' + idObj + '_Archivo" type="file" name="...">';
                    tds += '</span>';
                tds += '</div>';
            tds += '</div>';
            tds += '<div class="popular-post">';
                    tds += '<h2>Archivos Cargados</h2>';
               tds += '';
                tds += '<div class="m-t-20">';
                    tds += '<div id="cnt' + idObj + '_DivArchivo_Listado" class="list-group lg-alt">';
                    tds += '</div>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';
    tds += '</div>';

    $(this).append(tds);
    tds = "";

    if ($("#cntModal_Archivos").length == 0)
	{
	    tds += '<div class="modal fade" id="cntModal_Archivos" tabindex="-1" role="dialog" aria-hidden="true">';
            tds += '<div class="modal-dialog">';
                tds += '<div class="modal-content">';
                    tds += '<form id="frmModal_Archivo" class="form-horizontal" role="form">';
                        tds += '<div class="modal-header">';
                            tds += '<h4 class="modal-title">Guardar Archivo <span id="lblModal_Archivo_Nombre"></span></h4>';
                        tds += '</div>';
                        tds += '<div class="modal-body">';
                            tds += '<div class="form-group">';
                                tds += '<div class="fg-line">';
                                    tds += '<textarea id="txtModal_ArchivoDescripcion" class="form-control" rows="5" placeholder="Observaciones, Comentarios o Descripción del Archivo..."></textarea>';
                                tds += '</div>';
                            tds += '</div>';
                        tds += '</div>';
                        tds += '<div class="modal-footer">';
                            tds += '<button type="button" id="btnModal_Archivo_Cancelar" class="btn btn-link waves-effect">Cancelar</button>';
                            tds += '<button type="submit" class="btn btn-link waves-effect">Enviar</button>';
                        tds += '</div>';
                    tds += '</form>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';

        $("body").append(tds);

         $("#btnModal_Archivo_Cancelar").on("click", function(evento)
		{
			evento.preventDefault();
			$("#cntIngresar_Archivo").modal("hide");
		});

	    $('#txt' + idObj + '_Archivo').on("change", function(event)
	    {
	    	$("#txtModal_ArchivoDescripcion").val("");
	    	$("#cntModal_Archivos").modal("show");
	    	$("#lblModal_Archivo_Nombre").text($(this).val().replace("C:\\fakepath\\", ""));
	    	$("#txtModal_ArchivoDescripcion").focus();

	    	files = event.target.files;
	    });

	    $("#frmModal_Archivo").on("submit", function(evento)
	    {
	    	evento.preventDefault();
		    $("#cntModal_Archivos").modal("hide");

	    	var data = new FormData();

	    	$.each(files, function(key, value)
		    {
		        data.append(key, value);
		    });

		    parametros.Prefijo = $(parametros.Prefijo).val();

		    if (parametros != undefined && parametros != null)
		    {
			    $.each(parametros, function(index, val) 
			    {
			    	data.append(index, val);
			    });
		    }


		    data.append("Observaciones", $("#txtModal_ArchivoDescripcion").val());
		    var nomArchivo = files[0].name;

		    $.ajax({
			        url: 'server/php/subirArchivos.php',
			        type: 'POST',
			        data: data,
			        cache: false,
			        dataType: 'html',
			        processData: false, // Don't process the files
			        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			        success: function(data, textStatus, jqXHR)
			        {
			            if( parseInt(data) >= 1)
			            {
			            	var extension = nomArchivo.split('.');
			            	if (extension.length > 0)
			            	{
			            		extension = extension[extension.length - 1];
			            	} else
			            	{
			            		extension = "obj";
			            	}
			            	var tds = " ";
			               	tds += '<a href="server/Archivos/' + parametros.Prefijo + '/' + nomArchivo + '" target="_blank" class="list-group-item media">';
	                            tds += '<div class="pull-left">';
	                                tds += '<div class="avatar-char ac-check">';
	                                    tds += '<span class="acc-helper palette-Red bg text-uppercase">' + extension + '</span>';
	                                tds += '</div>';
	                            tds += '</div>';
	                            tds += '<div class="media-body">';
	                                tds += '<div class="lgi-heading">' + nomArchivo.replace(extension, "") + '</div>';
	                                tds += '<small class="lgi-text">' + $("#txtModal_ArchivoDescripcion").val() + '</small>';
	                            tds += '</div>';
	                        tds += '</a>';

	                        $('#cnt' + idObj + '_DivArchivo_Listado').prepend(tds);
			            }
			            else
			            {
			                Mensaje('Error:', data, "danger");
			            }
			        },
			        error: function(jqXHR, textStatus, errorThrown)
			        {
			            // Handle errors here
			            Mensaje('Error:', textStatus, "danger");
			            $("#cntIngresar_Archivo").modal("show");
			        }
			    });
	    });
    }
}

function lanzarModalMateriaPrimaAgregar(callback)
{
	if (callback === undefined)
	{
		callback = function(){};
	} 

	if ($("#cntModal_MateriaPrimaAgregar").length == 0)
	{
		var tds = "";

	    tds += '<div class="modal fade" id="cntModal_MateriaPrimaAgregar" tabindex="-1" role="dialog" aria-hidden="true">';
            tds += '<div class="modal-dialog">';
                tds += '<div class="modal-content">';
                    tds += '<form id="frmModal_MateriaPrimaAgregar" class="form-horizontal" role="form">';
                    	tds += '<input id="txtModal_MateriaPrimaAgregar_id" class="form-control guardar hide">';
                        tds += '<div class="modal-header">';
                            tds += '<h4 class="modal-title">Agregar Materia Prima</h4>';
                        tds += '</div>';
                        tds += '<div class="modal-body">';
                            tds += '<div class="form-group">';
                            	tds += '<label for="txtModal_MateriaPrimaAgregar_Nombre" class="control-label">Nombre</label>'
                                tds += '<div class="fg-line">';
                                    tds += '<input id="txtModal_MateriaPrimaAgregar_Nombre" class="form-control guardar" placeholder="Nombre" required>';
                                tds += '</div>';
                            tds += '</div>';
                           	
                           	tds += '<div class="col-md-7">';
	                            tds += '<div class="form-group">';
	                            	tds += '<label for="txtModal_MateriaPrimaAgregar_Unidades" class="control-label">Unidades</label>'
	                                tds += '<div class="fg-line">';
	                                    tds += '<input id="txtModal_MateriaPrimaAgregar_Unidades" class="form-control guardar" placeholder="Unidades" required>';
	                                tds += '</div>';
	                            tds += '</div>';
                            tds += '</div>';
                            tds += '<div class="col-md-5">';
	                            tds += '<div class="form-group">';
	                            	tds += '<label for="txtModal_MateriaPrimaAgregar_siglaUnidades" class="control-label">Sigla Unidades</label>'
	                                tds += '<div class="fg-line">';
	                                    tds += '<input id="txtModal_MateriaPrimaAgregar_siglaUnidades" class="form-control guardar" placeholder="Sigla Unidades" required>';
	                                tds += '</div>';
	                            tds += '</div>';
	                        tds += '</div>';
                        	tds += '<div class="col-md-6">';
	                            tds += '<div class="form-group">';
	                            	tds += '<label for="txtModal_MateriaPrimaAgregar_cantidadMinima" class="control-label">Cantidad Mínima</label>'
	                                tds += '<div class="fg-line">';
	                                    tds += '<input id="txtModal_MateriaPrimaAgregar_cantidadMinima" type="number" step="any" class="form-control guardar" placeholder="Cantidad Mínima" required>';
	                                tds += '</div>';
	                            tds += '</div>';
                            tds += '</div>';
                            tds += '<div class="col-md-6">';
	                            tds += '<div class="form-group">';
	                            	tds += '<label for="txtModal_MateriaPrimaAgregar_cantidadMaxima" class="control-label">Cantidad Máxima</label>'
	                                tds += '<div class="fg-line">';
	                                    tds += '<input id="txtModal_MateriaPrimaAgregar_cantidadMaxima" type="number" step="any" class="form-control guardar" placeholder="Cantidad Máxima" required>';
	                                tds += '</div>';
	                            tds += '</div>';
	                        tds += '</div>';
                        tds += '</div>';
                        tds += '<div class="modal-footer">';
                            tds += '<button type="button" id="btnModal_MateriaPrimaAgregar_Cancelar" class="btn btn-link waves-effect">Cancelar</button>';
                            tds += '<button type="submit" class="btn btn-link waves-effect">Enviar</button>';
                        tds += '</div>';
                    tds += '</form>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';

        $("body").append(tds);

        $("#btnModal_MateriaPrimaAgregar_Cancelar").on("click", function(evento)
    	{
    		evento.preventDefault();
    		$("#cntModal_MateriaPrimaAgregar").modal("hide");
    	});

    	$("#frmModal_MateriaPrimaAgregar").on("submit", function(evento)
    	{
    		evento.preventDefault();
    		$("#frmModal_MateriaPrimaAgregar").generarDatosEnvio("txtModal_MateriaPrimaAgregar_", function(datos)
			{
				$.post('server/php/proyecto/modals/crearMateriaPrima.php', {Usuario: Usuario.id, datos : datos}, function(data, textStatus, xhr) 
				{
					if (!isNaN(data))
					{
						Mensaje("Hey", "Los datos han sido Ingresados", "success");	
						$("#cntModal_MateriaPrimaAgregar").modal("hide");
						datos = JSON.parse(datos);
						datos.id = data;
						callback(datos);
					} else
					{
						Mensaje("Error",data, "danger");
					}
				}).fail(function()
				{
					Mensaje("Error", "No hay conexión con el servidor", "danger");
				});
			});
    	});
    }

    $("#frmModal_MateriaPrimaAgregar")[0].reset();
    $("#cntModal_MateriaPrimaAgregar").modal("show");
}

function lanzarModalProveedorAgregar()
{
	if ($("#cntModal_ProveedorAgregar").length == 0)
	{
		var tds = "";

	    tds += '<div class="modal fade" id="cntModal_ProveedorAgregar" tabindex="-1" role="dialog" aria-hidden="true">';
            tds += '<div class="modal-dialog">';
                tds += '<div class="modal-content">';
                    tds += '<form id="frmModal_ProveedorAgregar" class="form-horizontal" role="form">';
                    	tds += '<input id="txtModal_ProveedorAgregar_id" class="form-control guardar hide">';
                        tds += '<div class="modal-header">';
                            tds += '<h4 class="modal-title">Agregar Proveedor</h4>';
                        tds += '</div>';
                        tds += '<div class="modal-body">';
                            tds += '<div class="form-group">';
                            	tds += '<label for="txtModal_ProveedorAgregar_Nombre" class="control-label">Nombre</label>'
                                tds += '<div class="fg-line">';
                                    tds += '<input id="txtModal_ProveedorAgregar_Nombre" class="form-control guardar" placeholder="Nombre" required>';
                                tds += '</div>';
                            tds += '</div>';
                        tds += '</div>';
                        tds += '<div class="modal-footer">';
                            tds += '<button type="button" id="btnModal_ProveedorAgregar_Cancelar" class="btn btn-link waves-effect">Cancelar</button>';
                            tds += '<button type="submit" class="btn btn-link waves-effect">Enviar</button>';
                        tds += '</div>';
                    tds += '</form>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';

        $("body").append(tds);

        $("#btnModal_ProveedorAgregar_Cancelar").on("click", function(evento)
    	{
    		evento.preventDefault();
    		$("#cntModal_ProveedorAgregar").modal("hide");
    	});

    	$("#frmModal_ProveedorAgregar").on("submit", function(evento)
    	{
    		evento.preventDefault();
    		$("#frmModal_ProveedorAgregar").generarDatosEnvio("txtModal_ProveedorAgregar_", function(datos)
			{
				$.post('server/php/proyecto/modals/crearProveedor.php', {Usuario: Usuario.id, datos : datos}, function(data, textStatus, xhr) 
				{
					if (!isNaN(data))
					{
						Mensaje("Hey", "Los datos han sido Ingresados", "success");	
						$("#cntModal_ProveedorAgregar").modal("hide");
					} else
					{
						Mensaje("Error",data, "danger");
					}
				}).fail(function()
				{
					Mensaje("Error", "No hay conexión con el servidor", "danger");
				});
			});
    	});
    }

    $("#frmModal_ProveedorAgregar")[0].reset();
    $("#cntModal_ProveedorAgregar").modal("show");
}

function lanzarModalServicioPublicoAgregar(callback)
{
	if (callback === undefined)
	{
		callback = function(){};
	}

	if ($("#cntModal_ServicioPublicoAgregar").length == 0)
	{
		var tds = "";

	    tds += '<div class="modal fade" id="cntModal_ServicioPublicoAgregar" tabindex="-1" role="dialog" aria-hidden="true">';
            tds += '<div class="modal-dialog">';
                tds += '<div class="modal-content">';
                    tds += '<form id="frmModal_ServicioPublicoAgregar" class="form-horizontal" role="form">';
                    	tds += '<input id="txtModal_ServicioPublicoAgregar_id" class="form-control guardar hide">';
                        tds += '<div class="modal-header">';
                            tds += '<h4 class="modal-title">Agregar Servicio Público</h4>';
                        tds += '</div>';
                        tds += '<div class="modal-body">';
                            tds += '<div class="form-group">';
                            	tds += '<label for="txtModal_ServicioPublicoAgregar_Nombre" class="control-label">Nombre</label>'
                                tds += '<div class="fg-line">';
                                    tds += '<input id="txtModal_ServicioPublicoAgregar_Nombre" class="form-control guardar" placeholder="Nombre" required>';
                                tds += '</div>';
                            tds += '</div>';
                            tds += '<div class="form-group">';
                                tds += '<label for="txtModal_ServicioPublicoAgregar_Unidades" class="control-label">Unidades</label>'
                                tds += '<div class="fg-line">';
                                    tds += '<input id="txtModal_ServicioPublicoAgregar_Unidades" class="form-control guardar" placeholder="Unidades" required>';
                                tds += '</div>';
                            tds += '</div>';
                        tds += '</div>';
                        tds += '<div class="modal-footer">';
                            tds += '<button type="button" id="btnModal_ServicioPublicoAgregar_Cancelar" class="btn btn-link waves-effect">Cancelar</button>';
                            tds += '<button type="submit" class="btn btn-link waves-effect">Enviar</button>';
                        tds += '</div>';
                    tds += '</form>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';

        $("body").append(tds);

        $("#btnModal_ServicioPublicoAgregar_Cancelar").on("click", function(evento)
    	{
    		evento.preventDefault();
    		$("#cntModal_ServicioPublicoAgregar").modal("hide");
    	});

    	$("#frmModal_ServicioPublicoAgregar").on("submit", function(evento)
    	{
    		evento.preventDefault();
    		$("#frmModal_ServicioPublicoAgregar").generarDatosEnvio("txtModal_ServicioPublicoAgregar_", function(datos)
			{
				$.post('server/php/proyecto/modals/crearServicioPublico.php', {Usuario: Usuario.id, datos : datos}, function(data, textStatus, xhr) 
				{
					if (!isNaN(data))
					{
						Mensaje("Hey", "Los datos han sido Ingresados", "success");	
						$("#cntModal_ServicioPublicoAgregar").modal("hide");
						callback(data, $("#txtModal_ServicioPublicoAgregar_Nombre").val());
					} else
					{
						Mensaje("Error",data, "danger");
					}
				}).fail(function()
				{
					Mensaje("Error", "No hay conexión con el servidor", "danger");
				});
			});
    	});
    }

    $("#frmModal_ServicioPublicoAgregar")[0].reset();
    $("#cntModal_ServicioPublicoAgregar").modal("show");
}

function lanzarModalProductoAgregar(callback)
{
	if (callback === undefined)
	{
		callback = function(){};
	}

	if ($("#cntModal_ProductoAgregar").length == 0)
	{
		var tds = "";

	    tds += '<div class="modal fade" id="cntModal_ProductoAgregar" tabindex="-1" role="dialog" aria-hidden="true">';
            tds += '<div class="modal-dialog">';
                tds += '<div class="modal-content">';
                    tds += '<form id="frmModal_ProductoAgregar" class="form-horizontal" role="form">';
                        tds += '<div class="modal-header">';
                            tds += '<h4 class="modal-title">Agregar Producto</h4>';
                        tds += '</div>';
                        tds += '<div class="modal-body">';
                    		tds += '<input id="txtModal_ProductoAgregar_id" class="form-control guardar hide" value="0">';
                            tds += '<div class="form-group">';
                            	tds += '<label for="txtModal_ProductoAgregar_Nombre" class="control-label">Nombre</label>'
                                tds += '<div class="fg-line">';
                                    tds += '<input id="txtModal_ProductoAgregar_Nombre" class="form-control guardar" placeholder="Nombre" required>';
                                tds += '</div>';
                            tds += '</div>';
                            tds += '<div class="form-group">';
                                tds += '<label for="txtModal_ProductoAgregar_Presentacion" class="control-label">Presentación</label>'
                                tds += '<div class="fg-line">';
                                    tds += '<input id="txtModal_ProductoAgregar_Presentacion" class="form-control guardar" placeholder="Presentación" required>';
                                tds += '</div>';
                            tds += '</div>';
                        tds += '</div>';
                        tds += '<div class="modal-footer">';
                            tds += '<button type="button" id="btnModal_ProductoAgregar_Cancelar" class="btn btn-link waves-effect">Cancelar</button>';
                            tds += '<button type="submit" class="btn btn-link waves-effect">Enviar</button>';
                        tds += '</div>';
                    tds += '</form>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';

        $("body").append(tds);

        $("#btnModal_ProductoAgregar_Cancelar").on("click", function(evento)
    	{
    		evento.preventDefault();
    		$("#cntModal_ProductoAgregar").modal("hide");
    	});

    	$("#frmModal_ProductoAgregar").on("submit", function(evento)
    	{
    		evento.preventDefault();
    		$("#frmModal_ProductoAgregar").generarDatosEnvio("txtModal_ProductoAgregar_", function(datos)
			{
				$.post('server/php/proyecto/modals/crearProducto.php', {Usuario: Usuario.id, datos : datos}, function(data, textStatus, xhr) 
				{
					if (!isNaN(data))
					{
						Mensaje("Hey", "Los datos han sido Ingresados", "success");	
						$("#cntModal_ProductoAgregar").modal("hide");
						callback(data, $("#txtModal_ProductoAgregar_Nombre").val(), $("#txtModal_ProductoAgregar_Presentacion").val());
					} else
					{
						Mensaje("Error",data, "danger");
					}
				}).fail(function()
				{
					Mensaje("Error", "No hay conexión con el servidor", "danger");
				});
			});
    	});
    }

    $("#frmModal_ProductoAgregar")[0].reset();
    $("#cntModal_ProductoAgregar").modal("show");
}

function lanzarModalClienteAgregar(callback)
{
	if (callback === undefined)
	{
		callback = function(){};
	}

	if ($("#cntModal_ClienteAgregar").length == 0)
	{
		var tds = "";

	    tds += '<div class="modal fade" id="cntModal_ClienteAgregar" tabindex="-1" role="dialog" aria-hidden="true">';
            tds += '<div class="modal-dialog">';
                tds += '<div class="modal-content">';
                    tds += '<form id="frmModal_ClienteAgregar" class="form-horizontal" role="form">';
                    	tds += '<input id="txtModal_ClienteAgregar_id" class="form-control guardar hide">';
                        tds += '<div class="modal-header">';
                            tds += '<h4 class="modal-title">Agregar Cliente</h4>';
                        tds += '</div>';
                        tds += '<div class="modal-body">';
                            tds += '<div class="form-group">';
                            	tds += '<label for="txtModal_ClienteAgregar_Nombre" class="control-label">Nombre</label>'
                                tds += '<div class="fg-line">';
                                    tds += '<input id="txtModal_ClienteAgregar_Nombre" class="form-control guardar" placeholder="Nombre" required>';
                                tds += '</div>';
                            tds += '</div>';
                            tds += '<div class="col-sm-6 form-group">';
                                tds += '<label for="txtModal_ClienteAgregar_Nit" class="control-label">Identificación</label>'
                                tds += '<div class="fg-line">';
                                    tds += '<input id="txtModal_ClienteAgregar_Nit" class="form-control guardar" placeholder="Identificación">';
                                tds += '</div>';
                            tds += '</div>';
                            tds += '<div class="col-sm-6 form-group">';
                                tds += '<label for="txtModal_ClienteAgregar_Telefono" class="control-label">Teléfono</label>'
                                tds += '<div class="fg-line">';
                                    tds += '<input id="txtModal_ClienteAgregar_Telefono" class="form-control guardar" placeholder="Teléfono">';
                                tds += '</div>';
                            tds += '</div>';
                            tds += '<div class="col-sm-12 form-group">';
                                tds += '<label for="txtModal_ClienteAgregar_Direccion" class="control-label">Dirección</label>'
                                tds += '<div class="fg-line">';
                                    tds += '<input id="txtModal_ClienteAgregar_Direccion" class="form-control guardar" placeholder="Dirección">';
                                tds += '</div>';
                            tds += '</div>';
                            tds += '<div class="col-sm-12 form-group">';
                                tds += '<label for="txtModal_ClienteAgregar_Correo" class="control-label">Correo</label>'
                                tds += '<div class="fg-line">';
                                    tds += '<input id="txtModal_ClienteAgregar_Correo" type="email" class="form-control guardar" placeholder="Correo">';
                                tds += '</div>';
                            tds += '</div>';

                        tds += '</div>';
                        tds += '<div class="modal-footer">';
                            tds += '<button type="button" id="btnModal_ClienteAgregar_Cancelar" class="btn btn-link waves-effect">Cancelar</button>';
                            tds += '<button type="submit" class="btn btn-link waves-effect">Enviar</button>';
                        tds += '</div>';
                    tds += '</form>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';

        $("body").append(tds);

        $("#btnModal_ClienteAgregar_Cancelar").on("click", function(evento)
    	{
    		evento.preventDefault();
    		$("#cntModal_ClienteAgregar").modal("hide");
    	});

    	$("#frmModal_ClienteAgregar").on("submit", function(evento)
    	{
    		evento.preventDefault();
    		$("#frmModal_ClienteAgregar").generarDatosEnvio("txtModal_ClienteAgregar_", function(datos)
			{
				$.post('server/php/proyecto/modals/crearCliente.php', {Usuario: Usuario.id, datos : datos}, function(data, textStatus, xhr) 
				{
					if (!isNaN(data))
					{
						Mensaje("Hey", "Los datos han sido Ingresados", "success");	
						$("#cntModal_ClienteAgregar").modal("hide");
						callback(data, $("#txtModal_ClienteAgregar_Nombre").val());
					} else
					{
						Mensaje("Error",data, "danger");
					}
				}).fail(function()
				{
					Mensaje("Error", "No hay conexión con el servidor", "danger");
				});
			});
    	});
    }

    $("#frmModal_ClienteAgregar")[0].reset();
    $("#cntModal_ClienteAgregar").modal("show");
}