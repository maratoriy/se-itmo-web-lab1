<?php
    function make_td($td) {
        return "<td>$td</td>";
    }

    function make_tr(...$tds) {
        $tr = "<tr>";
        foreach ($tds as $td) {
            $tr = $tr.make_td($td);
        }
        return $tr."</tr>";
    }

    session_start();

    date_default_timezone_set('Europe/Moscow');
    $curr_time = date("Y-m-d H:i:s");
    $exec_time = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 5) . ' ms';

    $x = isset($_GET['x']) ? intval($_GET['x']) : null;
    $y = isset($_GET['y']) ? floatval($_GET['y']) : null;
    $r = isset($_GET['r']) ? floatval($_GET['r']) : null;


    if ($_SERVER['REQUEST_METHOD'] == "GET") {
        $valid = in_array($x, [-2, 1.5, 1, 0.5, 0, 0.5, 1, 1.5, 2])
              && is_numeric($y) &&($y>=-3&&$y<=5)
              && in_array($r, [1, 2, 3, 4, 5]);
        if($valid) {
            $valid =
            (($x<=0 && $y<=0 && $x>=-$r && $y>=-$r/2)
             ||($x>=0 && $y>=0 && $y<=-$x+$r/2)
             ||($x<=0 && $y>=0 && ($x*$x+$y*$y<=$r*$r)));
            $valid = $valid ? "Correct" : "Incorrect";
        } else {
            $valid = "Failed validating";
        }

        $_SESSION['table'].=make_tr($curr_time, $exec_time, "($x, $y, $r)", $valid);

        echo $_SESSION['table'];
    }

?>