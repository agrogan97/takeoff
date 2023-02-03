class Game {
    /*
        Trackers and utils for storing data about the game
    */
    constructor() {
        this.attempt = 0;
        this.round = 0;
        this.restarts = 0;
        this.correct = 0;
        this.level = 1;
        this.roundData = {};

        this.newRound();
    }

    newRound() {
        /*
            In Takeoff, a new round is when the player restarts, and the position of the target platform also restarts,
                thus representing a new, unseen challenge
            roundData contains information about the round configuration,
                and a sub-object with information about user settings each time they restarted
                this may be things such as which mods they went for, timestamp info, etc.
        */
        
        // Reset round-level parameters:
        this.restarts = 0;
        // Increment other parameters:
        this.attempt++;
        this.round++;
        // Define new round storage
        this.roundData[this.round] = {
            attempt : this.attempt,
            restarts : this.restarts,
            round: this.round,
            level : this.level,
            starttime : Date.now(),
            endTime : undefined,
            passed : false,
            launches: {
                0 : {
                    startTime : Date.now()
                }
            }
        }
    }

    saveAttempt(didPass){
        /*
            In Takeoff, a player gets unlimited attempts.
            A restart is when the aircraft goes below the horizon and it's position is reset
            This method can be run to count how many times this happens per level
            When the level is restarted, increment:
                - this.attempt
                - this.restarts
            Note that this is done after a round has failed, and so captures what's just occured
            We listen for a failed attempt in the aircraft class, when it drops below the window height,
                so it's called there
        */
        
        // Update the restart-level data storage
        this.roundData[this.round]['launches'][this.restarts].endTime = Date.now();
        this.roundData[this.round]['launches'][this.restarts].mods = modController.getMods();
        
        // Increment intra-round trackers
        this.attempt++;
        if (!didPass) {this.restarts++};

        // If not starting new round, define next tracking dict and set the start time
        if (!didPass) {
            this.roundData[this.round].launches[this.restarts] = {
                startTime : Date.now()
            }
        }

        // If the player did pass, save the end of round time
        if (didPass) {
            this.roundData[this.round].endTime = Date.now();
        }
    }
}