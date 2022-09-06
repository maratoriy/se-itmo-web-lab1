<?php
    session_start();

    if (isset($_SESSION['table'])) {
        echo $_SESSION['table'];
    } else {
        echo "";
    }
?>