class TextParticles{

    constructor(text, font, point_color, stroke_color, nb_parts, size, density, canvas, ctx, mouse){

        // text to be drawn
        this.text = text;

        // font to be used
        this.font = font;

        // color of the particles
        this.point_color = point_color;

        // color of the stroke between points
        this.stroke_color = stroke_color;

        // number of particle in total
        this.nb_parts = nb_parts;

        // density and size of particles
        this.density = density;
        this.size = size;

        // canvas + ctx
        this.canvas = canvas;
        this.ctx = ctx;

        // mouse object
        this.mouse = mouse;

        // array of all particles
        this.particles = [];

        // init the ctx with right info
        this.init_ctx();

        this.init();
        
    
    }

    // initializing the context with the text
    init_ctx(){
        this.ctx.fillStyle = 'white';
        this.ctx.font = this.font;
        this.ctx.fillText(this.text, 0, 50);
        this.ctx.strokeStyle = this.stroke_color;
        this.ctx.strokeRect(0,0,100,100);
        const data = this.ctx.getImageData(0, 0, 100, 100);
    }

    init(){
        for(let i = 0; i < this.nb_parts; i++){
            let x = Math.round(Math.random() * this.canvas.width);
            let y = Math.round(Math.random() * this.canvas.height);
            this.particles.push(new Particle(x,y, this.size, this.density, this.point_color, this.ctx, this.mouse));
        }
    }

    animate(){

        // clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // loop over the particles
        for(let i = 0; i <  this.particles.length; i++){
            console.log(i);
            this.particles[i].draw();
            this.particles[i].update()
        }
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

        this.treshold = 500;

        this.ctx = ctx;
        this.mouse = mouse;
    }

    draw(){
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI *2);
        this.ctx.closePath();
        this.ctx.fill();
        console.log(this.to_string());
    }

    update(){
        let dx = this.mouse.get_x - this.x;
        let dy = this.mouse.get_y - this.y;

        let distance = Math.sqrt(dx*dx + dy*dy);

        let force_direction_x = dx/distance;
        let force_direction_y = dy/distance;

        let force = (this.mouse.radius - distance) / this.mouse.radius;

        let direction_x = force_direction_x * force * this.density;
        let direction_y = force_direction_y * force * this.density;

        if(distance < this.mouse.radius){
            
            this.x -= direction_x;
            this.y -= direction_y;

        } else{

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

    to_string(){
        return "<X: " + this.x + ", Y: " + this.y + ", size: " + this.size + ">";
    }
}