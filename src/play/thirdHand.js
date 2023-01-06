const {
  last,
  getSuit,
  getSuitCards,
  sortCard,
  getFace,
  cardsNotPlayed,
  currentWinning,
  getRemainingCards,
  isHigherCard,
  secondLast
} = require('../shared')

const { card } = require('../card')

const iRevealTrump = require('./iRevealTrump')
const {
  setPlayedCards,
  nullify,
  haveTrumpCard,
  getFinalRemainingCards,
  cardSuit,
  isZeroCard
} = require('./common')

function thirdHand (
  ownId,
  ownCards,
  playedCards,
  trumpSuit,
  trumpRevealed,
  handsHistory,
  playersIds,
  payload
) {
  const myCards = ownCards.slice()

  const playedSuit = getSuit(playedCards[0])
  const mySortedCards = sortCard(ownCards)

  const ownSuitCards = getSuitCards(ownCards, playedSuit)

  const myTeam = payload.teams[0]
  const oppTeam = payload.teams[1]

  const ownIdIndex = playersIds.indexOf(ownId)
  const oppoenent1Index = (ownIdIndex + 1 + 4) % 4
  const partnerIndex = (ownIdIndex + 2 + 4) % 4
  const oppoenent2Index = (ownIdIndex + 3 + 4) % 4

  const suitNumber = cardSuit(ownCards)
  const [winningCard, winner] = whoIsWinning(
    ownId,
    playersIds,
    playedCards,
    trumpSuit,
    trumpRevealed
  )

  console.log(
    'in third hand winning card',
    winningCard,
    'winner ',
    playersIds[winner]
  )

  // all card with oppoenent
  let finalLeftCards = ''
  if (mySortedCards.length === 0)
    finalLeftCards = getFinalRemainingCards(
      playedSuit,
      [],
      playedCards,
      handsHistory
    )
  finalLeftCards = getFinalRemainingCards(
    playedSuit,
    mySortedCards,
    playedCards,
    handsHistory
  )

  let nonTrumpCards = ''
  let trumpSuitCards = ''
  let finalLeftTrumpCards = ''
  let sortedTrumpSuitCards = ''
  if (trumpSuit) {
    trumpSuitCards = getSuitCards(ownCards, trumpSuit)
    sortedTrumpSuitCards = sortCard(trumpSuitCards)
    nonTrumpCards = getRemainingCards(myCards, trumpSuitCards)

    finalLeftTrumpCards = getFinalRemainingCards(
      trumpSuit,
      trumpSuitCards,
      playedCards,
      handsHistory
    )
  }

  let isTrumPartner
  let isTrumOpp1
  let isTrumOpp2

  if (trumpSuit && trumpRevealed && handsHistory.length > 0) {
    isTrumPartner = haveTrumpCard(payload, partnerIndex, ownIdIndex)
    isTrumOpp1 = haveTrumpCard(payload, oppoenent1Index, oppoenent2Index)
    isTrumOpp2 = haveTrumpCard(payload, oppoenent2Index, oppoenent1Index)
  }

  let lastPlayerCard = ''
  if (handsHistory.length > 0)
    lastPlayerCard = thirdPlayerHistory(
      ownId,
      playersIds,
      playedSuit,
      handsHistory
    )

  // i have same suit card

  if (ownSuitCards.length > 0) {
    const sortedSuitCards = sortCard(ownSuitCards)
    if (ownSuitCards.length === 1) return sortedSuitCards[0]

    // ***** work here
    if (handsHistory.length === 0) {
      if (winner === partnerIndex) {
        // if trump revealed

        if (trumpRevealed) {
          if (getSuit(winningCard) === trumpSuit) {
            if (!isHigherCard(finalLeftTrumpCards, winningCard))
              return sortedSuitCards[0]

            if (
              !isHigherCard(finalLeftTrumpCards, last(sortedTrumpSuitCards))
            ) {
              if (
                !isHigherCard(
                  finalLeftTrumpCards,
                  secondLast(sortedTrumpSuitCards)
                )
              )return secondLast(sortedTrumpSuitCards)

              return last(sortedTrumpSuitCards)
            }
          }
        }

        return last(sortedSuitCards)
      }
      // if wininer is opponent and is playing trump card

      if (getSuit(winningCard) !== trumpSuit) {
        let first = last(sortedSuitCards)

        if (sortedSuitCards.length > 1) {
          let second = secondLast(sortedSuitCards)
          if (card[getFace(second)] > card[getFace(winningCard)]) return second
        }

        if (card[getFace(first)] > card[getFace(winningCard)]) return first
      }
      return sortedSuitCards[0]
    }

    // opponent is winning

    if (winner !== partnerIndex) {
      // winner is not trump card  card

      if (getSuit(winningCard) !== trumpSuit) {
        // if my card is winnign
        if (isHigherCard(ownSuitCards, winningCard)) {
          // third player has same suit card in last move and remaining card is not zero
          if (
            getSuit(lastPlayerCard) === playedSuit &&
            finalLeftCards.length > 0
          ) {
            let first = last(sortedSuitCards)

            if (sortedSuitCards.length > 1) {
              let second = secondLast(sortedSuitCards)
              if (card[getFace(second)] > card[getFace(winningCard)])
                return second
            }

            if (card[getFace(last)] > card[getFace(winningCard)]) return last
          }

          // no same suit card and no trump suit
          // last playes has same suit card ->
          if (lastPlayerCard !== playedSuit && !isTrumOpp1)
            return last(sortedSuitCards)
        }
      }

      return sortedSuitCards[0]
    }

    /**
     * partner is winning
     */
    // partner sure to win

    // last player has same suit card
    if (getSuit(lastPlayerCard) === playedSuit && finalLeftCards.length > 0) {
      if (!isHigherCard(finalLeftCards, winningCard))
        return last(sortedSuitCards)

      if (isHigherCard(sortedSuitCards, playedSuit))
        return last(sortedSuitCards)
    }

    // no same suit card
    if (trumpRevealed && lastPlayerCard !== playedSuit && !isTrumOpp1)
      return last(sortedSuitCards)

    return sortedSuitCards[0]
  }

  // I dont have card from same suit

  if (trumpSuit && trumpRevealed) {
    const sortedTrumpSuitCards = sortCard(trumpSuitCards)

    //i reveal trump case
    const wasTrumpRevealInThisRound =
      trumpRevealed.hand === handsHistory.length + 1
    const didIRevealTheTrump = trumpRevealed.playerId === ownId

    if (wasTrumpRevealInThisRound && didIRevealTheTrump) {
      return iRevealTrump(ownCards, playedCards, trumpSuit)
    }

    if (handsHistory.length === 0) {
      // if winner is my partner
      if (winner === partnerIndex) {
        if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
        return mySortedCards[0]
      }
      // opponent winning and i have higer card
      if (trumpSuitCards.length > 0) {
        let first = last(sortedTrumpSuitCards)

        if (card[getFace(first)] > card[getFace(winningCard)]) {
          if (sortedTrumpSuitCards.length > 1) {
            let second = secondLast(sortedTrumpSuitCards)
            if (card[getFace(second)] > card[getFace(winningCard)])
              return second
          }
          return first
        }
      }
      if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]
      return mySortedCards[0]
    }

    // opponent winning

    if (trumpSuitCards.length > 0) {
      // opponent is winning
      if (winner !== partnerIndex) {
        // winning card is trump card // i have higher trump suit card

        if (
          getSuit(winningCard) === trumpSuit &&
          isHigherCard(sortedTrumpSuitCards, winningCard)
        ) {
          // my trump card is the wining card
          if (finalLeftTrumpCards.length === 0) {
            if (sortedTrumpSuitCards.length > 1)
              return secondLast(sortedTrumpSuitCards)

            return last(sortedTrumpSuitCards)
          }
          // last player dont have trump card

          if (!isTrumOpp1) return last(sortedTrumpSuitCards)

          if (!isHigherCard(finalLeftTrumpCards, last(sortedTrumpSuitCards))) {
            let first = last(sortedTrumpSuitCards)
            if (sortedTrumpSuitCards.length > 1) {
              let second = secondLast(sortedTrumpSuitCards)

              if (!isHigherCard(finalLeftTrumpCards, second)) return second
            }
            return first
          }
        }
        // i dont have higher card
        if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]

        // opponent winning with same suit card and not no trummpcard left

        if (finalLeftTrumpCards.length === 0) {
          if (sortedTrumpSuitCards.length > 1)
            return secondLast(sortedTrumpSuitCards)

          return last(sortedTrumpSuitCards)
        }

        if (!isHigherCard(finalLeftTrumpCards, last(sortedTrumpSuitCards))) {
          let first = last(sortedTrumpSuitCards)

          if (sortedTrumpSuitCards.length > 1) {
            let second = secondLast(sortedTrumpSuitCards)
            if (card[getFace(second)] > card[getFace(winningCard)])
              return second
          }
          return first

          /***
           * check last payers has trump card or not
           *
           *
           *
           *
           *
           *
           *
           */
        }

        if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]

        return mySortedCards[0]
      }

      // partner winning
      // partner card is  winning
      if (getSuit(winningCard) === playedSuit) {
        if (
          finalLeftCards.length > 0 &&
          !isHigherCard(finalLeftCards, winningCard) &&
          finalLeftTrumpCards.length === 0
        ) {
          if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
          return last(mySortedCards)
        }

        /**
         * check if i can win in next tourn tooo
         *
         *
         *
         *
         *
         *
         *
         */
        // check if i have winnign trump card

        if (finalLeftTrumpCards.length === 0) {
          if (sortedTrumpSuitCards.length > 1)
            return secondLast(sortedTrumpSuitCards)
          return last(sortedTrumpSuitCards)
        }

        if (finalLeftTrumpCards.length > 0) {
          if (!isHigherCard(finalLeftTrumpCards, last(sortedTrumpSuitCards))) {
            if (
              sortedTrumpSuitCards.length > 1 &&
              !isHigherCard(
                finalLeftTrumpCards,
                secondLast(sortedTrumpSuitCards)
              )
            ) {
              return secondLast(sortedTrumpSuitCards)
            }
            return last(sortedTrumpSuitCards)
          }
          if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]
          // partner not wining case
          return mySortedCards[0]
        }
      }

      if (
        finalLeftTrumpCards.length > 0 &&
        isHigherCard(finalLeftTrumpCards, winningCard)
      )
        if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)

      // partner dont have same suti card and trumo suit card

      if (
        lastPlayerCard != playedSuit &&
        lastPlayerCard != trumpSuit &&
        !isTrumOpp1
      ) {
        if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
        return last(sortedSuitCards)
      }

      if (nonTrumpCards.length > 0) return sortCard(nonTrumpCards)[0]

      if (winner === partnerIndex && nonTrumpCards.length > 0)
        return last(sortCard(nonTrumpCards))
      return mySortedCards[0]
    }

    // i dont have trump card but opponent wininng
    if (winner !== partnerIndex) {
      if (nonTrumpCards.length > 0 && isZeroCard(sortCard(nonTrumpCards)[0]))
        return sortCard(nonTrumpCards)[0]
      return mySortedCards[0]
    }

    if (winner === partnerIndex && nonTrumpCards.length > 0)
      if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
    return last(mySortedCards)
  }

  if (winner === partnerIndex) {
    if (nonTrumpCards.length > 0) return last(sortCard(nonTrumpCards))
    // return card you have must but dont send jack
    let temp = 0
    let suit = ''
    for (const key in suitNumber) {
      if (temp < suitNumber[key]) {
        temp = suitNumber[key]
        suit = key
      }
    }
    let suitCard = getSuitCards(ownCards, suit)

    // if you have have j and 9 of same suit return lower one
    let first = last(suitCard)

    if (suitCard.length > 1) {
      let second = secondLast(suitCard)
      if (getFace(first) === 'J' && getFace(second) === '9') return second
    }
    return first
  }
  if (nullify(myTeam, oppTeam, handsHistory)) return mySortedCards[0]
  if (handsHistory.length < 4 && myTeam.bid !== 0) return mySortedCards[0]

  return 0
}

