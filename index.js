// Load boards from file or manually
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

// Decalring Variables
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;
id("start-btn").addEventListener("click", function() {
    console.log('Hello');
});
window.onload = function () {
    alert('Hi');
    
    // Run startgame function when button is clicked 
    id("start-btn").addEventListener("click", startGame);
    console.log("Hello");
    alert('Hi');
    // Add event listener to each number in number container
    for ( let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function() {
            // If selecting is not disable
            if(!disableSelect) {
            // If number is already selected
            if(this.classList.contains("selected")) {
                // Then remove selection
                this.classList.remove("selected");
                selectedNum = null;
            } else {
                // Deselect all other numbers
                for (let i = 0; i < 9; i++) {
                    id("number-container").children[i].classList.remove("selected");
                }
                // Select it and update selecNum variable
                this.classList.add("selected");
                selectedNum = this;
                updateMove();
            }
          }
        });
    }
}

function startGame() {

    // Choose board difficulty
    let board;
    if (id("diff-1").checked) board = easy[0];
    else if (id("diff-2").checked) board = medium[0];
    else board = hard[0];

    // Set lives to 3 and enable selecting numbers and tiles
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining = " + lives;

    // Creates board based on difficulty
    generateBoard(board);

    // Starts the timer 
    startTimer();

    // Sets theme based on input
    if(id("theme-1").checked) {
        qs("body").classList.remove("dark");
    } else {
        qs("body").classList.add("dark");
    }

    // Show number container
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    // Set time remaining based on input
    if(id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;

    // Sets timer for first second
    id("timer").textContent = timeConversion(timeRemaining);
    //Sets timer to update every second
    timer = setInterval(function () {
        timeRemaining--;
        // If no time remaining end game
        if(timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000)
}

// Converts seconds into string of MM:SS format
function timeConversion(time) {
    let minutes = Math.floor(time/60);
    if(minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if(seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board) {
    // Clear previous board 
    clearPrevious();

    // Let used to increment tile ids
    let idCount = 0;

    // Create 81 tiles
    for (let i = 0; i < 81; i++) {
        // Create a new paragraph element
        let tile = document.createElement("p");

        // If the tile is not blank with mean it's not "-"
        if (board.charAt(i) != "-") {
            // Set tile text to current number
            tile.textContent = board.charAt(i);
        } else {
            // Add click event listener to tile
            tile.addEventListener("click", function() {
                // If selecting is not disabled
                if(!disableSelect) {
                    // If the tile is already selected
                    if(tile.classList.contains("selected")) {
                        // Then remove the selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
                        // Deselect all other tiles
                        for(let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        // Add selection and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
        // Assign tile id
        tile.id = idCount;
        // Increment for next tile
        idCount++;
        // Add tile class to all tiles (The thick borders)
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 & tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        // Add tile to board
        id("board").appendChild(tile);
    }
}

function updateMove() {
    // If a tile and a number is selected
    if(selectedTile && selectedNum) {
        // Set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
        // If the number matches the corresponding number in the solution key
        if(checkCorrect(selectedtile)) {
            // Deselect the tile
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");

            // Clear the selected variables
            selectedNum = null;
            selectedTile = null;

            // Check if board is completed
            if(checkDone()) {
                endGame();
            }
            // If the number does not match the solution key
        } else {
            // Disable selecting new numbers for one second
            disableSelect = true;
            // Make the tile turn red
            selectedTile.classList.add("incorrect");
            //Run in one Sec
            setTimeout(function() {
                // Subtract lives by 1
                lives--;
                // If no lives left -> end game
                if (lives === 0) {endGame();}
                else {
                    //If not = 0 -> update lives text
                    id("lives").textContent = "Lives Remaining : " + lives;
                    // Renable selecting numbers and tiles
                    disableSelect = false;
                }
                // Restore tile color and remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");

                // Clear the tiles text and clear selected variables
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
            }, 1000);
        }
    }
}

function checkDone() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if(tiles[i].textContent === "") return false;
    } 
    return true;
}

function endGame() {
    // Disable moves and stop the timer
    disableSelect = true;
    clearTimeout(timer);

    // Display win or loss message
    if (lives === 0 || timeRemaining === 0) {
        id("lives").textContent = "You Lost!";
    } else {
        id("lives").textContent = "You Won!";
    }
}

function checkCorrect(tile) {
    // Set solution based on difficulty selection
    let solution;
    if (id("diff-1").checked) solution = easy[1];
    else if (id("diff-2").checked) solution = medium[1];
    else solution = hard[1];

    // If tiles number is = to solution number
    if (solution.charAt(title.id) === tile.textContent) return true;
    else return false;
}

// Delete any previous number on the board 
function clearPrevious() {
    // Access all of the tiles
    let tiles = qsa(".tile");

    // Remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }

    // If there is a timer clear it
    if(timer) clearTimeout(timer);

    // Deselect any numbers
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }

    // Clear selected variables
    selectedTile = null;
    selectedNum = null;
}


// Helper functions
// This function gets any element id once calling it
function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}