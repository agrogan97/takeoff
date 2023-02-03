class GameController {
    constructor() {

    }

    saveBodies(){
        /*
            Save a snapshot of all the bodies in the world
        */

        this.bodies = world.bodies;
    }

    clearWorld(){
        /*
            Wrapper to save world.bodies snapashot and then clear the world contents
        */
        this.saveBodies();
        Engine.clear(engine)
    }

    restoreBodies(){
        /*
            Restore world bodies, either from input or from this.world.bodies
        */
       world.bodies = this.bodies;
       Engine.update(engine);
    }

}