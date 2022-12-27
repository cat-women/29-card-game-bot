const {
  last,
  getSuit,
  getFace,
  getSuitCards,
  sortCard,
  cardsNotPlayed,
  currentWinning,
  getRemainingCards,
  isHigherCard
} = require('../shared')
/**
 * need to do a lot of works 
 * 
 */
function firstHand (myCards, trumpSuit, trumpRevealed, handsHistory) {
  const mySortedCards = sortCard(myCards)

  if (mySortedCards.length === 1) {
    return mySortedCards[0]
  }

  let trumpSuitCards = ''
  let nonTrumpCards = ''

  if (trumpSuit) {
    // check if other highesr card is played or not
    var myfirstCard = last(mySortedCards)
    if (getFace(myfirstCard) === 'J' && getSuit(myfirstCard) === trumpSuit) {
      return myfirstCard
    }
    trumpSuitCards = getSuitCards(myCards, trumpSuit)
    if (trumpSuitCards.length > 0)
      nonTrumpCards = getRemainingCards(myCards, trumpSuitCards)
  }

  if (trumpSuit && trumpRevealed) {
    const trumpRemaining = cardsNotPlayed(trumpSuit, handsHistory)
    // no trump suit card
    if (trumpSuitCards.length === 0) {
      // check other have trump suit

      // all trump are played
      if (trumpRemaining.length === 0) {
        // check which one is higher card
        const mySortedCardsOriginal = mySortedCards.slice()

        while (mySortedCards.length > 1) {
          let highestCard = last(mySortedCards)

          let suitCardNotPlayed = cardsNotPlayed(
            getSuit(highestCard),
            handsHistory
          )
          if (suitCardNotPlayed.length === 0) return highestCard

          let finalLeftCards = getRemainingCards(
            suitCardNotPlayed,
            mySortedCards
          )

          highestCard = mySortedCards.splice(myCards.length - 1, 1)

          if (
            finalLeftCards.length > 0 &&
            !isHigherCard(finalLeftCards, highestCard[0])
          ) {
            return highestCard[0]
          }
        }
        return mySortedCardsOriginal[0]
        // check who has trump card
      }

      return mySortedCards[0]
    }
    const sortedTrumpSuitCards = sortCard(trumpSuitCards)

    var finaLeftTrumpCards = getRemainingCards(trumpRemaining, trumpSuitCards)
    console.log('finaLeftTrumpCards', finaLeftTrumpCards, sortedTrumpSuitCards)
    /**
     * there is still trump card
     * check if i have winnign trump card
     */

    if (finaLeftTrumpCards.length > 0) {
      if (!isHigherCard(finaLeftTrumpCards, last(sortedTrumpSuitCards))) {
        return last(sortedTrumpSuitCards)
      } else return mySortedCards[0]
    }
    return last(sortedTrumpSuitCards)
  }

  //only non trump card
  if (nonTrumpCards.length === 1) return last(nonTrumpCards)

  if (nonTrumpCards.length > 0) {
    let nonTrump = nonTrumpCards.slice()
    let sNonTrump = sortCard(nonTrump)

    if (sNonTrump.length > 1) {
      while (sNonTrump.length > 1) {
        let highestValueCards = last(sNonTrump)

        let notPlayedCards = cardsNotPlayed(
          getSuit(highestValueCards),
          handsHistory
        )

        let highestSuitCards = getSuitCards(myCards, getSuit(highestValueCards))
        // all not played cards - mycards
        let finalLeftCards = getRemainingCards(notPlayedCards, highestSuitCards)

        if (finalLeftCards.length === 0) return highestValueCards

        highestValueCards = sNonTrump.splice(sNonTrump.length - 1, 1)

        if (!isHigherCard(finalLeftCards, highestValueCards[0], handsHistory)) {
          return highestValueCards[0]
        }
      }
    }
    return sNonTrump[0]
  }

  //trump not revealed
  // my first highest card is current winning card

  // if (currentWinning(mySortedCards, getSuit(last(mySortedCards)), handsHistory))
  // return last(mySortedCards)

  // check for second winning card

  const mySortedCardsOriginal = mySortedCards.slice()

  while (mySortedCards.length > 1) {
    
    let highestValueCards = last(mySortedCards)

    let notPlayedCards = cardsNotPlayed(
      getSuit(highestValueCards),
      handsHistory
    )

    let highestSuitCards = getSuitCards(myCards, getSuit(highestValueCards))

    let finalLeftCards = getRemainingCards(notPlayedCards, highestSuitCards)
    console.log("finalLeftCards",finalLeftCards)
    //if no other card left
    if (finalLeftCards.length === 0) return highestValueCards

    highestValueCards = mySortedCards.splice(myCards.length - 1, 1)

    if (!isHigherCard(finalLeftCards, highestValueCards[0])) {
      console.log(highestValueCards[0])
      return highestValueCards[0]
    }
  }

  return mySortedCardsOriginal[0]
}

module.exports = firstHand
