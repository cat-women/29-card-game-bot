class State {
  constructor (
    handsHistory,
    currentPlayerCards,
    currentPlayer,
    played_cards = [],
    firstPlayer = false,
    playersIds,
    trumpSuit = false,
    bidHistory = [],
    remainingCards
  ) {
    this.firstPlayer = firstPlayer
    this.currentPlayer = currentPlayer
    this.played_cards = played_cards
    this.handsHistory = handsHistory
    this.currentPlayerCards = currentPlayerCards
    this.trumpSuit = trumpSuit
    this.bidHistory = bidHistory
    this.playersIds = playersIds
    this.remainingCards = remainingCards
  }

  cardLength (card) {
    return card.length
  }

  isPlayer (player) {
    return player === this.currentPlayer
  }
  //
  hash () {
    return JSON.stringify(this.handsHistory)
  }
}

module.exports = State
