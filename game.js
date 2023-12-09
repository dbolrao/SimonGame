// array with possible colors:
var buttonColours = ["red", "blue", "green", "yellow"];

// array with game pattern: 
var gamePattern = [];

// user click pattern: 
var userClickedPattern = [];

// number of clicks: 
var numberOfClicks = 0;

// level: 
var level = 0;

// variable to start game: 
var started = false;

// block user from clicking when the game is doing the sequence:
var blockUser = true;

// detect when the button "Start game" is pressed:
$(".startGame").on("click", function(){
    
    // if the game hasn't started yet:
    if (!started) {
        // remove red background:
        $("html").removeClass("game-over");
        $("body").removeClass("game-over");

        // hide button "Start game":
        $(".startGame").css('visibility', 'hidden');

        // set motivation paragraph:
        $("#level-subtitle1").text("Remember the sequence.");
        $("#level-subtitle2").text("Stay focused!");

        // game started: 
        started = true;
        level = 0;
        flowOfGame();
    }
    

});

// flow of the game:
function flowOfGame() {
    // get next color in sequence with delay to make it easier for the user to see:
    setTimeout(nextSequence, 1000);

    // reset variables every time a new color comes up: 
    userClickedPattern = [];
    numberOfClicks = 0;
}

// next color in sequence: 
async function nextSequence() {
    // increase level and update h1: 
    level++;
    $("#level-title").text("Level " + level);

    // get random number between 0 and 3 to determine the next color in the sequence 
    var randomNumber = Math.floor(Math.random() * 4);
    
    // random color selected: 
    var randomChosenColour = buttonColours[randomNumber];

    // add this color to the pattern: 
    gamePattern.push(randomChosenColour);

    // delay:
    var delay = 500;
    
    // block user for now so user can't click on buttons while the sequence is playing:
    blockUser = true;

    // play sequence:
    for (let i=0; i < gamePattern.length; i++) {
        var currentColor = gamePattern[i];
        $("#" + currentColor).fadeOut(100).fadeIn(100);

        // play sound of this color: 
        playSound(currentColor);

        // wait:
        await sleep(delay)
    }

    // unblock user:
    blockUser = false;
}

// detect which button was clicked:
$(".btn").on("click", function() {
    if (!blockUser) {
        numberOfClicks++;

        // color:
        var userChosenColour = this.id;
        userClickedPattern.push(userChosenColour);
        playSound(userChosenColour);
        animatePress(userChosenColour);
        checkAnswer(userClickedPattern);
    }
});

// check if the answer is correct: 
function checkAnswer(userClickedPattern) {
    
    // check all click of the user:
    for (let i = 0; i <= numberOfClicks-1; i++) {
        
        if (userClickedPattern[i] != gamePattern[i]) {
            // WRONG! play sound, change background:
            playSound("wrong");
            $("html").addClass("game-over");
            $("body").addClass("game-over");

            // hide button "Start game":
            $(".startGame").css('visibility', 'visible');

            // set title and subtitles:
            $("#level-title").text("Game over!");
            $("#level-subtitle1").text("You failed!");
            $("#level-subtitle2").text("Play again.");

            // game over, stop game:
            gamePattern = []
            started = false;
        }
    }

    // reached end of level. Up with level:
    if (userClickedPattern.length == gamePattern.length) {
        flowOfGame();
    }
}

// play sound: 
function playSound(color){
    var soundColor = new Audio('./sounds/' + color + '.mp3');
    soundColor.play()
}

// animate the button to flash 
function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

// to sleep:
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }
