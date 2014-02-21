


function Snake(type){
    this.snakeBody = null;
    this.previousTail = null;
    this.snakeType = type;
}

Snake.prototype = {
    initSnake : function(body){
        this.snakeBody = body;
        for(var i = 0; i < this.snakeBody.length; i ++){
            this.snakeBody[i].setIsCanBeHit(true);
        }
    },
    fork : function(){
        var newSnake = new Snake();
        newSnake.initSnake(this.snakeBody.slice(0));
        return newSnake;
    },
    getSnakeBody : function(){
        return this.snakeBody;
    },
    getHead : function(){
        return this.snakeBody[0];
    },
    getTail : function(){
        return this.snakeBody[this.snakeBody.length - 1];
    },
    getPreviousTail : function(){
        return this.previousTail;
    },
    removeTail : function(){
        return this.snakeBody.pop();
    },
    getLength : function(){
        return this.snakeBody.length;
    },
    getPartByIndex : function(index){
        return this.snakeBody[index];
    },
    moveByNextCell : function(nextCell){
        //mark the nextCell
        nextCell.setIsCanBeHit(true);

        //move snake only do two thing
        // 1. add next cell to the head of snake
        this.snakeBody.unshift(nextCell);

        //2. remove the last and save it
        this.previousTail = this.snakeBody.pop();
        this.previousTail.setIsCanBeHit(false);
    },
    eatApple : function(apple){
        this.previousTail.setIsCanBeHit(true);
        this.snakeBody.push(this.previousTail);
    },
    getType : function(){
        return this.snakeType;
    }
}