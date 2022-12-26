/**
 * @payload
  {
    "playerId": "A1", // own player id
    "playerIds": ["A1", "B1", "A2", "B2"], // player ids in order
    "timeRemaining": 1200,
    "cards": ["JS", "TS", "KH", "9C"], // own cards
    "bidHistory": 
    [["A1", 16], ["B1",17], ["A1", 17], ["B1", 0], ["A2", 0], ["B2", 0]], // bidding history in chronological order
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
  const playerIds = payload.playerIds
  const playerId = payload.playerId
  const myCardValue = getCardValue(cards)

  if (bidHistory.length === 0) {
    if (myCardValue > MIN_BID)
      return {
        bid: 17
      }
    return {
      bid: MIN_BID
    }
  }

  const highestBid = getHighestBid(bidHistory)
  const ownIndex = playerIds.indexOf(playerId)
  console.log("hihgestbid ",highestBid)
  console.log("mycard value ",myCardValue)

  
  if (highestBid.value === 0) {
    if (myCardValue > MIN_BID)
      return {
        bid: 17
      }
    return {
      bid: MIN_BID
    }
  }


  // if partner is bidding
  if (
    (ownIndex - 2 + 4) % 4 === playerIds.indexOf(highestBid.bidder) &&
    highestBid.value > MIN_BID 
  ) {
    return {
      bid: PASS_BID
    }
  }

  // if I'm biddding highest
  // if (myCardValue >= 18 && highestBid.value <= 19 )
  //   return {
  //     bid: highestBid.value + 1
  //   }

  // if i have better cards
  if (myCardValue > highestBid.value && highestBid.value <= 19){
    return {
      bid: highestBid.value + 1
    }
  }
  
  return {
    bid: PASS_BID
  }
  // let bid = PASS_BID

  // // bid = 17
  // else if (highestBid === 17 && myCardValue >= 2) bid = highestBid + 1
  // // 18
  // else if (highestBid === 18 && myCardValue >= 3) bid = highestBid + 1 // 19
  // return {
  //   bid: bid
  // }
}
function getCardValue (cards) {
  // if i have more than one j and more than two cards of same suit

  const faces = {}
  const suits = {}
  cards.forEach(function (x) {
    faces[x[0]] = (faces[x[0]] || 0) + 1
    suits[x[1]] = (suits[x[1]] || 0) + 1
  })

  for (const [key, value] of Object.entries(suits)) {
    if (
      (faces['J'] === 1 && value == 2) ||
      (faces['1'] === 1 && faces['9'] === 1 && value == 2)
    )
      return 17

    if ((faces['J'] === 2 && value == 2) || value === 3) return 18
    if (faces['J'] === 3 || value == 4) return 19
  }

  return 0
}

function getHighestBid (bidHistory) {
  // const bids = bidHistory.map(function (x) {
  //   return x[1]
  // })
  // var max = Math.max.apply(0, bids)
  // return max

  const bid = {}
  bid.value = 0

  bidHistory.map(item => {
    if (bid.value < item[1]) {
      bid.value = item[1]
      bid.bidder = item[0]
    }
  })
  return bid
}

module.exports = bid
