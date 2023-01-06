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

const {
  haveTrumpCard,
  getFinalRemainingCards,
  cardSuit,
  isZeroCard
} = require('./common')
/**
 * need to do a lot of works
 *
 */
function firstHand (myCards, trumpSuit, trumpRevealed, handsHistory, payload) {
  const ownCards = myCards.slice()
  const mySortedCards = sortCard(ownCards)

  const playerIds = payload.playerIds
  const ownId = payload.playerId

  const ownIdIndex = playerIds.indexOf(ownId)
  const oppoenent1Index = (ownIdIndex + 1 + 4) % 4
  const partnerIndex = (ownIdIndex + 2 + 4) % 4
  const oppoenent2Index = (ownIdIndex + 3 + 4) % 4

  const prevCard = false
  if (
    handsHistory.length > 0 &&
    handsHistory[handsHistory.length - 1][0] === ownId
  )
    handsHistory[handsHistory.length - 1][1][0]
  let trumpSuitCards = ''
  let nonTrumpCards = ''
  let sortedTrumpSuitCards = ''
  let suitNumber = cardSuit(ownCards)
  let temp = 0
  let suit = ''
  for (const key in suitNumber) {
    if (temp < suitNumber[key]) {
      temp = suitNumber[key]
      suit = key
    }
  }

  let suitCard = getSuitCards(ownCards, suit)
  let first = last(sortCard(suitCard))
  let second = ''

  if (trumpSuit) {
    trumpSuitCards = sortCard(getSuitCards(ownCards, trumpSuit))
    sortedTrumpSuitCards = sortCard(trumpSuitCards)

    if (trumpSuitCards.length > 0) {
      first = last(sortedTrumpSuitCards)
      nonTrumpCards = getRemainingCards(myCards, trumpSuitCards)
    }
  }

  if (handsHistory.length < 3 && getFace(first) === 'J') return first

  if (trumpSuit && trumpRevealed && handsHistory.length > 0) {
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
      // all trump are played or opponent dont have trump card
      if (finaLeftTrumpCards.length === 0) {
        // check which one is higher card

        const mySortedCardsOriginal = mySortedCards.slice()
        let temp = mySortedCards.slice()

        while (temp.length > 1) {
          let highestCard = last(temp)

          let suitCardNotPlayed = cardsNotPlayed(
            getSuit(highestCard),
            handsHistory
          )

          let finalLeftCards = getRemainingCards(suitCardNotPlayed, temp)
          if (finalLeftCards.length === 0) return highestCard

          if (!isHigherCard(finalLeftCards, highestCard[0])) {
            return highestCard
          }
          temp.splice(temp.length - 1, 1)
        }
        if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]
        return mySortedCardsOriginal[0]
        // check who has trump card
      }

      return mySortedCards[0]
    }

    if (finaLeftTrumpCards.length === 0) return last(sortedTrumpSuitCards)

    first = last(sortedTrumpSuitCards)
    second = ''
    if (sortedTrumpSuitCards.length > 1)
      second = secondLast(sortedTrumpSuitCards)

    if (finaLeftTrumpCards.length > 0) {
      if (!isHigherCard(finaLeftTrumpCards, first)) {
        if (second.length != 0 && !isHigherCard(finaLeftTrumpCards, second))
          return second

        return first
      }

      // Partner dont have trump card
      if (!isTrumOpp1 && !isTrumOpp2) {
        if (second.length != 0) return second
        return first
      }
    }

    if (nonTrumpCards.length > 0) {
      let lastCard = sortCard(nonTrumpCards)[0]

      if (isZeroCard(lastCard)) return lastCard
    }
    return mySortedCards[0]
  }

  if (
    trumpSuit &&
    trumpSuitCards.length > 0 &&
    isZeroCard(sortedTrumpSuitCards[0])
  )
    return sortedTrumpSuitCards[0]
  if (nonTrumpCards.length > 0) {
    let nonTrump = nonTrumpCards.slice()
    let sNonTrump = sortCard(nonTrump)
    if (sNonTrump.length > 1) {
      while (sNonTrump.length > 1) {
        let highestValueCards = last(sNonTrump)
        if (
          prevCard &&
          getSuit(prevCard) === getSuit(highestValueCards) &&
          trumpSuit &&
          !trumpRevealed
        ) {
          sNonTrump.splice(sNonTrump.length - 1, 1)
          continue
        }

        let notPlayedCards = cardsNotPlayed(
          getSuit(highestValueCards),
          handsHistory
        )
        let highestSuitCards = getSuitCards(myCards, getSuit(highestValueCards))
        // all not played cards - mycards
        let finalLeftCards = getRemainingCards(notPlayedCards, highestSuitCards)

        if (finalLeftCards.length === 0) return highestValueCards

        if (!isHigherCard(finalLeftCards, highestValueCards)) {
          return highestValueCards
        }

        sNonTrump.splice(sNonTrump.length - 1, 1)
      }
    }

    return sortCard(nonTrumpCards)[0]
  }
  // if first place is not jack throw lower card / that has highest number

  if (handsHistory.length <= 2) {
    // if i have trump suit throw one that you have leat card
    if (getFace(last(mySortedCards)) !== 'J') return last(mySortedCards)

    // // if i have jack check if you have send same suit card again
    // if (
    //   handsHistory.length > 0 &&
    //   handsHistory[handsHistory.length - 1][0] === ownId
    // ) {
    //   // if im the first player in prev game check my card suit
    //   let prevCard = handsHistory[handsHistory.length - 1][1][0]
    //   if (
    //     getSuit(prevCard) === getSuit(last(mySortedCards)) &&
    //     getFace(secondLast(mySortedCards)) === 'J'
    //   )
    //     return secondLast(mySortedCards)
    // }
    // return suitCard[0]
  }
  temp = mySortedCards.slice()

  while (temp.length > 1) {
    let highestValueCards = last(temp)
    if (
      prevCard &&
      getSuit(prevCard) === getSuit(highestValueCards) &&
      trumpSuit &&
      !trumpRevealed
    ) {
      sNonTrump.splice(sNonTrump.length - 1, 1)
      continue
    }
    let notPlayedCards = cardsNotPlayed(
      getSuit(highestValueCards),
      handsHistory
    )

    let highestSuitCards = getSuitCards(ownCards, getSuit(highestValueCards))

    let finalLeftCards = getRemainingCards(notPlayedCards, highestSuitCards)
    //if no other card left
    if (finalLeftCards.length === 0) return highestValueCards

    highestValueCards = temp.splice(temp.length - 1, 1)
    if (!isHigherCard(finalLeftCards, highestValueCards[0])) {
      return highestValueCards[0]
    }
  }
  return mySortedCards[0]
}

module.exports = firstHand
