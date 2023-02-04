/**
 * whos turn
 * winner
 * rules
 */
const {
  last,
  secondLast,
  getSuit,
  getFace,
  getSuitCards,
  sortCard,
  cardsNotPlayed,
  currentWinning,
  getRemainingCards,
  isHigherCard
} = require('../shared')
const State = require('./state')

class Game {
  nextPlayer (state) {
    const first_player_index = state.playersIds.indexOf(state.currentPlayer)
    return state.playersIds[(first_player_index + 1 + 4) % 4]
  }

  legalPlays (state) {
    let currentPlayer = state.currentPlayer
    let cards = state.currentPlayerCards
    let played_cards = state.played_cards.slice()

    if (played_cards.length === 4) return []

    if (played_cards.length === 0 && cards.length !== 0) return cards

    const suitCards = getSuitCards(cards, getSuit(played_cards[0]))
    if (suitCards.length > 0) return suitCards
    return cards
  }

  nextState (state, play) {
    let newHistory = state.handsHistory.slice() // 1-deep copy

    state.played_cards.push(play)

    let firstPlayer = state.firstPlayer

    let player = this.nextPlayer(state)

    // if (state.played_cards.length === 4) return null

    let cards = state.remainingCards.get(player)

    // let remainingCards = this.removePlayedCards(state, play)
    return new State(
      newHistory,
      cards,
      player,
      state.played_cards,
      firstPlayer,
      state.playersIds,
      state.trumpSuit,
      state.bidHistory,
      state.remainingCards
    )
  }

  winner (state) {
    let played_cards = state.played_cards.slice()

    if (state.played_cards.length >= 4) {
      let winingCard
      if (state.trumpSuit) {
        const trumpSuitCards = getSuitCards(played_cards, state.trumpSuit)
        if (trumpSuitCards.length > 0)
          winingCard = last(sortCard(trumpSuitCards))
        else {
          const suitCards = getSuitCards(played_cards, getSuit(played_cards[0]))
          winingCard = last(sortCard(suitCards))
        }
      } else {
        // const suitCards = getSuitCards(
        //   state.played_cards,
        //   getSuit(state.played_cards[0])
        // )
        winingCard = last(sortCard(state.played_cards.slice()))
      }
      const index_of_winningcard = state.played_cards.indexOf(winingCard)
      const first_player_index = state.playersIds.indexOf(state.firstPlayer)
      let winner =
        state.playersIds[(index_of_winningcard + first_player_index + 4) % 4]
      state.firstPlayer = winner
      state.currentPlayer = winner
      let newHistory = [state.firstPlayer, state.played_cards.slice(), winner]
      state.handsHistory.push(newHistory)
      state.played_cards = []

      return winner
    } else return null
  }

  removePlayedCards (state, card) {
    let cards = state.remainingCards.get(state.currentPlayer)

    if (cards.includes(card)) {
      let index = cards.indexOf(card)
      cards.splice(index, 1)
    }
    return state.remainingCards
  }
}
module.exports = Game
