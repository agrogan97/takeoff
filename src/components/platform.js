class Platform {
    /*
        Platform class. In the game, the aircraft starts on one and lands on the other.
        This has physics and collision detection but is static in space.
        We define the platform as being a `start` or `end` platform. 
        An `end` platform listens for collisions with the aircraft for end of level
    */
    constructor(x, y, type) {
        // Define the physics parameters and create a matter body
        this.x = x;
        this.y = y;
        this.w = 300;
        this.h = 50;
        this.p = createVector(this.x, this.y)
        this.type = type;
        const options = {
            isStatic : true
        }
        this.body = Bodies.rectangle(this.x, this.y, this.w+50, this.h, options);
        Composite.add(engine.world, this.body);
        if (type == "start"){this.body.purpose = "start"};
    }

    draw() {
        let pos = this.body.position;
        this.p = createVector(pos.x, pos.y)
        let angle = this.body.angle;
        push();
        rectMode(CENTER);
        translate(pos.x, pos.y);
        fill('rgba(255, 0, 0, 0.8)');
        rect(0, 0, this.w, this.h);
        pop();
    }

    listen(){
        /*
            Listen for collisions with the aircraft and return true if satisfied
            Collisions for landing are:
                - Matter.Collision.collides(aircraft.body, this.body) != null
                - aircraft.body.velocity = 0
                . _.inRange(aircraft.body.bounds.max.y, this.body.bounds.min.y-10, this.body.bounds.min.y+10)
        */

        // Check for collision
        if (Matter.Collision.collides(aircraft.body, this.body) != null){
            // Check aircraft has come to a complete stop
            if (aircraft.body.velocity.x == 0){
                return true;
            }
        }

        return false;
    }
    
}