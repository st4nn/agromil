function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Sacos Devueltos");

	$("#frmSacosDevueltos .datepicker").datetimepicker(
    {
        format: 'YYYY-MM-DD',
        inline: true,
        sideBySide: true,
        locale: 'es'
    });

    $("#txtSacosDevueltos_Hora").val(obtenerFecha().substr(11, 5));
    $("#txtSacosDevueltos_Hora").datetimepicker({
        format: 'Z'
    });

    $("#txtSacosDevueltos_Prefijo").val(obtenerPrefijo());

	$("#txtSacosDevueltos_idProducto").cargarDatosConf("configuracion/cargarCombo", function()
    {
        $("#txtSacosDevueltos_idProducto").prepend('<option value="">Seleccione un elemento de la Lista</option>');
        $("#txtSacosDevueltos_idProducto").val("");
        $("#txtSacosDevueltos_idProducto").selectpicker("refresh");
    }, {Tabla : 'cboproductos'});

    $("#lnkSacosDevueltosAgregarProducto").on("click", function(evento)
    {
        evento.preventDefault();
        lanzarModalProductoAgregar();
    });


    $("#txtSacosDevueltos_idProducto").on("change", function()
    {
    	$("#tblSacosDevueltos_Log tbody tr").remove();
    	var idProducto = $(this).val();
    	$.post('server/php/proyecto/SacosDevueltos/cargarLogSacos.php', {Usuario: Usuario.id, idProducto : idProducto}, function(data, textStatus, xhr) 
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
    			$("#tblSacosDevueltos_Log tbody").append(tds);
    		}
    	}, "json").fail(function()
    	{
    		Mensaje("Error", "No hay conexión con el Servidor", "danger");
    	});
    });


	$("#frmSacosDevueltos").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#frmSacosDevueltos").generarDatosEnvio("txtSacosDevueltos_", function(datos)
		{
			$.post('server/php/proyecto/SacosDevueltos/ingresarSacosDevueltos.php', {Usuario: Usuario.id, datos: datos}, function(data, textStatus, xhr) 
			{
				if (!isNaN(data))
				{
					Mensaje("Hey", "Los datos han sido Ingresados", "success");

					var parametros = {
                        id : data,
						Producto : $("#txtSacosDevueltos_idProducto option:selected").html(),
						CantidadKg : $("#txtSacosDevueltos_CantidadKg").val(),
						Fecha : $("#txtSacosDevueltos_Fecha").val() + ' ' + $("#txtSacosDevueltos_Hora").val(),
						Cantidad : $("#txtSacosDevueltos_Cantidad").val(),
						fechaCargue : obtenerFecha(),
						Usuario : Usuario.Nombre,
						Observaciones : $("#txtSacosDevueltos_Observaciones").val(),
						Adjuntos : $("#cntSacosDevueltos_Archivos_DivArchivo_Listado a").length
					};

					SacosDevueltos_AgregarAlHistorico(parametros, true);

					$("#frmSacosDevueltos")[0].reset();

					$("#txtSacosDevueltos_Prefijo").val(obtenerPrefijo());
                    $("#txtSacosDevueltos_Hora").val(obtenerFecha().substr(11, 5));
                    $("#txtSacosDevueltos_Fecha").val(obtenerFecha().substr(0, 10));



					$("#cntSacosDevueltos_Archivos_DivArchivo_Listado a").remove();
				} else
				{
					Mensaje("Error",data, "danger");
				}
			});
		});
	});

	SacosDevueltos_CargarLog();

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

            $.post('server/php/proyecto/SacosDevueltos/eliminarElemento.php', {Usuario: Usuario.id, idObj : idObj, Tabla : 'sacosDevueltos'}, function(data, textStatus, xhr) 
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

function SacosDevueltos_CargarLog()
{
	$.post('server/php/proyecto/SacosDevueltos/cargarHistorico.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
    {
    	if (data != 0)
    	{
    		$("#tblSacosDevueltos_Historico tbody tr").remove();
    		$.each(data, function(index, val) 
    		{
    			 SacosDevueltos_AgregarAlHistorico(val);
    		});
    	}
    }, "json");
}

function SacosDevueltos_AgregarAlHistorico(parametros, primero)
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
            tds += '<td>' + parametros.Fecha + '</td>';
            tds += '<td>' + parametros.Cantidad + '</td>';
            tds += '<td>' + parametros.CantidadKg + '</td>';
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
        	$("#tblSacosDevueltos_Historico tbody").prepend(tds);
        } else
        {
        	$("#tblSacosDevueltos_Historico tbody").append(tds);
        }
	}
}