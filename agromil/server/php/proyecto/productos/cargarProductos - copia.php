<?php
   
   include("../../conectar.php"); 

   $link = Conectar();

   $filtro = $_POST['searchPhrase'];
   $current = $_POST['current'];
   $rowCount = $_POST['rowCount'];

   $limit = "";
   
   $tCurrent = $current;

   
      $tCurrent =($current - 1) * $rowCount;
   
   if ($rowCount > 0)
   {
      $limit = "LIMIT " . $tCurrent . ", $rowCount";
   }
   

   $where = "";

   if ($filtro <> "")
   {
      $where = " WHERE 
                  Productos.Nombre LIKE '%" . $filtro . "%'
                  OR Productos.Presentacion LIKE '%" . $filtro . "%' ";
   }
 
   $sql = "SELECT COUNT(*) AS Cantidad FROM Productos $where;";
   $result = $link->query($sql);
   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   $sql = "SELECT 
            Productos.id AS id,
            Productos.Nombre,
            Productos.Presentacion
         FROM 
            Productos $where $limit;";

   $result = $link->query($sql);

   $Usuarios = array();
   $Usuarios['current'] = $current;
   $Usuarios['rowCount'] = 0;
   $Usuarios['total'] = $fila['Cantidad'];
   $Usuarios['rows'] = array();

   if ( $result->num_rows > 0)
   {
      $idx = 0;
      while ($row = mysqli_fetch_assoc($result))
      { 
         $Usuarios['rows'][$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Usuarios['rows'][$idx][$key] = utf8_encode($value);
         }

         $Usuarios['rows'][$idx]['commands'] = '<button idProducto="' . $Usuarios['rows'][$idx]['id'] . '" class="btn palette-Gray btn-icon bg waves-effect waves-circle waves-float btnProductos_Editar"><i class="zmdi zmdi-edit"></i></button>';

         $idx++;
      }

      $Usuarios['rowCount'] = $result->num_rows;
      
      mysqli_free_result($result);  
   }

   echo json_encode($Usuarios);
?>