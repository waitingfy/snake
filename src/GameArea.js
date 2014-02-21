/**
 * Created by huguangli on 14-2-18.
 */

//var topMargin = 50;
//var bottomMargin = 150;
//var leftMargin = 25;
//var rightMargin = 25;

var topMargin = 100;
var bottomMargin = 270;
var leftMargin = 30;
var rightMargin = 30;

var GameArea = cc.Node.extend({
    screenSize:null,
    eachBoxWidth:0,
    eachBoxHeight:0,
    mainLayer:null,
    init:function () {
        this.screenSize = cc.Director.getInstance().getWinSize();
    },
    ctor:function () {
        this._super();
        this.init();
    },
    setMainLayer:function(layer){
        this.mainLayer = layer;
    },
    setSnake:function(snake){
        this.snake = snake;
    },
    setApple:function(apple){
       this.appleCell = apple;
    },
    draw:function () {
        this._super();
        this.drawWholeMap();
        this.drawSnake(this.mainLayer.snake);
        //this.drawPath(this.mainLayer.safePathCells);
        if(gGameMode == GameMode.kGameVSAI){
           this.drawSnake(this.mainLayer.playerSnake);
        }
        if(this.mainLayer.gameState != GameState.kGamePerfectEnd){
            this.drawApple(this.mainLayer.appleCell);
        }

        if(this.isEndOfDrawHeart()){
            this.drawHeart();
        }

    },
    drawWholeMap:function(){
        //set color white
        cc.drawingUtil.setDrawColor4B(0,0,0,255);
        //cc.drawingUtil.setLineWidth(10);

        var startPointX = leftMargin;
        var startPointY = bottomMargin;
        var endPointX = this.screenSize.width - rightMargin;
        var endPointY = bottomMargin;
        var totalWidth = this.screenSize.width - (leftMargin + rightMargin);
        var totalHeight = this.screenSize.height - (topMargin + bottomMargin);
        this.eachBoxWidth = totalWidth / xLineCount;
        this.eachBoxHeight = totalHeight / yLineCount;

        cc.drawingUtil.drawLine(cc.p(startPointX,startPointY),cc.p(endPointX,endPointY));//draw horizontal line
        cc.drawingUtil.drawLine(cc.p(startPointX,this.screenSize.height - topMargin),
            cc.p(endPointX,this.screenSize.height - topMargin));//draw horizontal line

//        for(var i = 0; i <= yLineCount; i++){
//            cc.drawingUtil.drawLine(cc.p(startPointX,startPointY),cc.p(endPointX,endPointY));//draw horizontal line
//            startPointY += this.eachBoxHeight;
//            endPointY = startPointY;
//        }

        startPointX = leftMargin;
        startPointY = bottomMargin;
        endPointX = leftMargin;
        endPointY = this.screenSize.height - topMargin;

        cc.drawingUtil.drawLine(cc.p(startPointX,startPointY),cc.p(endPointX,endPointY));//draw vertical line
        cc.drawingUtil.drawLine(cc.p(this.screenSize.width - rightMargin, bottomMargin),
            cc.p(this.screenSize.width - rightMargin,endPointY));//draw vertical line

//        for(var i = 0; i <= xLineCount; i++){
//            cc.drawingUtil.drawLine(cc.p(startPointX,startPointY),cc.p(endPointX,endPointY));//draw vertical line
//            startPointX += this.eachBoxWidth;
//            endPointX = startPointX;
//        }
    },
    drawSnake:function(snake){
        if(snake == null){
            return;
        }

        //var snakeBodyColor = cc.c4f(1, 1, 1, 1);
        var snakeBodyColor = cc.c4f(0, 0.5, 0.25, 1);

        var cell;
        var nextCell;
        var startX,startY,endX,endY;
        for (var i = 0; i < snake.getLength(); i++) {
            cell = snake.getPartByIndex(i);
            startX = leftMargin + cell.getX() * this.eachBoxWidth + cellPadding;
            startY = bottomMargin + cell.getY() * this.eachBoxHeight + cellPadding;
            endX = leftMargin + (cell.getX() + 1) * this.eachBoxWidth - cellPadding;
            endY = bottomMargin + (cell.getY() + 1) * this.eachBoxHeight - cellPadding;
            if(i == snake.getLength() - 1){
                cc.drawingUtil.drawSolidRect(cc.p(startX,startY), cc.p(endX,endY), cc.c4f(0, 0, 1, 1));
            }else{
                cc.drawingUtil.drawSolidRect(cc.p(startX,startY), cc.p(endX,endY), snakeBodyColor);
            }


            if(this.isEndOfDrawHeart() == false){
                //draw train
                if(i + 1 < snake.getLength()){
                    nextCell = snake.getPartByIndex(i + 1);
                    startX = leftMargin + (nextCell.getX() + 1) * this.eachBoxWidth - cellPadding;
                    startY = bottomMargin + nextCell.getY() * this.eachBoxHeight + cellPadding;
                    endX = leftMargin + cell.getX() * this.eachBoxWidth + cellPadding;
                    endY = bottomMargin + (cell.getY() + 1) * this.eachBoxHeight - cellPadding;
                    cc.drawingUtil.drawSolidRect(cc.p(startX,startY), cc.p(endX,endY), snakeBodyColor);
                }
            }


        }
    },
    drawApple:function(apple){
        if(apple != null){
            var startX,startY,endX,endY;
            startX = leftMargin + apple.getX() * this.eachBoxWidth + cellPadding;
            startY = bottomMargin + apple.getY() * this.eachBoxHeight + cellPadding;
            endX = leftMargin + (apple.getX() + 1) * this.eachBoxWidth - cellPadding;
            endY = bottomMargin + (apple.getY() + 1) * this.eachBoxHeight - cellPadding;

            cc.drawingUtil.drawSolidRect(cc.p(startX,startY),cc.p(endX,endY), cc.c4f(1, 0, 0, 1));
            //cc.drawingUtil.drawCircle()
        }
    },
    drawPath : function(path){
        var cell;
        var startX,startY,endX,endY;
        for (var i = 0; i < path.length; i++) {
            cell = path[i];
            startX = leftMargin + cell.getX() * this.eachBoxWidth + cellPadding;
            startY = bottomMargin + cell.getY() * this.eachBoxHeight + cellPadding;
            endX = leftMargin + (cell.getX() + 1) * this.eachBoxWidth - cellPadding;
            endY = bottomMargin + (cell.getY() + 1) * this.eachBoxHeight - cellPadding;
            cc.drawingUtil.drawSolidRect(cc.p(startX,startY), cc.p(endX,endY), cc.c4f(0, 1, 0, 1));
        }
    },
    drawHeart:function(){
        var cell;
        var nextCell;
        var startX,startY,endX,endY;
        for (var i = 0; i < headPath.length; i++) {
            cell = headPath[i];
            startX = leftMargin + cell[0] * this.eachBoxWidth + cellPadding;
            startY = bottomMargin + cell[1] * this.eachBoxHeight + cellPadding;
            endX = leftMargin + (cell[0] + 1) * this.eachBoxWidth - cellPadding;
            endY = bottomMargin + (cell[1] + 1) * this.eachBoxHeight - cellPadding;
            cc.drawingUtil.drawSolidRect(cc.p(startX,startY), cc.p(endX,endY), cc.c4f(1, 0, 0, 1));
        }
    },
    isEndOfDrawHeart:function(){
        if(gGameMode == GameMode.kGameLove){
            if(this.mainLayer.snake.getLength() == 93){
                return true;
            }
        }
        return false;
    }
})