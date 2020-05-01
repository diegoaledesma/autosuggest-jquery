# Autosuggest v1.5

## Requisitos

- jQuery 3.2.1
- Bootstrap 4.4.0

### ¿Cómo utilizarlo?

```
<script>
  $(function(){
   $('#localidad').autosuggest({
    placeholder: 'Buscar',
    width: '100%',
    url: 'path/localidades.php'
   });
  });
 </script>
```

### Ejemplo de path/localidades.php
```
<?php
 if (isset($_POST['val']) && ! empty($_POST['val'])) {

  require CLASS_DB;

  $dbi = new DB();
  $dbi->connect();

  function clean($a)
  {
   $a = preg_replace('/[^ A-Za-z0-9_-ñÑ]/', '', trim($a));
   $a = preg_replace('/\s+/', ' ', trim($a));
   return $a;
  }

  $field1 = 'id';
  $field2 = 'descripcion_completa';
  $field3 = 'descripcion_completa';
  $table = 'localidades';
  $where = 'descripcion_completa';
  $like = str_replace(' ','%',clean($_POST['val']));
  $limit = '15';

  $query = "SELECT `$field1`,`$field2`,`$field3` FROM `$table` WHERE `$where` LIKE '%$like%' ";
  $query .= " LIMIT $limit";

  $res = $dbi->Query(trim($query));

  if ($dbi->numRows($res) > 0) {
   while ($row = $dbi->fetchObject($res)) {
    echo '<li><a data-value="'.$row->$field1.'" data-text="'.$row->$field2.'" class="dropdown-item">'.$row->$field3.'</a></li>';
   }
  } else {
   echo '<li><a><div class="col-md-12">No se encontraron coincidencias.</div></a></li>';
  }
 }
```
