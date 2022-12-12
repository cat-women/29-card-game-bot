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
  console.log('winning card', winningCard, 'winner ', winner)

  // i have same suit card
  if (ownSuitCards.length > 0) {
    const sortedSuitCards = sortCard(ownSuitCards)

    // ***** work here
    if (handsHistory.length === 0) {
      if (winner === playersIds[parterIndex]) return last(sortedSuitCards)
      return sortedSuitCards[0]
    }

    const lastPlayerCardHistory = whatIsLastPlayerCard(
      handsHistory,
      playedSuit,
      playersIds
    )
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
          getSuit(lastPlayerCardHistory) === playedSuit &&
          finalLeftCards.length !== 0
        ) {
          if (currentWinning(sortedSuitCards, playedSuit, handsHistory))
            return last(sortedSuitCards)
        }
        // no same suit card
        if (
          trumpRevealed &&
          getSuit(lastPlayerCardHistory) !== playedSuit &&
          getSuit(lastPlayerCardHistory) !== trumpSuit
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

    if (
      getSuit(lastPlayerCardHistory) === playedSuit &&
      finalLeftCards.length !== 0
    ) {
      if (currentWinning(sortedSuitCards, playedSuit, handsHistory))
        return last(sortedSuitCards)
    }

    // no same suit card
    if (
      trumpRevealed &&
      getSuit(lastPlayerCardHistory) !== playedSuit &&
      getSuit(lastPlayerCardHistory) !== trumpSuit
    )
      return last(sortedSuitCards)

    return sortedSuitCards[0]
  }

  // I dont have card from same suit
  if (trumpSuit && trumpRevealed) {
    if (handsHistory.length === 0) {
      if (winner === playersIds[parterIndex]) return mySortedCards[0]
      return 0
    }
    if (
      trumpRevealed &&
      winner === playersIds[parterIndex] &&
      getFace(winningCard) === 'J'
    ) {
      return mySortedCards[0]
    }
    const myTrumpSuitCards = getSuitCards(myCards, trumpSuit)
    const mySortedTrumpSuitCards = sortCard(myTrumpSuitCards)

    const lastPlayerCardHistory = whatIsLastPlayerCard(
      handsHistory,
      playedSuit,
      playersIds
    )

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
    if (winner !== playersIds[parterIndex]) {
      console.log('oppoent  is winngng ')
      if (myTrumpSuitCards.length === 0) return mySortedCards[0]

      // winning card is trump card // i have higher trump suit card
      if (getSuit(winningCard) === trumpSuit) {
        if (currentWinning(mySortedTrumpSuitCards, trumpSuit, handsHistory))
          return last(mySortedTrumpSuitCards)
      }

      if (lastPlayerCardHistory === playedSuit && finalLeftCards.length !== 0)
        return mySortedTrumpSuitCards[0]
      else {
        if (currentWinning(mySortedTrumpSuitCards, trumpSuit, handsHistory))
          return last(mySortedTrumpSuitCards)
      }
      return mySortedCards[0]
    }
    // opponent have same suit card
    if (
      finalLeftCards.length > 0 &&
      getSuit(lastPlayerCardHistory) === playedSuit
    ) {
      if (!isHigherCard(finalLeftCards, winningCard)) {
        const nonTrumpCard = getRemainingCards(
          mySortedCards,
          mySortedTrumpSuitCards
        )
        return last(sortCard(nonTrumpCard))
      }

      if (mySortedTrumpSuitCards.length === 0) return mySortedCards[0]
      return mySortedTrumpSuitCards[0]
    }
    if (
      getSuit(lastPlayerCardHistory) !== playedSuit &&
      getSuit(lastPlayerCardHistory) !== trumpSuit
    ) {
      const nonTrumpCard = getRemainingCards(
        mySortedCards,
        mySortedTrumpSuitCards
      )
      return sortCard(nonTrumpCard)[0]
    }

    if (
      finalLeftTrumpCards.length > 0 &&
      isHigherCard(mySortedTrumpSuitCards, last(sortCard(finalLeftTrumpCards)))
    )
      return last(mySortedTrumpSuitCards)

    //i reveal trump case
    const wasTrumpRevealInThisRound =
      trumpRevealed.hand === handsHistory.length + 1
    const didIRevealTheTrump = trumpRevealed.playerId === ownId

    if (wasTrumpRevealInThisRound && didIRevealTheTrump)
      return iRevealTrump(myCards, playedCards, trumpSuit)

    return mySortedCards[0]
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

  return [winningCard, playersIds[winnerIndex]]
}

function whatIsLastPlayerCard (handsHistory, cardSuit, playersIds) {
  const history = handsHistory.filter(hand => getSuit(hand[1][0]) === cardSuit)

  if (history.length === 0) return 0
  const lastMove = history[history.length - 1]
  console.log(lastMove)
  const cards = lastMove[1]
  console.log(lastMove, lastMove[0])

  const firstPlayerIndex = getFirstPlayerIndex(playersIds, lastMove)
  const lastPlayerIndex = (firstPlayerIndex + 1) % 4
  const lastPlayerCard = cards[lastPlayerIndex]
  return lastPlayerCard
}

function getFirstPlayerIndex (playersIds, history) {
  const firstPlayerIndex = playersIds.indexOf(history[1])
  return firstPlayerIndex
}

module.exports = thirdHand

//  * if (ownIdIndex === 0) {
//     if (firstPlayerIndex === 0) lastPlayerCard = cards[cards.length - 3]
//     if (firstPlayerIndex === 2) lastPlayerCard = cards[cards.length - 1]
//     if (firstPlayerIndex === 3) lastPlayerCard = cards[cards.length - 2]
//   }
//   if (ownIdIndex === 1) {
//     if (firstPlayer === 2) lastPlayerCard = cards[cards.length - 3]
//     if (firstPlayer === 0) lastPlayerCard = cards[cards.length - 1]
//     if (firstPlayer === 1) lastPlayerCard = cards[cards.length - 2]
//   }

//   if (getSuit(lastPlayerCard) === cardSuit) return lastPlayerCard
// }
