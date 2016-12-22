function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Servicios");

    $("#lnkProductos_CrearProducto").on("click", function(evento)
    {
        evento.preventDefault();
        lanzarModalServicioPublicoAgregar();
    });

    $(document).delegate('.btnProductos_Editar', 'click', function(event) 
    {
        lanzarModalServicioPublicoAgregar();
        var fila = $(this).parent("td").parent("tr").find("td");

        $("#txtModal_ProductoAgregar_id").val($(this).attr("idProducto"));
        $("#txtModal_ServicioPublicoAgregar_Nombre").val($(fila[2]).text());
        $("#txtModal_ServicioPublicoAgregar_Unidades").val($(fila[3]).text());
    });

    $.post('server/php/proyecto/productos/cargarServicios.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
    {
        var tds = "";
        $.each(data, function(index, val) 
        {
             tds += "<tr>";
                tds += '<td>';
                    tds += '<button idProducto="' + val.id + '" class="btn btn-primary btn-icon bg waves-effect waves-circle waves-float btnProductos_Editar"><i class="zmdi zmdi-edit"></i></button>';
                    tds += '<button idProducto="' + val.id + '" class="btn btn-danger btn-icon bg waves-effect waves-circle waves-float btnProductos_Borrar"><i class="zmdi zmdi-delete"></i></button>';
                tds += '</td>';
                tds += "<td>" + val.id + "</td>";
                tds += "<td>" + val.Nombre + "</td>";
                tds += "<td>" + val.Unidades + "</td>";
             tds += "</tr>";
        });
        $("#tblProductos_Resultado").crearDataTable(tds);
    }, "json");

    $(document).delegate('.btnProductos_Borrar', 'click', function(event) 
    {
        var objFila = this;
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
            
            var t = $("#tblProductos_Resultado").DataTable();
            t.row($(objFila).parent("td").parent("tr")).remove().draw();

        });
    });

}