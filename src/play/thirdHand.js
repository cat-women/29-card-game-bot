const {
  last,
  getSuit,
  getSuitCards,
  sortCard,
  getFace,
  cardsNotPlayed,
  currentWinning,
  getRemainingCards,
  isHigherCard
} = require('../shared')

const iRevealTrump = require('./iRevealTrump')
const { setPlayedCards } = require('./common')

function thirdHand (
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
  const [winningCard, winner] = whoIsWinning(
    ownId,
    playersIds,
    playedCards,
    trumpSuit,
    trumpRevealed
  )
  console.log('in third hand winning card', winningCard, 'winner ', winner)

  let lastPlayerCard = ''
  if (handsHistory.length > 0)
    lastPlayerCard = thirdPlayerHistory(
      ownId,
      playersIds,
      playedSuit,
      handsHistory
    )

  // i have same suit card
  if (ownSuitCards.length > 0) {
    const sortedSuitCards = sortCard(ownSuitCards)

    // ***** work here
    if (handsHistory.length === 0) {
      if (winner === playersIds[parterIndex]) return last(sortedSuitCards)
      return sortedSuitCards[0]
    }

    // cards not played in total
    const totalRemaingCards = cardsNotPlayed(playedSuit, handsHistory)
    // card to be played
    const remaingCards = getRemainingCards(
      totalRemaingCards,
      getSuitCards(playedCards, playedSuit)
    )

    // all card with oppoenent
    const finalLeftCards = getRemainingCards(remaingCards, ownSuitCards)
    console.log('finalLeftCards', finalLeftCards)

    // opponent is winning
    if (winner !== playersIds[parterIndex]) {
      // winner is not trump card  card
      if (trumpRevealed && getSuit(winningCard) !== trumpSuit) {
        // third player has same suit card in last move and remaining card is not zero
        if (
          getSuit(lastPlayerCard) === playedSuit &&
          finalLeftCards.length > 0
        ) {
          if (currentWinning(sortedSuitCards, playedSuit, handsHistory))
            return last(sortedSuitCards)
        }
        // no same suit card
        if (
          trumpRevealed &&
          getSuit(lastPlayerCard) !== playedSuit &&
          getSuit(lastPlayerCard) !== trumpSuit
        )
          return last(sortedSuitCards)

        return sortedSuitCards[0]
      }

      return sortedSuitCards[0]
    }

    /**
     * partner is winning
     */
    // partner sure to win

    if (getSuit(lastPlayerCard) === playedSuit && finalLeftCards.length > 0) {
      if (currentWinning(sortedSuitCards, playedSuit, handsHistory))
        return last(sortedSuitCards)
    }

    // no same suit card
    if (
      trumpRevealed &&
      getSuit(lastPlayerCard) !== playedSuit &&
      getSuit(lastPlayerCard) !== trumpSuit
    )
      return last(sortedSuitCards)

    return sortedSuitCards[0]
  }

  // I dont have card from same suit
  if (trumpSuit && trumpRevealed) {
    //i reveal trump case
    const wasTrumpRevealInThisRound =
      trumpRevealed.hand === handsHistory.length + 1
    const didIRevealTheTrump = trumpRevealed.playerId === ownId

    if (wasTrumpRevealInThisRound && didIRevealTheTrump)
      return iRevealTrump(myCards, playedCards, trumpSuit)

    if (handsHistory.length === 0) {
      if (winner === playersIds[parterIndex]) return mySortedCards[0]
      return 0
    }
    // if partner thor jack throw zero card  ********** not sure here
    // if (
    //   trumpRevealed &&
    //   winner === playersIds[parterIndex] &&
    //   getFace(winningCard) === 'J'
    // ) {
    //   return mySortedCards[0]
    // }

    const myTrumpSuitCards = getSuitCards(myCards, trumpSuit)
    const mySortedTrumpSuitCards = sortCard(myTrumpSuitCards)

    // cards not played in total
    const totalRemaingCards = cardsNotPlayed(playedSuit, handsHistory)
    // card to be played
    const remaingCards = getRemainingCards(
      totalRemaingCards,
      getSuitCards(playedCards, playedSuit)
    )

    // all card with oppoenent
    const finalLeftCards = getRemainingCards(remaingCards, ownSuitCards)
    console.log('finalLeftCards', finalLeftCards)

    // opponent winning
    if (myTrumpSuitCards.length > 0) {
      // cards not played in total
      const trumpCardsNotPlayed = cardsNotPlayed(trumpSuit, handsHistory)
      // card to be played
      const remaingTrumpCards = getRemainingCards(
        trumpCardsNotPlayed,
        getSuitCards(playedCards, trumpSuit)
      )

      // all card with oppoenent
      const finalLeftTrumpCards = getRemainingCards(
        remaingTrumpCards,
        myTrumpSuitCards
      )

      console.log('finalLeftTrumpCards', finalLeftTrumpCards)

      // opponent is winning
      if (winner !== playersIds[parterIndex]) {
        // winning card is trump card // i have higher trump suit card

        if (getSuit(winningCard) === trumpSuit) {
          if (currentWinning(mySortedTrumpSuitCards, trumpSuit, handsHistory))
            return last(mySortedTrumpSuitCards)
        }

        if (getSuit(lastPlayerCard) === playedSuit && finalLeftCards.length > 0)
          return mySortedTrumpSuitCards[0]
        else {
          if (currentWinning(mySortedTrumpSuitCards, trumpSuit, handsHistory))
            return last(mySortedTrumpSuitCards)
        }
        return mySortedCards[0]
      }
      // partner winning

      // last have same suit card
      if (finalLeftCards.length > 0 && getSuit(lastPlayerCard) === playedSuit) {
        // partner card is  winning
        if (!isHigherCard(finalLeftCards, winningCard)) {
          const nonTrumpCards = getRemainingCards(
            mySortedCards,
            mySortedTrumpSuitCards
          )

          if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
          return mySortedCards[0]
        }
        return last(mySortedTrumpSuitCards)
      }

      if (
        getSuit(lastPlayerCard) !== playedSuit &&
        getSuit(lastPlayerCard) !== trumpSuit
      ) {
        const nonTrumpCards = getRemainingCards(
          mySortedCards,
          mySortedTrumpSuitCards
        )
        if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]
      }

      isHigherCard(mySortedTrumpSuitCards, last(sortCard(finalLeftTrumpCards)))
      return last(mySortedTrumpSuitCards)

      return mySortedCards[0]
    }
  }
  if (winner === playersIds[parterIndex]) return mySortedCards[0]
  return 0
}

