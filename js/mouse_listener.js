class MouseListener{

    constructor(radius){

        var self_obj = this;

        // string with element to be watched
        this.element = window;
        
        //mouse position
        this.x = 0;
        this.y = 0;

        // mouse radius
        this.radius = radius;

        this.init_listener(self_obj)
    }

    init_listener(self_obj) {
        $(this.element).mousemove(function (e) { 
            self_obj.set_x(e.clientX);
            self_obj.set_y(e.clientY);
        });
    }

    get get_x(){
        return this.x;
    }

    set_x(x){
        this.x = x;
    }

    get get_y(){
        return this.y;
    }

    set_y(y){
        this.y = y;
    }

    get get_r(){
        return this.radius;
    }

    get get_xyr(){
        return {'x': this.x, 'y': this.y, 'radius': this.radius};
    }
}