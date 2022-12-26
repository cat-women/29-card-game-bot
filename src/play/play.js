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
    console.log('handsHistory', payload)
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
