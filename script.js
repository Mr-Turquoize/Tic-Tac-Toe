var game = function () {

    // Global Vars
    var selected = ['X'];
    var nextMove = [];
    var aiChoice;

    // Cache - Dom
    zero = document.querySelector('.O');
    cross = document.querySelector('.X');
    ai = document.querySelector('.AI');
    human = document.querySelector('.Human');
    a = document.querySelector('#a');
    b = document.querySelector('#b');
    c = document.querySelector('#c');
    d = document.querySelector('#d');
    e = document.querySelector('#e');
    f = document.querySelector('#f');
    g = document.querySelector('#g');
    h = document.querySelector('#h');
    i = document.querySelector('#i');
    footer = document.querySelector('.footer');
    winner = document.querySelector('.winner');
    modeTitle = document.querySelector('.modeTitle');
    element = document.querySelectorAll('.grid-element');

    //Bind - Events
    ai.addEventListener('click', updateModeUI)
    human.addEventListener('click', updateModeUI)
    zero.addEventListener('click', (e) => selected.push(e.target.value));
    cross.addEventListener('click', (e) => selected.push(e.target.value));

    // console.log(aiMove([0,1,2,3,4,5,6,7,8]))

    function updateModeUI(){
        this.style.backgroundColor ='#9b59b6';

        if (this.textContent.includes('AI')){
            human.style.backgroundColor = '#27ae60';
        }
        else{
            ai.style.backgroundColor = '#27ae60';
        }

        setMode(this.textContent);
        modeTitle.textContent = 'Mode'
    }

    function setMode(modeSelected){
        mode = modeSelected.includes('AI') ? 'AI' :  'Human'

        if (mode == 'Human'){
            Array.from(element).forEach(e => e.addEventListener('click', humanMode))
            ai.classList.add('move-mode')
        }else{
            human.classList.add('move-mode')
            cross.addEventListener('click', removeOther);
            zero.addEventListener('click', removeOther);
            Array.from(element).forEach(e => e.addEventListener('click', aiMode))
        }
    }

    function removeOther(){
        if (this.value =='X'){
            aiChoice = 'O';
            zero.style.display = 'none';
            cross.classList.add('move-other')
        }else{
            aiChoice = 'X';
            zero.classList.add('move-other')
            cross.style.display = 'none';
        }
    }

    function humanMode() {
        //Checks if X or O is selected and if last move == this move, alert to change symbol else display the symbol
        //End game if symbols appended = 9

        let toDisplay = selected[selected.length - 1];
        let lastMove = nextMove[nextMove.length - 1]

        if (nextMove.length == 8) { endGame(); }
        if (nextMove.length > 0 && toDisplay == lastMove) {
            alert("It is next player's move");
        }
        else {
            if (this.innerHTML == '') {
                nextMove.push(toDisplay);   //Only append last move if the grid area was empty else do nothing
                this.innerHTML = `<p class ='marked ${toDisplay}'>${toDisplay}</p>`;
            }
            checkWinner();
        }
    }

    function aiMode(){

        let toDisplay = selected[selected.length - 1];

        if (selected.length > 1){
            if (this.innerHTML == '') {  //Human Move
                nextMove.push(toDisplay);   //Only append last move if the grid area was empty else do nothing
                this.innerHTML = `<p class ='marked ${toDisplay}'>${toDisplay}</p>`;
            }

            currBoard = [a.textContent,b.textContent,c.textContent,d.textContent,e.textContent,f.textContent,g.textContent,h.textContent,i.textContent]
            boardMap = {0:a, 1:b, 2:c, 3:d, 4:e, 5:f, 6:g, 7:h, 8:i};
            board = currBoard.map((element, index) => element.length==0 ? index : element)
            aiMove = giveMove(board, aiChoice)

            if (aiMove !== undefined){   //Computer Move
                boardMap[aiMove].innerHTML = `<p class ='marked ${aiChoice}'>${aiChoice}</p>`;
            }else{
                endGame();
            }
            checkWinner();
        }
    }


    function giveMove(origBoard, choice){
        // Code from FreeCodeCamp : https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/
        var huPlayer = "O";
        var aiPlayer = "X";

        // finding the ultimate play on the game that favors the computer
        if (choice == huPlayer){
            return minimax(origBoard, huPlayer).index;
        }else{
            return minimax(origBoard, aiPlayer).index;
        }

        // the main minimax function
        function minimax(newBoard, player){

            //available spots
            var availSpots = emptyIndexies(newBoard);

            // checks for the terminal states such as win, lose, and tie and returning a value accordingly
            if (winning(newBoard, huPlayer)){
                return {score:-10};
            }
            else if (winning(newBoard, aiPlayer)){
                return {score:10};
                }
            else if (availSpots.length === 0){
                return {score:0};
            }

            // an array to collect all the objects
            var moves = [];

            // loop through available spots
            for (var i = 0; i < availSpots.length; i++){
                //create an object for each and store the index of that spot that was stored as a number in the object's index key
                var move = {};
                move.index = newBoard[availSpots[i]];

                // set the empty spot to the current player
                newBoard[availSpots[i]] = player;

                //if collect the score resulted from calling minimax on the opponent of the current player
                if (player == aiPlayer){
                    var result = minimax(newBoard, huPlayer);
                    move.score = result.score;
                }
                else{
                    var result = minimax(newBoard, aiPlayer);
                    move.score = result.score;
                }

                //reset the spot to empty
                newBoard[availSpots[i]] = move.index;

                // push the object to the array
                moves.push(move);
            }

            // if it is the computer's turn loop over the moves and choose the move with the highest score
            var bestMove;

            if(player === aiPlayer){
                var bestScore = -10000;
                for(var i = 0; i < moves.length; i++){
                    if(moves[i].score > bestScore){
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }else{
            // else loop over the moves and choose the move with the lowest score
                var bestScore = 10000;
                for(var i = 0; i < moves.length; i++){
                    if(moves[i].score < bestScore){
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }

            // return the chosen move (object) from the array to the higher depth
            return moves[bestMove];
        }

        // returns the available spots on the board
        function emptyIndexies(board){
            return  board.filter(s => s != "O" && s != "X");
        }

        // winning combinations using the board indexies for instace the first win could be 3 xes in a row
        function winning(board, player){
            if (
                (board[0] == player && board[1] == player && board[2] == player) ||
                (board[3] == player && board[4] == player && board[5] == player) ||
                (board[6] == player && board[7] == player && board[8] == player) ||
                (board[0] == player && board[3] == player && board[6] == player) ||
                (board[1] == player && board[4] == player && board[7] == player) ||
                (board[2] == player && board[5] == player && board[8] == player) ||
                (board[0] == player && board[4] == player && board[8] == player) ||
                (board[2] == player && board[4] == player && board[6] == player)
                ) {
                return true;
            } else {
                return false;
            }
        }

    }

    function checkWinner() {
        // a b c
        // d e f
        // g h i
        aa = a.textContent;
        bb = b.textContent;
        cc = c.textContent;
        dd = d.textContent;
        ee = e.textContent;
        ff = f.textContent;
        gg = g.textContent;
        hh = h.textContent;
        ii = i.textContent;

        if ((aa != '' && aa == bb && bb == cc) || (aa != '' && aa == dd && dd == gg) || (aa != '' && aa == ee && ee == ii)){
            endGame(aa);
        }
        else if ((dd != '' && dd == ee && ee == ff) || (bb != '' && bb == ee && ee == hh) || (cc != '' && cc == ee && ee == gg)){
            endGame(ee);
        }
        else if ((gg != '' && gg == hh && hh == ii) || (cc != '' && cc == ff && ff == ii)) {
            endGame(ii);
        }
    }

    function endGame(player) {
        footer.classList.toggle('footer-show');
        if (player) {
            winner.textContent = `The winner is ${player}`
        } else {
            winner.textContent = `It's a Draw`
        }
    }

}()
