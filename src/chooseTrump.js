const { last, getSuit, getSuitCards } = require('./shared')

/**
 * @payload
  {
    "playerId": "A1", // own player id
    "playerIds": ["A1", "B1", "A2", "B2"], // player ids in order
    "timeRemaining": 1200,
    "cards": ["JS", "TS", "KH", "9C"], // own cards
    "bidHistory": [["A1", 16], ["B1",17], ["A1", 17], ["B1", 0], ["A2", 0], ["B2", 0]], // bidding history in chronological order
  }
 */

function chooseTrump (payload) {
  const ownCards = payload.cards
  const lastCard = last(ownCards)

  possibleTrumpCard = {}

  // count
  ownCards.forEach(function (x) {
    possibleTrumpCard[getSuit(x)] = (possibleTrumpCard[getSuit(x)] || 0) + 1
  })

  let max = 0
  let suit = ''
  
  for (const [key, value] of Object.entries(possibleTrumpCard)) {
    if (max < value) {
      max = value
      suit = key
    } else if (max === value && key == 'J') {
      max = value
      suit = key
    }
  }
  console.log('trump is ', suit)
  return {
    suit: suit
  }
}

module.exports = chooseTrump
