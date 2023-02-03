class ModController {
    /*
        Namespaced management class for mods
    */
    constructor() {
        this.mods = []
        this.effects = {
            scale : [],
            frictionAir : [],
            gravity : []
        };
    }

    addMod(mod) {
        /*
            Add a mod to the this.mods storage object
        */
        this.mods.push(mod)
    }

    removeMod(target){
        /*
            Remove a mod from the this.mods storage object
        */
        this.mods = this.mods.filter(mod => mod != target);
        target.isActive = false;
        console.log(`Removed ${target.name} from aircraft`)
    }

    getMods(){
        return this.mods.filter(m => m.effect);
    }

    refresh() {
        // Removes all mods and reapplies them, to prevent double mod loading
        this.effects = {
            scale : [],
            frictionAir : [],
            gravity : []
        };
        this.applyAllMods();
    }

    applyAllMods(){
        this.mods.forEach(mod => {
            // Get the dictionary with the mod parameter scaling, as {scale : x}
            let e = mod.apply();
            // Get array of effect names in case we have multiple, eg. [gravity, scale]
            Object.keys(e).forEach(effect => {
                // Add the scale effect to this.effects so we can chain them
                this.effects[effect].push(e[effect])
            })
        });
        return this.effects;
    }
}