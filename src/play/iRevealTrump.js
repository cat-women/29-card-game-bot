const { last, getSuitCards, sortCard } = require('../shared')

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
  // console.log("sortedTrumpSuitCards",sortedTrumpSuitCards)
  // console.log("trumpSuit",trumpSuit)
console.log("i reveal trum ")
  if (trumpSuitCards.length === 0) return mySortedCards[0]

  if (playedCards.length === 3 && playedTrumpcards.length === 0)
    return sortedTrumpSuitCards[0]


    //compare trump value here
  return last(sortedTrumpSuitCards)
}

module.exports = iRevealTrump
