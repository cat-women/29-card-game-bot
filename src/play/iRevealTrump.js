const { last, getSuitCards, sortCard } = require('../shared')

function iRevealTrump (myCards, playedCards, trumpSuit) {
  const trumpSuitCards = getSuitCards(myCards, trumpSuit)
  const mySortedCards = sortCard(myCards)
  const sortedTrumpSuitCards = sortCard(trumpSuitCards)
  const playedTrumpcards = getSuitCards(playedCards, trumpSuit)
  // console.log(sortedTrumpSuitCards)
  // console.log(trumpSuit)

  if (trumpSuitCards.length === 0) return mySortedCards[0]

  if (playedCards.length === 3 && playedTrumpcards.length === 0)
    return sortedTrumpSuitCards[0]

  return last(sortedTrumpSuitCards)
}

module.exports = iRevealTrump
