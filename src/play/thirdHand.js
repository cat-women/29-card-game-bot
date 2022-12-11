const {
  last,
  secondLast,
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

const card = require('../card.js')

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
  const sortedSuitCards = sortCard(ownSuitCards)

  const orinalPlayedCards = playedCards.slice()
  const sortedPlayedCards = sortCard(playedCards)
  const ownIdIndex = playersIds.indexOf(ownId)
  const parterIndex = (ownIdIndex - 2 + 4) % 4
  const [winningCard, winner] = whoIsWinning(
    ownId,
    playersIds,
    playedCards,
    trumpSuit,
    trumpRevealed
  )

  if (handsHistory.length === 0) {
    if (winner === playersIds[parterIndex]) return last(sortedSuitCards)
    return sortedSuitCards[0]
  }
  const lastPlayerCardHistory = whatIsLastPlayerCard(
    handsHistory,
    playedSuit,
    playersIds
  )
  // i have same suit card
  if (ownSuitCards.length > 0) {
    // cards not played in total
    const totalRemaingCards = cardsNotPlayed(playedSuit, handsHistory)
    // card to be played
    const remaingCards = getRemainingCards(
      totalRemaingCards,
      getSuitCards(playedCards, playedSuit)
    )

    // all card with oppoenent
    const finalLeftCards = getRemainingCards(remaingCards, ownSuitCards)

    // opponent is winning
    if (winner !== playersIds[parterIndex]) {
      // winner is trump card
      if (trumpRevealed && getSuit(winningCard) === trumpSuit) {
        return sortedSuitCards[0]
      }

      // opponent dont have same suit card and trump card
      if (finalLeftCards.length === 0 && lastPlayerCardHistory !== trumpSuit) {
        if (isHigherCard(sortedSuitCards, winningCard))
          return last(sortedSuitCards)
        return sortedSuitCards[0]
      }

      // there is possible that oppp have card from same suit
      if (getSuit(lastPlayerCardHistory) === playedSuit) {
        //  have winning card
        if (currentWinning(myCards, playedSuit, handsHistory))
          return last(sortedSuitCards)

        return sortedSuitCards[0]
      }

      // dont have card from same suit but have trump suit
      if (getSuit(lastPlayerCardHistory) === trumpSuit)
        return sortedSuitCards[0]

      // no trump suit and same suit card
      if (!isHigherCard(sortedSuitCards, winningCard)) return sortedSuitCards[0]

      return last(sortedSuitCards)
    }

    /**
     * partner is winning
     */
    // partner sure to win
    if (
      trumpRevealed &&
      getSuit(winningCard) === trumpSuit &&
      getFace(winningCard) === 'J'
    )
      return last(sortedSuitCards)

    if (
      trumpRevealed &&
      getSuit(winningCard) === trumpSuit &&
      getSuit(lastPlayerCardHistory) === trumpSuit
    ) {
      // winner is  the highest cards
      if (currentWinning(finalLeftCards, winningCard, handsHistory))
        return sortedSuitCards[0]
      return last(sortedSuitCards)
    }
    //  might have same suit card
    const trumpCardsNotPlayed = cardsNotPlayed(trumpSuit, handsHistory)
    if (finalLeftCards.length === 0 && trumpCardsNotPlayed.length === 0)
      return last(sortedSuitCards)
    return sortedSuitCards[0]
  }

  // I dont have card from same suit
  if (trumpSuit && trumpRevealed) {
    const myTrumpSuitCards = getSuitCards(myCards, trumpSuit)
    const mySortedTrumpSuitCards = sortCard(myTrumpSuitCards)

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

    if (winner !== playersIds[parterIndex]) {
      if (myTrumpSuitCards.length === 0) return mySortedCards[0]

      // winning card is trump card // i have higher trump suit card
      if (
        getSuit(winningCard) === trumpSuit &&
        currentWinning(myCards, trumpSuit, handsHistory)
      )
        return last(mySortedTrumpSuitCards)
      // if only i have trump cards
      if (finalLeftTrumpCards.length === 0) return mySortedTrumpSuitCards[0]

      if (
        isHigherCard(
          last(mySortedTrumpSuitCards),
          last(sortCard(finalLeftTrumpCards))
        )
      )
        return last(mySortedTrumpSuitCards)
      return mySortedCards[0]

      if (isHigherCard(last(mySortedCards), winningCard))
        return last(mySortedCards)
      return mySortedCards[0]
    }
    // partner is winning and its trump suit
    if (myTrumpSuitCards.length === 0 && finalLeftTrumpCards.length === 0)
      return last(mySortedCards)

    if (winningCard === trumpSuit) {
      if (finalLeftTrumpCards.length === 0) return last(mySortedCards)
      if (currentWinning(mySortedTrumpSuitCards, trumpSuit, handsHistory))
        return last(mySortedTrumpSuitCards)
      return mySortedCards[0]
    }

    if (myTrumpSuitCards.length !== 0 && finalLeftTrumpCards.length !== 0) {
      if (currentWinning(mySortedTrumpSuitCards, trumpSuit, handsHistory))
        return last(mySortedTrumpSuitCards)

      return mySortedCards[0]
    }

    //i reveal trump case
    const wasTrumpRevealInThisRound =
      trumpRevealed.hand === handsHistory.length + 1
    const didIRevealTheTrump = trumpRevealed.playerId === ownId

    if (wasTrumpRevealInThisRound && didIRevealTheTrump)
      return iRevealTrump(myCards, playedCards, trumpSuit)

    return mySortedCards[0]
  }

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

  const partnerPos = (playedCards.length - 2 + 4) % 4
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
