const { getSuitCards, last, getSuit, getFace, sortCard } = require('./shared')
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
  // console.log(payload)
  const mySortedCard = sortCard(ownCards)
  console.log('hand history', handsHistory)

  /** we are the one to throw the first card in the hands  throw highest value card*/
  if (!thisRoundCards.length > 0) {
    // *Todo: protect each card from each suit
    return {
      card: last(mySortedCard)
    }
  }

  const firstCardSuit = getSuit(thisRoundCards[0])
  const ownSuitCards = getSuitCards(ownCards, firstCardSuit)

  /** if we have the suit with respect to the first card, we throw it */
  if (ownSuitCards.length > 0) {
    const sortedSuitCard = sortCard(ownSuitCards)
    // if opponent is sure to win, throw zero card
    if (isOpponetWin(thisRoundCards, sortedSuitCard, trumpSuit))
      return {
        card: sortedSuitCard[0]
      }

    return {
      card: last(sortedSuitCard)
    }
  }

  /**
   * we don't have cards that follow the suit
   * @example
   *  the first player played "7H" (7 of hearts)
   *  we don't have any cards of suit "hearts"
   *
   * We could either
   *
   * 1. throw any card
   * 2. reveal the trump
   *
   *
   * git ko
   * one commit
   */

  /** trump is already revealed, and everyone knows the trump */
  if (trumpSuit && trumpRevealed) {
    console.log('trump revealed')

    const trumpSuitCards = getSuitCards(ownCards, trumpSuit)
    console.log('my trump suit are:--- ', trumpSuitCards)

    //if i dont have the trumpsuit
    if (trumpSuitCards.length === 0) {
      return {
        card: mySortedCard[0]
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
        card: last(sortCard(trumpSuitCards)) || last(mySortedCard)
      }
    }
    if (isOpponetWin(thisRoundCards, mySortedCard, trumpSuit))
      return {
        card: trumpSuitCards[0]
      }
    return {
      card: last(trumpSuitCards)
    }
  }

  /**
   * trump is revealed only to me
   * this means we won the bidding phase, and set the trump
   * im the bidder
   */
  if (trumpSuit && !trumpRevealed) {
    // if my partner is winning dont reveal trump throw last card that is zero card

    const trumpSuitCards = getSuitCards(ownCards, trumpSuit)
    if (trumpSuitCards.length > 0 || isPartnerWin(thisRoundCards))
      return {
        revealTrump: false,
        card: mySortedCard[0]
      }

    return {
      /**  after revealing the trump, we must throw trump card */
      revealTrump: true,
      card: last(sortedCard(trumpSuitCards)) || last(mySortedCard)
    }
  }

  /** trump has not yet been revealed, let's reveal the trump */
  return {
    revealTrump: true
  }

  // console.log('trmup suit :', trumpSuit, 'trump reveal :', trumpRevealed)
  // console.log('hand history legth', handsHistory.length)
}

function isPartnerWin (playedCard) {
  if (last(sortCard(playedCard)) === playedCard[playedCard.length - 2])
    return true
  return false
}

function isOpponetWin (playedCard, mySortedCard, trumpSuit) {
  const sortedCard = sortCard(playedCard)

  if (trumpSuit) {
    const trumpSuitCards = getSuitCards(playedCard, trumpSuit)
    console.log('trump in the played card ', trumpSuitCards)
    const partnerPos = playedCard.length - 2
    if (trumpSuitCards.length === 1 && playedCard.indexOf(trumpSuitCards[0]) === partnerPos)
      return false

    if (playedCard.indexOf(last(sortCard(trumpSuitCards))) !== partnerPos) return true

    return true
  }

  if (card[getFace(last(sortedCard))] > card[getFace(last(mySortedCard))])
    return true
  return false
}

module.exports = play
