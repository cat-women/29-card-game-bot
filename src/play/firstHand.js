const {
  last,
  getSuit,
  getSuitCards,
  sortCard,
  cardsNotPlayed,
  currentWinning,
  getRemainingCards
} = require('../shared')


function firstHand (myCards, trumpSuit, trumpRevealed, handsHistory) {
  const myOrginalCards = myCards.slice()
  const mySortedCards = sortCard(myCards)
  console.log("my sorted cards",mySortedCards)

  if (mySortedCards.length === 1) {
    return mySortedCards[0]
}
  if (trumpSuit && trumpRevealed) {
    const trumpSuitCards = getSuitCards(myCards, trumpSuit)

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
        while (mySortedCards.length === 1) {
          let highestCard = mySortedCards.splice(myCards.length - 1, 1)
          console.log('all trump played ', mySortedCards, highestCard)
          if (
            currentWinning(mySortedCards, getSuit(highestCard[0]), handsHistory)
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
    console.log("Trump suit and Trump Not Revealed")
    const trumpSuitCards = getSuitCards(myCards, trumpSuit)
    const nonTrumpCards = getRemainingCards(myCards, trumpSuitCards)
    
    if (nonTrumpCards.length === 1) {
      console.log("SOMETHING WAS RETURNED")
      return last(nonTrumpCards)
    }

    if (nonTrumpCards.length >= 2) {
      while (nonTrumpCards.length === 1) {
        let highestCard = nonTrumpCards.splice(nonTrumpCards.length - 1, 1)
        console.log("highestCard", highestCard)
        console.log('non trump card', nonTrumpCards, highestCard)

        if (currentWinning(nonTrumpCards, getSuit(highestCard[0]), handsHistory))
          return last(nonTrumpCards)
      }
    }
    console.log("HERE nothing is returned")
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
