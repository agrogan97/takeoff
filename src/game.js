// module aliases
var Engine = Matter.Engine,
    // Render = Matter.Render, 
    Runner = Matter.Runner,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events,
    Common = Matter.Common;

var engine = Engine.create();
var constants = new Constants();
var game = new GameController();
var aircraft;
var runner;
var world;
var startPlatform,
    endPlatform;
var mouse;
var isWorkshop = false;
var mouseConstraint;
var mods = [];
var modController;
var modsApplied;
var launchButton;
var game = new Game();

var testRect;

function preload() {
    /*
        - Asynchronous, blocking preload call for static assets
        - Path names placed within constants file
        - Ref: https://p5js.org/reference/#/p5/preload
    */
    constants.assets.forEach(c => {
        let img = loadImage(constants.STATICBASE + c);
        constants.imgs[c] = img;
    })
}

function setup() {
    var canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent("gameCanvas");
    world = engine.world;
    // engine.positionIterations = 20
    rectMode(CENTER);
    hover = null;
    grabbed = null;
    // ----- FLIGHT -----
    // Define world objects
    aircraft = new Aircraft(200, 500);
    startPlatform = new Platform(200, 800, "start");
    endPlatform = new Platform(1100, 800, "end");
    launchButton = new LaunchButton(650, 900);

    // add mouse control
    mouse = Mouse.create(canvas.elt);
    mouse.pixelRatio = pixelDensity();
    mouseConstraint = new MouseConstraint.create(engine, mouse)
    Composite.add(world, mouseConstraint)
    modController = new ModController();

    // ----- Workshop -----
    // In workshop mode, the aircraft is fixed
    mods.push(new Mod(200, 200, undefined, 'antek-MkII', 'A'))
    mods.push(new Mod(200, 400, undefined, 'dPAC-MkI', 'B'))
    mods.push(new Mod(200, 600, undefined, 'ohax1000', 'C'))
    mods.push(new Mod(200, 800, undefined, 'antek-MkIV', 'D'))

    // create a runner
    runner = Runner.create();
    // Run the engine
    Runner.run(runner, engine);

    startPlatform.draw();
    endPlatform.draw();
    aircraft.draw();
}

function draw() {
    // Get mouse coordinates
    mCoords = createVector(mouseX, mouseY);
    hover = null;
    // ----- WORKSHOP RENDER -----
    if (isWorkshop) {
        // Remove previous physics objects
        Composite.remove(world, [startPlatform, endPlatform])
        // Draw background first
        image(constants.imgs["city1.png"], 0, 0, window.innerWidth, window.innerHeight);
        // Move aircraft to mod dock
        aircraft.draw();
        aircraft.setIsInTheShop(true);
        // Add in mods
        mods.forEach(mod => {
            mod.draw();
            // Get proximity of mouse to object
            if (mCoords.dist(mod.p) < mod.w) {
                hover = mod
            }
            // Add to mod list if active
            if (modController.mods.includes(mod)) {
                document.getElementById(`mod${mod.effect}`).innerHTML = `${mod.name}`;
            } else {
                document.getElementById(`mod${mod.effect}`).innerHTML = ``
            }
        })
        modsApplied = false;
    // ----- LAUNCHPAD RENDER -----
    } else if (!isWorkshop) {
        // Apply all mods in the mod controller
        if (!modsApplied) {modController.applyAllMods()};
        Composite.add(world, [startPlatform, endPlatform])
        image(constants.imgs["city1.png"], 0, 0, window.innerWidth, window.innerHeight);
        startPlatform.draw();
        endPlatform.draw();
        // Success condition
        launchButton.draw();
        aircraft.setIsInTheShop(false)
        aircraft.draw();
        modsApplied = true;

        if (endPlatform.listen()){
            console.log("Landed!")
            newRound();
        };
    }
}

// ----- Mouse click processes

function mousePressed() {
    if (hover) {
        grabbed = hover;
    }
}

function mouseReleased() {
    // Check if grabbed and placed on the aircraft
    if (grabbed != null) {
        if (aircraft.p.dist(grabbed.p) < aircraft.w) {
            console.log(`Applying mod ${grabbed.name} to aircraft`)
            modController.addMod(grabbed)
            grabbed.isActive = true;
        } else {
            // If the mouse is released away from the aircraft
            if (modController.mods.includes(grabbed)) {
                // While holding an active mod - remove that mod
                modController.removeMod(grabbed);
            }
        }
    }
    grabbed = null;
}

function mouseDragged() {
    if (grabbed) {
        grabbed.p.add(createVector(movedX, movedY))
    }
}

function mouseClicked() {
    // Check for launch click
    if (!isWorkshop) {
        if (!aircraft.inFlight) {
            if (launchButton.p.dist(createVector(mouseX, mouseY)) < launchButton.w) {
                aircraft.launch();
            }
        }
    }
}

/*
    Next Steps:
        - Means of calculating if level is possible
        - More mods: 4x4 of each type to give a wide selection of options 
            (would be great to basically make it so that every endPlatform position is possible perhaps?)
        - Next level and restart buttons
        - Curriculum
        - More game art:
            - 3 new level backgrounds
            - Platforms, startPlatform with launcher
            - Control panel for launch, new game, restart
            - Art for mods
            - Workshop background and art
            - Landing page
            - Clouds!
*/