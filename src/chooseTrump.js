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

  console.log()
  trump = {}
  ownCards.map(card => {
    suit = getSuit(card)
    if (trump[suit] === undefined) trump[suit] = 1
    else trump[suit]++
  })

  let t = 0
  let s = ''
  for (var x in trump) {
    if (t < trump[x]) 
    t =  trump[x]
    s = x
  }
  console.log("trump is ",s)
  return {
    suit: s
  }
}

module.exports = chooseTrump
