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
  getFinalRemainingCards,
  nullify
} = require('./common.js')

const iRevealTrump = require('./iRevealTrump')

function secondHand (
  ownId,
  ownCards,
  playedCards,
  trumpSuit,
  trumpRevealed,
  handsHistory,
  playersIds,
  payload
) {
  const myCards = ownCards.slice()
  const playedSuit = getSuit(playedCards[0])
  const mySortedCards = sortCard(ownCards)

  const ownSuitCards = getSuitCards(ownCards, playedSuit)

  const ownIdIndex = playersIds.indexOf(ownId)
  const parterIndex = (ownIdIndex - 2 + 4) % 4

  const myTeam = payload.teams[0]
  const oppTeam = payload.teams[1]

  if (ownCards.length === 1) return ownCards[0]

  let finalLeftTrumpCards
  if (trumpRevealed && trumpSuit) {
    finalLeftTrumpCards = getFinalRemainingCards(
      trumpSuit,
      ownCards,
      playedCards,
      handsHistory
    )
  }

  // all card with oppoenent
  const finalLeftCards = getFinalRemainingCards(
    playedSuit,
    myCards,
    playedCards,
    handsHistory
  )

  // i have same suit card
  if (ownSuitCards.length > 0) {
    const sortedSuitCards = sortCard(ownSuitCards)

    // no winning card
    if (!isHigherCard(sortedSuitCards, playedCards[0]))
      return sortedSuitCards[0]

    let remaingSuitCards = remainingPlayerHistory(
      ownId,
      playersIds,
      playedSuit,
      handsHistory
    )
    let remaingTrumpCards = remainingPlayerHistory(
      ownId,
      playersIds,
      trumpSuit,
      handsHistory
    )
    console.log('finalLeftCards', finalLeftCards, sortedSuitCards)
    if (
      finalLeftCards.length > 0 &&
      isHigherCard(finalLeftCards, last(sortedSuitCards))
    )
      return sortedSuitCards[0]

    let partnerPrevCard =
      remaingSuitCards.partnerPrevCard === 0
        ? remaingTrumpCards.partnerPrevCard
        : remaingSuitCards.partnerPrevCard

    let oppPrevCard =
      remaingSuitCards.oppPrevCard === 0
        ? remaingTrumpCards.oppPrevCard
        : remaingSuitCards.oppPrevCard

    // if opponetent have same suit card, check if i have highercard
    console.log('partnerPrevCard', partnerPrevCard, 'oppPrevCard', oppPrevCard)
    if (
      finalLeftCards.length > 0 &&
      getSuit(oppPrevCard) === playedSuit &&
      !isHigherCard(finalLeftCards, last(sortedSuitCards))
    )
      return last(sortedSuitCards)

    if (
      getSuit(oppPrevCard) !== playedSuit &&
      getSuit(oppPrevCard) !== trumpSuit
    ) {
      return last(sortedSuitCards)
    }

    // if (currentWinning(sortedSuitCards, playedSuit, handsHistory))
    //   return last(sortedSuitCards)
    return sortedSuitCards[0]
  }

  // I dont have card from same suit
  if (trumpSuit && trumpRevealed) {
    //i reveal trump case
    const wasTrumpRevealInThisRound =
      trumpRevealed.hand === handsHistory.length + 1
    const didIRevealTheTrump = trumpRevealed.playerId === ownId

    if (wasTrumpRevealInThisRound && didIRevealTheTrump) {
      const temp = iRevealTrump(ownCards, playedCards, trumpSuit)
      console.log('i reveal trump ', temp)
      return temp
    }
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

    // other two player have same suit cards ?
    // yes
    if (
      finalLeftCards.length > 0 &&
      (getSuit(partnerPrevCard) === playedSuit ||
        getSuit(oppPrevCard) === playedSuit)
    )
      return last(mySortedTrumpSuitCards)

    if (
      finalLeftTrumpCards.length > 0 &&
      (getSuit(partnerPrevCard) === trumpSuit ||
        getSuit(oppPrevCard) === trumpSuit)
    ) {
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

    return mySortedCards[0]
  }

  if (nullify(myTeam, oppTeam, handsHistory)) return mySortedCards[0]

  return 0
}

module.exports = secondHand
