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

function bid (payload) {
  const cards = payload.cards

  let faces = {
    J: 0,
    N: 0,
    T: 0,
    A: 0
  }
  let bid = 0
  let suits = {
    c: 0,
    d: 0,
    h: 0,
    s: 0
  }

  for (let x in cards) {
    let card = cards[x][0]
    let suit = cards[x][1]
    if (card === 'J') faces.J++
    if (card === 'N') faces.N++
    if (card === 'T') faces.T++
    if (card === 'A') faces.A++

    if (suit === 'C') suits.c++
    if (suit === 'D') suits.d++
    if (suit === 'H') suits.h++
    if (suit === 'S') suits.s++
  }

  bid = faces.J * 3 + faces.N * 2 + faces.A + faces.T

  for (const key in suits) {
    if (suits[key] > 1 && suits[key] <= 2) bid = 17
    else if (suits[key] >= 2) {
      bid = 19
      break
    }
  }
  if (payload.bidHistory.length === 0) {
    const finalValue = bid < 16 ? MIN_BID : bid
    // finalValue = 20
    return {
      bid: finalValue
    }
  }

  return {
    bid: PASS_BID
  }
}

module.exports = bid
