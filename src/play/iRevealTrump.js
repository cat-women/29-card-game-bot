const { last, getSuitCards, sortCard, getFace } = require('../shared')

const {
  remainingPlayerHistory,
  getSecondPlayerCard,
  getThirdPlayerCard,
  getFirstPlayerIndex,
  getFinalRemainingCards
} = require('./common.js')

function iRevealTrump (myCards, playedCards, trumpSuit) {
  const trumpSuitCards = getSuitCards(myCards, trumpSuit)
  const mySortedCards = sortCard(myCards)
  const sortedTrumpSuitCards = sortCard(trumpSuitCards)
  const playedTrumpcards = getSuitCards(playedCards, trumpSuit)

  if (trumpSuitCards.length === 0) return mySortedCards[0]

  if (getFace(last(sortedTrumpSuitCards)) !== 'J')
    return last(sortedTrumpSuitCards)
    
  const temp = sortedTrumpSuitCards.slice()
  const firstThree = temp.splice(sortedTrumpSuitCards.length - 3, 3)
  if (firstThree.length > 1) {   
    if (
      getFace(last(firstThree)) === 'J' &&
      (getFace(firstThree[firstThree.length - 2]) === '9' ||
        getFace(firstThree[firstThree.length - 2]) === '1')
    )
      return firstThree[firstThree.length - 2]

    if (
      getFace(last(firstThree)) === '9' &&
      getFace(firstThree[firstThree.length - 2]) === '1'
    )
      return firstThree[firstThree.length - 2]
  }
  console.log(
    'firstThree',
    getFace(last(firstThree)),
    firstThree[firstThree.length - 2]
  )
  return sortedTrumpSuitCards[0]
}

module.exports = iRevealTrump
