<?php

if(isset($_POST['post_jsondata']))
{

    $original_content = file_get_contents("assets/entries.json");
    
    $content_decode = json_decode($original_content, TRUE);

    $content_decode[] = json_decode($_POST['post_jsondata']);

    $new_json = json_encode($content_decode);

    file_put_contents("assets/entries.json", $new_json);

    echo $new_json;
}

?>