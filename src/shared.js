const { card, Deck } = require('./card')

function last (items) {
  return items[items.length - 1]
}
function secondLast (items) {
  return items[items.length - 2]
}

function getSuit (card) {
  return card[1]
}

function getFace (card) {
  return card[0]
}
function getSuitCards (cards, cardSuit) {
  return cards.filter(card => getSuit(card) === cardSuit)
}

function sortCard (cards) {
  var sortOrder = ['7', '8', 'Q', 'K', 'T', '1', '9', 'J']
  var ordering = {}
  for (var i = 0; i < sortOrder.length; i++) ordering[sortOrder[i]] = i
  return cards.sort(function (a, b) {
    return ordering[a[0]] - ordering[b[0]]
  })
}

function cardsNotPlayed (cardSuit, handsHistory) {
  const cards = Deck[cardSuit]

  if (handsHistory.length === 0) return cards

  let playedCards = []

  handsHistory.forEach(handsHistory => {
    // get only from that partcuar suit
    let suitCards = getSuitCards(handsHistory[1], cardSuit)
    playedCards = playedCards.concat(suitCards)
  })

  playedCards.forEach(card => {
    const index = cards.indexOf(card)
    if (index > -1) {
      cards.splice(index, 1)
    }
  })
  // remaining cards
  return cards
}

function currentWinning (myCards, cardSuit, handsHistory) {
  const remainingCards = cardsNotPlayed(cardSuit, handsHistory)
  if (remainingCards.length === 0) return true

  const mySortedCards = sortCard(myCards)
  const myHighestValueCard = last(mySortedCards)

  const highestValueCard = last(sortCard(remainingCards))

  if (card[highestValueCard[0]] > card[myHighestValueCard[0]]) return false
  return true
}

function getRemainingCards (allCards, myCards) {
  if (myCards.length === 0) return allCards

  myCards.map(card => {
    var index = allCards.indexOf(card)
    if (allCards.includes(card)) allCards.splice(index, 1)
  })
  return allCards
}

function isHigherCard (myCard, opponentCard) {
  if (card[getFace(last(sortCard(myCard)))] > card[getFace(opponentCard)])
    return true
  return false
}

module.exports = {
  last,
  secondLast,
  getSuit,
  getSuitCards,
  sortCard,
  getFace,
  cardsNotPlayed,
  currentWinning,
  getRemainingCards,
  isHigherCard
}
