
const history = 
[
 [ 'You-0', [ 'JD', '7D', 'QD', 'KD' ], 'You-0' ],
 [ 'You-0', [ 'JH', '9H', '8H', '7H' ], 'You-0' ],
 [ 'You-0', [ '7S', 'QS', 'KS', 'JS' ], 'Opponent-1' ],
 [ 'Opponent-1', [ 'TH', 'QH', 'QC', '1H' ], 'You-1' ],
 [ 'You-1', [ 'JC', '9S', 'KC', '9C' ], 'Opponent-1' ],
 [ 'Opponent-1', [ '1S', '8S', '7C', 'TS' ], 'Opponent-1' ],
 [ 'Opponent-1', [ 'KH', '1D', '1C', '8C' ], 'Opponent-1' ]
]
const playersIds= [ 'Opponent-0', 'You-0', 'Opponent-1', 'You-1' ]

let playersHistory=[]
for(let i =0 ; i <playersIds.length ; i++){
   playersHistory[i] = playersIds[i]
}

history.map((item) =>{
for(let i =0 ; i <playersHistory.length ; i++){
    let j =0
   if(item[0] == playersHistory[i] ){
       let index = i;
       playersHistory[index].push(item[i][j])
       j++
       (index > 4) ? index++ : index == 0
      }
   
}
})


// 

console.log(playersHistory)






history.map((item) =>{
    for (var key of Object.keys(playersHistory)) {
        
        if(item[0] == key){
            let j = 0
            for (var key of Object.keys(playersHistory)){
                playersHistory[key].push(item[1][j])
                j++
            }
        }}  
    })





    // just do it 

  const history = handsHistory.filter(
    hand => getSuit(hand[1][0]) === playedSuit
  )

  if (history.length === 0) return { partnerPrevCard: 0, oppPrevCard: 0 }

  const lastMove = history[history.length - 1]
  const cards = lastMove[1]

  const ownIdIndex = playersIds.indexOf(ownId)
  // console.log("lastMove",lastMove,"cards",cards)
  const firstPlayerIndex = getFirstPlayerIndex(playersIds, lastMove)
  const partnerPrevCard = getSecondPlayerCard(
    ownIdIndex,
    firstPlayerIndex,
    cards
  )
  const oppPrevCard = getThirdPlayerCard(ownIdIndex, firstPlayerIndex, cards)

 