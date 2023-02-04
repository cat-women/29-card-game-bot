class MonteCarloNode {
  constructor (parent, play, state, unexpandedPlays) {
    this.play = play
    this.state = state

    this.n_plays = 0
    this.n_wins = 0

    this.parent = parent
    this.children = new Map()
    for (let play of unexpandedPlays) {
      this.children.set(play, { play: play, node: null })
    }
  }

  //   child
  childNode (play) {
    let child = this.children.get(play)
    if (child === undefined) throw new Error('you dont have child')
    else if (child.node === null) throw new Error('Child not expanded ')
    return child.node
  }

  //   expading all child
  expand (play, childState, unexpandedPlays) {
    if (!this.children.has(play)) throw new Error('No such play exit')
    let childNode = new MonteCarloNode(this, play, childState, unexpandedPlays)
    if (childState.played_cards.length < 4)
      this.children.set(play, { play: play, node: childNode })
    return childNode
  }

  // all the plays in child
  allPlays () {
    let ret = []
    for (let child of this.children.values()) {
      ret.push(child.play)
    }
    return ret
  }

  //   all unexpanded node
  unexpandedPlays () {
    let ret = []
    for (let child of this.children.values()) {
      if (child.node === null) ret.push(child.play)
    }
    return ret
  }

  isFullyExpanded () {
    for (let child of this.children.values()) {
      if (child.node === null) return false
    }
    return true
  }

  isLeaf () {
    if (this.children.size === 0) return true
    else return false
  }

  getUCB1 (biasParam) {
    return (
      this.n_wins / this.n_plays +
      Math.sqrt((biasParam * Math.log(this.parent.n_plays)) / this.n_plays)
    )
  }
}

module.exports = MonteCarloNode
