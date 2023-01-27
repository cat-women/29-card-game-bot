const Deck = require('./deck')
const State = require('./state')
const Game = require('./game')
const MCTS = require('./monteCarlo')

const myCards = ['7H', '8H', '7D', 'QD', '7S', 'TS', 'KS']
const handsHistory = [['Xnp5spLG', ['JH', 'KH', '9H', '1H'], 'Xnp5spLG']]
const deck = new Deck()
const currentPlayer = 'Xnp5spLG'
const playersIds = ['Bot 0', 'Xnp5spLG', 'Bot 1', 'pYQkwH0z']
// const played_cards = ['1S', '9S', '8S', 'TC']
const played_cards = ['1S']
const firstPlayer = 'pYQkwH0z'

const game = new Game()
const mcts = new MCTS(game)

const state = new State(
  handsHistory,
  myCards,
  deck,
  "Bot 0",
  played_cards,
  playersIds,
  firstPlayer,
  false
)


// const nextPlayer = playersIds[game.nextPlayer(state)]

// console.log("nextPlayer ",nextPlayer,state.otherCards.get(nextPlayer))

// console.log("Legal moves ",game.legalMove(state))

// console.log(game.legalMove(state,state.nextPlayer,false)))




let winner = null

// From initial state, play games until end
console.log("winner first",winner)
while (winner === null) {


  mcts.runSearch(state, 1)

  let stats = mcts.getStats(state)

  let play = mcts.bestPlay(state, "robust")
  // console.log("chosen play: " + util.inspect(play, {showHidden: false, depth: null}))
console.log("plat,",play)
  // state = game.nextState(state, play)
  // winner = game.winner(state)
}

console.log("winner ",winner)