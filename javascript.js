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
        dimension: 3,
        turn: X,
        gameFinished: false,
        move: 0,
        mode: EASY_MODE,
        matrix: Array(3).fill(Array(3).fill(EMPTY_CELL))
    },
    methods: {

        getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },

        isThereEmptyCell(matrix) {
            return (matrix.map(row => { return row.includes(EMPTY_CELL) })).includes(true);
        },

        resetBoard() {
            this.turn = X;
            this.gameFinished = false;
            this.move = 0;
            this.getModeSelected();
            this.writeInMainText("Iniciar partida");
            this.matrix = Array(this.dimension).fill(Array(this.dimension).fill(EMPTY_CELL));
            var tds = document.querySelectorAll("td");
            for (let td of tds) {
                td.className = "normalCell";
            }
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

        writeInMainText(text) {
            document.getElementById('title').innerHTML = text;
        },

        playerTurn(id) {
            if (this.gameFinished == false && this.matrix[Math.floor(id / this.dimension)][Math.floor(id % this.dimension)] == EMPTY_CELL) {
                this.move++;
                this.writeCell(id);
                if (this.gameFinished == false && this.mode != MANUAL_MODE) {
                    this.computersTurn();
                }
            }
        },

        writeCell(id) {
            this.writeInMatrix(Math.floor(id / this.dimension), Math.floor(id % this.dimension), this.turn);
            this.gameFinished = this.checkMatrix(this.matrix, this.turn, Math.floor(id / this.dimension), Math.floor(id % this.dimension));
            if (this.gameFinished == false) {
                this.turn = this.turn === X ? O : X;
                this.writeInMainText("Turno de " + this.turn);
            }
        },

        writeInMatrix(row, column, value) {
            var newRow = this.matrix[row].slice();
            newRow[column] = value;
            Vue.set(this.matrix, row, newRow);
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
                    td.className = "normalCell disable";
                }
                return true;
            } else {
                return false;
            }
        },

        setVictoryCells(init, sum) {
            this.writeInMainText("Victoria de " + this.matrix[Math.floor(init / this.dimension)][Math.floor(init % this.dimension)]);
            var tds = document.querySelectorAll("td");
            for (let td of tds) {
                td.className = "normalCell disable";
            }
            for (var i = 0; i < this.dimension; i++) {
                document.getElementById(init + (i * sum)).className = "winCell";
            }
        },

        computersTurn() {
            var id = this.chooseCell();
            if (this.matrix[Math.floor(id / this.dimension)][Math.floor(id % this.dimension)] == EMPTY_CELL) {
                this.writeCell(id);
            }
        },

        chooseCell() {
            if (this.mode == EASY_MODE) {
                return this.getRandomEmptyCell();
            } else {
                var choice = this.tryToWin(O);
                if (choice != -1) {
                    return choice;
                } else {
                    choice = this.tryToWin(X);
                    if (choice != -1) {
                        return choice;
                    } else {
                        return this.mode == MEDIUM_MODE ? this.getRandomEmptyCell() : this.studyMove();
                    }
                }
            }
        },

        getRandomEmptyCell() {
            var emptyCells = this.matrix.map((row, i) => {
                return row.map((element, j) => {
                    if (element === "") {
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
            var number = this.getRandomNumber(0, emptyIds.length - 1);
            return emptyIds[number];
        },

        tryToWin(value) {
            //Primera fila
            if (this.matrix[0][0] == value && this.matrix[0][1] == value && this.matrix[0][2] == EMPTY_CELL) {
                return 2;
            } else if (this.matrix[0][0] == value && this.matrix[0][2] == value && this.matrix[0][1] == EMPTY_CELL) {
                return 1;
            } else if (this.matrix[0][1] == value && this.matrix[0][2] == value && this.matrix[0][0] == EMPTY_CELL) {
                return 0;
            }
            //Segunda fila
            else if (this.matrix[1][0] == value && this.matrix[1][1] == value && this.matrix[1][2] == EMPTY_CELL) {
                return 5;
            } else if (this.matrix[1][0] == value && this.matrix[1][2] == value && this.matrix[1][1] == EMPTY_CELL) {
                return 4;
            } else if (this.matrix[1][1] == value && this.matrix[1][2] == value && this.matrix[1][0] == EMPTY_CELL) {
                return 3;
            }
            //Tercera fila
            else if (this.matrix[2][0] == value && this.matrix[2][1] == value && this.matrix[2][2] == EMPTY_CELL) {
                return 8;
            } else if (this.matrix[2][0] == value && this.matrix[2][2] == value && this.matrix[2][1] == EMPTY_CELL) {
                return 7;
            } else if (this.matrix[2][1] == value && this.matrix[2][2] == value && this.matrix[2][0] == EMPTY_CELL) {
                return 6;
            }
            //Primera columna
            else if (this.matrix[0][0] == value && this.matrix[1][0] == value && this.matrix[2][0] == EMPTY_CELL) {
                return 6;
            } else if (this.matrix[0][0] == value && this.matrix[2][0] == value && this.matrix[1][0] == EMPTY_CELL) {
                return 3;
            } else if (this.matrix[1][0] == value && this.matrix[2][0] == value && this.matrix[0][0] == EMPTY_CELL) {
                return 0;
            }
            //Segunda columna
            else if (this.matrix[0][1] == value && this.matrix[1][1] == value && this.matrix[2][1] == EMPTY_CELL) {
                return 7;
            } else if (this.matrix[0][1] == value && this.matrix[2][1] == value && this.matrix[1][1] == EMPTY_CELL) {
                return 4;
            } else if (this.matrix[1][1] == value && this.matrix[2][1] == value && this.matrix[0][1] == EMPTY_CELL) {
                return 1;
            }
            //Tercera columna
            else if (this.matrix[0][2] == value && this.matrix[1][2] == value && this.matrix[2][2] == EMPTY_CELL) {
                return 8;
            } else if (this.matrix[0][2] == value && this.matrix[2][2] == value && this.matrix[1][2] == EMPTY_CELL) {
                return 5;
            } else if (this.matrix[1][2] == value && this.matrix[2][2] == value && this.matrix[0][2] == EMPTY_CELL) {
                return 2;
            }
            //Primera diagonal
            else if (this.matrix[0][0] == value && this.matrix[1][1] == value && this.matrix[2][2] == EMPTY_CELL) {
                return 8;
            } else if (this.matrix[0][0] == value && this.matrix[2][2] == value && this.matrix[1][1] == EMPTY_CELL) {
                return 4;
            } else if (this.matrix[1][1] == value && this.matrix[2][2] == value && this.matrix[0][0] == EMPTY_CELL) {
                return 0;
            }
            //Segunda diagonal
            else if (this.matrix[0][2] == value && this.matrix[1][1] == value && this.matrix[2][0] == EMPTY_CELL) {
                return 6;
            } else if (this.matrix[0][2] == value && this.matrix[2][0] == value && this.matrix[1][1] == EMPTY_CELL) {
                return 4;
            } else if (this.matrix[1][1] == value && this.matrix[2][0] == value && this.matrix[0][2] == EMPTY_CELL) {
                return 2;
            }
            //Otro
            else {
                return -1;
            }
        },

        studyMove() {
            switch (this.move) {
                //Primer turno
                case 1:
                    if (this.matrix[0][0] == X || this.matrix[0][2] == X || this.matrix[2][0] == X || this.matrix[2][2] == X) {
                        return 4;
                    } else if (this.matrix[1][1] == X) {
                        return 0;
                    } else if (this.matrix[0][1] == X) {
                        return 2;
                    } else if (this.matrix[1][0] == X) {
                        return 6;
                    } else {
                        return 8;
                    }
                //Segundo turno: solo debemos comprobar las opciones que no se hayan descartado anteriormente con la función tryToWin
                case 2:
                    if (this.matrix[0][0] == X && this.matrix[1][1] == O) {
                        if (this.matrix[1][2] == X) {
                            return 1;
                        } else {
                            return 5;
                        }
                    } else if (this.matrix[0][1] == X && this.matrix[0][2] == O) {
                        if (this.matrix[0][0] == X || this.matrix[1][0] == X) {
                            return 8;
                        } else if (this.matrix[1][2] == X) {
                            return 4;
                        } else {
                            return 7;
                        }
                    } else if (this.matrix[0][2] == X && this.matrix[1][1] == O) {
                        if (this.matrix[1][0] == X) {
                            return 1;
                        } else {
                            return 3;
                        }
                    } else if (this.matrix[1][0] == X && this.matrix[2][0] == O) {
                        if (this.matrix[0][0] == X || this.matrix[0][1] == X) {
                            return 8;
                        } else if (this.matrix[2][2] == X) {
                            return 5;
                        } else {
                            return 4;
                        }
                    } else if (this.matrix[1][1] == X && this.matrix[0][0] == O) {
                        return 6;
                    } else if (this.matrix[1][2] == X && this.matrix[2][2] == O) {
                        if (this.matrix[0][0] == X || this.matrix[2][1] == X) {
                            return 4;
                        } else if (this.matrix[2][0] == X) {
                            return 3;
                        } else {
                            return 6;
                        }
                    } else if (this.matrix[2][0] == X && this.matrix[1][1] == O) {
                        if (this.matrix[1][2] == X) {
                            return 7;
                        } else {
                            return 3;
                        }
                    } else if (this.matrix[2][1] == X && this.matrix[2][2] == O) {
                        if (this.matrix[1][0] == X || this.matrix[2][0] == X) {
                            return 2;
                        } else if (this.matrix[0][2] == X) {
                            return 1;
                        } else {
                            return 4;
                        }
                    } else if (this.matrix[2][2] == X && this.matrix[1][1] == O) {
                        if (this.matrix[0][0] == X) {
                            return 5;
                        } else if (this.matrix[0][1] == X) {
                            return 0;
                        } else {
                            return 7;
                        }
                    } else {
                        return this.getRandomEmptyCell();
                    }
                default:
                    return this.getRandomEmptyCell();
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
                        <tr v-for="i in dimension">
                            <td class="normalCell" v-bind:id="(i-1)*dimension + j-1" v-on:click="playerTurn((i-1)*dimension + j-1)" v-for="j in dimension">
                                <img src="./images/X_symbol.png" alt="X_symbol" v-if="matrix[i-1][j-1] === 'X'">
                                <img src="./images/O_symbol.png" alt="O_symbol" v-else-if="matrix[i-1][j-1] === 'O'">
                            </td>
                        </tr>
                    </tbody>
                </table>    
            </div>
            <footer>
                <div>
                    <button class="btn btn-warning" name="restart_game" type="button" v-on:click="resetBoard">Reiniciar partida</button>
                </div>
            </footer>
        </div>
    `
});