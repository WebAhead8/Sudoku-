
// Declare Variable
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;
var winModel = id("winModal");
var lostModel = id("loseModal");
var easyTable;
var mediumTable;
var hardTable;

var clickSound = new Audio();
clickSound.src= "click.mp3";
var numberSound = new Audio();
numberSound.src="number.mp3";
var winSound = new Audio();
winSound.src= "win.mp3";
var loseSound = new Audio();
loseSound.src= "lose.mp3";


window.onload = function () {
    // Run startGame function when button is clicked
    id("start-btn").addEventListener("click", startGame);

    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function () {
            // If selecting is not disable
            if (!disableSelect) {
                // If number is already selected
                if (this.classList.contains("selected")) {
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
    // Choose Difficulty
    let board;
    if (id("diff-1").checked) {
        easyTable = Math.floor(Math.random()*3);  
        board = easy[easyTable][0];
        lives = 8;
    } else if (id("diff-2").checked) {
        mediumTable = Math.floor(Math.random()*3);  
        board = medium[mediumTable][0];
        lives = 5;
    } else {
        hardTable = Math.floor(Math.random()*3);  
        board = hard[hardTable][0];
        if(hardTable == 3) {
            hardTable = 0;
        }
        lives = 3;
    }
    disableSelect = false;
    id("lives").textContent = "Lives Remaining : " + lives;

    // Creates board based on dificulty
    generateBoard(board);
    startTimer();

    if (id("theme-1").checked) {
        qs("body").classList.remove("dark");
    } else {
        qs("body").classList.add("dark");
    }

    // Display the number container
    id("number-container").classList.remove("hidden");

}

function startTimer() {
    if (id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;

    // Sets timer for first second
    id("timer").textContent = "Time Remaining : " + timeConversion(timeRemaining);
    //Sets timer to update every second
    timer = setInterval(function () {
        timeRemaining--;
        // If no time remaining end game
        if (timeRemaining === 0) endGame();
        id("timer").textContent = "Time Remaining : " + timeConversion(timeRemaining);
    }, 1000)
}

// Converts seconds into string of MM:SS format
function timeConversion(time) {
    let minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
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
            tile.addEventListener("click", function () {
                // If selecting is not disabled
                if (!disableSelect) {
                    // If the tile is already selected
                    if (tile.classList.contains("selected")) {
                        // Then remove the selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
                        // Deselect all other tiles
                        for (let i = 0; i < 81; i++) {
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
    if (selectedTile && selectedNum) {
        // Set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;

        // If the number matches the corresponding number in the solution key
        if (checkCorrect(selectedTile)) {
            // Deselect the tile
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");

            // Clear the selected variables
            selectedNum = null;
            selectedTile = null;



            // Check if board is completed
            if (checkDone()) {
                endGame();
            }
            // If the number does not match the solution key
        } else {
            // Disable selecting new numbers for one second
            disableSelect = true;
            // Make the tile turn red
            selectedTile.classList.add("incorrect");
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");



            //Run in one Sec
            setTimeout(function () {
                // Subtract lives by 1
                lives--;
                selectedTile.textContent = "";
                // If no lives left -> end game
                if (lives === 0) { endGame(); }
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
        if (tiles[i].textContent === "") return false;
    }
    return true;
}

function endGame() {
    // Disable moves and stop the timer
    disableSelect = true;
    clearTimeout(timer);

    // Display win or loss message
    if (lives === 0 || timeRemaining === 0) {
        id("loseModal").style.display = "block";
        loseSound.play();
        setTimeout(function () {
            location.reload();
        }, 5000)
    } else {
        id("winModal").style.display = "block";
        winSound.play();
        setTimeout(function () {
            location.reload();
        }, 5000)
    }
}

function checkCorrect(tile) {
    // Set solution based on difficulty selection
    let solution;
    if (id("diff-1").checked) { 
        solution = easy[easyTable][1]; 
    }
    else if (id("diff-2").checked) { 
        solution = medium[mediumTable][1];
    }
    else { 
        solution = hard[hardTable][1]; 
    }
    
    // If tiles number is = to solution number
    if (solution.charAt(tile.id) === tile.textContent) {
        return true;
    } else {
        return false;
    }
}

function clearPrevious() {
    // Clear the tiles
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }

    // Clear the timer
    if (timer) clearTimeout(timer);

    // Deselect any numbers
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }

    // Clear selected Variables
    selectedTile = null;
    selectedNum = null;
}

// Helper Function
function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}