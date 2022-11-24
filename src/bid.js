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
  console.log('=========================================================')
  const cards = payload.cards
  const bidHistory = payload.bidHistory
  console.log('bid history', bidHistory)
  console.log("card",cards)
  let bid = 0

  const faces = {}
  const suits = {}
  cards.forEach(function (x) {
    faces[x[0]] = (faces[x[0]] || 0) + 1
    suits[x[1]] = (suits[x[1]] || 0) + 1
  })
  // console.log('cards', cards)
  // console.log('faces', faces)
  // console.log('suits', suits)

  for (const [key, value] of Object.entries(faces)) {
    if (key === 'J') bid += value * 3
    if (key === '9') bid += value * 2
    if (key == 'T' || key == '1') bid += value
  }
  console.log('bid based on my cards', bid)
  bid = 2 * bid
  //only if you have j card
  for (const [key, value] of Object.entries(suits)) {
    if (value >= 3) bid = MAX_BID
  }
  if (bidHistory.length === 0) {
    //i'm first to bid
    return {
      bid: MIN_BID
    }
  }

  const myBid = bid < 16 ? MIN_BID : bid

  if (myBid > getHighestBid) {
    myBid = getHighestBid(bidHistory) + 1

    return {
      bid: myBid
    }
  }
  return {
    bid: PASS_BID
  }
}

function getHighestBid (bidHistory) {
  let bid = 0
  bidHistory.forEach(x => {
    if (bid < x[1] && x[0] !== 'A2') bid = x[1]
    return bid
  })
}
module.exports = bid
