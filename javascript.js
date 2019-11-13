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
        cells: Array(9).fill(EMPTY_CELL)
    },
    methods: {

        resetBoard() {
            this.turn = X;
            this.gameFinished = false;
            this.move = 0;
            this.getModeSelected();
            this.writeInMainText("Iniciar partida");
            this.cells = Array((this.dimension * this.dimension)).fill(EMPTY_CELL);
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
            if (this.gameFinished == false && this.cells[id] == EMPTY_CELL) {
                this.move++;
                this.writeCell(id);
                if (this.gameFinished == false && this.mode != MANUAL_MODE) {
                    this.computersTurn();
                }
            }
        },

        writeCell(id) {
            Vue.set(this.cells, id, this.turn);
            this.checkBoard(this.cells, this.turn, id);
            if (this.gameFinished == false) {
                this.turn = this.turn === X ? O : X;
                this.writeInMainText("Turno de " + this.turn);
            }
        },

        checkBoard(cells, currentTurn, position) {
            if (!(cells.includes(EMPTY_CELL))) {
                this.writeInMainText("Empate");
                var tds = document.querySelectorAll("td");
                for (let td of tds) {
                    td.className = "normalCell disable";
                }
                this.gameFinished = true;
            } else {
                this.gameFinished = this.checkCells(cells, currentTurn, Math.floor(position/this.dimension),  Math.floor(position%this.dimension));
            }
        },

        checkCells(cells, value, x, y) {
            var n = this.dimension;
            var col=0;
            var row=0;
            var diag=0;
            var rdiag=0;
    
            for (var i=0; i<n; i++) {
                if (cells[(x*n)+i]===value) row++;
                if (cells[(i*n)+y]===value) col++;
                if (cells[(i*n)+i]===value) diag++;
                if (cells[(i*n)+n-(i+1)]===value) rdiag++;
            }
    
            if (row === n) {
                this.setVictoryCells(x*n,1);
                return true;
            } else if (col === n) {
                this.setVictoryCells(y,n);
                return true;
            } else if (diag === n) {
                this.setVictoryCells(0,n+1);
                return true;
            } else if (rdiag === n) {
                this.setVictoryCells(n-1,n-1);
                return true;
            } else {
                return false;
            }
        },
    
        setVictoryCells(init, sum) {
            this.writeInMainText("Victoria de " + this.cells[init]);
            var tds = document.querySelectorAll("td");
            for (let td of tds) {
                td.className = "normalCell disable";
            }
            for (var i = 0; i < this.dimension; i++) {
                document.getElementById(init+(i*sum)).className = "winCell";
            }
        },

        computersTurn() {
            var taken = false;
            while (taken === false && this.move != 5) {
                var id = this.chooseCell();
                if (this.cells[id] == EMPTY_CELL) {
                    taken = true;
                    this.writeCell(id);
                }
            }
        },

        chooseCell() {
            if (this.mode == EASY_MODE) {
                return (Math.random() * 9).toFixed();
            } else {
                var choice = this.tryToWin(O);
                if (choice != -1) {
                    return choice;
                } else {
                    choice = this.tryToWin(X);
                    if (choice != -1) {
                        return choice;
                    } else {
                        return this.mode == MEDIUM_MODE ? (Math.random() * 9).toFixed() : this.studyMove();
                    }
                }
            }
        },

        tryToWin(value) {
            //Primera fila
            if (this.cells[0] == value && this.cells[1] == value && this.cells[2] == EMPTY_CELL) {
                return 2;
            } else if (this.cells[0] == value && this.cells[2] == value && this.cells[1] == EMPTY_CELL) {
                return 1;
            } else if (this.cells[1] == value && this.cells[2] == value && this.cells[0] == EMPTY_CELL) {
                return 0;
            }
            //Segunda fila
            else if (this.cells[3] == value && this.cells[4] == value && this.cells[5] == EMPTY_CELL) {
                return 5;
            } else if (this.cells[3] == value && this.cells[5] == value && this.cells[4] == EMPTY_CELL) {
                return 4;
            } else if (this.cells[4] == value && this.cells[5] == value && this.cells[3] == EMPTY_CELL) {
                return 3;
            }
            //Tercera fila
            else if (this.cells[6] == value && this.cells[7] == value && this.cells[8] == EMPTY_CELL) {
                return 8;
            } else if (this.cells[6] == value && this.cells[8] == value && this.cells[7] == EMPTY_CELL) {
                return 7;
            } else if (this.cells[7] == value && this.cells[8] == value && this.cells[6] == EMPTY_CELL) {
                return 6;
            }
            //Primera columna
            else if (this.cells[0] == value && this.cells[3] == value && this.cells[6] == EMPTY_CELL) {
                return 6;
            } else if (this.cells[0] == value && this.cells[6] == value && this.cells[3] == EMPTY_CELL) {
                return 3;
            } else if (this.cells[3] == value && this.cells[6] == value && this.cells[0] == EMPTY_CELL) {
                return 0;
            }
            //Segunda columna
            else if (this.cells[1] == value && this.cells[4] == value && this.cells[7] == EMPTY_CELL) {
                return 7;
            } else if (this.cells[1] == value && this.cells[7] == value && this.cells[4] == EMPTY_CELL) {
                return 4;
            } else if (this.cells[4] == value && this.cells[7] == value && this.cells[1] == EMPTY_CELL) {
                return 1;
            }
            //Tercera columna
            else if (this.cells[2] == value && this.cells[5] == value && this.cells[8] == EMPTY_CELL) {
                return 8;
            } else if (this.cells[2] == value && this.cells[8] == value && this.cells[5] == EMPTY_CELL) {
                return 5;
            } else if (this.cells[5] == value && this.cells[8] == value && this.cells[2] == EMPTY_CELL) {
                return 2;
            }
            //Primera diagonal
            else if (this.cells[0] == value && this.cells[4] == value && this.cells[8] == EMPTY_CELL) {
                return 8;
            } else if (this.cells[0] == value && this.cells[8] == value && this.cells[4] == EMPTY_CELL) {
                return 4;
            } else if (this.cells[4] == value && this.cells[8] == value && this.cells[0] == EMPTY_CELL) {
                return 0;
            }
            //Segunda diagonal
            else if (this.cells[2] == value && this.cells[4] == value && this.cells[6] == EMPTY_CELL) {
                return 6;
            } else if (this.cells[2] == value && this.cells[6] == value && this.cells[4] == EMPTY_CELL) {
                return 4;
            } else if (this.cells[4] == value && this.cells[6] == value && this.cells[2] == EMPTY_CELL) {
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
                    if (this.cells[0] == X || this.cells[2] == X || this.cells[6] == X || this.cells[8] == X) {
                        return 4;
                    } else if (this.cells[4] == X) {
                        return 0;
                    } else if (this.cells[1] == X) {
                        return 2;
                    } else if (this.cells[3] == X) {
                        return 6;
                    } else {
                        return 8;
                    }
                    //Segundo turno: solo debemos comprobar las opciones que no se hayan descartado anteriormente con la función tryToWin
                    case 2:
                        if (this.cells[0] == X && this.cells[4] == O) {
                            if (this.cells[5] == X) {
                                return 1;
                            } else {
                                return 5;
                            }
                        } else if (this.cells[1] == X && this.cells[2] == O) {
                            if (this.cells[0] == X || this.cells[3] == X) {
                                return 8;
                            } else if (this.cells[5] == X) {
                                return 4;
                            } else {
                                return 7;
                            }
                        } else if (this.cells[2] == X && this.cells[4] == O) {
                            if (this.cells[3] == X) {
                                return 1;
                            } else {
                                return 3;
                            }
                        } else if (this.cells[3] == X && this.cells[6] == O) {
                            if (this.cells[0] == X || this.cells[1] == X) {
                                return 8;
                            } else if (this.cells[8] == X) {
                                return 5;
                            } else {
                                return 4;
                            }
                        } else if (this.cells[4] == X && this.cells[0] == O) {
                            return 6;
                        } else if (this.cells[5] == X && this.cells[8] == O) {
                            if (this.cells[0] == X || this.cells[7] == X) {
                                return 4;
                            } else if (this.cells[6] == X) {
                                return 3;
                            } else {
                                return 6;
                            }
                        } else if (this.cells[6] == X && this.cells[4] == O) {
                            if (this.cells[5] == X) {
                                return 7;
                            } else {
                                return 3;
                            }
                        } else if (this.cells[7] == X && this.cells[8] == O) {
                            if (this.cells[3] == X || this.cells[6] == X) {
                                return 2;
                            } else if (this.cells[2] == X) {
                                return 1;
                            } else {
                                return 4;
                            }
                        } else if (this.cells[8] == X && this.cells[4] == O) {
                            if (this.cells[0] == X) {
                                return 5;
                            } else if (this.cells[1] == X) {
                                return 0;
                            } else {
                                return 7;
                            }
                        } else {
                            return (Math.random() * 9).toFixed();
                        }
                        default:
                            return (Math.random() * 9).toFixed();
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
                                <img height="50" width="50" src="./images/X_symbol.png" alt="X_symbol" v-if="cells[(i-1)*dimension + j-1] === 'X'">
                                <img height="50" width="50" src="./images/O_symbol.png" alt="O_symbol" v-else-if="cells[(i-1)*dimension + j-1] === 'O'">
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