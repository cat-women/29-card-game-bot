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

function play(payload) {
  const ownCards = payload.cards
  const thisRoundCards = payload.played
  const trumpSuit = payload.trumpSuit
  const trumpRevealed = payload.trumpRevealed
  const handsHistory = payload.handsHistory
  const ownId = payload.playerId
  const playersIds = payload.playerIds

  if (ownCards.length === 1) {
    return {
      card: ownCards[0]
    }
  }

  // first hand case
  if (thisRoundCards.length === 0) {
    let first = firstHand(ownCards, trumpSuit, trumpRevealed, handsHistory, payload)
    console.log("first hand ", first)
    return {
      card: first
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
      playersIds,
      payload
    )
    console.log("second hand ",cardToPlay)
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
      playersIds,
      payload
    )
    console.log("third hand ",cardToPlay)
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
      playersIds,
      payload
    )
    console.log("fourth hand ",cardToPlay)
    if (cardToPlay !== 0)
      return {
        card: cardToPlay
      }
  }

  /** trump has not yet been revealed, let's reveal the trump */

  return {
    revealTrump: true
  }
}

module.exports = play
