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

const { haveTrumpCard, getFinalRemainingCards } = require('./common')
/**
 * need to do a lot of works
 *
 */
function firstHand (myCards, trumpSuit, trumpRevealed, handsHistory, payload) {
  const mySortedCards = sortCard(myCards)
  const ownCards = myCards.slice()
  const playerIds = payload.playerIds
  const ownId = payload.playerId

  const ownIdIndex = playerIds.indexOf(ownId)
  const oppoenent1Index = (ownIdIndex + 1 + 4) % 4
  const partnerIndex = (ownIdIndex + 2 + 4) % 4
  const oppoenent2Index = (ownIdIndex + 3 + 4) % 4

  if (mySortedCards.length === 1) {
    return mySortedCards[0]
  }

  let trumpSuitCards = ''
  let nonTrumpCards = ''

  let firstCard = last(mySortedCards)
  let secondCard = '6F'

  let firstSuitCard = getSuitCards(myCards, getSuit(firstCard))
  if (firstSuitCard.length > 0) {
    firstCard = last(sortCard(firstSuitCard))
    secondCard = secondLast(sortCard(firstSuitCard))
  }
  if (trumpSuit) {
    trumpSuitCards = sortCard(getSuitCards(myCards, trumpSuit))

    if (trumpSuitCards.length > 1) secondCard = secondLast(trumpSuitCards)

    if (trumpSuitCards.length > 0) {
      firstCard = last(trumpSuitCards)
      nonTrumpCards = getRemainingCards(ownCards, trumpSuitCards)
    }
  }
  if (
    getFace(firstCard) === 'J' &&
    getFace(secondCard) === '9' &&
    handsHistory.length < 3
  ) {
    return secondCard
  }

  if (handsHistory.length < 4 && getFace(firstCard) === 'J') return firstCard

  if (trumpSuit && trumpRevealed) {
    let isTrumPartner = haveTrumpCard(payload, partnerIndex, ownIdIndex)
    let isTrumOpp1 = haveTrumpCard(payload, oppoenent1Index, oppoenent2Index)
    let isTrumOpp2 = haveTrumpCard(payload, oppoenent2Index, oppoenent1Index)

    const finaLeftTrumpCards = getFinalRemainingCards(
      trumpSuit,
      myCards,
      [],
      handsHistory
    )
    // no trump suit card
    if (trumpSuitCards.length === 0) {
      // check other have trump suit

      // all trump are played or opponent dont have trump card
      if (finaLeftTrumpCards.length === 0) {
        // check which one is higher card

        const mySortedCardsOriginal = mySortedCards.slice()

        while (mySortedCards.length > 1) {
          let highestCard = last(mySortedCards)

          let suitCardNotPlayed = cardsNotPlayed(
            getSuit(highestCard),
            handsHistory
          )

          let finalLeftCards = getRemainingCards(
            suitCardNotPlayed,
            mySortedCards
          )
          if (finalLeftCards.length === 0) return highestCard

          highestCard = mySortedCards.splice(myCards.length - 1, 1)

          if (!isHigherCard(finalLeftCards, highestCard[0])) {
            return highestCard[0]
          }
        }
        return mySortedCardsOriginal[0]
        // check who has trump card
      }

      return mySortedCards[0]
    }

    const sortedTrumpSuitCards = sortCard(trumpSuitCards)

    if (finaLeftTrumpCards.length === 0) return last(sortedTrumpSuitCards)

    console.log('finaLeftTrumpCards', finaLeftTrumpCards)

    if (finaLeftTrumpCards.length > 0) {
      if (!isHigherCard(finaLeftTrumpCards, last(sortedTrumpSuitCards))) {
        return last(sortedTrumpSuitCards)
      }
      // both opponent might not have trump car
      if (isTrumOpp1 || isTrumOpp2) return mySortedCards[0]
    }
    if (nonTrumpCards.length > 0) return nonTrumpCards[0]
    return mySortedCards[0]
  }

  //only non trump card
  // if (nonTrumpCards.length === 1) return last(nonTrumpCards)

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

  const mySortedCardsOriginal = mySortedCards.slice()
console.log("mySortedCardsOriginal",mySortedCardsOriginal)
  while (mySortedCards.length > 1) {
    let highestValueCards = last(mySortedCards)

    let notPlayedCards = cardsNotPlayed(
      getSuit(highestValueCards),
      handsHistory
    )

    let highestSuitCards = getSuitCards(myCards, getSuit(highestValueCards))

    let finalLeftCards = getRemainingCards(notPlayedCards, highestSuitCards)
    //if no other card left
    if (finalLeftCards.length === 0) return highestValueCards

    highestValueCards = mySortedCards.splice(myCards.length - 1, 1)

    console.log("finalLeftCards",finalLeftCards,highestValueCards[0])

    if (!isHigherCard(finalLeftCards, highestValueCards[0])) {

      return highestValueCards[0]
    }
  }

  return mySortedCardsOriginal[0]
}

module.exports = firstHand
