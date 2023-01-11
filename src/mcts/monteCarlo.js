const MonteCarloNode = require('./monteCarloNode')


class MonteCarlo{
    constructor(game, UCB1ExploreParam = 2){
        this.game =game
        this.UCB1ExploreParam = UCB1ExploreParam
        this.nodes = new Map()
    }

    makeNode(state){
        if(!this.nodes.has(state.hash())){
            let unexpandedPlays = this.game.legalMove(state,cards, trumpSuit)
        }
    }
}