class Node {
  constructor (state, parent = null) {
    this.state = state
    this.parent = parent
    this.children = []
    this.visits = 0
    this.wins = 0
  }

  selectChild () {
    //Select child with the highest UCB1 score
    const ucb1Scores = this.children.map(child => child.getUCB1())
    const maxScore = Math.max(...ucb1Scores)
    const maxChildren = this.children.filter(
      child => child.getUCB1() === maxScore
    )
    return maxChildren[Math.floor(Math.random() * maxChildren.length)]
  }

  expand () {
    //Expand the node by adding all possible children
    const possibleStates = getPossibleStates(this.state)
    this.children = possibleStates.map(state => new Node(state, this))
  }

  update (result) {
    //Update the node with the result of a playout
    this.visits++
    this.wins += result
  }

  getUCB1 () {
    //Calculate the UCB1 score for the node
    if (this.visits === 0) {
      return Infinity
    }
    return (
      this.wins / this.visits +
      Math.sqrt((2 * Math.log(this.parent.visits)) / this.visits)
    )
  }
}

function monteCarloTreeSearch (root) {
  //Perform the MCTS algorithm on the given root node
  for (let i = 0; i < numPlayouts; i++) {
    const leaf = traverseTree(root)
    const result = playout(leaf.state)
    backpropagate(leaf, result)
  }
}

function traverseTree (node) {
  //Traverse the tree from the given node to a leaf
  while (node.children.length > 0) {
    node = node.selectChild()
  }
  return node
}

function playout (state) {
  //Perform a playout from the given state
  while (!isTerminal(state)) {
    state = randomPlay(state)
  }
  return getResult(state)
}

function backpropagate (node, result) {
  //Backpropagate the result through the tree
  while (node) {
    node.update(result)
    node = node.parent
  }
}

function getBestChild (node) {
  //Return the child with the highest win rate
  return node.children.reduce((best, current) =>
    current.wins / current.visits > best.wins / best.visits ? current : best
  )
}
