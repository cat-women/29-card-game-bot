const {
  last,
  getSuit,
  getSuitCards,
  sortCard,
  cardsNotPlayed,
  currentWinning,
  getRemainingCards,
  isHigherCard
} = require('../shared')

const {
  remainingPlayerHistory,
  getSecondPlayerCard,
  getThirdPlayerCard,
  getFirstPlayerIndex,
  getFinalRemainingCards
} = require('./common.js')

const iRevealTrump = require('./iRevealTrump')

function secondHand (
  ownId,
  ownCards,
  playedCards,
  trumpSuit,
  trumpRevealed,
  handsHistory,
  playersIds
) {
  const myCards = ownCards.slice()
  const playedSuit = getSuit(playedCards[0])
  const mySortedCards = sortCard(ownCards)

  const ownSuitCards = getSuitCards(ownCards, playedSuit)

  const ownIdIndex = playersIds.indexOf(ownId)
  const parterIndex = (ownIdIndex - 2 + 4) % 4
  if (ownCards.length === 1) return ownCards[0]
  console.log('first card ', playedSuit)
  let finalLeftTrumpCards

  if (trumpRevealed && trumpSuit) {
    finalLeftTrumpCards = getFinalRemainingCards(
      trumpSuit,
      myCards,
      playedCards,
      handsHistory
    )
    console.log('finalLeftTrumpCards', finalLeftTrumpCards)
  }

  // all card with oppoenent
  const finalLeftCards = getFinalRemainingCards(
    playedSuit,
    myCards,
    playedCards,
    handsHistory
  )
  console.log('finalLeftCards', finalLeftCards)

  // i have same suit card
  if (ownSuitCards.length > 0) {
    const sortedSuitCards = sortCard(ownSuitCards)

    // no winning card
    if (!isHigherCard(sortedSuitCards, playedSuit)) return sortedSuitCards[0]

    const { partnerPrevCard, oppPrevCard } = remainingPlayerHistory(
      ownId,
      playersIds,
      playedSuit,
      handsHistory
    )
    console.log('partnerPrevCard', partnerPrevCard, 'oppPrevCard', oppPrevCard)
    // card left from same suit
    if (
      finalLeftCards.length > 0 &&
      (partnerPrevCard === playedSuit || oppPrevCard === playedSuit)
    ) {
      // might have higher value card
      if (
        !currentWinning(
          finalLeftCards,
          getSuit(last(sortedSuitCards)),
          handsHistory
        )
      )
        return last(sortedSuitCards)
      else return sortedSuitCards[0]
    }

    // no trump card left
    if (
      trumpRevealed &&
      finalLeftTrumpCards.length === 0 &&
      getSuit(partnerPrevCard) === trumpSuit &&
      getSuit(oppPrevCard) === trumpSuit
    )
      return last(sortedSuitCards)

    if (currentWinning(sortedSuitCards, playedSuit, handsHistory))
      return last(sortedSuitCards)

    return sortedSuitCards[0]
  }

  // I dont have card from same suit
  if (trumpSuit && trumpRevealed) {
    const myTrumpSuitCards = getSuitCards(myCards, trumpSuit)
    const mySortedTrumpSuitCards = sortCard(myTrumpSuitCards)

    // non trump card
    const nonTrumpCards = getRemainingCards(myCards, myTrumpSuitCards)

    if (myTrumpSuitCards.length === 0) return mySortedCards[0]

    const { partnerPrevCard, oppPrevCard } = remainingPlayerHistory(
      ownId,
      playersIds,
      playedSuit,
      handsHistory
    )
    console.log('playersIds', playersIds)
    console.log('partnerPrevCard', partnerPrevCard, 'oppPrevCard', oppPrevCard)

    // other two player have same suit cards ?
    // yes
    if (
      finalLeftCards.length > 0 &&
      (getSuit(partnerPrevCard) === playedSuit ||
        getSuit(oppPrevCard) === playedSuit)
    )
      return last(mySortedTrumpSuitCards)

    // Trump card left ?
    // yes
    if (
      finalLeftTrumpCards.length > 0 &&
      (getSuit(partnerPrevCard) === trumpSuit ||
        getSuit(oppPrevCard) === trumpSuit)
    ) {
      console.log(
        'other two plyer dont have same suit card but have trump cards '
      )
      // im have higher card throw higher trump card
      if (
        !currentWinning(
          finalLeftTrumpCards,
          getSuit(last(mySortedTrumpSuitCards)),
          handsHistory
        )
      )
        return last(mySortedTrumpSuitCards)
      else return sortCard(nonTrumpCards)[0]
    }
    // no trump card left
    if (finalLeftTrumpCards.length === 0) return mySortedTrumpSuitCards[0]

    //i reveal trump case
    const wasTrumpRevealInThisRound =
      trumpRevealed.hand === handsHistory.length + 1
    const didIRevealTheTrump = trumpRevealed.playerId === ownId

    if (wasTrumpRevealInThisRound && didIRevealTheTrump) {
      const temp = iRevealTrump(ownCards, playedCards, trumpSuit)
      console.log('i reveal trump ', temp)
      return temp
    }
    return mySortedCards[0]
  }

  return 0
}

module.exports = secondHand
