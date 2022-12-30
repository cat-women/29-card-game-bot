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

function remainingPlayerHistory (ownId, playerIds, playedSuit, handsHistory) {
  const playersCards = setPlayedCards(playerIds, handsHistory)

  for (let i = 0; i < playersCards.get('firstCard').length; i++) {
    if (playersCards.get('firstCard')[i][1] === playedSuit) {
      const fistPlayerIndex = playerIds.indexOf(
        playersCards.get('firstPlayer')[i]
      )
      console.log(fistPlayerIndex)

      const secondPlayer = playerIds[(fistPlayerIndex + 1) % 4]
      const secondCard = playersCards.get(secondPlayer)[i]
      const thirdPlayer = playerIds[(fistPlayerIndex + 2) % 4]
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

function getFirstPlayerIndex (playerIds, history) {
  const firstPlayerIndex = playerIds.indexOf(history[0])
  return firstPlayerIndex
}

function getFinalRemainingCards (cardSuit, myCards, playedCards, handsHistory) {
  const totalRemaingCards = cardsNotPlayed(cardSuit, handsHistory)
  let suitCards = getSuitCards(playedCards, cardSuit)

  let leftCards = ''
  let opponentsCards = ''

  if (suitCards.length != 0)
    // all cards left - cards in played
    leftCards = getRemainingCards(totalRemaingCards, suitCards)

  if (leftCards.length === 0) {
    opponentsCards = getRemainingCards(totalRemaingCards, myCards)
    return opponentsCards
  }

  // all card with oppoenent
  opponentsCards = getRemainingCards(leftCards, myCards)

  return opponentsCards
}

function setPlayedCards (playerIds, history) {
  let playersCards = new Map()

  playerIds.map(id => {
    playersCards.set(id, [])
  })

  playersCards.set('firstPlayer', [])
  playersCards.set('firstCard', [])

  history.map(item => {
    const first = item[0]
    const firstIndex = playerIds.indexOf(first)
    const second = playerIds[(firstIndex + 1) % 4]
    const third = playerIds[(firstIndex + 2) % 4]
    const fourth = playerIds[(firstIndex + 3) % 4]

    playersCards.get(first).push(item[1][0])
    playersCards.get(second).push(item[1][1])
    playersCards.get(third).push(item[1][2])
    playersCards.get(fourth).push(item[1][3])
    playersCards.get('firstPlayer').push(first)
    playersCards.get('firstCard').push(item[1][0])
  })

  return playersCards
}

function haveTrumpCard (payload, player1, player2) {
  const trumpRevealed = payload.trumpRevealed
  const hand = trumpRevealed.hand

  const revealer = trumpRevealed.playerId

  const playerIds = payload.playerIds
  const handsHistory = payload.handsHistory

  const cardsHistory = setPlayedCards(playerIds, handsHistory)
  const firstCards = cardsHistory.get('firstCard')

  const player1Cards = cardsHistory.get(playerIds[player1])
  const player2Cards = cardsHistory.get(playerIds[player2])

  const trumpSuit = payload.trumpSuit

  var count = 0
  for (var i = 0; i < firstCards.length; i++) {
    if (
      getSuit(firstCards[i]) !== getSuit(player1Cards[i]) &&
      (getFace(player2Cards[i]) !== 'J' ||
        handsHistory[i][2] !== playerIds[player2])
    )
      count++
  }
  if (count > 0) return true

  const revealerPlayedCards = cardsHistory.get(revealer)
  const playedCard = revealerPlayedCards[hand - 1]

  if (revealer === playerIds[player1]) {
    if (getSuit(playedCard) === trumpSuit) return true
  }

  return false
}

function nullify (myTeam,oppTeam,handsHistory) {
  if (
    (handsHistory.length > 4 &&
      oppTeam.bid !== 0 &&
      oppTeam.won > oppTeam.bid * 0.65) ||
    (handsHistory.length > 4 &&
      myTeam.bid !== 0 &&
      myTeam.won < myTeam.bid * 0.7)
  )
    return true
  return false
}

module.exports = {
  remainingPlayerHistory,
  getSecondPlayerCard,
  getThirdPlayerCard,
  getFirstPlayerIndex,
  getFinalRemainingCards,
  setPlayedCards,
  haveTrumpCard,
  nullify
}
