const {
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
} = require('../shared')

function remainingPlayerHistory (ownId, playersIds, playedSuit, handsHistory) {
  const playersCards = setPlayedCards(playersIds, handsHistory)

  for (let i = 0; i < playersCards.get('firstCard').length; i++) {
    if (playersCards.get('firstCard')[i][1] === playedSuit) {
      const fistPlayerIndex = playersIds.indexOf(
        playersCards.get('firstPlayer')[i]
      )
      console.log(fistPlayerIndex)

      const secondPlayer = playersIds[(fistPlayerIndex + 1) % 4]
      const secondCard = playersCards.get(secondPlayer)[i]
      const thirdPlayer = playersIds[(fistPlayerIndex + 2) % 4]
      const thirdCard = playersCards.get(thirdPlayer)[i]

      return { partnerPrevCard: thirdCard, oppPrevCard: secondCard }
    }
  }
  return { partnerPrevCard: 0, oppPrevCard: 0 }
}

function getSecondPlayerCard (ownIdIndex, firstPlayerIndex, card) {
  console.log(ownIdIndex)
  let secondPlayerIndex
  if (ownIdIndex === 0) {
    if (
      firstPlayerIndex === ownIdIndex ||
      firstPlayerIndex === (ownIdIndex + 2) % 4
    )
      secondPlayerIndex = (firstPlayerIndex + 1) % 4
    else secondPlayerIndex = (firstPlayerIndex + 3) % 4
  }
  if (ownIdIndex === 2) {
    if (
      firstPlayerIndex === ownIdIndex ||
      firstPlayerIndex === (ownIdIndex + 2) % 4
    )
      secondPlayerIndex = (firstPlayerIndex + 3) % 4
    else secondPlayerIndex = (firstPlayerIndex + 1) % 4
  }
  console.log('secondPlayerIndex', secondPlayerIndex)
  return card[secondPlayerIndex]
}

function getThirdPlayerCard (ownIdIndex, firstPlayerIndex, card) {
  let secondPlayerIndex
  if (ownIdIndex === 0) {
    if (
      firstPlayerIndex === ownIdIndex ||
      firstPlayerIndex === (ownIdIndex + 2) % 4
    )
      secondPlayerIndex = (firstPlayerIndex + 2) % 4
    else secondPlayerIndex = firstPlayerIndex
  }
  if (ownIdIndex === 2) {
    if (
      firstPlayerIndex === ownIdIndex ||
      firstPlayerIndex === (ownIdIndex + 2) % 4
    )
      secondPlayerIndex = firstPlayerIndex
    else secondPlayerIndex = (firstPlayerIndex + 2) % 4
  }
  return card[secondPlayerIndex]
}

function getFirstPlayerIndex (playersIds, history) {
  const firstPlayerIndex = playersIds.indexOf(history[0])
  return firstPlayerIndex
}

function getFinalRemainingCards (cardSuit, myCards, playedCards, handsHistory) {
  const totalRemaingCards = cardsNotPlayed(cardSuit, handsHistory)

  let suitCards = getSuitCards(playedCards, cardSuit)

  let leftCards = ''

  let opponentsCards = ''
  if (suitCards.length != 0)
    leftCards = getRemainingCards(totalRemaingCards, suitCards)

  if (leftCards.length === 0) {
    opponentsCards = getRemainingCards(totalRemaingCards, myCards)
    return opponentsCards
  }

  // all cards left - cards in played

  const finalLeftCards = getRemainingCards(totalRemaingCards, leftCards)

  // all card with oppoenent
  opponentsCards = getRemainingCards(finalLeftCards, myCards)
  return opponentsCards
}

function setPlayedCards (playersIds, history) {
  let playersCards = new Map()

  playersIds.map(id => {
    playersCards.set(id, [])
  })

  playersCards.set('firstPlayer', [])
  playersCards.set('firstCard', [])

  history.map(item => {
    const first = item[0]
    const firstIndex = playersIds.indexOf(first)
    const second = playersIds[(firstIndex + 1) % 4]
    const third = playersIds[(firstIndex + 2) % 4]
    const fourth = playersIds[(firstIndex + 3) % 4]

    playersCards.get(first).push(item[1][0])
    playersCards.get(second).push(item[1][1])
    playersCards.get(third).push(item[1][2])
    playersCards.get(fourth).push(item[1][3])
    playersCards.get('firstPlayer').push(first)
    playersCards.get('firstCard').push(item[1][0])
  })

  return playersCards
}


module.exports = {
  remainingPlayerHistory,
  getSecondPlayerCard,
  getThirdPlayerCard,
  getFirstPlayerIndex,
  getFinalRemainingCards,
  setPlayedCards
}
