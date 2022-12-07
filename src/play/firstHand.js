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

  if(mySortedCards.length === 1) return mySortedCards[0]
  if (trumpSuit && trumpRevealed) {
    trumpSuitCards = getSuitCards(myCards, trumpSuit)

    // no trump suit card
    if (trumpSuitCards.length === 0) {
      // check other have trump suit
      const trumpRemaining = cardsNotPlayed(trumpSuit, handsHistory)

      // all trump are played
      if (trumpRemaining.length === 0) {
        // i have current winning card ?
        if (currentWinning(mySortedCards, trumpSuit, handsHistory))
          return last(mySortedCard)

        // check for second winngin card
        const mySortedCardsOriginal = mySortedCards.slice()

        if (mySortedCards.length > 0) {
          mySortedCards.splice(myCards.length - 1, 1)
          if (currentWinning(mySortedCards, trumpSuit, handsHistory))
            return last(mySortedCards)
        }
        if (mySortedCards.length > 0) {
          // check for third winngin card
          mySortedCards.splice(myCards.length - 1, 1)
          if (currentWinning(mySortedCards, trumpSuit, handsHistory))
            return last(mySortedCards)
          return mySortedCardsOriginal[0]
        }
        return mySortedCards[0]
      }
      return mySortedCards[0]
    }

    const trumpRemaining = cardsNotPlayed(trumpSuit, handsHistory)
    const sortedTrumpSuitCards = sortCard(trumpSuitCards)
    // i have trump suit
    // other also dont have trump card
    // if (trumpRemaining.length === 0) {
    //   // my first highest card is current winning card
    //   if (currentWinning(mySortedCards, trumpSuit, handsHistory))
    //     return last(mySortedCards)

    //   // check for second winngin card
    //   const mySortedCardsOriginal = mySortedCards.slice()
    //   mySortedCards.slice(myCards.length - 1, 1)
    //   if (currentWinning(mySortedCards, trumpSuit, handsHistory))
    //     return last(mySortedCards)

    //   //i dont have winnig trump card
    //   return last(trumpSuitCards)
    // }
    const opponentCards = getRemainingCards(trumpRemaining, trumpSuitCards)
    // opponent dont have trump card
    if (opponentCards.length === 0) {
      return last(sortedTrumpSuitCards)
    }
    if (
      card[getFace(last(sortCard(opponentCards)))] >
      card[getFace(last(sortCard(trumpSuitCards)))]
    )
      return mySortedCards[0]
    return last(sortCard(trumpSuitCards))
  }
  //trump not revealed
  // my first highest card is current winning card
  if (currentWinning(mySortedCards, getSuit(mySortedCards[0]), handsHistory))
    return last(mySortedCards)

  // check for second winning card
  const mySortedCardsOriginal = mySortedCards.slice()
  if (mySortedCards.length > 0) {
    mySortedCards.splice(myCards.length - 1, 1)
    if (currentWinning(mySortedCards, getSuit(mySortedCards[0]), handsHistory))
      return last(mySortedCards)
  }

  // check for third winngin card'
  if (myOrginalCards.length > 0) {
    mySortedCards.splice(myCards.length - 1, 1)
    if (currentWinning(mySortedCards, getSuit(mySortedCards[0]), handsHistory))
      return last(mySortedCards)
  }
  return mySortedCardsOriginal[0]
}

module.exports = firstHand
