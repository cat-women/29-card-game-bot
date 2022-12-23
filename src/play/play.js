const {
  last,
  getSuit,
  getSuitCards,
  sortCard,
  getFace,
  cardsNotPlayed,
  currentWinning
} = require('../shared')
const card = require('../card.js')
const firstHand = require('./firstHand')
const secondHand = require('./secondHand')
const thirdHand = require('./thirdHand')
const fourthHand = require('./fourthHand')

function play (payload) {
  const ownCards = payload.cards
  const thisRoundCards = payload.played
  const trumpSuit = payload.trumpSuit
  const trumpRevealed = payload.trumpRevealed
  const handsHistory = payload.handsHistory
  const ownId = payload.playerId
  const playersIds = payload.playerIds

  if (ownCards.length === 1) {
    console.log("handsHistory",payload)
    return {
      card: ownCards[0]
    }
  }
  // first move of game
  if (handsHistory.length === 0 && thisRoundCards.length === 0) {
    const myCards = sortCard(ownCards)
    if (getFace(last(myCards)) === 'J')
      return {
        card: last(myCards)
      }
    return {
      card: myCards[0]
    }
  }

  // first hand case
  if (thisRoundCards.length === 0) {
    return {
      card: firstHand(ownCards, trumpSuit, trumpRevealed, handsHistory)
    }
  }

  // second hand case
  if (thisRoundCards.length === 1) {
    const cardToPlay = secondHand(
      ownId,
      ownCards,
      thisRoundCards,
      trumpSuit,
      trumpRevealed,
      handsHistory,
      playersIds
    )
    if (cardToPlay !== 0)
      return {
        card: cardToPlay
      }
  }

  // third hand case
  if (thisRoundCards.length === 2) {
    const cardToPlay = thirdHand(
      ownId,
      ownCards,
      thisRoundCards,
      trumpSuit,
      trumpRevealed,
      handsHistory,
      playersIds
    )
    if (cardToPlay !== 0)
      return {
        card: cardToPlay
      }
  }

  // fourth hand case
  if (thisRoundCards.length === 3) {
    const cardToPlay = fourthHand(
      ownId,
      ownCards,
      thisRoundCards,
      trumpSuit,
      trumpRevealed,
      handsHistory,
      playersIds
    )
    if (cardToPlay !== 0)
      return {
        card: cardToPlay
      }
  }

  const firstCardSuit = getSuit(thisRoundCards[0])
  const myCards = ownCards.slice()
  const ownSuitCards = getSuitCards(ownCards, firstCardSuit)
  const mySortedCards = sortCard(ownCards)

  /** if we have the suit with respect to the first card, we throw it */
  if (ownSuitCards.length > 0) {
    const sortedSuitCards = sortCard(ownSuitCards)
    if (trumpSuit && trumpRevealed) {
      // i have card from same suit but i dont trump is already reveal
      if (thisRoundCards.length === 3) {
        if (
          isOpponetWin(
            thisRoundCards,
            sortedSuitCards,
            trumpSuit,
            trumpRevealed,
            handsHistory
          )
        )
          return {
            card: sortedSuitCards[0]
          }
      }
      const remainingTrumpCards = cardsNotPlayed(trumpSuit, handsHistory)
      const myTrumpSuit = getSuitCards(myCards, trumpSuit)
      const playedTrumpCards = getSuitCards(thisRoundCards, trumpSuit)
      const remainingSuitCards = cardsNotPlayed(
        getSuit(thisRoundCards[0]),
        handsHistory
      )

      const playedCards = thisRoundCards.slice()

      // no trump cards left
      if (
        remainingTrumpCards.length + myTrumpSuit.length + playedCards.length ===
          8 &&
        card[getFace(last(sortCard(remainingSuitCards)))] <
          card[getFace(last(sortedSuitCards))]
      )
        return {
          card: last(sortedSuitCards)
        }

      return {
        card: sortedSuitCards[0]
      }
    }
    if (
      isOpponetWin(
        thisRoundCards,
        sortedSuitCards,
        trumpSuit,
        trumpRevealed,
        handsHistory
      )
    )
      return {
        card: sortedSuitCards[0]
      }
    return {
      card: last(sortedSuitCards)
    }
  }
  /** trump is already revealed, and everyone knows the trump */
  if (trumpSuit && trumpRevealed) {
    console.log('trump revealed ')

    const trumpSuitCards = getSuitCards(ownCards, trumpSuit)

    //if i dont have the trumpsuit
    if (trumpSuitCards.length === 0) {
      if (
        isOpponetWin(
          thisRoundCards,
          myCards,
          trumpSuit,
          trumpRevealed,
          handsHistory
        )
      )
        return {
          card: mySortedCards[0]
        }
      return {
        card: last(mySortedCards)
      }
    }

    const wasTrumpRevealInThisRound =
      trumpRevealed.hand === handsHistory.length + 1
    const didIRevealTheTrump = trumpRevealed.playerId === ownId

    /**
     * if I'm the one who revealed the trump in this round.
     */
    if (wasTrumpRevealInThisRound && didIRevealTheTrump) {
      // if im the last one to throw and i have more than 1 trump card throw least value card
      if (trumpSuitCards.length > 1 && thisRoundCards.length === 3) {
        return { card: sortCard(trumpSuitCards)[0] }
      }

      /** player who revealed the trump should throw the trump suit card
       * im not last player throw higher value card
       */
      return {
        card: last(sortCard(trumpSuitCards)) || mySortedCards[0]
      }
    }
    // I have trump card

    // this is final round card
    if (thisRoundCards.length !== 3) {
      const playedTrumpcards = getSuitCards(thisRoundCards, trumpSuit)
      if (playedTrumpcards.length === 0) {
        // i have winning trump card
        if (currentWinning(trumpSuitCards, trumpSuit, handsHistory))
          return {
            card: last(sortCard(trumpSuitCards))
          }
        return {
          card: mySortedCards[0]
        }
      }
      if (
        isOpponetWin(
          thisRoundCards,
          trumpSuitCards,
          trumpSuit,
          trumpRevealed,
          handsHistory
        )
      )
        return {
          card: mySortedCards[0]
        }

      return {
        card: last(mySortedCards)
      }
    }
    // for the final hand
    if (
      !isOpponetWin(
        thisRoundCards,
        trumpSuitCards,
        trumpSuit,
        trumpRevealed,
        handsHistory
      )
    )
      return {
        card: last(mySortedCards)
      }
    // opoennet is winning, check trump played
    const playedTrumpcards = getSuitCards(thisRoundCards, trumpSuit)
    if (playedTrumpcards.length === 0)
      return {
        card: trumpSuitCards[0]
      }
    return {
      card: mySortedCards[0]
    }
  }

  if (ownCards.length === 1)
    return {
      card: ownCards[0]
    }
  if (trumpSuit && !trumpRevealed) {
    // if my partner is winning dont reveal trump throw last card that is zero card

    const trumpSuitCards = getSuitCards(ownCards, trumpSuit)
    if (trumpSuitCards.length === 0 || isPartnerWin(thisRoundCards))
      return {
        revealTrump: false,
        card: mySortedCards[0]
      }

    return {
      /**  after revealing the trump, we must throw trump card */
      revealTrump: true,
      card: last(sortCard(trumpSuitCards)) || last(mySortedCards)
    }
  }

  /** trump has not yet been revealed, let's reveal the trump */
  return {
    revealTrump: true
  }
}
function isPartnerWin (playedCard) {
  if (last(sortCard(playedCard)) === playedCard[playedCard.length - 2])
    return true
  return false
}

