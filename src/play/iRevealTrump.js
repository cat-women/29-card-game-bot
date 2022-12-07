const { getSuitCards, sortCard } = require('../shared')

function iRevealTrump (myCards, playedCards, trumpSuit) {
  const trumpSuitCards = getSuitCards(myCards, trumpCard)
  const mySortedCards = sortCard(myCards)
  const sortedTrumpSuitCards = sortCard(trumpSuitCards)
  const playedTrumpcards = getSuitCards(playedCards, trumpCard)

  if (trumpSuitCards.length === 0) return mySortedCards[0]

  if (playedCards.length === 3 && playedTrumpcards.length === 0)
    return sortedTrumpSuitCards[0]
  return last(sortedTrumpSuitCards)
}

module.exports = iRevealTrump
