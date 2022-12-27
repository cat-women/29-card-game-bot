const {
  last,
  getSuit,
  getSuitCards,
  sortCard,
  getRemainingCards,
  isHigherCard
} = require('../shared')

const iRevealTrump = require('./iRevealTrump')

function fourthHand (
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
      if (trumpRevealed && getSuit(winningCard) === trumpSuit) {
        return sortedSuitCards[0]
      }

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
      if (winner !== playersIds[parterIndex]) {
        // winning card is trump card
        if (getSuit(winningCard) === trumpSuit) {
          if (isHigherCard(mySortedTrumpSuitCards, winningCard))
            return last(mySortedTrumpSuitCards)
          else return sortCard(nonTrumpCards)[0]
        }
        if (getSuit(winningCard) !== trumpSuit) return mySortedTrumpSuitCards[0]
      }
      
      if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
    }
    if (winner === playersIds[parterIndex]) return last(mySortedCards)
    return mySortedCards[0]
  }
  // if parner is winning dont reveal trump
  if (winner === parterIndex) {
    if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
    else return last(mySortedCards)
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
