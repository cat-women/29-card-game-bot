const {
  last,
  secondLast,
  getSuit,
  getSuitCards,
  sortCard,
  getFace,
  cardsNotPlayed,
  currentWinning,
  getRemainingCards
} = require('./shared')
const card = require('./card.js')
/**
 * @payload
  {
    "playerId": "A2", // own player id
    "playerIds": ["A1", "B1", "A2", "B2"], // player ids in order
    "timeRemaining": 1500,
    "teams": [
      { "players": ["A1", "A2"], "bid": 17, "won": 0 }, // first team information
      { "players": ["B1", "B2"], "bid": 0, "won": 4 }, // second team information
    ],
    "cards": ["JS", "TS", "KH", "9C", "JD", "7D", "8D"], // own cards
    "bidHistory": [["A1", 16], ["B1",17], ["A1", 17], ["B1", 0], ["A2", 0], ["B2", 0]], // bidding history in chronological order
    "played": ["9S", "1S", "8S"],
    "handsHistory": [
        [
          "A1", // player who threw the first card ("7H") 
          ["7H", "1H", "8H", "JH"], // cards that thrown in the first hand
          "B2" // winner of this hand
        ]
    ],
    // represents the suit if available, the trumpSuit is only present for the player who reveals the trump
    // after the trump is revealed, the trumpSuit is present for all the players
    "trumpSuit": false | "H",

    // only after the trump is revealed by the player the information is revealed
    "trumpRevealed": false | {
      hand: 2, // represents the hand at which the trump was revealed
      playerId: "A2", // the player who revealed the trump
    },
  }
 */
function play (payload) {
  const ownCards = payload.cards
  const thisRoundCards = payload.played
  const trumpSuit = payload.trumpSuit
  const trumpRevealed = payload.trumpRevealed
  const handsHistory = payload.handsHistory
  const ownId = payload.playerId
  /** we are the one to throw the first card in the hands  throw highest value card*/
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
  if (thisRoundCards.length === 0) {
    // *Todo: protect each card from each suit
    return {
      card: firstHand(trumpSuit, trumpRevealed, ownCards, handsHistory)
    }
  }

  const firstCardSuit = getSuit(thisRoundCards[0])
  const myCards = ownCards.slice()
  const ownSuitCards = getSuitCards(ownCards, firstCardSuit)

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
    const mySortedCards = sortCard(ownCards)
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
        card: mySortedCard[0]
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
function firstHand (trumpSuit, trumpRevealed, myCards, handsHistory) {
  const orginalMyCards = myCards.slice()
  const mySortedCards = sortCard(myCards)

  if (trumpSuit && trumpRevealed) {
    trumpSuitCards = getSuitCards(myCards, trumpSuit)
    // i dont have trump suit
    if (trumpSuitCards.length === 0) {
      // check other have trump suit or not
      const trumpRemaining = cardsNotPlayed(trumpSuit, handsHistory)
      // all trump are played
      if (trumpRemaining.length === 0) {
        // my first highest card is current winning card
        if (currentWinning(mySortedCards, trumpSuit, handsHistory))
          return last(mySortedCard)

        // check for second winngin card
        const mySortedCardsOriginal = mySortedCards.slice()
        mySortedCards.splice(myCards.length - 1, 1)
        if (currentWinning(mySortedCards, trumpSuit, handsHistory))
          return last(mySortedCards)

        // check for third winngin card
        mySortedCards.splice(myCards.length - 1, 1)
        if (currentWinning(mySortedCards, trumpSuit, handsHistory))
          return last(mySortedCards)
        return mySortedCardsOriginal[0]
      }
      // oppoent might have trump card
      return mySortedCards[0]
    }
    const trumpRemaining = cardsNotPlayed(trumpSuit, handsHistory)
    // other also dont have trump card
    if (trumpRemaining.length === 0) {
      // my first highest card is current winning card
      if (currentWinning(mySortedCards, trumpSuit, handsHistory))
        return last(mySortedCards)

      // check for second winngin card
      const mySortedCardsOriginal = mySortedCards.slice()
      mySortedCards.slice(myCards.length - 1, 1)
      if (currentWinning(mySortedCards, trumpSuit, handsHistory))
        return last(mySortedCards)

      //i dont have winnig trump card
      return last(trumpSuitCards)
    }
    const opponentCards = getRemainingCards(trumpRemaining, trumpSuitCards)
    if (
      card[getFace(last(sortCard(opponentCards)))] >
      card[getFace(last(sortCard(trumpSuitCards)))]
    )
      return mySortedCards[0]
    return last(sortCard(trumpSuitCards))
  }
  //trump not revealed
  // my first highest card is current winning card
  if (currentWinning(mySortedCards, getSuit(mySortedCards[0]), handsHistory))
    return last(mySortedCards)

  // check for second winngin card
  const mySortedCardsOriginal = mySortedCards.slice()
  mySortedCards.splice(myCards.length - 1, 1)
  if (currentWinning(mySortedCards, getSuit(mySortedCards[0]), handsHistory))
    return last(mySortedCards)

  // check for third winngin card
  mySortedCards.splice(myCards.length - 1, 1)
  if (currentWinning(mySortedCards, getSuit(mySortedCards[0]), handsHistory))
    return last(mySortedCards)

  return mySortedCardsOriginal[0]
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
  orginalPlayedCards = playedCards.slice()
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

// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler

console.log("Welcome to Programiz!");


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
