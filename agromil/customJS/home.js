var fondos = ['palette-Red', 'palette-Pink', 'palette-Purple', 'palette-Indigo', 'palette-Blue', 'palette-Cyan', 'palette-Teal', 'palette-Green', 'palette-Lime', 'palette-Yellow', 'palette-Amber', 'palette-Orange', 'palette-Brown', 'palette-Grey', 'palette-Black'];
function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Inicio");
	var fecha = obtenerFecha().substr(0, 10);
	alert(fecha);

	$.post('../server/php/proyecto/reportes/cargarProducidoTotal.php', {Usuario: Usuario.id, Desde : fecha, Hasta : fecha}, function(data, textStatus, xhr) 
	{
		if (data != 0)
		{
			$("#cntHome_Produccion div").remove();
			var tds = "";

			$.each(data, function(index, val) 
			{
				
				tds += '<div class="card c-dark  bg">';
                    tds += '<div class="card-header">';
                        tds += '<h2>' + val.NombreReferencia + ' <strong>' + Sacos + ' Sacos</strong></h2>';
                    tds += '</div>';
                    tds += '<div class="card-body card-padding">';
                        tds += '<h2 class="m-t-0 m-b-15 c-white">';
                            tds += '<i class="zmdi zmdi-caret-up-circle m-r-5"></i>';
                            tds += val.Peso + ' Kg';
                        tds += '</h2>';
                    tds += '</div>';
                tds += '</div>';
			});

			$("#cntHome_Produccion").append(tds);
		}
	}, json);
}