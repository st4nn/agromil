function iniciarModulo()
{
    $("#lblHeader_NomModulo").text("Clientes");

    $("#lnkProductos_CrearProducto").on("click", function(evento)
    {
        evento.preventDefault();
        lanzarModalClienteAgregar();
    });

    $(document).delegate('.btnProductos_Editar', 'click', function(event) 
    {
        lanzarModalClienteAgregar();
        var fila = $(this).parent("td").parent("tr").find("td");

        $("#txtModal_ProductoAgregar_id").val($(this).attr("idProducto"));
        $("#txtModal_ClienteAgregar_Nombre").val($(fila[2]).text());
        $("#txtModal_ClienteAgregar_Nit").val($(fila[3]).text());
        $("#txtModal_ClienteAgregar_Telefono").val($(fila[4]).text());
        $("#txtModal_ClienteAgregar_Direccion").val($(fila[5]).text());
        $("#txtModal_ClienteAgregar_Correo").val($(fila[6]).text());
    });

    $.post('server/php/proyecto/productos/cargarClientes.php', {Usuario: Usuario.id}, function(data, textStatus, xhr) 
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
                tds += "<td>" + val.Nit + "</td>";
                tds += "<td>" + val.Telefono + "</td>";
                tds += "<td>" + val.Direccion + "</td>";
                tds += "<td>" + val.Correo + "</td>";
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