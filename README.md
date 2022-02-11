## [Big Bac Boe](https://www.bigbacboe.com)

Big Bac Boe is a game I created that extends [ultimate Tic Tac Toe](https://mathwithbaddrawings.com/2013/06/16/ultimate-tic-tac-toe/) to another level of nesting, for a total of 729 Tic Tac Toe boards.
Each board is a part of one large board, one medium board and one small board. Think of this as three coordinates (x, y, z). When one player places an X at (x, y, z), the next player must place their x in
the small board with coordinates (y, z, ). It's built using Node.js, Express and Socket.io.
 