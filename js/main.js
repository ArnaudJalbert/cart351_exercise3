// global variables
let particles_text = null;
let all_entries = null;

// canvas id
const CANVAS = 'main_canvas'

// initial entry
const TEXT = 'Hey';
const FONT = '20px Helvetica';
const STROKE_COLOR = '#FFFFFF';
const POINT_COLOR = '#FFFFFF';
const NB_PARTS = 128;
const SIZE = 5;
const SCALE = 25;
const X_OFFSET = 500;
const Y_OFFSET = 100;
const DENSITY = 15;
const CONNECT_TRESH = 50;
const CONNECT_ENABLED = true;

$('document').ready(function () 
{
    console.log('Hello World!');

    const main_canvas = document.getElementById(CANVAS);

    const main_ctx = get_context_from_canvas(main_canvas);

    load_entries();

    init_events_listeners();

    let mouse = new MouseListener(50);

    particles_text = new TextParticles(TEXT, FONT, POINT_COLOR, STROKE_COLOR, NB_PARTS, SIZE, SCALE, X_OFFSET, Y_OFFSET, DENSITY, CONNECT_TRESH, CONNECT_ENABLED, main_canvas, main_ctx, mouse);

    init_animate();

    particles_text.import_key_value(particles_text.export_key_value());

})

function init_events_listeners(){
    document.getElementById('save_entry').addEventListener('click', function(){
        register_entry();
        load_entries();
        alert('This entry has been saved! You can load it back in "Load" after having refreshed your page.')
    })

    document.getElementById('load_entry').addEventListener('change', function(text){
        let id = parseInt(text.target.value);
        for(let i = 0; i<all_entries.length; i++){
            if(id == all_entries[i]['id']){
                particles_text.import_key_value(all_entries[i]);
                break;
            }
        }
        update_parameters();
    })
}

function get_context_from_canvas(canvas){

    // set w+h
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    console.log("Canvas jQuery object: " + canvas);

    // set context
    let ctx = canvas.getContext('2d');
    
    console.log("Canvas 2D context: " + ctx);

    console.log("X :" + canvas.width + ", Y: " + canvas.height);

    // we return context for use
    return ctx;
}

function init_animate(){

    particles_text.animate();

    requestAnimationFrame(init_animate);

}

function load_entries(){

    $.get("get_db.php",{all_entries:all_entries},
    function (data) {
            all_entries = JSON.parse(data);
            all_entries = JSON.parse(all_entries);
            
        },
    ).done(function() {

        $('#load_entry').find('option').remove().end();

        for(let i = 0; i< all_entries.length; i++){
            $('#load_entry').append('<option value="' + all_entries[i]['id'] + '"> ' + all_entries[i]['text']+ '</option>');
        }
    })

}

function register_entry(){
    
    let entry = JSON.stringify(particles_text.export_key_value());

    $.post('new_entry.php', {post_jsondata:entry}).done(function(){
        console.log("Registered!");
    });
}

function update_parameters(){

    $('#text_box').val(particles_text.text);

    $('#font_select').val(particles_text.font);

    $('#point_color').val(particles_text.point_color);

    $('#stroke_color').val(particles_text.stroke_color);

    $('#nb_parts').val(255-particles_text.nb_parts);

    $('#size_parts').val(particles_text.size);

    $('#scale_parts').val(particles_text.scale);

    $('#x_offset').val(particles_text.x_offset);

    $('#y_offset').val(particles_text.y_offset);

    $('#density_parts').val(particles_text.density);

    $('#connect_tresh').val(particles_text.connect_tresh)

    document.getElementById('connect_enabled').checked = particles_text.connect_enabled;


}