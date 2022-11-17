class TextParticles{

    constructor(text, font, point_color, stroke_color, nb_parts, size, scale, x_offset, y_offset, density, connect_tresh, connect_enabled, canvas, ctx, mouse){

        this.self = this;

        this.id = Date.now();

        // str -> text to be drawn
        this.text = text;

        // str -> font to be used
        this.font = font;

        // str(hex or the color itself) -> color of the particles
        this.point_color = point_color;

        // str(hex or the color itself) -> color of the stroke between points
        this.stroke_color = stroke_color;

        // int [0.255] -> number of particle in total
        this.nb_parts = nb_parts;

        // int [0,30] -> density
        this.density = density;

        // int [0,5] -> size of the particles
        this.size = size;

        // int [0.20] -> scale of the text
        this.scale = scale;

        // int [0, height/width] -> x and y offset
        this.x_offset = x_offset;
        this.y_offset = y_offset;

        // canvas + ctx to store
        this.canvas = canvas;
        this.ctx = ctx;

        // int [0, 100] -> connect treshold
        this.connect_tresh = connect_tresh;

        // bool -> if we connect the dots or not
        this.connect_enabled = connect_enabled;

        // mouse object
        this.mouse = mouse;

        // array of all particles
        this.particles = [];
        this.text_coords;

        // init the ctx with right info
        this.init_ctx();

        this.init_particles_array();

        this.init_events_listeners();
        
    }

    // initializing the context with the text
    init_ctx(){
        this.ctx.fillStyle = 'white';
        this.ctx.font = this.font;
        this.ctx.fillText(this.text, 0, 25);
        this.ctx.strokeStyle = this.stroke_color;
        this.text_coords = this.ctx.getImageData(0, 0, 100, 100);
    }

    // init all particles but they are randomly spread, not mapped to text
    // not used in project it was to test partciles before doing the text feature
    init_no_text(){

        for(let i = 0; i < this.nb_parts; i++){
            let x = Math.round(Math.random() * this.canvas.width);
            let y = Math.round(Math.random() * this.canvas.height);
            this.particles.push(new Particle(x,y, this.size, this.density, this.point_color, this.ctx, this.mouse));
        }
    }

    // goes over the text data in canvas and maps particles to where there is text
    init_particles_array(){

        // making sure to empty array before spreading particles
        this.particles = [];

        // goes over all x and y coordinates of the data and checks if they contain text
        for(let y =0, y2 = this.text_coords.height; y<y2;y++){
            for(let x = 0, x2 = this.text_coords.width; x < x2; x++){
                // this is checking the level of lumincance, if it is over treshold it generates a point
                if(this.text_coords.data[(y*4*this.text_coords.width) + (x * 4) + 3] > this.nb_parts ){
                    this.particles.push(new Particle(x * this.scale + this.x_offset,
                                                     y * this.scale + this.y_offset,
                                                     this.size,
                                                     this.density,
                                                     this.point_color,
                                                     this.ctx,
                                                     this.mouse));
                }
            }
        }
    }

    // creates one frame of animation, not the loop tho this is done in main
    animate(){

        // clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // loop over the particles
        for(let i = 0; i <  this.particles.length; i++){
            this.particles[i].draw();
            this.particles[i].update()
        }

        // checks if connect is enabled
        if(this.connect_enabled){
            this.connect();
        }
    }

    // connects the partciles with a stroke depending in treshold
    connect(){

        // checks the distance between all particles
        for(let a = 0; a < this.particles.length ; a++){
            for(let b = a; b < this.particles.length; b++){
                let dx = this.particles[a].x - this.particles[b].x;
                let dy = this.particles[a].y - this.particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // if the distance is below the treshold, it connectex the two particles
                if(distance < this.connect_tresh){
                    this.ctx.strokeStyle = this.stroke_color;
                    this.ctx.linewidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    // re-init both the 2d context and the particles array
    // allows to change the TextParticles in real time
    re_init(){
        this.init_ctx();
        this.init_particles_array();
    }

    init_events_listeners(){

        var obj_self = this.self;

        document.getElementById('text_box').addEventListener('input', function(text){
            console.log(text.target.value);
            obj_self.set_text(text.target.value);
        })

        document.getElementById('font_select').addEventListener('change', function(text){
            console.log(text.target.value);
            obj_self.set_font(text.target.value);
        })

        document.getElementById('point_color').addEventListener('input', function(text){
            obj_self.set_point_color(text.target.value);
        })

        document.getElementById('stroke_color').addEventListener('input', function(text){
            obj_self.set_stroke_color(text.target.value);
        })

        document.getElementById('nb_parts').addEventListener('input', function(text){
            obj_self.set_nb_parts(255-text.target.value);
        })

        document.getElementById('size_parts').addEventListener('input', function(text){
            obj_self.set_size(text.target.value);
        })

        document.getElementById('scale_parts').addEventListener('input', function(text){
            obj_self.set_scale(text.target.value);
        })

        document.getElementById('x_offset').addEventListener('input', function(text){
            obj_self.set_x_offset(parseInt(text.target.value));
        })

        document.getElementById('y_offset').addEventListener('input', function(text){
            obj_self.set_y_offset(parseInt(text.target.value));
        })

        document.getElementById('density_parts').addEventListener('input', function(text){
            obj_self.set_density(30-parseInt(text.target.value));
        })

        document.getElementById('connect_tresh').addEventListener('input', function(text){

            obj_self.set_connect_tresh(parseInt(text.target.value));
        })

        document.getElementById('connect_enabled').addEventListener('input', function(text){
            obj_self.set_connect_enabled(text.target.checked);
        })

    }


    /*
    to change the object while animating
    anytime we change a property, we need to re-init the ctx and the particles array
    we simply call re_init()
    */

    set_text(text){
        this.text = text;
        this.re_init();
    }

    set_font(font){
        this.font = "20px " + font;
        this.re_init();
    }

    set_point_color(point_color){
        this.point_color = point_color;
        this.re_init();
    }

    set_stroke_color(stroke_color){
        this.stroke_color = stroke_color;
        this.re_init();
    }

    set_nb_parts(nb_parts){
        this.nb_parts = nb_parts;
        this.re_init();
    }

    set_size(size){
        this.size = size;
        this.re_init();
    }

    set_scale(scale){
        this.scale = scale;
        this.re_init();
    }

    set_x_offset(x_offset){
        this.x_offset = x_offset;
        this.re_init();
    }

    set_y_offset(y_offset){
        this.y_offset = y_offset;
        this.re_init();
    }

    set_density(density){
        this.density = density;
        this.re_init();
    }

    set_connect_tresh(connect_tresh){
        this.connect_tresh = connect_tresh;
        this.re_init();
    }
    
    set_connect_enabled(connect_enabled){
        this.connect_enabled = connect_enabled;
        this.re_init();
    }

    import_key_value(key_value){

        // new id
        this.id = Date.now();
        
         // str -> text to be drawn
         this.text = key_value.text;

         // str -> font to be used
         this.font = key_value.font;
 
         // str(hex or the color itself) -> color of the particles
         this.point_color = key_value.point_color;
 
         // str(hex or the color itself) -> color of the stroke between points
         this.stroke_color = key_value.stroke_color;
 
         // int [0.255] -> number of particle in total
         this.nb_parts = key_value.nb_parts;
 
         // int [0,30] -> density
         this.density = key_value.density;
 
         // int [0,5] -> size of the particles
         this.size = key_value.size;
 
         // int [0.20] -> scale of the text
         this.scale = key_value.scale;
 
         // int [0, height/width] -> x and y offset
         this.x_offset = key_value.x_offset;
         this.y_offset = key_value.y_offset;
 
         // int [0, 100] -> connect treshold
         this.connect_tresh = key_value.connect_tresh;
 
         // bool -> if we connect the dots or not
         this.connect_enabled = key_value.connect_enabled;

         this.re_init();

    }

    export_key_value(){

        let to_export = {
            "id": this.id,
            "text": this.text,
            "font": this.font,
            "point_color": this.point_color,
            "stroke_color": this.stroke_color,
            "nb_parts": this.nb_parts,
            "density": this.density,
            "size": this.size,
            "scale": this.scale,
            "x_offset": this.x_offset,
            "y_offset": this.y_offset,
            "connect_tresh": this.connect_tresh,
            "connect_enabled": this.connect_enabled,
        };


        return to_export;
    }
    
}

class Particle {

    constructor(x, y, size, density, color, ctx, mouse){
        
        // x and y coords
        this.x = x;
        this.y = y;

        // size and density of particles
        this.size = size;
        this.org_size = size;

        // between 1 and 30
        this.density = density;

        // color of particle
        this.color = color;
        
        // original x and y
        this.base_x = x;
        this.base_y = y;

        // store reference to the mouse and canvas
        this.ctx = ctx;
        this.mouse = mouse;
    }

    // simply draws a circle at particle's position with given color and size
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI *2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // updates the position of the particles depending on the position of the mouse
    update(){
        // distance from the mouse
        let dx = this.mouse.get_x - this.x;
        let dy = this.mouse.get_y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        // if the point is in the radius of the moue, we move it
        if(distance < this.mouse.radius){
            // calculating the force of the update, the close to the mouse the faster it moves
            let force_direction_x = dx/distance;
            let force_direction_y = dy/distance;
            let force = (this.mouse.radius - distance) / this.mouse.radius;

            // figures out the position to go to
            let direction_x = force_direction_x * force * this.density;
            let direction_y = force_direction_y * force * this.density;

            // updates the position
            this.x -= direction_x;
            this.y -= direction_y;

        } else{
            
            // checks if the particle is at its original position
            // if not, it gradually takes it back to the original x/y coord
            if(this.base_x !== this.x){
                let bdx = this.x - this.base_x;
                this.x -= bdx/10;
            }
            
            if(this.base_y !== this.y){
                let bdy = this.y - this.base_y;
                this.y -= bdy/10;
            }
        }
    }

    // just to get inff on the points
    to_string(){
        return "<X: " + this.x + ", Y: " + this.y + ", size: " + this.size + ">";
    }
}