function isOpponetWin (
  playedCards,
  mySortedCards,
  trumpSuit,
  trumpRevealed,
  handsHistory
) {
  const orginalPlayedCards = playedCards.slice()
  const sortedCardPlayedCards = sortCard(playedCards)

  if (trumpSuit) {
    const trumpSuitCards = getSuitCards(playedCards, trumpSuit)
    const partnerPos = (playedCards.length - 2 + 4) % 4

    if (
      trumpSuitCards.length === 1 &&
      orginalPlayedCards.indexOf(trumpSuitCards[0]) === partnerPos
    )
      return false

    if (
      orginalPlayedCards.indexOf(last(sortCard(trumpSuitCards))) === partnerPos
    )
      return false
    // trump card not played
    if (
      trumpSuitCards.length === 0 &&
      currentWinning(
        mySortedCards,
        getSuit(orginalPlayedCards[0]),
        handsHistory
      )
    )
      return false
    return true
  }
  if (
    currentWinning(mySortedCards, getSuit(orginalPlayedCards[0]), handsHistory)
  )
    return false
  return true
}

module.exports = play
/*


const playersIds = ['you-0','op-0','you-1','op-1']
const playedCards = ['9S','JS','KS']

const playerId = 'you-0'


const wiiningCard = 'JS'
const playerIndex = playersIds.indexOf(playerId)
const winningIndexInPlayedCard = playedCards.indexOf(wiiningCard)
const result = (playerIndex+winningIndexInPlayedCard+4 - playedCards.length)%4


console.log(playersIds[result])

console.log(result)

*/
