// global variables
let particles_text = null;

// canvas id
const CANVAS = 'main_canvas'

// only for testing
const TEXT = 'FROST';
const FONT = '20px Helvetica';
const STROKE_COLOR = 'white';
const POITN_COLOR = 'white';
const NB_PARTS = 2000;
const SIZE = 2;
const DENSITY = 4;

$('document').ready(function () 
{
    console.log('Hello World!');

    const main_canvas = document.getElementById(CANVAS);

    const main_ctx = get_context_from_canvas(main_canvas);

    let mouse = new MouseListener(100);

    particles_text = new TextParticles(TEXT, FONT, POITN_COLOR, STROKE_COLOR, NB_PARTS, SIZE, DENSITY,main_canvas, main_ctx, mouse);

    init_animate();


})

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