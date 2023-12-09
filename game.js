// array with possible colors:
var buttonColours = ["red", "blue", "green", "yellow"];

// array with game pattern: 
var gamePattern = [];

// user click pattern: 
var userClickedPattern = [];

// number of clicks: 
var numberOfClicks = 0;

// delay:
var delay = 800;

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
        // reset title:
        $("#level-title").text("Simon Game");

        // set motivation paragraph:
        $("#level-subtitle2").text("Good luck!");

        // remove game-over background:
        $("html").removeClass("game-over");
        $("body").removeClass("game-over");

        // hide button "Start game":
        $(".startGame").css('visibility', 'hidden');

        // game started: 
        started = true;
        
        // go to level 1:
        flowOfGame();
    }
});

// flow of the game. This is where levels go up:
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
    $("#level-subtitle2").text("See sequence:");

    // get random number between 0 and 3 to determine the next color in the sequence 
    var randomNumber = Math.floor(Math.random() * 4);
    
    // random color selected: 
    var randomChosenColour = buttonColours[randomNumber];

    // add this color to the pattern: 
    gamePattern.push(randomChosenColour);

    // wait between level and color so user has time to process information:
    await sleep(delay)
    
    // block user for now so user can't click on buttons while the sequence is playing:
    blockUser = true;

    // play sequence:
    for (let i=0; i < gamePattern.length; i++) {
        var currentColor = gamePattern[i];
        $("#" + currentColor).fadeOut(100).fadeIn(100);

        // play sound of this color: 
        playSound(currentColor);

        // wait between colors:
        await sleep(delay)
    }

    // the sequence was played. unblock user so now user can touch the buttons:
    blockUser = false;

    // give indication of the number of clicks:
    $("#level-subtitle2").text("Clicks: " + numberOfClicks + "/" + level);
}

// detect which button was clicked:
$(".btn").on("click", function() {
    if (!blockUser) {
        // update number of clicks every time the user clicks on a button:
        numberOfClicks++;
        $("#level-subtitle2").text("Clicks: " + numberOfClicks + "/" + level);

        // chosen color:
        var userChosenColour = this.id;

        // add the color to the pattern:
        userClickedPattern.push(userChosenColour);

        // play sound and flash button:
        playSound(userChosenColour);
        animatePress(userChosenColour);

        // check answer:
        checkAnswer(userClickedPattern);

        // check if user reached end of level:
        endOfLevel();
    }
});

// reached end of level. Up with level:
async function endOfLevel() {
    if (userClickedPattern.length == gamePattern.length) {
        // block user for now:
        blockUser = true;

        // reached end of level:
        await sleep(delay/2)
        $("#level-subtitle2").text("Good!");
        await sleep(delay/2);

        // continue to next level:
        flowOfGame();
    }
}

// check if the answer is correct: 
async function checkAnswer(userClickedPattern) {
    
    // check all click of the user:
    for (let i = 0; i <= numberOfClicks-1; i++) {
        
        if (userClickedPattern[i] != gamePattern[i]) {
            // WRONG! play sound, change to game-over background:
            playSound("wrong");
            $("html").addClass("game-over");
            $("body").addClass("game-over");

            // show button "Start game":
            $(".startGame").css('visibility', 'visible');

            // set title and subtitle:
            $("#level-title").text("Level " + level);
            $("#level-subtitle2").text("GAME OVER!");

            // game over, stop game and reset variables:
            started = false;
            gamePattern = []
            level = 0;
        }
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
