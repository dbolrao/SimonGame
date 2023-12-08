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

// check if game started: 
$(document).keypress(function(event){
    
    if (event.key == "Enter") {
        if (!started) {
            // remove red background:
            $("html").removeClass("game-over");
            $("body").removeClass("game-over");

            // set motivation paragraph:
            $("#level-subtitle").text("Stay focused!");

            // game started: 
            started = true;
            level = 0;

            flowOfGame();
        }
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
function nextSequence() {
    // increase level and update h1: 
    level++;
    $("#level-title").text("Level " + level);

    // get random number between 0 and 3 to determine the next color in the sequence 
    var randomNumber = Math.floor(Math.random() * 4);
    
    // random color selected: 
    var randomChosenColour = buttonColours[randomNumber];

    // add this color to the pattern: 
    gamePattern.push(randomChosenColour);

    // flash the button of this color: 
    $("#" + randomChosenColour).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);

    // play sound of this color: 
    playSound(randomChosenColour);
}


// detect which button was clicked:
$(".btn").on("click", function() {
    numberOfClicks++;

    // color:
    var userChosenColour = this.id;
    console.log(userChosenColour);
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern);
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

            // set title and subtitle:
            $("#level-title").text("Game over!");
            $("#level-subtitle").text("You failed at repeating the sequence! Press Enter to Start.");

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
