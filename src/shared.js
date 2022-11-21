function last (items) {
  return items[items.length - 1]
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
  var sortOrder = ['7', '8', 'Q', 'K', 'T', '1', '9', 'J' ]
  var ordering = {}
  for (var i = 0; i < sortOrder.length; i++) ordering[sortOrder[i]] = i  
  return cards.sort(function (a, b) {
    return ordering[a[0]] - ordering[b[0]]
  })
}

module.exports = {
  last,
  getSuit,
  getSuitCards,
  sortCard,
  getFace
}
