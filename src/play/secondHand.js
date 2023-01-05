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
  nullify,
  haveTrumpCard
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
  const oppoenent1Index = (ownIdIndex + 1 + 4) % 4
  const partnerIndex = (ownIdIndex + 2 + 4) % 4
  const oppoenent2Index = (ownIdIndex + 3 + 4) % 4

  const myTeam = payload.teams[0]
  const oppTeam = payload.teams[1]

  let finalLeftTrumpCards = ''
  let trumpSuitCards = ''

  if (trumpSuit) {
    trumpSuitCards = getSuitCards(ownCards, trumpSuit)
    finalLeftTrumpCards = getFinalRemainingCards(
      trumpSuit,
      trumpSuitCards,
      playedCards,
      handsHistory
    )
  }
  // all card with oppoenent
  let finalLeftCards = ''
  if (mySortedCards.length === 0)
    finalLeftCards = getFinalRemainingCards(
      playedSuit,
      [],
      playedCards,
      handsHistory
    )
  finalLeftCards = getFinalRemainingCards(
    playedSuit,
    mySortedCards,
    playedCards,
    handsHistory
  )

  let isTrumPartner
  let isTrumOpp1
  let isTrumOpp2

  if (trumpSuit && trumpRevealed && handsHistory.length >0) {
    isTrumPartner = haveTrumpCard(payload, partnerIndex, ownIdIndex)
    isTrumOpp1 = haveTrumpCard(payload, oppoenent1Index, oppoenent2Index)
    isTrumOpp2 = haveTrumpCard(payload, oppoenent2Index, oppoenent1Index)
  }

  // i have same suit card
  if (ownSuitCards.length > 0) {
    const sortedSuitCards = sortCard(ownSuitCards)

    // no winning card
    if (!isHigherCard(sortedSuitCards, playedSuit)) return sortedSuitCards[0]

    // there is higher card then i have
    //--> check if the secon opponent has same suti card
    if (
      finalLeftCards.length > 0 &&
      isHigherCard(finalLeftCards, last(sortedSuitCards))
    )
      return sortedSuitCards[0]

    if (
      finalLeftCards.length > 0 &&
      !isTrumOpp1 &&
      !isHigherCard(finalLeftCards, last(sortedSuitCards))
    )
      return last(sortedSuitCards)

    if (!isTrumOpp1) return last(sortedSuitCards)

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
    const sortedTrumpSuitCards = sortCard(trumpSuitCards)

    // non trump card
    const nonTrumpCards = getRemainingCards(myCards, trumpSuitCards)

    // i dont have trump suit card
    if (trumpSuitCards.length === 0) {
      // ---> guess if my partner has trump card ---->

      if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]
      return mySortedCards[0]
    }

    // opponent have same suit card ---->
    // dont have trump suit card

    if (!isTrumOpp1) return last(sortedTrumpSuitCards)

    // no trump card left
    if (finalLeftTrumpCards.length === 0) return sortedTrumpSuitCards[0]

    // if last players has trump suit card
    if (isTrumOpp1) {
      // im have higher card throw higher trump card
      if (!isHigherCard(finalLeftTrumpCards, last(sortedTrumpSuitCards)))
        return last(sortedTrumpSuitCards)
      if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]
    }
    return mySortedCards[0]
  }

  if (nullify(myTeam, oppTeam, handsHistory)) return mySortedCards[0]

  return 0
}

module.exports = secondHand
