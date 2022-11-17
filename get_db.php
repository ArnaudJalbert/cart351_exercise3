<?php

    // fetching the json database
    $file = file_get_contents("assets/entries.json");
    $json_string = json_encode($file);
    // returning the json file string
    echo $json_string;

?>