# MIMO-HTML5-Tres_en_raya-Vue

TIC-TAC-TOE game created with Vue

- There are 2 game modes, and 2 players in each mode:
	1. Manual: Human vs Human
	2. Automatic: Human vs Machine. In this mode, the machine plays placing its symbol in a random cell chosen among the empty ones.

- The symbol (X or O) is automatically assigned to each player.

- Each player can add their symbol to the board once, in an empty cell, during their turn. After adding it, the turn will go to the other player.

- The player who manages to complete any of the 8 lines of the board with their symbol wins the game.

- If none of the players manages to win and there are no empty cells in the board, the game will end in a draw.

- Lines to consider:
	1. Three horizontal lines.
	2. Three vertical lines.
	3. Two diagonals.

- There are 3 game difficulties in automatic mode:
	1. Easy: the machine randomly chooses its next move.
	2. Medium: the machine tries to avoid the player's victory and tries to win, but if it cannot, it chooses randomly its next move.
	2. Difficult: the machine calculates the best movement in order to avoid player's victory and guarantee its own.

![image](https://user-images.githubusercontent.com/23210811/68624939-3cef8a80-04d8-11ea-9c13-a1dd4dadffe6.png)