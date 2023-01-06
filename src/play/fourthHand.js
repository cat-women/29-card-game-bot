const {
  last,
  getSuit,
  getSuitCards,
  sortCard,
  getRemainingCards,
  isHigherCard,
  secondLast,
  getFace
} = require('../shared')

const { nullify, getFinalRemainingCards } = require('./common')
const iRevealTrump = require('./iRevealTrump')

const { card } = require('../card')

function fourthHand (
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
  const mySortedCards = sortCard(myCards)
  const ownSuitCards = getSuitCards(ownCards, playedSuit)

  const myTeam = payload.teams[0]
  const oppTeam = payload.teams[1]

  const ownIdIndex = playersIds.indexOf(ownId)

  const parterIndex = (ownIdIndex - 2 + 4) % 4

  let nonTrumpCards = ''
  if (trumpSuit) {
    const trumpSuitCards = getSuitCards(ownCards, trumpSuit)
    nonTrumpCards = getRemainingCards(ownCards, trumpSuitCards)
  }

  const [winningCard, winner] = whoIsWinning(
    ownId,
    playersIds,
    playedCards,
    trumpSuit,
    trumpRevealed
  )

  // i have same suit card
  if (ownSuitCards.length > 0) {
    const sortedSuitCards = sortCard(ownSuitCards)
    // opponent is winning
    if (winner !== parterIndex) {
      // opponent wining with played suit
      if (getSuit(winningCard) === playedSuit) {
        if (isHigherCard(sortedSuitCards, winningCard)) {
          if (ownSuitCards.length > 1) {
            let second = secondLast(sortedSuitCards)
            if (card[getFace(second)] > card[getFace(winningCard)])
              return second
          }

          return last(sortedSuitCards)
        }
      }
      // if trump suit was played
      if (trumpRevealed && getSuit(winningCard) === trumpSuit) {
        return sortedSuitCards[0]
      }

      // if i have i dont have wining card
      if (!isHigherCard(sortedSuitCards, winningCard)) {
        return sortedSuitCards[0]
      }

      return last(sortedSuitCards)
    }
    // work herer

    return last(sortedSuitCards)
  }

  // I dont have card from same suit
  if (trumpSuit && trumpRevealed) {
    const myTrumpSuitCards = getSuitCards(myCards, trumpSuit)
    const mySortedTrumpSuitCards = sortCard(myTrumpSuitCards)

    //i reveal trump case
    const wasTrumpRevealInThisRound =
      trumpRevealed.hand === handsHistory.length + 1
    const didIRevealTheTrump = trumpRevealed.playerId === ownId

    if (wasTrumpRevealInThisRound && didIRevealTheTrump)
      return iRevealTrump(myCards, playedCards, trumpSuit)

    if (myTrumpSuitCards.length > 0) {
      // opponent is winning

      if (winner !== parterIndex) {
        // winning card is trump card
        if (getSuit(winningCard) === trumpSuit) {
          if (isHigherCard(mySortedTrumpSuitCards, winningCard)) {
            if (mySortedTrumpSuitCards.length > 1) {
              let second = secondLast(mySortedTrumpSuitCards)
              if (card[getFace(second)] > card[getFace(winningCard)])
                return second
            }
            return last(mySortedTrumpSuitCards)
          }
          if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]
          return mySortedCards[0]
        }
        if (getSuit(winningCard) !== trumpSuit) return mySortedTrumpSuitCards[0]
      }

      const finalLeftTrumpCards = getFinalRemainingCards(
        trumpSuit,
        mySortedTrumpSuitCards,
        playedCards,
        handsHistory
      )
      // if im gonna win in next round and can win this round throw winning card
      var highestTrump = last(mySortedTrumpSuitCards)

      if (finalLeftTrumpCards.length > 0) {
        // I have higest trump card
        if (
          mySortedTrumpSuitCards.length > 1 &&
          !isHigherCard(finalLeftTrumpCards, highestTrump)
        ) {
          // partner winning with trump card
          if (getSuit(winningCard) === trumpSuit) {
            const temp = mySortedTrumpSuitCards.slice()

            let index = mySortedTrumpSuitCards.indexOf(highestTrump)

            temp.splice(index, 1)
            // my second card is higher then partner winning card
            if (isHigherCard(temp, winningCard)) return last(temp)

            if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))

            return last(mySortedCards)
          }
          //  my second trump card is winnign among all
          if (
            !isHigherCard(
              finalLeftTrumpCards,
              secondLast(mySortedTrumpSuitCards)
            )
          )
            return secondLast(mySortedTrumpSuitCards)
        }
      }
      if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
    }

    if (winner === parterIndex) {
      return last(mySortedCards)
    }
    return mySortedCards[0]
  }
  // if parner is winning dont reveal trump
  if (winner === parterIndex) {
    if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
    return last(mySortedCards)
  }

  if (nullify(myTeam, oppTeam, handsHistory)) return mySortedCards[0]
  if (handsHistory.length < 4 && myTeam.bid !== 0) return mySortedCards[0]

  return 0
}

// end of second funciton

function whoIsWinning (
  ownId,
  playersIds,
  playedCards,
  trumpSuit,
  trumpRevealed
) {
  const orginalPlayedCards = playedCards.slice()
  const playedSuitCards = getSuitCards(playedCards, getSuit(playedCards[0]))
  const sortedPlayedCards = sortCard(playedSuitCards)

  const partnerPos = (playedCards.length - 2 + 4) % 4
  const playerIndex = playersIds.indexOf(ownId)
  let winningCard = ''

  if (trumpSuit && trumpRevealed) {
    const trumpSuitCards = getSuitCards(playedCards, trumpSuit)

    // trump card played
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

module.exports = fourthHand
