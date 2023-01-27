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

class Game {
  nextPlayer (state) {
    const first_player_index = state.playersIds.indexOf(state.firstPlayer)
    return (first_player_index + 1 + 4) % 4
  }

  legalPlays (state) {
    let currentPlayer = state.currentPlayer
    let cards = state.otherCards.get(state.firstPlayer)
    if (state.played_cards.length === 0) return cards

    const suitCards = getSuitCards(cards, getSuit(state.played_cards[0]))
    if (suitCards.length > 0) return suitCards
    else if (state.trumpSuit) {
      const trumpSuitCards = getSuitCards(cards, state.trumpSuit)
      return trumpSuitCards
    }
    return false
  }


  nextState(state, play) {
    let newHistory = state.handsHistory.slice() // 1-deep copy
    newHistory.push(play)
    let newBoard = state.board.map((row) => row.slice())
    newBoard[play.row][play.col] = state.player
    let newPlayer = -state.player

    return new State(newHistory, newBoard, newPlayer)
  }
  winner (state) {
    let played_cards = state.played_cards.slice()

    if (state.played_cards.length === 4) {
      let winingCard
      if (state.trumpSuit) {
        const trumpSuitCards = getSuitCards(state.played_cards, state.trumpSuit)
        if (trumpSuitCards.length > 0)
          winingCard = last(sortCard(trumpSuitCards))
        else {
          const suitCards = getSuitCards(
            state.played_cards,
            getSuit(state.played_cards[0])
          )
          winingCard = last(sortCard(suitCards))
        }
      } else {
        const suitCards = getSuitCards(
          state.played_cards,
          getSuit(state.played_cards[0])
        )
        winingCard = last(sortCard(suitCards))
      }
      const index_of_winningcard = played_cards.indexOf(winingCard)
      const first_player_index = state.playersIds.indexOf(state.firstPlayer)

      return state.playersIds[
        (index_of_winningcard + first_player_index + 4) % 4
      ]
    } else return null
  }
}

module.exports = Game
