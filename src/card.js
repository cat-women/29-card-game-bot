const card = []

card['7'] = 0
card['8'] = 0
card['Q'] = 0
card['K'] = 0
card['T'] = 1
card['1'] = 1.5
card['9'] = 2
card['J'] = 3

const Deck = {
  C: ['JC', '9C', '1C', 'TC', 'KC', 'QC', '8C', '7C'],
  D: ['JD', '9D', '1D', 'TD', 'KD', 'QD', '8D', '7D'],
  H: ['JH', '9H', '1H', 'TH', 'KH', 'QH', '8H', '7H'],
  S: ['JS', '9S', '1S', 'TS', 'KS', 'QS', '8S', '7S']
}

const playersCardHistory = {
  you0: {},
  opp0: {},
  you1: {},
  opp1: {}
} 
module.exports = { card, Deck }
