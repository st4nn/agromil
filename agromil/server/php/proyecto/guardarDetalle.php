<?php 
	include("conectar.php"); 
	$link = Conectar();

	$parametros = $_POST;

	$columnasParametros = array_keys($parametros);
   $sql = "SHOW COLUMNS FROM prueba;";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {

      $Columnas = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         
        $Columnas[$idx] = $row['Field'];
         
         $idx++;
      }

         mysqli_free_result($result);  
         $diferencias = array_diff($columnasParametros, $Columnas);
         	$alter = "";
         
         foreach ($diferencias as $key => $value) 
         {
         	$alter .= " ADD $value VARCHAR(255) NULL DEFAULT NULL, ";
         }

         $alter = substr($alter, 0, -2);

         if ($alter <> "")
         {
         	$alter = "ALTER TABLE prueba " . $alter . ";";
         	$link->query($alter);

         	 if ($link->error <> "")
         	 {
         	 	echo $link->error . "<br>" . $alter;
         	 }
         }

         $campos = "";
         $values = "";
         $values2 = "";

         foreach ($parametros as $key => $value) 
         {
         	$campos .= $key . ", ";
         	$values .= 	"'" . addslashes($value) . "', ";
         	$values2 .= $key . " = VALUES(" . $key . "), ";
         }

         $campos = substr($campos, 0, -2);
         $values = substr($values, 0, -2);
         $values2 = substr($values2, 0, -2);

         if ($campos <> "")
         {
         	$sql = "INSERT INTO prueba ($campos) VALUES ($values) ON DUPLICATE KEY UPDATE $values2";
         	$result = $link->query(utf8_decode($sql));

         	if ($link->error <> "")
         	 {
         	 	echo $link->error . "<br>" . $sql;
         	 } else
             {
               echo 1;
             }
         }
         
   } else
   {
      echo 0;
   }

   //$link->query(utf8_decode($sql));
?>

