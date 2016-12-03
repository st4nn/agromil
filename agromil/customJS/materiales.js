function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Formulas de Producto");

    $("#txtMaterial_idProducto").cargarDatosConf("configuracion/cargarCombo", function()
        {
            $("#txtMaterial_idProducto").prepend('<option value="">Seleccione un elemento de la Lista</option>');
            $("#txtMaterial_idProducto").val("");
            $("#txtMaterial_idProducto").selectpicker("refresh");
        }, {Tabla : 'cboproductos'});

    $("#txtMaterial_idProducto").on("change", function()
    {
        idProducto = $(this).val();
        $("#tblMaterial_Formula tbody tr").remove();
        var tds = "";
            tds += '<tr id="rowMaterial_FormulaVacia">';
                tds += '<td colspan="3">Aún no se ha agregado ningún Material a la Fórmula</td>';
            tds += '</tr>';

            $("#tblMaterial_Formula tbody").append(tds);
        if (idProducto != "")
        {
            $.post('server/php/proyecto/materiales/cargarFormula.php', {Usuario: Usuario.id, Producto : idProducto}, function(data, textStatus, xhr) 
            {
                if (data != 0)
                {
                    var objSelects = $("#tblMaterial_Formula tbody select");
                    var objInputs = $("#tblMaterial_Formula tbody input");
                    console.log(objSelects);
                    $.each(data, function(index, val) 
                    {
                        formulas_AgregarFila(function()
                        {
                            objSelects = $("#tblMaterial_Formula tbody select");
                            objInputs = $("#tblMaterial_Formula tbody input");
                            $(objSelects[index]).val(val.idMaterial);
                            $(objInputs[index]).val(val.Cantidad);
                            
                        });
                    });
                }
            }, "json");
        }   
    });

    $("#btnMaterial_AgregarMateria").on("click", function()
    {
        formulas_AgregarFila();
    });

    $(document).delegate('.btnMaterial_EliminarFila', 'click', function(event) 
    {
        var objFila = this;
        swal({
            title: "Está Seguro?",
            text: "Después de guardar, éste registro no podrá recuperarse!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f44336",
            confirmButtonText: "Si, Borrar!",
            cancelButtonText : "Cancelar",
            closeOnConfirm: true
        }, function(){
            $(objFila).parent("td").parent("tr").remove();

            if ($("#tblMaterial_Formula tbody tr").length == 0)
            {
                var tds = "";
                tds += '<tr id="rowMaterial_FormulaVacia">';
                    tds += '<td colspan="3">Aún no se ha agregado ningún Material a la Fórmula</td>';
                tds += '</tr>';

                $("#tblMaterial_Formula tbody").append(tds);
            }
        });
    });

    $(document).delegate('#tblMaterial_Formula tbody select', 'change', function(event) 
    {
        var idSeleccionado = $(this).val();
        var objSelect = this;
        if (idSeleccionado != "")
        {
            var obj = $("#tblMaterial_Formula tbody select option[value=" + idSeleccionado + "]:selected");
            if ($(obj).length > 1)
            {
                $(this).val("");
                Mensaje("Error", "Ya hay un material seleccionado antes en ésta fórmla", "danger");
            } else
            {
                $.post('server/php/proyecto/configuracion/cargarDatosMateriaPrima.php', {Usuario: Usuario.id, idMateria : idSeleccionado}, function(data, textStatus, xhr) 
                {
                    $.each(data, function(index, val) 
                    {
                        $(objSelect).parent("div").parent("div").parent("td").parent("tr").find("input").attr("placeholder", 'Cantidad ' + val.siglaUnidades)
                    });
                }, "json");
            }
        }
    });

    $("#lnkMaterial_AgregarMateriaPrima").on("click", function(evento)
    {
        evento.preventDefault();
        lanzarModalMateriaPrimaAgregar(function(data)
        {
            $("#tblMaterial_Formula tbody select").prepend('<option value="' + data.id + '">' + data.Nombre + '</option>');
        });
    });

    $("#lnkServicioPublicoAgregarProducto").on("click", function(evento)
    {
        evento.preventDefault();
        lanzarModalProductoAgregar(function(id, nombre, presentacion)
        {
            $("#txtMaterial_idProducto").append('<option value="' + id + '">' + nombre + ' ' +  presentacion + '</option>');
            $("#txtMaterial_idProducto").selectpicker("refresh");
        });
    });

    $("#frmFormulaMaterial").on("submit", function(evento)
    {
        evento.preventDefault();
        var objMateriales = $("#tblMaterial_Formula tbody tr");
        var datos = [];
        var idx = 0;
        var idMaterial = 0;
        var Cantidad = 0;
        $.each(objMateriales, function(index, val) 
        {
            idMaterial = $(val).find("select").val();
            Cantidad = $(val).find("input").val();
            datos[idx] = {Cantidad : Cantidad, Material : idMaterial};
            idx++;             
        });

        $.post('server/php/proyecto/materiales/ingresarFormula.php', {Usuario : Usuario.id, formulas : datos, idProducto : $("#txtMaterial_idProducto").val()}, 
        function(data, textStatus, xhr) {
            if (!isNaN(data))
            {
                Mensaje("Hey", "Los datos han sido Ingresados", "success"); 
                $("#cntModal_MateriaPrimaAgregar").modal("hide");
                datos = JSON.parse(datos);
                datos.id = data;
                callback(datos);
            } else
            {
                Mensaje("Error",data, "danger");
            }
        }).fail(function()
        {
            Mensaje("Error", "No hay conexión con el servidor", "danger");
        });

    });
    

}

function formulas_AgregarFila(callback)
{
    if (callback === undefined)
    {
        callback = function(){};
    }

    if ($("#txtMaterial_idProducto").val() == "")
    {
        Mensaje("Error", "Debe seleccionar primero un Producto", "danger");
    } else
    {
        if ($("#rowMaterial_FormulaVacia").length > 0)
        {
            $("#rowMaterial_FormulaVacia").remove();   
        }

        var tds = "";
        tds += '<tr>';
            tds += '<td>';
                tds += '<div class="fg-line">';
                    tds += '<div class="select">';
                        tds += '<select class="form-control guardar cboMaterial_MateriaPrimaSinIniciar" placeholder="Materia Prima" required>';
                            tds += '<option value="">1</option>';
                        tds += '</select>';
                    tds += '</div>';
                tds += '</div>';
            tds += '</td>';
            tds += '<td>';
                tds += '<div class="fg-line">';
                    tds += '<input type="number" class="form-control guardar" step="any" placeholder="Cantidad" required>';
                tds += '</div>';
            tds += '</td>';
            tds += '<td>';
                tds += '<button type="button" class="btn btn-danger btn-icon waves-effect waves-circle waves-float btnMaterial_EliminarFila"><i class="zmdi zmdi-delete"></i></button>';
            tds += '</td>';
        tds += '</tr>';
        $("#tblMaterial_Formula tbody").append(tds);
        $(".cboMaterial_MateriaPrimaSinIniciar").cargarDatosConf("configuracion/cargarCombo", function()
        {
            $(".cboMaterial_MateriaPrimaSinIniciar").prepend('<option value=""></option>');
            $(".cboMaterial_MateriaPrimaSinIniciar").val("");
            $(".cboMaterial_MateriaPrimaSinIniciar").removeClass('cboMaterial_MateriaPrimaSinIniciar');  
            callback(); 
        }, {Tabla : 'materiaPrima'});
    }
}