function whoIsWinning (
  ownId,
  playersIds,
  playedCards,
  trumpSuit,
  trumpRevealed
) {
  const orginalPlayedCards = playedCards.slice()
  const sortedPlayedCards = sortCard(playedCards)

  const playerIndex = playersIds.indexOf(ownId)
  let winningCard = ''

  if (trumpSuit && trumpRevealed) {
    const trumpSuitCards = getSuitCards(playedCards, trumpSuit)

    // trump card not played
    if (trumpSuitCards.length > 0) {
      const sortedTrumpSuitCards = sortCard(trumpSuitCards)
      winningCard = last(sortedTrumpSuitCards)
    } else winningCard = last(sortedPlayedCards)
  } else winningCard = last(sortedPlayedCards)

  const winningCardIndex = orginalPlayedCards.indexOf(winningCard)
  const winnerIndex =
    (playerIndex + winningCardIndex + 4 - playedCards.length) % 4

  console.log('winnign card', winningCard, 'players', playersIds[winnerIndex])

  return [winningCard, winnerIndex]
}

function thirdPlayerHistory (ownId, playersIds, playedSuit, handsHistory) {
  const playersCards = setPlayedCards(playersIds, handsHistory)
  console.log(playersCards)
  const ownIdIndex = playersIds.indexOf(ownId)
  let lastPlayerIndex = (ownIdIndex + 1 + 4) % 4

  let lastPlayerCard = ''

  for (let i = 0; i < playersCards.get('firstCard').length; i++) {
    if (playersCards.get('firstCard')[i][1] === playedSuit) {
      lastPlayerCard = playersCards.get(playersIds[lastPlayerIndex])[i]
    }
  }

  console.log('third hand : last players card', lastPlayerCard)
  return lastPlayerCard
}
// changes this function
function whatIsLastPlayerCard (handsHistory, cardSuit, playersIds) {
  const history = handsHistory.filter(hand => getSuit(hand[1][0]) === cardSuit)

  if (history.length === 0) return 0
  const lastMove = history[history.length - 1]
  const cards = lastMove[1]

  console.log('third hand case ', lastMove, lastMove[0])

  const firstPlayerIndex = getFirstPlayerIndex(playersIds, lastMove)
  const lastPlayerIndex = (firstPlayerIndex + 1) % 4
  const lastPlayerCard = cards[lastPlayerIndex]
  return lastPlayerCard
}

function getFirstPlayerIndex (playersIds, history) {
  const firstPlayerIndex = playersIds.indexOf(history[0])
  return firstPlayerIndex
}

module.exports = thirdHand
