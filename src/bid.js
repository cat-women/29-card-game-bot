/**
 * @payload
  {
    "playerId": "A1", // own player id
    "playerIds": ["A1", "B1", "A2", "B2"], // player ids in order
    "timeRemaining": 1200,
    "cards": ["JS", "TS", "KH", "9C"], // own cards
    "bidHistory": [["A1", 16], ["B1",17], ["A1", 17], ["B1", 0], ["A2", 0], ["B2", 0]], // bidding history in chronological order
    "bidState": {
      "defenderId": "A1",
      "challengerId": "B1",
      "defenderBid": 16,
      "challengerBid": 17
    },
  }
 */

const MIN_BID = 16
const PASS_BID = 0
const MAX_BID = 28

function bid (payload) {
  const cards = payload.cards
  const bidHistory = payload.bidHistory

  if (bidHistory.length === 0)
    return {
      bid: MIN_BID
    }

  const highestBid = getHighestBid(bidHistory)
  const myCardValue = getCardValue(cards)
  let bid = PASS_BID

  if (highestBid === 16 && myCardValue >= 1) bid = highestBid + 1
  // bid = 17
  else if (highestBid === 17 && myCardValue >= 2) bid = highestBid + 1
  // 18
  else if (highestBid === 18 && myCardValue >= 3) bid = highestBid + 1 // 19
  return {
    bid: bid
  }
}
function getCardValue (cards) {
  // if i have more than one j and more than two cards of same suit

  const faces = {}
  const suits = {}
  cards.forEach(function (x) {
    faces[x[0]] = (faces[x[0]] || 0) + 1
    suits[x[1]] = (suits[x[1]] || 0) + 1
  })
  let result = 0
  for (const [key, value] of Object.entries(suits)) {
    if (faces['J'] === 1 && value >= 2) result = 1
    if (faces['J'] === 2 && value >= 2) result = 2
    if (faces['J'] === 3 && value >= 2) result = 3
    if (value >= 3) result = 2
  }

  return result
}
function getHighestBid (bidHistory) {
  const bids = bidHistory.map(function (x) {
    return x[1]
  })
  var max = Math.max.apply(0, bids)
  return max
}
module.exports = bid
