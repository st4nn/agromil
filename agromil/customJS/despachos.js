function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Despachos");

	$("#frmDespacho .datepicker").datetimepicker(
    {
        format: 'YYYY-MM-DD',
        inline: true,
        sideBySide: true,
        locale: 'es'
    });

    $("#txtDespacho_Hora").val(obtenerFecha().substr(11, 5));
    $("#txtDespacho_Hora").datetimepicker({
        format: 'Z'
    });

    $("#txtDespacho_Prefijo").val(obtenerPrefijo());

    $("#cntDespacho_Archivos").iniciarObjArchivos({Prefijo : $("#txtDespacho_Prefijo"), Proceso: "Despachos", Usuario: Usuario.id});

	$("#txtDespacho_idProducto").cargarDatosConf("configuracion/cargarCombo", function()
    {
        $("#txtDespacho_idProducto").prepend('<option value="">Seleccione un elemento de la Lista</option>');
        $("#txtDespacho_idProducto").val("");
        $("#txtDespacho_idProducto").selectpicker("refresh");
    }, {Tabla : 'cboproductos'});

    $("#txtDespacho_Cliente").cargarDatosConf("configuracion/cargarCombo", function()
    {
        $("#txtDespacho_Cliente").prepend('<option value="">Seleccione un elemento de la Lista</option>');
        $("#txtDespacho_Cliente").val("");
        $("#txtDespacho_Cliente").selectpicker("refresh");
    }, {Tabla : 'Clientes'});

    $("#txtDespacho_idProducto").on("change", function()
    {
    	$("#tblDespacho_Log tbody tr").remove();
    	var idProducto = $(this).val();
    	$.post('server/php/proyecto/despachos/cargarLogServicios.php', {Usuario: Usuario.id, idProducto : idProducto}, function(data, textStatus, xhr) 
    	{
    		if (data != 0)
    		{
    			var tds = "";
    			$.each(data, function(index, val) 
    			{
    				 tds += "<tr>";
    				 	tds += '<td>' + val.Fecha + '</td>';
    				 	tds += '<td>' + val.Cantidad + '</td>';
    				 tds += "</tr>";
    			});
    			$("#tblDespacho_Log tbody").append(tds);
    		}
    	}, "json").fail(function()
    	{
    		Mensaje("Error", "No hay conexión con el Servidor", "danger");
    	});
    });

    $("#lnkDespachosAgregarCliente").on("click", function(evento)
	{
		evento.preventDefault();
		lanzarModalClienteAgregar(function(dataId, dataNombre)
		{
			$("#txtDespacho_Cliente").append('<option value="' + dataId + '">' + dataNombre + '</option>');
            $("#txtDespacho_Cliente").selectpicker("refresh");
		});	
	});

	

	$("#frmDespacho").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#frmDespacho").generarDatosEnvio("txtDespacho_", function(datos)
		{
			$.post('server/php/proyecto/despachos/ingresarDespacho.php', {Usuario: Usuario.id, datos: datos}, function(data, textStatus, xhr) 
			{
				if (!isNaN(data))
				{
					Mensaje("Hey", "Los datos han sido Ingresados", "success");

					var parametros = {
                        id : data,
						Producto : $("#txtDespacho_idProducto option:selected").html(),
						Cliente : $("#txtDespacho_Cliente option:selected").html(),
						Fecha : $("#txtDespacho_Fecha").val() + ' ' + $("#txtDespacho_Hora").val(),
						Cantidad : $("#txtDespacho_Cantidad").val(),
						fechaCargue : obtenerFecha(),
						Usuario : Usuario.Nombre,
						Observaciones : $("#txtDespacho_Observaciones").val(),
						Adjuntos : $("#cntDespacho_Archivos_DivArchivo_Listado a").length
					};

					despachos_AgregarAlHistorico(parametros, true);

					$("#frmDespacho")[0].reset();

					$("#txtDespacho_Prefijo").val(obtenerPrefijo());
                    $("#txtDespacho_Hora").val(obtenerFecha().substr(11, 5));
                    $("#txtDespacho_Fecha").val(obtenerFecha().substr(0, 10));



					$("#cntDespacho_Archivos_DivArchivo_Listado a").remove();
				} else
				{
					Mensaje("Error",data, "danger");
				}
			});
		});
	});

	despachos_CargarLog();

    $(document).delegate('.btnObjeto_Eliminar', 'click', function(event) 
    {
        var objFila = this;
        var idObj = $(objFila).attr('idObjeto');
        swal({
            title: "Está Seguro?",
            text: "Después de borrar, éste registro no podrá recuperarse!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336",
            confirmButtonText: "Si, Borrar!",
            cancelButtonText : "Cancelar",
            closeOnConfirm: true
        }, function(){
            
            var fila = $(objFila).parent("td").parent("tr").find('td');

            $.post('server/php/proyecto/modals/eliminarElemento.php', {Usuario: Usuario.id, idObj : idObj, Tabla : 'Despachos'}, function(data, textStatus, xhr) 
            {
                if (isNaN(data))
                {
                    Mensaje("Error", data, 'danger');
                } else
                {
                    $(objFila).parent("td").parent("tr").remove();

                    Mensaje("Hey", 'El Registro ha sido eliminado', 'success');
                }
            });
        });
    });
}

function despachos_CargarLog()
{
	$.post('server/php/proyecto/despachos/cargarHistorico.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
    {
    	if (data != 0)
    	{
    		$("#tblDespacho_Historico tbody tr").remove();
    		$.each(data, function(index, val) 
    		{
    			 despachos_AgregarAlHistorico(val);
    		});
    	}
    }, "json");
}

function despachos_AgregarAlHistorico(parametros, primero)
{
	if (primero == undefined)
	{
		primero = false;
	}	
	if (parametros != undefined && parametros != null)
	{
		var tds = "";
		tds += '<tr>';
            tds += '<td><button idObjeto="' + parametros.id + '" class="btn btn-danger btn-icon waves-effect waves-circle waves-float btnObjeto_Eliminar"><i class="zmdi zmdi-delete"></i> </button></td>';
            tds += '<td>' + parametros.Producto + '</td>';
            tds += '<td>' + parametros.Cliente + '</td>';
            tds += '<td>' + parametros.Fecha + '</td>';
            tds += '<td>' + parametros.Cantidad + '</td>';
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
        	$("#tblDespacho_Historico tbody").prepend(tds);
        } else
        {
        	$("#tblDespacho_Historico tbody").append(tds);
        }
	}
}