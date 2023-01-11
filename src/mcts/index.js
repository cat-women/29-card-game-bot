const Deck = require('./deck')

const State = require('./state')

const Game = require('./game')

const myCards = ['7H', '8H', '7D', 'QD', '7S', 'TS', 'KS']
const handsHistory = [['Xnp5spLG', ['JH', 'KH', '9H', '1H'], 'Xnp5spLG']]
const deck = new Deck()
const currentPlayer = 'Xnp5spLG'
const playersIds = ['Bot 0', 'Xnp5spLG', 'Bot 1', 'pYQkwH0z']
// const played_cards = ['1S', '9S', '8S', 'TC']
const played_cards = ['1S']
const firstPlayer = 'pYQkwH0z'

const game = new Game()

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

const nextPlayer = playersIds[game.nextPlayer(state)]

// console.log(state.otherCards.get(nextPlayer))

console.log(game.legalMove(state))

// console.log(game.legalMove(state,state.nextPlayer,false))
