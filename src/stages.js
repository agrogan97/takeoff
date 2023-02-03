function newRound() {
    /*
        Generate a new round, which means changing the position of the end platform
        Also calls the newRound function from the Game class to define storage for a new round
    */

    // Change the position of the end platform:
    Body.setPosition(startPlatform.body, createVector(
        startPlatform.body.position.x, // Fix x
        Math.floor(Math.random() * window.innerHeight) // Pick y at random
    ))

    // Manually reposition the aircraft just above the new platform
    Body.setPosition(aircraft.body, createVector(
        startPlatform.body.position.x,
        startPlatform.body.position.y-100
    ))

    aircraft.inFlight = false;

    // call new round
    game.newRound();
}