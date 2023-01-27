class State {
  constructor (
    handsHistory,
    myCards,
    deck,
    currentPlayer,
    played_cards,
    playersIds,
    firstPlayer,
    trumpSuit
  ) {
    this.firstPlayer = firstPlayer
    this.playersIds = playersIds.slice()
    this.currentPlayer = currentPlayer
    this.played_cards = played_cards
    this.handsHistory = handsHistory
    this.myCards = myCards
    this.deck = deck
    this.trumpSuit = trumpSuit
    this.playable_deck = this.removeMyCards(this.myCards)

    this.otherCards = new Map()

    // assign car to other
    playersIds.splice(playersIds.indexOf(currentPlayer), 1)


    let j = 3
    playersIds.map((id, i) => {
      j = j - i
      this.otherCards.set(
        id,
        this.playable_deck.splice(0, this.cardLength(this.playable_deck) / j)
      )
    })

  }

  cardLength (card) {
    return card.length
  }

  removeMyCards (myCards) {
    for (let i = 0; i < this.handsHistory.length; i++) {
      this.handsHistory[i][1].map(card => {
        if (this.deck.playable_deck.includes(card)) {
          const index = this.deck.playable_deck.indexOf(card)
          this.deck.playable_deck.splice(index, 1)
        }
      })
    }

    myCards.map(card => {
      if (this.deck.playable_deck.includes(card)) {
        const index = this.deck.playable_deck.indexOf(card)
        this.deck.playable_deck.splice(index, 1)
      }
    })
    return this.deck.playable_deck
  }
  isPlayer(player) {
    return (player === this.player)
  }
  // 
  hash() {
    return JSON.stringify(this.handsHistory)
  }
}

module.exports = State
