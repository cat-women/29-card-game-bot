const Deck = require('./deck')
const State = require('./state')
const Game = require('./game')
const MCTS = require('./monteCarlo')
const util = require('util')

const myCards = ['7H', '8H', '7D', 'QD', '7S', 'TS', 'KS']
const handsHistory = [['Xnp5spLG', ['JH', 'KH', '9H', '1H'], 'Xnp5spLG']]
const deck = new Deck()
const currentPlayer = 'Xnp5spLG'
const playersIds = ['Bot 0', 'Xnp5spLG', 'Bot 1', 'pYQkwH0z']
// const played_cards = ['1S', '9S', '8S', 'TC']
const played_cards = []
const firstPlayer = 'Xnp5spLG'

const game = new Game()
const mcts = new MCTS(game)

const playable_deck = removeMyCards(handsHistory, myCards, played_cards)

const otherCards = new Map()
otherCards.set(currentPlayer, myCards)
// assign cards to other
const ids = playersIds.slice()
ids.splice(playersIds.indexOf(currentPlayer), 1)

let j = 3
ids.map((id, i) => {
  j = j - i
  otherCards.set(id, playable_deck.splice(0, playable_deck.length / j))
})

// const nextPlayer = game.nextPlayer(state)

// state = new State(
//   handsHistory,
//   otherCards.get(nextPlayer),
//   nextPlayer,
//   played_cards,
//   firstPlayer,
//   playersIds,
//   false,
//   [],
//   otherCards
// )

let state = new State(
  handsHistory,
  myCards,
  currentPlayer,
  played_cards,
  firstPlayer,
  playersIds,
  false,
  [],
  otherCards
)
let winner = game.winner(state)

while (winner === null) {
  console.log()
  console.log('player: ' + state.currentPlayer)

  let result = mcts.runSearch(state, 1)
  console.log('after runnnig mcts', result)
  let stats = mcts.getStats(state)
  console.log(
    'statistics ',
    util.inspect(stats, { showHidden: false, depth: null })
  )
  console.log(state)
  let play = mcts.bestPlay(state, 'robust')
  console.log(
    'chosen play: ' + util.inspect(play, { showHidden: false, depth: null })
  )

  state = game.nextState(state, play)
  winner = game.winner(state)
  console.log('final winner ', winner)
}

function removeMyCards (handsHistory, cards, played_cards) {
  for (let i = 0; i < handsHistory.length; i++) {
    handsHistory[i][1].map(card => {
      if (deck.playable_deck.includes(card)) {
        const index = deck.playable_deck.indexOf(card)
        deck.playable_deck.splice(index, 1)
      }
    })
  }

  played_cards.map(card => {
    if (deck.playable_deck.includes(card)) {
      const index = deck.playable_deck.indexOf(card)
      deck.playable_deck.splice(index, 1)
    }
  })
  cards.map(card => {
    if (deck.playable_deck.includes(card)) {
      const index = deck.playable_deck.indexOf(card)
      deck.playable_deck.splice(index, 1)
    }
  })
  return deck.playable_deck
}