// end of firstHand function 





function whoIsWinning (
  ownId,
  playersIds,
  playedCards,
  trumpSuit,
  trumpRevealed
) {
  const orginalPlayedCards = playedCards.slice()
  const sortedPlayedCards = sortCard(playedCards)

  const playerIndex = playersIds.indexOf(ownId)
  let winningCard = ''

  if (trumpSuit && trumpRevealed) {
    const trumpSuitCards = getSuitCards(playedCards, trumpSuit)

    // trump card not played
    if (trumpSuitCards.length > 0) {
      const sortedTrumpSuitCards = sortCard(trumpSuitCards)
      winningCard = last(sortedTrumpSuitCards)
    } else winningCard = last(sortedPlayedCards)
  } else winningCard = last(sortedPlayedCards)

  const winningCardIndex = orginalPlayedCards.indexOf(winningCard)
  const winnerIndex =
    (playerIndex + winningCardIndex + 4 - playedCards.length) % 4

  console.log('winnign card', winningCard, 'players', playersIds[winnerIndex])

  return [winningCard, winnerIndex]
}

function thirdPlayerHistory (ownId, playersIds, playedSuit, handsHistory) {
  const playersCards = setPlayedCards(playersIds, handsHistory)
  const ownIdIndex = playersIds.indexOf(ownId)
  let lastPlayerIndex = (ownIdIndex + 1 + 4) % 4

  let lastPlayerCard = ''

  for (let i = 0; i < playersCards.get('firstCard').length; i++) {
    if (playersCards.get('firstCard')[i][1] === playedSuit) {
      lastPlayerCard = playersCards.get(playersIds[lastPlayerIndex])[i]
    }
  }

  return lastPlayerCard
}

module.exports = thirdHand
