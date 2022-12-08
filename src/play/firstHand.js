const {
  last,
  secondLast,
  getSuit,
  getSuitCards,
  sortCard,
  getFace,
  cardsNotPlayed,
  currentWinning,
  getRemainingCards
} = require('../shared')

const card = require('../card.js')

function firstHand (myCards, trumpSuit, trumpRevealed, handsHistory) {
  const myOrginalCards = myCards.slice()
  const mySortedCards = sortCard(myCards)

  if (mySortedCards.length === 1) return mySortedCards[0]

  if (trumpSuit && trumpRevealed) {
    trumpSuitCards = getSuitCards(myCards, trumpSuit)

    // no trump suit card
    if (trumpSuitCards.length === 0) {
      // check other have trump suit
      const trumpRemaining = cardsNotPlayed(trumpSuit, handsHistory)
      console.log('card not played ', trumpRemaining)

      // all trump are played
      if (trumpRemaining.length === 0) {
        // i have current winning card ?
        const myHighestValueCardSuit = getSuit(last(mySortedCards))

        if (
          currentWinning(mySortedCards, myHighestValueCardSuit, handsHistory)
        ) {
          console.log('I have currnt winning card')
          return last(mySortedCards)
        }
        // check for second winngin card
        const mySortedCardsOriginal = mySortedCards.slice()
        while (mySortedCards.length > 0) {
          let highestCard = mySortedCards.splice(myCards.length - 1, 1)

          if (
            currentWinning(mySortedCards, getSuit(highestCard), handsHistory)
          ) {
            console.log('the second card is winning ')
            return last(mySortedCards)
          }
        }

        return mySortedCards[0]
      }

      return mySortedCards[0]
    }

    const trumpRemaining = cardsNotPlayed(trumpSuit, handsHistory)
    const sortedTrumpSuitCards = sortCard(trumpSuitCards)

    /**
     * there is still trump card
     * check if i have winnign trump card
     */
    if (currentWinning(trumpSuitCards, trumpSuit, handsHistory)) {
      console.log('I have currnt winning trump card')
      return last(sortCard(trumpSuitCards))
    }
    return mySortedCards[0]
  }

  /**
   * if im the bidder protect trump
   */

  if (trumpSuit && !trumpRevealed) {
    const trumpSuitCards = getSuitCards(myCards, trumpSuit)
    const nonTrumpCards = getRemainingCards(myCards, trumpSuitCards)

    while (nonTrumpCards.length > 0) {
      let highestCard = nonTrumpCards.splice(nonTrumpCards.length - 1, 1)

      if (currentWinning(nonTrumpCards, getSuit(highestCard), handsHistory)) {
        return last(nonTrumpCards)
      }
    }
  }
  //trump not revealed
  // my first highest card is current winning card

  const myHighestValueCardSuit = getSuit(last(mySortedCards))
  if (currentWinning(mySortedCards, myHighestValueCardSuit, handsHistory))
    return last(mySortedCards)

  // check for second winning card
  const mySortedCardsOriginal = mySortedCards.slice()
  if (mySortedCards.length > 0) {
    mySortedCards.splice(myCards.length - 1, 1)
    if (currentWinning(mySortedCards, myHighestValueCardSuit, handsHistory))
      return last(mySortedCards)
  }

  // check for third winngin card'
  if (myOrginalCards.length > 0) {
    mySortedCards.splice(myCards.length - 1, 1)
    if (currentWinning(mySortedCards, myHighestValueCardSuit, handsHistory))
      return last(mySortedCards)
  }
  return mySortedCardsOriginal[0]
}

module.exports = firstHand
