/* 
Code modified from : https://www.youtube.com/watch?v=P2TcQ3h0ipQ

The code is for the basic tic tac toe game and the minimax algorithm has been replicated using the turorial above.
The minimax algorith visualization has be written by me.

Author: Simon Delisle
Last Updated: Jan 17th 2021

*/

var origBoard;
const huPlayer = 'O'; // human player
const aiPlayer = 'X'; // ai player
const winCombos = [ // all winning combinations
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

const cells = document.querySelectorAll('.cell'); // stores a reference to each cell from index.html
const cells2 = document.querySelectorAll('.cell2'); // stores a reference to each cell from index.html
startGame();




function startGame() {
    document.querySelector(".endgame").style.display = "none" // hide the endgame window
    origBoard  = Array.from(Array(9).keys()); // array of 9 for the board
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color'); // remove background colors of last game sinning cells
        cells[i].addEventListener('click', turnClick, false); // when clieck on a square, call the turnclick function
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') { // means that nobody has played there already
        turn(square.target.id, huPlayer); // when click in the squares call the turn function
        if(!checkTie()) turn(bestSpot(), aiPlayer); // if not tie ai player plays

    }



}

function turn(squareId, player) {
    origBoard[squareId] = player; // log in array squareid = player
    document.getElementById(squareId).innerText = player; // display player symbol on tictactoe board
    let gameWon = checkWin(origBoard, player); // call fx to check if player has won
    if (gameWon) gameOver(gameWon); // if game won, call the game over fx
    if (player == huPlayer) {
        for (var i = 0; i < cells2.length; i++) {
            cells2[i].innerText = "";
        }
    }

}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => 
        ((e === player)) ? a.concat(i) : a, []) // add index to a array where element in board is equal to the player
    // a:accumulator (value that will give back at the end, initialized to an empty array)
    // e: element in board array that we are going though
    // i: board index
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) { // get index and win array [x,x,x] from win combos
        if (win.every(elem => plays.indexOf(elem) > -1)) { // check if every index of win if greater than -1 i.e. has the player played in every spot that he need to win
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon
}

function gameOver (gameWon) {
    for(let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "green" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
        cells2[i].innerText = "";
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose...");
}

function declareWinner (who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i=0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "blue";
            cells[i].removeEventListener('click', turnClick, false);
            cells2[i].innerText = "";
        }
        declareWinner("Tie game!");
        return true;
        //if (gameWon.player == huPlayer) {
        //    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose...");
        //} else {
        //    return true
        //}
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, huPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {}; 
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
        //console.log(move);
        //onsole.log(moves);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            for (var key in moves) {
                //console.log(key);
                //console.log(moves);
                //console.log(cells2[key]);
                
                if (moves[key] == -10) {
                    cells2[key].backgroundColor = "red";
                } else if (moves[key] == 0) {
                    cells2[key].backgroundColor = "blue";
                } else {
                    cells2[key].backgroundColor = "green"; 
                }
                
            }

            //cells2[i].innerText = moves[i].score
            cells2[moves[i].index].innerText = moves[i].score
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
                //console.log("Best move : " + bestMove);
                //console.log("Best score : " + bestScore);
                
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            

            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}


