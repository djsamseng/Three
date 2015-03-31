<?php

function render($view, $data = array()) {
    $path = "private/view/".$view;
    if (file_exists($path)) {
        extract($data);
        require_once("private/view/".$view);
    } else {
        echo "Error, render file does not exist <br>";
        echo "cwd = ";
        echo getcwd();
        echo "<br>path = ";
        print_r($path);
    }
}
?>
