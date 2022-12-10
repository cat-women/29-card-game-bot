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

  const orinalPlayedCards = playedCards.slice()
  const sortedPlayedCards = sortCard(playedCards)
  const ownIdIndex = playersIds.indexOf(ownId)
  const parterIndex = (ownIdIndex-2+4)%4
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
    if (winner !== playersIds[parterIndex]) {
      // winner is trump card
      if (trumpRevealed && getSuit(winningCard) === trumpSuit) {
        return sortedSuitCards[0]
      }

      const cardsNotPlayed = cardsNotPlayed(playedSuit, handsHistory)
      const remaingCards = getRemainingCards(cardsNotPlayed, ownSuitCards)
      const finalLeftCards = getRemainingCards(
        remaingCards,
        getSuitCards(playedCards, playedCards)
      )

      const lastPlayerCardHistory = isCardRemaining(
        handsHistory,
        playedSuit,
        ownIdIndex
      )

      // there is still cards from that suit
      if (lastPlayerCardHistory.length !== 0) {
        // its possible that opponent has cards
        if (getSuit(lastPlayerCardHistory) === playedSuit) {
          //  have winning card
          if (!currentWinning(myCards, playedSuit, handsHistory))
            return sortedSuitCards[0]
        }

        // no card from same suit
        if (getSuit(lastPlayerCardHistory) === trumpSuit)
          return sortedSuitCards[0]

        if (currentWinning(myCards, playedSuit, handsHistory))
          return last(sortedSuitCards)
      }

      // i have winning card
      if (!currentWinning(myCards, playedSuit, handsHistory))
        return sortedSuitCards[0]
    }
    return last(sortedSuitCards)
  }

  // I dont have card from same suit
  if (trumpSuit && trumpRevealed) {
    const trumpSuitCards = getSuitCards(ownCards,trumpSuit)

    // i dont have trump suit 
    if(trumpSuitCards.length === 0){
      if(winner === parterIndex) return last(mySortedCards) // but not trump card 
      return mySortedCards[0]
    }

    // opponent is winning
    if (winner !== playersIds[parterIndex]) {
      
      // winner is trump card

      const cardsNotPlayed = cardsNotPlayed(trumpSuit, handsHistory)
      const remaingCards = getRemainingCards(cardsNotPlayed, trumpSuitCards )
      // chec if the remaing card is only mine 
      const finalLeftCards = getRemainingCards(
        remaingCards,
        getSuitCards(playedCards, playedCards)
      )

      if (trumpRevealed && getSuit(winningCard) === trumpSuit) {
        return sortedSuitCards[0]
      }

      const cardsNotPlayed = cardsNotPlayed(playedSuit, handsHistory)
      let cardsNotPlayed = remaingCards + playedCards + myCards
      const remaingCards = getRemainingCards(cardsNotPlayed, ownSuitCards)
      const finalLeftCards = getRemainingCards(
        remaingCards,
        getSuitCards(playedCards, playedCards)
      )

      const lastPlayerCardHistory = isCardRemaining(
        handsHistory,
        playedSuit,
        ownIdIndex
      )

      // there is still cards from that suit
      if (lastPlayerCardHistory.length !== 0) {
        // its possible that opponent has cards
        if (getSuit(lastPlayerCardHistory) === playedSuit) {
          //  have winning card
          if (!currentWinning(myCards, playedSuit, handsHistory))
            return sortedSuitCards[0]
        }

        // no card from same suit
        if (getSuit(lastPlayerCardHistory) === trumpSuit)
          return sortedSuitCards[0]

        if (currentWinning(myCards, playedSuit, handsHistory))
          return last(sortedSuitCards)
      }

      // i have winning card
      if (!currentWinning(myCards, playedSuit, handsHistory))
        return sortedSuitCards[0]

    const myTrumpSuitCards = getSuitCards(myCards, trumpSuit)
    const mySortedTrumpSuitCards = sortCard(myTrumpSuitCards)

    if (winner !== playersIds[2]) {
      // winning card is trump card
      if (getSuit(winningCard) === trumpSuit) {
        console.log('wiining card is the trump card', winningCard)
        if (myTrumpSuitCards.length === 0) return mySortedCards[0]

        if ((isHigherCard(last(mySortedTrumpSuitCards)), winningCard))
          return mySortedTrumpSuitCards[0]
      }

      //winning card is not trump card
      /**
       * i have trump card
       */
      if (myTrumpSuitCards.length !== 0) return mySortedTrumpSuitCards[0]

      //trump card not played but i have lower value card
      if (isHigherCard(last(mySortedCards), winningCard))
        return last(mySortedCards)
      return mySortedCards[0]
    }

    /**
     * my partner is the winner
     * and he throw
     *
     */
    if (winningCard === trumpSuit) {
      const nonTrumpCards = getRemainingCards(myCards, myTrumpSuitCards)
      return last(sortCard(nonTrumpCards))
    }

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

function isCardRemaining (handHistory, cardSuit, ownIdIndex) {
  const history = handHistory.filter(hand => getSuit(hand[1][0]) === cardSuit)
  const lastMove = history[history.length - 1]
  const cards = lastMove[1]
  console.log(lastMove, lastMove[0])

  let lastPlayerCard = ''
  const firstPlayer = playersIds.indexOf(lastMove[0])
  console.log('fifrst players index', firstPlayer)
  if (ownIdIndex === 0) {
    if (firstPlayer === 0) lastPlayerCard = cards[cards.length - 3]
    if (firstPlayer === 2) lastPlayerCard = cards[cards.length - 1]
    if (firstPlayer === 3) lastPlayerCard = cards[cards.length - 2]
  }
  if (ownIdIndex === 1) {
    if (firstPlayer === 2) lastPlayerCard = cards[cards.length - 3]
    if (firstPlayer === 0) lastPlayerCard = cards[cards.length - 1]
    if (firstPlayer === 1) lastPlayerCard = cards[cards.length - 2]
  }

  if (getSuit(lastPlayerCard) === cardSuit) return lastPlayerCard
}

module.exports = fourthHand
