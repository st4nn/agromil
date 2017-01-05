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
						id : data,
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

    inventario_CargarLog();

    $("#lnkInventario_AgregarMateriaPrima").on("click", function(evento)
	{
		evento.preventDefault();
		lanzarModalMateriaPrimaAgregar();
	});

	$("#lnkInventario_AgregarProveedor").on("click", function(evento)
	{
		evento.preventDefault();
		lanzarModalProveedorAgregar();
	});

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

            $.post('server/php/proyecto/modals/eliminarElemento.php', {Usuario: Usuario.id, idObj : idObj, Tabla : 'ingresoMateriaPrima'}, function(data, textStatus, xhr) 
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
			tds += '<td><button idObjeto="' + parametros.id + '" class="btn btn-danger btn-icon waves-effect waves-circle waves-float btnObjeto_Eliminar"><i class="zmdi zmdi-delete"></i> </button></td>';
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