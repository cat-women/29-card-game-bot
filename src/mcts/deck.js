const crypto = require('crypto')

class Deck {
  constructor () {
    this.values = ['T', '9', '8', 'K', 'Q', 'J', '7', '1'] //6 not considered
    this.suits = ['S', 'D', 'C', 'H']

    this.playable_deck = new Array()

    for (var i = 0; i < this.suits.length; i++)
      for (var x = 0; x < this.values.length; x++)
        this.playable_deck.push(this.values[x] + this.suits[i])
    this.randomizeCards()

    /**
     * payable  cards - mycards
     * payable cards - card given to other players
     */
  }
  arrayRotate (count) {
    count -=
      this.playable_deck.length * Math.floor(count / this.playable_deck.length)
    this.playable_deck.push.apply(
      this.playable_deck,
      this.playable_deck.splice(0, count)
    )
  }

  randomInt (min, max) {
    var randbytes = parseInt(crypto.randomBytes(1).toString('hex'), 16)
    var result = Math.floor((randbytes / 256) * (max - min + 1) + min)

    // fallback
    if (result > max) result = Math.floor(Math.random() * (max - min + 1)) + min

    return result
  }

  randomizeCards () {
    /*randomize playable cards*/
    //this.arrayRotate(Math.floor((Math.random() * this.playable_deck.length)));
    this.arrayRotate(this.randomInt(0, this.playable_deck.length - 1))
    /* Fisher Yates shuffle */
    var m = this.playable_deck.length,
      i,
      t
    while (m) {
      //i = Math.floor(Math.random() * m--);
      i = this.randomInt(0, --m)
      t = this.playable_deck[m]
      this.playable_deck[m] = this.playable_deck[i]
      this.playable_deck[i] = t
    }
    //this.arrayRotate(-Math.floor((Math.random() * this.playable_deck.length)));
    this.arrayRotate(-this.randomInt(0, this.playable_deck.length - 1))

    for (var i = 0; i < 100; i++) {
      var location1 = Math.floor(Math.random() * this.playable_deck.length)
      var location2 = Math.floor(Math.random() * this.playable_deck.length)
      if (location1 != location2) {
        var tmp = this.playable_deck[location1]
        this.playable_deck[location1] = this.playable_deck[location2]
        this.playable_deck[location2] = tmp
      }
    }
  }
}

module.exports = Deck