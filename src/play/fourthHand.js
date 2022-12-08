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

function fourthHand (ownId,ownCards,playedCards,trumpSuit,trumpRevealed,handsHistory,playersIds) {
  
  // const ownId = payload.playerId
  // const ownCards = payload.cards 

  const myCards = ownCards.slice()

  // const playedCards = payload.played
  const playedSuit = getSuit(playedCards[0])
console.log("played suit ",playedSuit)
  const mySortedCards = sortCard(ownCards)
  const ownSuitCards = getSuitCards(ownCards, playedSuit)

  const orinalPlayedCards = playedCards.slice()
  const sortedPlayedCards = sortCard(playedCards)

  // const trumpSuit = payload.trumpSuit
  // const trumpRevealed = payload.trumpRevealed

  // const handsHistory = payload.handsHistory
  // const playersIds = payload.playerIds

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
    if (winner !== playersIds[2]) {
      if (trumpRevealed && getSuit(winningCard) === trumpSuit) {

        return sortedSuitCards[0]
      }

      if (!isHigherCard(last(sortedSuitCards), winningCard)){
        return sortedSuitCards[0]}
    }
    return last(sortedSuitCards)
  }

  // I dont have card from same suit
  if (trumpSuit && trumpRevealed) {
    const myTrumpSuitCards = getSuitCards(myCards, trumpSuit)
    const mySortedTrumpSuitCards = sortCard(myTrumpSuitCards)

    if (winner !== playersIds[2]) {
      // trumpCard played but i dont have
      if (getSuit(winningCard) === trumpSuit && myTrumpSuitCards.length === 0)
        return mySortedCards[0]

      if (
        getSuit(winningCard) === trumpSuit &&
        !isHigherCard(last(sortCard(myTrumpSuitCards)), winningCard)
      )
        return mySortedCards[0]

      //trump card not played but i have lower value card
      if (!isHigherCard(last(mySortedCards), winningCard))
        return mySortedCards[0]
      return last(mySortedCards)
    }

    // protect trump card
    return last(mySortedCards)
  }
  if (winner === playersIds) return last(mySortedCards)

  //i reveal trump case
  const wasTrumpRevealInThisRound =
    trumpRevealed.hand === handsHistory.length + 1
  const didIRevealTheTrump = trumpRevealed.playerId === ownId

  if (wasTrumpRevealInThisRound && didIRevealTheTrump)
    return iRevealTrump(myCards, playedCards, trumpSuit)
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

module.exports = fourthHand
