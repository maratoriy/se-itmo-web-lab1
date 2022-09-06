<?php
    session_start();

    if (isset($_SESSION['table'])) {
        unset($_SESSION['table']);
    }
?>