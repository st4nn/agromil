function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Inventario");

	$("#txtInventario_Prefijo").val(obtenerPrefijo());

	$("#cntInventario_Archivos").iniciarObjArchivos({Prefijo : $("#txtInventario_Prefijo"), Proceso: "Inventario", Usuario: Usuario.id});

	$("#txtInventario_FechaIngreso").datetimepicker(
    {
        format: 'YYYY-MM-DD',
        inline: true,
        sideBySide: true,
        locale: 'es'
    });

	$("#txtInventario_idMateriaPrima").iniciarSelectRemoto("cargarMateriaPrima", 300, -1);

	$("#txtInventario_idMateriaPrima").on("change", function()
	{
		var idMateria = $(this).val();
		$.post('server/php/proyecto/configuracion/cargarDatosMateriaPrima.php', {Usuario: Usuario.id, idMateria : idMateria}, function(data, textStatus, xhr) 
		{
			if (data != 0)
			{
				$.each(data, function(index, val) 
				{
					$("#lblInventario_Cantidad").text(val.Unidades + " que Ingresan");
				});
			}
		}, "json").fail(function()
		{
			Mensaje("Error", "No hay conexión con el servidor", "danger");
		});
	});

	$("#txtInventario_idProveedor").iniciarSelectRemoto("cargarProveedores", 300, -1);

	$("#frmIngresarMateriaPrima").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#frmIngresarMateriaPrima").generarDatosEnvio("txtInventario_", function(datos)
		{
			$.post('server/php/proyecto/inventario/ingresarMateriaPrima.php', {Usuario: Usuario.id, datos: datos}, function(data, textStatus, xhr) 
			{
				if (!isNaN(data))
				{
					Mensaje("Hey", "Los datos han sido Ingresados", "success");

					var parametros = {
						FechaIngreso : obtenerFecha().substr(0,10),
						MateriaPrima :  $("#select2-txtInventario_idMateriaPrima-container").text(),
						Proveedor : $("#select2-txtInventario_idProveedor-container").html(),
						Cantidad : $("#txtInventario_Cantidad").val(),
						Valor : $("#txtInventario_Valor").val(),
						fechaCargue : obtenerFecha(),
						Usuario : Usuario.Nombre,
						Observaciones : $("#txtInventario_Observaciones").val(),
						Unidades : "",
						Adjuntos : $("#cntInventario_Archivos_DivArchivo_Listado a").length
					};

					inventario_AgregarAlLog(parametros, true);

					$("#frmIngresarMateriaPrima")[0].reset();

					$("#frmIngresarMateriaPrima [data-plugin=select2]").val("");
					$("#frmIngresarMateriaPrima [data-plugin=select2]").trigger("change");
					$("#txtInventario_FechaIngreso").val(obtenerFecha().substr(0,10))
					$("#txtInventario_Prefijo").val(obtenerPrefijo());

					$("#cntInventario_Archivos_DivArchivo_Listado a").remove();
				} else
				{
					Mensaje("Error",data, "danger");
				}
			});
		});
	});

	var files;
    $("#txtInventario_Archivo").on("change", function(event)
    {
    	$("#txtInventario_ArchivoDescripcion").val("");
    	$("#cntInventario_Archivo").modal("show");
    	$("#lblInventario_Archivo_Nombre").text($("#txtInventario_Archivo").val().replace("C:\\fakepath\\", ""));
    	$("#txtInventario_ArchivoDescripcion").focus();

    	files = event.target.files;
    });

    $("#frmInventario_Archivo").on("submit", function(evento)
    {
    	evento.preventDefault();
	    $("#cntInventario_Archivo").modal("hide");

    	var data = new FormData();

    	$.each(files, function(key, value)
	    {
	        data.append(key, value);
	    });

	    data.append("idActivo", $("#txtInventario_id").val());
	    data.append("Observaciones", $("#txtInventario_ArchivoDescripcion").val());
	    data.append("Usuario", Usuario.id);

	    var nomArchivo = files[0].name;
	    $.ajax({
		        url: 'server/php/proyecto/ingresar/subirArchivos.php',
		        type: 'POST',
		        data: data,
		        cache: false,
		        dataType: 'html',
		        processData: false, // Don't process the files
		        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		        success: function(data, textStatus, jqXHR)
		        {
		            if( parseInt(data) > 1)
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
		               	tds += '<a href="server/Archivos/' + $("#txtInventario_Prefijo").val() + '/' + nomArchivo + '" target="_blank" class="list-group-item media">';
                            tds += '<div class="pull-left">';
                                tds += '<div class="avatar-char ac-check">';
                                    tds += '<span class="acc-helper palette-Red bg text-uppercase">' + extension + '</span>';
                                tds += '</div>';
                            tds += '</div>';
                            tds += '<div class="media-body">';
                                tds += '<div class="lgi-heading">' + nomArchivo.replace(extension, "") + '</div>';
                                tds += '<small class="lgi-text">' + $("#txtInventario_ArchivoDescripcion").val() + '</small>';
                            tds += '</div>';
                        tds += '</a>';

                        $("#cntInventario_DivArchivo_Listado").prepend(tds);
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
		            $("#cntInventario_Archivo").modal("show");
		        }
		    });
    });
    inventario_CargarLog();
}

function inventario_CargarLog()
{
	$.post('server/php/proyecto/inventario/cargarUltimosIngresosMateriaPrima.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
    {
    	if (data != 0)
    	{
    		$("#lblInventario_UltimosCantidad").text(data.length);
    		$("#tblInventario_Log tbody tr").remove();
    		$.each(data, function(index, val) 
    		{
    			 inventario_AgregarAlLog(val);
    		});
    	}
    }, "json");
}

function inventario_AgregarAlLog(parametros, primero)
{
	if (primero == undefined)
	{
		primero = false;
	}	
	if (parametros != undefined && parametros != null)
	{
		var tds = "";
		tds += '<tr>';
            tds += '<td>' + parametros.FechaIngreso + '</td>';
            tds += '<td>' + parametros.MateriaPrima + '</td>';
            tds += '<td>' + parametros.Proveedor + '</td>';
            tds += '<td>' + parametros.Cantidad + ' ' + parametros.Unidades + '</td>';
            tds += '<td>' + parametros.Valor + '</td>';
            tds += '<td>' + parametros.fechaCargue + '</td>';
            tds += '<td>' + parametros.Usuario + '</td>';
            tds += '<td>' + parametros.Observaciones + '</td>';
            if (parametros.Adjuntos > 0)
            {
            	tds += '<td><a href="#">' + parametros.Adjuntos;
				tds += ' <i class="zmdi zmdi-attachment-alt zmdi-hc-fw"></i></a>';
            	tds += '</td>';
            } else
            {
            	tds += '<td></td>';
            }
        tds += '</tr>';
        if (primero)
        {
        	$("#lblInventario_UltimosCantidad").text(parseInt($("#lblInventario_UltimosCantidad").text()) + 1);
        	$("#tblInventario_Log tbody").prepend(tds);
        } else
        {
        	$("#tblInventario_Log tbody").append(tds);
        	$("#lblInventario_UltimosDesde").text(parametros.fechaCargue);
        }
	}
}