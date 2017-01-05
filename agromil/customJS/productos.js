function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Productos");

    $("#lnkProductos_CrearProducto").on("click", function(evento)
    {
        evento.preventDefault();
        lanzarModalProductoAgregar();
    });

    $(document).delegate('.btnProductos_Editar', 'click', function(event) 
    {
        lanzarModalProductoAgregar();
        var fila = $(this).parent("td").parent("tr").find("td");

        $("#txtModal_ProductoAgregar_id").val($(this).attr("idProducto"));
        $("#txtModal_ProductoAgregar_Nombre").val($(fila[2]).text());
        $("#txtModal_ProductoAgregar_Presentacion").val($(fila[3]).text());
    });

    $.post('server/php/proyecto/productos/cargarProductos.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
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
                tds += "<td>" + val.Presentacion + "</td>";
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
            
            var fila = $(objFila).parent("td").parent("tr").find('td');

            $.post('server/php/proyecto/modals/borrarElemento.php', {Usuario: Usuario.id, idObj : $(fila[1]).text(), Tabla : 'Productos'}, function(data, textStatus, xhr) 
            {
                if (isNaN(data))
                {
                    Mensaje("Error", data, 'danger');
                } else
                {
                    var t = $("#tblProductos_Resultado").DataTable();
                    t.row($(objFila).parent("td").parent("tr")).remove().draw();

                    Mensaje("Hey", 'El producto ha sido borrado', 'success');
                }
            });
        });
    });

}