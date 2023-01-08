const util = require('util')
const TwentynineGame  = require('./twentyGame')
// const MonteCarlo = require('./monteCarlo')

let game  = new TwentynineGame()
// let mcts = new MonteCarlo(game)

let state = game.start()

let winner = game.winner(state)
