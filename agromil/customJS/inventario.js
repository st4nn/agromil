function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Inventario");

	$("#txtIngresar_FechaIngreso").datetimepicker(
    {
        format: 'YYYY-MM-DD',
        inline: true,
        sideBySide: true,
        locale: 'es'
    });

	$("#txtInventario_idMateriaPrima").iniciarSelectRemoto("cargarMateriaPrima", 300, -1);

	$("#txtInventario_idMateriaPrima").on("change", function()
	{
		alert($(this).val());
	});

	$("#txtInventario_idProveedor").iniciarSelectRemoto("cargarProveedores", 300, -1);

	

	/*$("#txtInventario_MateriaPrima").cargarDatosConf("configuracion/cargarCombo", function()
        {
            
        }, {Tabla : 'materiaPrima'});*/
}