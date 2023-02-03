class Mod {
    /*
        Mod class, where a mod changes some aspect of the game physics
        Construction Params:
            - x; y : Render coordinates
            - name : The mod name
            - effect : What function the mod has, using the switch method to apply the function
    */
    constructor(x, y, img, name, effect) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.p = createVector(x, y)
        this.name = name;
        this.effect = effect;
        this.w = 50; // Change to image anyway
        this.h = 50;
        
        this.isActive = false;
    }

    apply() {
        /*
            Apply the effects of the mod
        */

        switch (this.effect) {
            case 'A':
                // Case A effect
                return {scale : 1.25}
            case 'B':
                // Case B effect
                return {scale : 0.65}
            case 'C':
                // Case B effect
                return {frictionAir : 3} // NB these are the scale factors, so we scale the default by this - i.e 0.001*2.5=0.0025
            case 'D':
                // Case B effect
                return {gravity : 3}
            default:
                throw new Error(`Unknown mod with name ${this.effect}`)
        }
    }

    draw() {
        /*
            Render the mod to the display
        */
        push();
        translate(this.p.x, this.p.y);
        fill('red')
        rect(0, 0, this.w, this.h);
        fill('black')
        textSize(24)
        translate(-50, 50)
        text(this.name, 0, 0)
        pop();
    }
}