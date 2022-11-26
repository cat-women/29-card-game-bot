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
  // console.log('bid history', bidHistory)

  // console.log('card', cards)
  let bid = 0

  // console.log('cards', cards)
  // console.log('faces', faces)
  // console.log('suits', suits)

  for (const [key, value] of Object.entries(faces)) {
    if (key === 'J') bid += 3
    if (key === '9') bid += 2
    if (key == 'T' || key == '1') bid += value
  }
  bid = 0
  for (const [key, value] of Object.entries(suits)) {
    // console.log('key in sutis', key, value)
    if (value >= 3) bid = MAX_BID
    if (value == 2 && Object.hasOwn(suits, key)) bid = 17
  }
  if (bidHistory.length === 0) {
    //i'm first to bid
    return {
      bid: MIN_BID
    }
  }

  // const myBid = bid < 16 ? MIN_BID : bid
  // console.log('my card value ', bid)
  const highestBid = getHighestBid(bidHistory)
  if (bid === 17 && bid === highestBid) {
    return {
      bid: 17
    }
  }
  if (bid === MAX_BID && highestBid > 19)
    return {
      bid: getHighestBid(bidHistory) + 1
    }

  return {
    bid: PASS_BID
  }
}
function haveGoodCard(cards){
  // if i have more than one j and more than two cards of same suit

  const faces = {}
  const suits = {}
  cards.forEach(function (x) {
    faces[x[0]] = (faces[x[0]] || 0) + 1
    suits[x[1]] = (suits[x[1]] || 0) + 1
  })
if(faces['J'] >= 1 && suits['S'] >1){
  console.log("good card ")
}
for (const [key, value] of Object.entries(suits)) {
  if(faces['J'] >=1 && value >= 2)console.log("good card ")
}


  
}
function getHighestBid (bidHistory) {
  const bids = bidHistory.map(function (x) {
    return x[1]
  })
  var max = Math.max.apply(0, bids)
  return max
}
module.exports = bid
