//MARK: Global variables
const X = "X";
const O = "O";
const EMPTY_CELL = "";
const MANUAL_MODE = "manual";
const EASY_MODE = "automatic_easy";
const MEDIUM_MODE = "automatic_medium";

let app = new Vue({
    el: "#app",
    data: {
        dimension: 0,
        turn: X,
        gameFinished: false,
        mode: EASY_MODE,
        matrix: Array(3).fill(Array(3).fill(EMPTY_CELL)),
        minimaxOptions: new Map()
    },
    methods: {

        // MARK: Auxiliar functions

        getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },

        isThereEmptyCell(matrix) {
            return (matrix.map(row => { return row.includes(EMPTY_CELL) })).includes(true);
        },

        writeInMainText(text) {
            document.getElementById('title').innerHTML = text;
        },

        writeInMatrix(row, column, value) {
            var newRow = this.matrix[row].slice();
            newRow[column] = value;
            Vue.set(this.matrix, row, newRow);
        },

        getEmptyCells(matrix) {
            var emptyCells = matrix.map((row, i) => {
                return row.map((element, j) => {
                    if (element === EMPTY_CELL) {
                        return (i * this.dimension) + j;
                    }
                });
            }).map(row => {
                return row.filter(Number.isFinite);
            });
            var emptyIds = emptyCells[0];
            for (var i = 1; i < emptyCells.length; i++) {
                emptyIds = emptyIds.concat(emptyCells[i]);
            }
            return emptyIds;
        },

        getRandomEmptyCell() {
            var emptyIds = this.getEmptyCells(this.matrix);
            var number = this.getRandomNumber(0, emptyIds.length - 1);
            return emptyIds[number];
        },

        // MARK: Board functions

        writeCell(row, column) {
            this.writeInMatrix(row, column, this.turn);
            this.gameFinished = this.checkMatrix(this.matrix, this.turn, row, column);
            if (this.gameFinished == false) {
                this.turn = this.turn === X ? O : X;
                this.writeInMainText("Turno de " + this.turn);
            }
        },

        checkMatrix(matrix, value, x, y) {
            var n = this.dimension;
            var col = 0;
            var row = 0;
            var diag = 0;
            var rdiag = 0;

            for (var i = 0; i < n; i++) {
                if (matrix[x][i] === value) row++;
                if (matrix[i][y] === value) col++;
                if (matrix[i][i] === value) diag++;
                if (matrix[i][n - (i + 1)] === value) rdiag++;
            }

            if (row === n) {
                this.setVictoryCells(x * n, 1);
                return true;
            } else if (col === n) {
                this.setVictoryCells(y, n);
                return true;
            } else if (diag === n) {
                this.setVictoryCells(0, n + 1);
                return true;
            } else if (rdiag === n) {
                this.setVictoryCells(n - 1, n - 1);
                return true;
            } else if (!this.isThereEmptyCell(matrix)) {
                this.writeInMainText("Empate");
                var tds = document.querySelectorAll("td");
                for (let td of tds) {
                    td.className = "td" + n + " disable";
                }
                return true;
            } else {
                return false;
            }
        },

        checkBoard(matrix, value) {
            var n = this.dimension;
            var col = 0;
            var row = 0;
            var diag = 0;
            var rdiag = 0;

            var cols = [];
            var rows = [];

            for (var i = 0; i < n; i++) {
                for (var j = 0; j < n; j++) {
                    if (matrix[i][j] === value) row++;
                    if (matrix[j][i] === value) col++;
                }
                if (matrix[i][i] === value) diag++;
                if (matrix[i][n - (i + 1)] === value) rdiag++;
                cols.push(col === n);
                rows.push(row === n);
                col = 0;
                row = 0;
            }

            return rows.includes(true) || cols.includes(true) || diag === n || rdiag === n;
        },

        setVictoryCells(init, sum) {
            var n = this.dimension;
            this.writeInMainText("Victoria de " + this.matrix[Math.floor(init / n)][Math.floor(init % n)]);
            var tds = document.querySelectorAll("td");
            for (let td of tds) {
                td.className = "td" + n + " disable";
            }
            for (var i = 0; i < n; i++) {
                document.getElementById(init + (i * sum)).className = "winTd" + n;
            }
        },

        // MARK: Main functions

        playerTurn(row, column) {
            if (this.gameFinished == false && this.matrix[row][column] == EMPTY_CELL) {
                this.writeCell(row, column);
                if (this.gameFinished == false && this.mode != MANUAL_MODE) {
                    this.computersTurn();
                }
            }
        },

        resetBoard() {
            var n = this.dimension;
            this.turn = X;
            this.gameFinished = false;
            this.getModeSelected();
            this.writeInMainText("Iniciar partida");
            this.matrix = Array(n).fill(Array(n).fill(EMPTY_CELL));
            var tds = document.querySelectorAll("td");
            for (let td of tds) {
                td.className = "td" + n;
            }
        },

        setDimensionTo3() {
            this.dimension = 3;
            this.resetBoard();
        },

        setDimensionTo4() {
            this.dimension = 4;
            this.resetBoard();
        },

        getModeSelected() {
            var modes = document.getElementsByName('mode');
            for (let mode of modes) {
                if (mode.checked) {
                    this.mode = mode.id;
                    break;
                }
            }
        },

        // MARK: Computer functions

        computersTurn() {
            var id = this.chooseCell();
            var row = Math.floor(id / this.dimension);
            var column = Math.floor(id % this.dimension);
            if (this.matrix[row][column] == EMPTY_CELL) {
                this.writeCell(row, column);
            }
        },

        chooseCell() {
            if (this.mode == EASY_MODE) {
                return this.getRandomEmptyCell();
            } else if (this.mode == MEDIUM_MODE) {
                var choice = this.tryToWin(X);
                if (choice != -1) {
                    return choice;
                } else {
                    return this.getRandomEmptyCell();
                }
            } else {
                return this.minimax(this.matrix, true, (res) => { }, 0);
            }
        },

        tryToWin(value) {
            var id = -1;

            //Get available moves
            var emptyIds = this.getEmptyCells(this.matrix);

            //Iterate over available moves
            emptyIds.forEach(element => {

                var row = Math.floor(element / this.dimension);
                var column = Math.floor(element % this.dimension);

                var child = this.matrix.map((r, i) => {
                    if (row == i) {
                        return r.map((c, j) => {
                            return column == j ? value : c;
                        });
                    } else {
                        return r;
                    }
                });

                var victory = this.checkBoard(child, value);
                if (victory) {
                    id = element;
                }
            });

            return id;
        },

        minimax(board, maximizing, callback, depth) {

            var dimension = this.dimension;

            if (depth == 0) this.minimaxOptions.clear();
            var Xvictory = this.checkBoard(board, X);
            var Ovictory = this.checkBoard(board, O);
            if (Xvictory) {
                return -100 + depth;
            } else if (Ovictory) {
                return 100 - depth;
            } else if (depth === dimension + 1) {
                return 0;
            }

            if (maximizing) {
                var best = -100;

                //Get available moves
                var emptyIds = this.getEmptyCells(board);

                //Iterate over available moves
                emptyIds.forEach(element => {

                    var row = Math.floor(element / dimension);
                    var column = Math.floor(element % dimension);

                    var child = board.map((r, i) => {
                        if (row == i) {
                            return r.map((c, j) => {
                                return column == j ? O : c;
                            });
                        } else {
                            return r;
                        }
                    });

                    var node_value = this.minimax(child, false, callback, depth + 1);
                    best = Math.max(best, node_value);

                    if (depth === 0) {
                        var moves = this.minimaxOptions.has(node_value) ? this.minimaxOptions.get(node_value).toString() + "," + element.toString() : element
                        this.minimaxOptions.set(node_value, moves)
                    }

                });

                var result;
                if (depth === 0) {

                    if (this.minimaxOptions.has(-100)) {
                        best = -100;
                    } else if (this.minimaxOptions.has(100)) {
                        best = 100;
                    }

                    var bestResult = this.minimaxOptions.get(best);
                    if (typeof bestResult == "string") {

                        var bestArray = bestResult.split(",").map(id => parseInt(id));
                        if (bestArray.length === Math.pow(dimension, 2) - 1) {
                            if (bestArray.includes(0)) {
                                result = 0;
                            } else if (bestArray.includes(dimension - 1)) {
                                result = dimension - 1;
                            } else if (bestArray.includes((dimension - 1) * dimension)) {
                                result = (dimension - 1) * dimension;
                            } else if (bestArray.includes(Math.pow(dimension, 2) - 1)) {
                                result = Math.pow(dimension, 2) - 1;
                            } else {
                                var random = this.getRandomNumber(0, bestArray.length - 1);
                                result = bestArray[random];
                            }
                        } else {
                            var random = this.getRandomNumber(0, bestArray.length - 1);
                            result = bestArray[random];
                        }

                    } else {
                        result = bestResult;
                    }

                    callback(result);
                    return result;
                }
                return best;
            }

            if (!maximizing) {
                var best = 100;

                //Get available moves
                var emptyIds = this.getEmptyCells(board);

                //Iterate over available moves
                emptyIds.forEach(element => {

                    var row = Math.floor(element / dimension);
                    var column = Math.floor(element % dimension);

                    var child = board.map((r, i) => {
                        if (row == i) {
                            return r.map((c, j) => {
                                return column == j ? X : c;
                            });
                        } else {
                            return r;
                        }
                    });

                    var node_value = this.minimax(child, true, callback, depth + 1);
                    best = Math.min(best, node_value);

                    if (depth === 0) {
                        var moves = this.minimaxOptions.has(node_value) ? this.minimaxOptions.get(node_value).toString() + "," + element.toString() : element
                        this.minimaxOptions.set(node_value, moves)
                    }

                });
                return best;
            }
        }
    },
    template: `
        <div>
            <header>
                <div>
                    <input type="radio" id="manual" name="mode" class="mode-radio"" v-on:click="resetBoard">
                    <label for=" manual"><span class="text-mode">Jugador vs Jugador</span></label>
                    <div class="breaker2"></div>
                    <input type="radio" id="automatic_easy" name="mode" class="mode-radio"" checked v-on:click="resetBoard">
                    <label for=" automatic_easy"><span class="text-mode">Jugador vs Máquina</span> (Fácil)</label>
                    <div class="breaker"></div>
                    <input type="radio" id="automatic_medium" name="mode" class="mode-radio"" v-on:click="resetBoard">
                    <label for=" automatic_medium"><span class="text-mode">Jugador vs Máquina</span> (Medio)</label>
                    <div class="breaker2"></div>
                    <input type="radio" id="automatic_impossible" name="mode" class="mode-radio"" v-on:click="resetBoard">
                    <label for=" automatic_impossible"><span class="text-mode">Jugador vs Máquina</span> (Imposible)</label>
                </div>
                <h4 id="title">Iniciar partida</h4>
            </header>
            <div id="table_div">
                <table class="table-striped no-bordered" id="board">
                    <tbody>
                        <tr :class="'tr' + dimension" v-for="i in dimension">
                            <td :class="'td' + dimension" :id="(i-1)*dimension + j-1" v-on:click="playerTurn(i-1,j-1)" v-for="j in dimension">
                                <img src="./images/X_symbol.png" alt="X_symbol" v-if="matrix[i-1][j-1] === 'X'">
                                <img src="./images/O_symbol.png" alt="O_symbol" v-else-if="matrix[i-1][j-1] === 'O'">
                            </td>
                        </tr>
                    </tbody>
                </table>    
            </div>
            <footer>
                <div>
                    <button class="btn btn-warning" name="restart_game_3" type="button" v-on:click="setDimensionTo3">Reiniciar partida (3x3)</button>
                    <div class="breaker"></div>
                    <button class="btn btn-warning" name="restart_game_4" type="button" v-on:click="setDimensionTo4">Reiniciar partida (4x4)</button>
                </div>
            </footer>
        </div>
    `
});