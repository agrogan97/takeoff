class Aircraft {
    /*
        Class for defining the aircraft and controlling its' position and flight dynamics
    */
    constructor(x, y) {
        // Define the physics parameters and create a matter body
        this.x = x;
        this.y = y;
        this.p = createVector(this.x, this.y);
        this.w = 200
        this.h = 300;
        this.inFlight = false;
        const options = {
        }
        this.launchParameters = {
            // Here we have the flight physics settings
            scale : 1,
            frictionAir: 0.001, // MatterJS default = 0.001
            gravity: 0.001, 
        }
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
        Composite.add(engine.world, this.body);

    }

    setIsInTheShop(bool) {
        if (bool) {
            Body.setPosition(this.body, createVector(800, 500))
            // Setting something as static changes the mass, density, etc. - so better to just constraint it in place
            const anchor1 = createVector(400, this.body.position.y-50);
            const anchor2 = createVector(800, this.body.position.y-50);
            if (world.constraints.filter(c => c.name == "aircraft1").length == 0) {
                this.elastic1 = Constraint.create({
                    name: 'aircraft1',
                    pointA: anchor1,
                    bodyB: this.body,
                    stiffness: 1
                });
                this.elastic2 = Constraint.create({
                    name: 'aircraft2',
                    pointA: anchor2,
                    bodyB: this.body,
                    stiffness: 1
                })
                Composite.add(engine.world, [this.elastic1, this.elastic2], true)
            }
            
        } else {
            if (world.constraints.length > 1 && world.constraints.filter(c => c.name == "aircraft1").length > 0) {
                Composite.remove(engine.world, [this.elastic1, this.elastic2]);
                Body.setPosition(this.body, createVector(200, 500))
            }
            
            
        }
    }

    launch(){
        /*
            Apply a force on the plane. We can modify the following parameters:
                - Magnitude
                - Directional vector
                - Density (/ Mass)
                - Air resistance (frictionAir)

            Ref: https://brm.io/matter-js/docs/classes/Body.html
            FYI, Array.reduce docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
        */

        // Get the mod effects from the modController: a dict with the same params as this.launchParameters
        const modEffects = modController.effects;
        const scaleEffect = modEffects.scale.reduce((a, b) => a*b, 1);
        console.log("Scaling force by", scaleEffect)
        const frictionAirEffect = modEffects.frictionAir.reduce((a, b) => a*b, 1);
        const gravityEffect = modEffects.gravity.reduce((a, b) => a*b, 1)
        const baseX = 1.5;
        const baseY = -1.5;

        // Update the engine with the new frictionAir and gravity parameters
        this.body.frictionAir = this.launchParameters.frictionAir * frictionAirEffect;
        engine.gravity.scale = this.launchParameters.gravity * gravityEffect;

        // Apply the force to the aircraft
        Body.applyForce(
            this.body, this.body.position, 
            {
                x : baseX * scaleEffect,
                y : baseY * scaleEffect,
            }
        );
        this.inFlight = true;
    }

    resetPosition() {
        if (this.body.position.y > window.innerHeight*1.2) {
            Body.setVelocity(this.body, createVector(0, this.body.velocity.y))
            Body.set(this.body, this.body.angle, 0)
            Body.setPosition(this.body, createVector(200, 0))
            // Also refresh the mods and repply them
            modController.refresh();
            // Remove flight tag
            this.inFlight = false;
            // And save the attempt in the Game object
            game.saveAttempt(false);
        }
    }

    draw() {
        let pos = this.body.position;
        let angle = this.body.angle;
        this.p = createVector(pos.x, pos.y);
        push();
        rectMode(CENTER);
        imageMode(CENTER);
        translate(pos.x, pos.y);
        rotate(angle)
        fill(255);
        image(constants.imgs["aircraft.png"], 0, 0, this.w, this.h)
        // rect(0, 0, this.w, this.h);
        pop();

        // Listens out for when it falls below 0 to reset its position
        this.resetPosition()
    }
}