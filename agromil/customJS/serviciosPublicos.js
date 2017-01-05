function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Servicios Públicos");

	$("#frmIngresarServicioPublico .separadorDeMiles").on("keyup", function()
	{
		separadorMiles(this,this.value.charAt(this.value.length-1));
		//onkeyup = "separadorMiles(this,this.value.charAt(this.value.length-1))"
	});

	$("#frmIngresarServicioPublico .datepicker").datetimepicker(
    {
        format: 'YYYY-MM-DD',
        inline: true,
        sideBySide: true,
        locale: 'es'
    });

    $("#txtServicioPublico_Prefijo").val(obtenerPrefijo());

    $("#cntServicioPublico_Archivos").iniciarObjArchivos({Prefijo : $("#txtServicioPublico_Prefijo"), Proceso: "Servicios Públicos", Usuario: Usuario.id});

	$("#txtServicioPublico_idServicio").cargarDatosConf("configuracion/cargarCombo", function()
    {
        $("#tblServicioPublico_Log tbody tr").remove();
        $("#txtServicioPublico_idServicio").prepend('<option value=""></option>');
        $("#txtServicioPublico_idServicio").val("");
    }, {Tabla : 'serviciosPublicos'});

    $("#txtServicioPublico_idServicio").on("change", function()
    {
    	$("#tblServicioPublico_Log tbody tr").remove();
    	var idServicio = $(this).val();
    	$.post('server/php/proyecto/serviciosPublicos/cargarLogServicios.php', {Usuario: Usuario.id, idServicio : idServicio}, function(data, textStatus, xhr) 
    	{
    		if (data != 0)
    		{
    			var tds = "";
    			$.each(data, function(index, val) 
    			{
    				 tds += "<tr>";
    				 	tds += '<td>' + val.Periodo + '</td>';
    				 	tds += '<td>' + val.Consumo + '</td>';
    				 	tds += '<td>' + val.Valor + '</td>';
    				 tds += "</tr>";
    			});
    			$("#tblServicioPublico_Log tbody").append(tds);
    		}
    	}, "json").fail(function()
    	{
    		Mensaje("Error", "No hay conexión con el Servidor", "danger");
    	});
    });

    $("#lnkServicioPublicoAgregarProveedor").on("click", function(evento)
	{
		evento.preventDefault();
		lanzarModalServicioPublicoAgregar(function(dataId, dataNombre)
		{
			$("#txtServicioPublico_idServicio").append('<option value="' + dataId + '">' + dataNombre + '</option>');
		});	
	});

	$("#txtServicioPublico_valorUnidad, #txtServicioPublico_Consumo").on("change", function()
	{
		if (!isNaN(parseFloat($("#txtServicioPublico_Consumo").val())*parseFloat($("#txtServicioPublico_Consumo").val())))
		{
			$("#txtServicioPublico_Valor").val(parseFloat($("#txtServicioPublico_Consumo").val())*parseFloat($("#txtServicioPublico_Consumo").val()));
		}
	});

	$("#frmIngresarServicioPublico").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#frmIngresarServicioPublico").generarDatosEnvio("txtServicioPublico_", function(datos)
		{
			$.post('server/php/proyecto/serviciosPublicos/ingresarServicio.php', {Usuario: Usuario.id, datos: datos}, function(data, textStatus, xhr) 
			{
				if (!isNaN(data))
				{
					Mensaje("Hey", "Los datos han sido Ingresados", "success");

					var parametros = {
                        id : data,
						Nombre : $("#txtServicioPublico_idServicio option:selected").html(),
						Periodo :  $("#txtServicioPublico_Desde").val() + " a " + $("#txtServicioPublico_Hasta").val(),
						Consumo : $("#txtServicioPublico_Consumo").val(),
						valorUnidad : $("#txtServicioPublico_valorUnidad").val(),
						Valor : $("#txtServicioPublico_Valor").val(),
						fechaCargue : obtenerFecha(),
						Usuario : Usuario.Nombre,
						Observaciones : $("#txtServicioPublico_Observaciones").val(),
						Adjuntos : $("#cntInventario_Archivos_DivArchivo_Listado a").length
					};

					serviciosPublicos_AgregarAlHistorico(parametros, true);

					$("#frmIngresarServicioPublico")[0].reset();

					$("#txtServicioPublico_Prefijo").val(obtenerPrefijo());

					$("#cntServicioPublico_Archivos_DivArchivo_Listado a").remove();
				} else
				{
					Mensaje("Error",data, "danger");
				}
			});
		});
	});

	serviciosPublicos_CargarLog();

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

            $.post('server/php/proyecto/modals/eliminarElemento.php', {Usuario: Usuario.id, idObj : idObj, Tabla : 'ingresoServiciosPublicos'}, function(data, textStatus, xhr) 
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

function serviciosPublicos_CargarLog()
{
	$.post('server/php/proyecto/serviciosPublicos/cargarHistorico.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
    {
    	if (data != 0)
    	{
    		$("#lblServicioPublico_UltimosCantidad").text(data.length);
    		$("#tblServicioPublico_Historico tbody tr").remove();
    		$.each(data, function(index, val) 
    		{
    			 serviciosPublicos_AgregarAlHistorico(val);
    		});
    	}
    }, "json");
}

function serviciosPublicos_AgregarAlHistorico(parametros, primero)
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
            tds += '<td>' + parametros.Nombre + '</td>';
            tds += '<td>' + parametros.Periodo + '</td>';
            tds += '<td>' + parametros.Consumo + '</td>';
            tds += '<td>' + parametros.valorUnidad + '</td>';
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
        	$("#lblServicioPublico_UltimosCantidad").text(parseInt($("#lblServicioPublico_UltimosCantidad").text()) + 1);
        	$("#tblServicioPublico_Historico tbody").prepend(tds);
        } else
        {
        	$("#tblServicioPublico_Historico tbody").append(tds);
        	$("#lblServicioPublico_UltimosDesde").text(parametros.fechaCargue);
        }
	}
}