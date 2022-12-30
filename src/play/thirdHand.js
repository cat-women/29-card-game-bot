const {
  last,
  getSuit,
  getSuitCards,
  sortCard,
  getFace,
  cardsNotPlayed,
  currentWinning,
  getRemainingCards,
  isHigherCard,
  secondLast
} = require('../shared')

const { getFinalRemainingCards } = require('./common')
const iRevealTrump = require('./iRevealTrump')
const { setPlayedCards, nullify } = require('./common')

function thirdHand (
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

  const myTeam = payload.teams[0]
  const oppTeam = payload.teams[1]

  const ownIdIndex = playersIds.indexOf(ownId)
  const parterIndex = (ownIdIndex - 2 + 4) % 4
  console.log('ownIdIndex', ownIdIndex, 'part', parterIndex)
  const [winningCard, winner] = whoIsWinning(
    ownId,
    playersIds,
    playedCards,
    trumpSuit,
    trumpRevealed
  )
  console.log('in third hand winning card', winningCard, 'winner ', winner)

  let nonTrumpCards = ''

  if (trumpSuit) {
    const trumpSuitCards = getSuitCards(myCards, trumpSuit)
    nonTrumpCards = getRemainingCards(myCards, trumpSuitCards)
  }
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
      if (winner === parterIndex) {
        return last(sortedSuitCards)
      }
      if (getFace(last(sortedSuitCards)) === 'J') return last(sortedSuitCards)

      return sortedSuitCards[0]
    }

    const finalLeftCards = getFinalRemainingCards(
      playedSuit,
      sortedSuitCards,
      playedCards,
      handsHistory
    )
    console.log('finalLeftCards', finalLeftCards)

    // opponent is winning
    if (winner !== playersIds[parterIndex]) {
      // winner is not trump card  card
      if (trumpRevealed && getSuit(winningCard) !== trumpSuit) {
        // if my card is winnign
        if (isHigherCard(ownSuitCards, winningCard)) {
          // third player has same suit card in last move and remaining card is not zero
          if (
            getSuit(lastPlayerCard) === playedSuit &&
            finalLeftCards.length > 0
          ) {
            if (isHigherCard(sortedSuitCards, winningCard))
              return last(sortedSuitCards)
          }

          // no same suit card
          if (
            trumpRevealed &&
            getSuit(lastPlayerCard) !== playedSuit &&
            getSuit(lastPlayerCard) !== trumpSuit
          )
            return last(sortedSuitCards)
        }

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
    const myTrumpSuitCards = getSuitCards(ownCards, trumpSuit)
    const mySortedTrumpSuitCards = sortCard(myTrumpSuitCards)
    //i reveal trump case
    const wasTrumpRevealInThisRound =
      trumpRevealed.hand === handsHistory.length + 1
    const didIRevealTheTrump = trumpRevealed.playerId === ownId

    if (wasTrumpRevealInThisRound && didIRevealTheTrump) {
      return iRevealTrump(ownCards, playedCards, trumpSuit)
    }

    if (handsHistory.length === 0) {
      // if winner is my partner
      if (winner === parterIndex) return last(sortCard(nonTrumpCards))
      // opponent winning and i have higer card
      if (myTrumpSuitCards.length > 0) {
      }
      if (getSuit(winningCard) === playedSuit)
        return last(mySortedTrumpSuitCards)
      console.log(mySortedTrumpSuitCards, winningCard)
      if (isHigherCard(mySortedTrumpSuitCards, winningCard))
        return last(mySortedTrumpSuitCards)

      return sortCard(nonTrumpCards)[0]
    }

    let finalLeftCards = getFinalRemainingCards(
      playedSuit,
      myCards,
      playedCards,
      handsHistory
    )

    const totalRemaingCards = cardsNotPlayed(playedSuit, handsHistory)

    // opponent winning
    if (myTrumpSuitCards.length > 0) {
      let finalLeftTrumpCards = getFinalRemainingCards(
        trumpSuit,
        myTrumpSuitCards,
        playedCards,
        handsHistory
      )
      let finalLeftCards = getFinalRemainingCards(
        playedSuit,
        [],
        playedCards,
        handsHistory
      )
      // opponent is winning
      if (winner !== parterIndex) {
        // winning card is trump card // i have higher trump suit card

        if (getSuit(winningCard) === trumpSuit) {
          if (isHigherCard(mySortedTrumpSuitCards, winningCard)) {
            // my trump card is the wining card
            if (finalLeftTrumpCards.length === 0)
              return last(mySortedTrumpSuitCards)

            if (
              !isHigherCard(finalLeftTrumpCards, last(mySortedTrumpSuitCards))
            )
              return last(mySortedTrumpSuitCards)
          }
        }

        // my trump card is the wining card
        if (finalLeftTrumpCards.length === 0)
          return last(mySortedTrumpSuitCards)

        console.log('finalLeftTrumpCards', finalLeftTrumpCards)

        if (!isHigherCard(finalLeftTrumpCards, last(mySortedTrumpSuitCards))) {
          if (mySortedTrumpSuitCards.length > 1) {
            let first = last(mySortedTrumpSuitCards)
            let second = secondLast(mySortedTrumpSuitCards)

            if (getFace(first) === 'J' && getFace(second) === '9') return second
          }
          /***
           * check last payers has trump card or not
           *
           *
           *
           *
           *
           *
           *
           */
          return last(mySortedTrumpSuitCards)
        }

        if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]

        return mySortedCards[0]
      }

      // partner winning

      // last have same suit card
      if (finalLeftCards.length > 0) {
        // partner card is  winning

        console.log('finalLeftCards', finalLeftCards, winningCard)
        if (!isHigherCard(finalLeftCards, winningCard)) {
          //no trum left
          if (finalLeftTrumpCards.length === 0) {
            if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
            return last(mySortedCards)
          }

          if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))

          // check if last players  has trump card
          return mySortedCards[0]
        }

        /**
         * check if i can win in next tourn tooo
         *
         *
         *
         *
         *
         *
         *
         */
        // check if i have winnign trump card

        if (finalLeftTrumpCards.length === 0) {
          if (mySortedTrumpSuitCards.length > 1)
            return secondLast(mySortedTrumpSuitCards)
          return last(mySortedTrumpSuitCards)
        }
        if (finalLeftTrumpCards.length > 0) {
          if (!isHigherCard(finalLeftTrumpCards, last(mySortedTrumpSuitCards)))
            return last(mySortedTrumpSuitCards)
        }

        // partner not wining case
        return mySortedCards[0]
      }
      if (
        finalLeftTrumpCards.length > 0 &&
        isHigherCard(
          mySortedTrumpSuitCards,
          last(sortCard(finalLeftTrumpCards))
        )
      )
        return last(mySortedTrumpSuitCards)

      // partner dont have same suti card and trumo suit card

      if (
        getSuit(lastPlayerCard) !== playedSuit &&
        getSuit(lastPlayerCard) !== trumpSuit
      ) {
        if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
      }
      if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]
    }
    if (winner === parterIndex && nonTrumpCards.length > 0)
      return last(sortCard(nonTrumpCards))
    return mySortedCards[0]
  }

  if (winner === parterIndex) return mySortedCards[0]

  if (nullify(myTeam, oppTeam, handsHistory)) return mySortedCards[0]

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
  const ownIdIndex = playersIds.indexOf(ownId)
  let lastPlayerIndex = (ownIdIndex + 1 + 4) % 4

  let lastPlayerCard = ''

  for (let i = 0; i < playersCards.get('firstCard').length; i++) {
    if (playersCards.get('firstCard')[i][1] === playedSuit) {
      lastPlayerCard = playersCards.get(playersIds[lastPlayerIndex])[i]
    }
  }

  return lastPlayerCard
}

//why not working 
// changes this function

//why not working 
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
