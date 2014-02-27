
var MainGameLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    appleCell:null,
    allPossible:null,
    gameMap:null,
    screenSize:null,
    pastTime:0,
    moveDirection:SnakeMoveDirection.kUpDirection,
    gameState:GameState.kGameReady,
    deqPathCell:[],
    safePathCells:[],
    snake:null,
    playerSnake:null,    //player control snake
    isMoveAlready:false,
    pauseMenu:null,
    resumeMenu:null,
    displayScoreLabel:null,
    displayTimeStartLabel:null,
    AIScore:0,
    PlayerScore:0,
    drawLovePathIndex:0,
    applePathIndex:0,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        var bRet = false;
        //////////////////////////////
        // 1. super init first
        if (this._super()){
            this.screenSize = cc.Director.getInstance().getWinSize();

            var bgSprite = cc.Sprite.create(s_BackGround);
            bgSprite.setPosition(this.screenSize.width / 2, this.screenSize.height / 2);
            this.addChild(bgSprite);

            this.initGameMap();
            this.initSnakeBody();
            if(gGameMode == GameMode.kGameLove){
                this.generatorNewAppleByPlan();
            }else{
                this.generatorNewApple();
            }

            var gameArea = new GameArea();
            gameArea.setMainLayer(this);
            this.addChild(gameArea);

            // create menus
            this.initMenu();
            this.setAnchorPoint(0,0);

            gGameData.setLastScore(0);
            this.displayScoreLabel = cc.LabelTTF.create("Score:", "Marker Felt", displayScoreFontSize);
            this.displayScoreLabel.setString("Score: " + gGameData.lastScore);
            this.displayScoreLabel.setColor(cc.c3b(255, 0, 0));
            this.displayScoreLabel.retain();
            this.displayScoreLabel.setPosition(this.screenSize.width / 2, this.screenSize.height - menuTopPadding);
            this.addChild(this.displayScoreLabel);

            this.displayTimeStartLabel = cc.LabelTTF.create("3", "Marker Felt", displayTimeFontSize);
            this.displayTimeStartLabel.setColor(cc.c3b(0, 0, 255));
            this.displayTimeStartLabel.retain();
            this.displayTimeStartLabel.setPosition(this.screenSize.width / 2, this.screenSize.height / 2);
            this.addChild(this.displayTimeStartLabel);

            // schedule
            this.scheduleUpdate();
            this.setTouchEnabled(true);

            bRet = true;
        }
        return bRet;

    },
    initMenu:function(){
        var TopMenuItem = cc.MenuItemImage.create(
            s_Top,
            s_TopDown,
            this.onMenuUpCallback,
            this
        );
        var RightMenuItem = cc.MenuItemImage.create(
            s_Right,
            s_RightDown,
            this.onMenuRightCallback,
            this
        );
        var DownMenuItem = cc.MenuItemImage.create(
            s_Bottom,
            s_BottomDown,
            this.onMenuDownCallback,
            this
        );
        var LeftMenuItem = cc.MenuItemImage.create(
            s_Left,
            s_LeftDown,
            this.onMenuLeftCallback,
            this
        );

        var menuPositionX = this.screenSize.width / 2;
        var hNavigationMenu = cc.Menu.create(LeftMenuItem, RightMenuItem);
        hNavigationMenu.alignItemsHorizontallyWithPadding(directionMenuPadding);
        hNavigationMenu.setPosition(menuPositionX, menuPositionY);

        var vNavigationMenu = cc.Menu.create(TopMenuItem,DownMenuItem);
        vNavigationMenu.alignItemsVerticallyWithPadding(directionMenuPadding);
        vNavigationMenu.setPosition(menuPositionX, menuPositionY);
        this.addChild(hNavigationMenu);
        this.addChild(vNavigationMenu);

        var BackMenuItem = cc.MenuItemImage.create(
            s_Back,
            s_Back,
            this.onMenuBackCallback,
            this
        );
        var backMenu = cc.Menu.create(BackMenuItem);
        backMenu.setPosition(40, this.screenSize.height - menuTopPadding);
        this.addChild(backMenu);


        var PauseMenuItem = cc.MenuItemImage.create(
            s_Pause,
            s_Pause,
            this.onMenuPauseCallback,
            this
        );
        this.pauseMenu = cc.Menu.create(PauseMenuItem);
        this.pauseMenu.setPosition(this.screenSize.width - 40, this.screenSize.height - menuTopPadding);
        this.addChild(this.pauseMenu);

        var ResumeMenuItem = cc.MenuItemImage.create(
            s_Resume,
            s_Resume,
            this.onMenuResumeCallback,
            this
        );
        this.resumeMenu = cc.Menu.create(ResumeMenuItem);
        this.resumeMenu.setPosition(this.screenSize.width - 40, this.screenSize.height - menuTopPadding);
        this.resumeMenu.setVisible(false);
        this.addChild(this.resumeMenu);

    },
    onMenuBackCallback:function(sender){
        var nextScene = cc.Scene.create();
        var nextLayer = new WelcomeLayer;
        nextScene.addChild(nextLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionSlideInL.create(0.4, nextScene));
    },
    onMenuPauseCallback:function(sender){
        this.gameState = GameState.kGamePause;
        this.pauseMenu.setVisible(false);
        this.resumeMenu.setVisible(true);
    },
    onMenuResumeCallback:function(sender){
        this.gameState = GameState.kGameRunning;
        this.pauseMenu.setVisible(true);
        this.resumeMenu.setVisible(false);
    },
    onMenuUpCallback:function(sender){
	    cc.log("Up");
        if(this.moveDirection != SnakeMoveDirection.kDownDirection){
            this.moveDirection = SnakeMoveDirection.kUpDirection;
            this.isMoveAlready = false;
        }
    },
    onMenuRightCallback:function(sender){
        cc.log("Right");
        if(this.moveDirection != SnakeMoveDirection.kLeftDirection){
            this.moveDirection = SnakeMoveDirection.kRightDirection;
            this.isMoveAlready = false;
        }
    },
    onMenuDownCallback:function(sender){
        cc.log("Down");
        if(this.moveDirection != SnakeMoveDirection.kUpDirection){
            this.moveDirection = SnakeMoveDirection.kDownDirection;
            this.isMoveAlready = false;
        }
    },
    onMenuLeftCallback:function(sender){
        cc.log("Left");
        if(this.moveDirection != SnakeMoveDirection.kRightDirection){
            this.moveDirection = SnakeMoveDirection.kLeftDirection;
            this.isMoveAlready = false;
        }

    },
    initGameMap:function(){
        this.gameMap = new Array2D(xLineCount, yLineCount);
        this.allPossible = new Array();
        for(var y = 0; y < yLineCount; y++){
            for(var x = 0; x < xLineCount; x++){
                var cell = new Cell(x, y);
                this.gameMap.Set(x, y, cell);
                this.allPossible.push(cell);
            }
        }

    },
    initSnakeBody:function(){
        this.snake = new Snake(SnakeType.kComputerControl);

        var initSnakeBody = new Array();
        initSnakeBody.push(this.gameMap.Get(3, 3));
        initSnakeBody.push(this.gameMap.Get(3, 2));
        this.snake.initSnake(initSnakeBody);

        var partSnake;
        for(var i = 0; i < this.snake.getLength(); i++){
            partSnake = this.snake.getPartByIndex(i);
            this.removePossible(partSnake.getX(), partSnake.getY());
        }

        if(gGameMode == GameMode.kGameVSAI){
            this.playerSnake = new Snake(SnakeType.kPlayerControl);
            var playerInitSnakeBody = new Array();
            playerInitSnakeBody.push(this.gameMap.Get(11, 3));
            playerInitSnakeBody.push(this.gameMap.Get(11, 2));
            this.playerSnake.initSnake(playerInitSnakeBody);

            for(var i = 0; i < this.playerSnake.getLength(); i++){
                partSnake = this.playerSnake.getPartByIndex(i);
                this.removePossible(partSnake.getX(), partSnake.getY());
            }
        }
    },
    generatorNewAppleByPlan:function(){
        this.appleCell = this.gameMap.Get(applePath[this.applePathIndex][0],applePath[this.applePathIndex][1]) ;
        this.applePathIndex++;
    },
    generatorNewApple:function(){
        if(this.allPossible.length != 0){
            var randomIndex = Math.floor(Math.random() * this.allPossible.length);
            //randomIndex = 124;
            cc.log("randomIndex:%d", randomIndex);

            this.appleCell = this.allPossible[randomIndex];
            cc.log("apple position %d,%d", this.appleCell.getX(), this.appleCell.getY());
            //this.appleCell = this.gameMap.Get(2,1);
        }else{
            cc.log("kGamePerfectEnd");
            this.gameState = GameState.kGamePerfectEnd;
        }
    },
    getNextCellByDirection:function(headCell, direction){
        var result;
        switch (direction) {
            case SnakeMoveDirection.kUpDirection:
                result = new Cell(headCell.getX(), headCell.getY() + 1);
                break;
            case SnakeMoveDirection.kRightDirection:
                result = new Cell(headCell.getX() + 1, headCell.getY());
                break;
            case SnakeMoveDirection.kDownDirection:
                result = new Cell(headCell.getX(), headCell.getY() - 1);
                break;
            case SnakeMoveDirection.kLeftDirection:
                result = new Cell(headCell.getX() - 1, headCell.getY());
                break;

            default:
                break;
        }
        return result;
    },
    isLegalCell:function(x, y){
        var result = true;
        if(x < 0 || x > xLineCount - 1 || y < 0 ||
            y > yLineCount - 1){
            result = false;
        }
        return result;
    },
    removePossible:function(x, y){
        for(var i = 0; i < this.allPossible.length; i++){
            if(this.allPossible[i].getX() == x
                && this.allPossible[i].getY() == y){
                this.allPossible.splice(i, 1);
                return true;
            }
        }
        return false;
        //below more fast!
//	       for(var i = 0; i < this.allPossible.length; i++){
//            if(this.allPossible[i].getX() == x
//                && this.allPossible[i].getY() == y){
//                if(i == this.allPossible.length - 1){
//                    this.allPossible.pop();
//                }else{
//                    this.allPossible[i] = this.allPossible.pop();
//                }
//                return true;
//            }
//        }
//        return false;
    },
    checkIsHitTheWall:function(x, y){
        return !this.isLegalCell(x, y);
    },
    checkIsHitItself:function(x, y){
        return this.gameMap.Get(x, y).getIsCanBeHit();
    },
    displayScore:function(snake){
        if(gGameMode == GameMode.kGameClassic){
            gGameData.setLastScore(++(gGameData.lastScore));
            this.displayScoreLabel.setString("Score: " + gGameData.lastScore);
        }else if(gGameMode == GameMode.kGameJustAI || gGameMode == GameMode.kGameLove){
            this.displayScoreLabel.setString("Score: " + ++(this.AIScore));
        }else if(gGameMode == GameMode.kGameVSAI){
            if(snake.getType() == SnakeType.kComputerControl){
                this.AIScore = this.AIScore + 1;
            }else{
                this.PlayerScore = this.PlayerScore + 1;
            }
            this.displayScoreLabel.setString("Score: " + (this.PlayerScore - this.AIScore));
        }
    },
    displayResult:function(){
        if(gGameMode == GameMode.kGameVSAI){
            if(this.PlayerScore - this.AIScore > 0){
                this.displayScoreLabel.setString("You Win! " + this.PlayerScore + ":" + this.AIScore);
            }else if(this.PlayerScore - this.AIScore < 0){
                this.displayScoreLabel.setString("You Lose! " + this.PlayerScore + ":" + this.AIScore);
            }else{
                this.displayScoreLabel.setString("All are good. " + this.PlayerScore + ":" + this.AIScore);
            }
        }
    },
    checkEatAppleAndProduceNewAppleByPlan:function(snake){
        var headCell = snake.getHead();

        //snake eat an apple
        if(headCell.isSamePosition(this.appleCell)){
            this.displayScore(snake);
            snake.eatApple(this.appleCell);
            this.removePossible(snake.getPreviousTail().getX(), snake.getPreviousTail().getY());
            this.generatorNewAppleByPlan();
        }
    },
    checkEatApple:function(snake){
        var headCell = snake.getHead();

        //snake eat an apple
        if(headCell.isSamePosition(this.appleCell)){
            this.displayScore(snake);
            snake.eatApple(this.appleCell);
            this.removePossible(snake.getPreviousTail().getX(), snake.getPreviousTail().getY());
            this.generatorNewApple();
        }
    },
    moveSnakeAction:function(snake, x, y){
        if(this.checkIsHitTheWall(x, y) == false && this.checkIsHitItself(x, y) == false){
            var pNextCell = this.gameMap.Get(x, y);
            this.computerMoveSnakeAction(snake, pNextCell, false);
        }else{
            this.gameState = GameState.kGameOver;
            this.displayResult();
            this.showGameResult();
        }
    },
    computerMoveSnakeAction:function(snake, nextCell, test){

        snake.moveByNextCell(nextCell);

        if(test == false){
            //remove possible
            if(this.removePossible(nextCell.getX(), nextCell.getY())){
                this.allPossible.push(snake.getPreviousTail());
            }
        }
    },
    addCountDown:function(dt){
        if(this.gameState == GameState.kGameReady){
            this.pastTime += dt;
            if(this.pastTime >= 1 && this.pastTime < 2){
                this.displayTimeStartLabel.setString("2");
            }else if(this.pastTime >= 2 && this.pastTime < 3){
                this.displayTimeStartLabel.setString("1");
            }
            if(this.pastTime >= 3){
                this.pastTime = 0;
                this.gameState = GameState.kGameRunning;
                this.displayTimeStartLabel.setVisible(false);
            }

        }
    },
    update:function (dt) {
         this.addCountDown(dt);

        if(this.gameState == GameState.kGameReady ||
            this.gameState == GameState.kGamePause  || this.gameState == GameState.kGamePerfectEnd
            || this.gameState == GameState.kGameOver)
            return;

        var nextCell;
        if(gGameMode == GameMode.kGameDebug){
            if(this.isMoveAlready == false){
                nextCell = this.getNextCellByDirection(this.snake.getHead(), this.moveDirection);
                this.moveSnakeAction(this.snake, nextCell.getX(), nextCell.getY());
                //this.getNextCellBySnakeAI();
                this.checkEatApple(this.snake);
                this.isMoveAlready = true;

            }
        }else{
            this.pastTime += dt;

            var speed;
            if(gGameMode == GameMode.kGameJustAI || gGameMode == GameMode.kGameLove){
                speed = gGameData.snakeMoveSpeed;
            }else{
                speed = gGameData.getSnakeMoveSpeed();
            }


            if(this.pastTime >= speed){
                this.pastTime = 0;

                if(gGameMode == GameMode.kGameJustAI){
                    nextCell = this.getNextCellBySnakeAI();
                    this.computerMoveSnakeAction(this.snake, nextCell, false);
                    this.checkEatApple(this.snake);
                }else if(gGameMode == GameMode.kGameClassic){
                    nextCell = this.getNextCellByDirection(this.snake.getHead(), this.moveDirection);
                    this.moveSnakeAction(this.snake, nextCell.getX(), nextCell.getY());
                    this.checkEatApple(this.snake);
                }else if(gGameMode == GameMode.kGameVSAI){
                    nextCell = this.getNextCellBySnakeAI();
                    this.computerMoveSnakeAction(this.snake, nextCell, false);

                    var playerMoveNextCell = this.getNextCellByDirection(this.playerSnake.getHead(), this.moveDirection);
                    this.moveSnakeAction(this.playerSnake, playerMoveNextCell.getX(), playerMoveNextCell.getY());

                    this.checkEatApple(this.snake);
                    this.checkEatApple(this.playerSnake);

                }else if(gGameMode == GameMode.kGameLove){
                    if(this.snake.getLength() >= 93){
                        this.displayScoreLabel.setString("I Love You");
                        return;
                    }

                    if(this.snake.getLength() < 68){
                        nextCell = this.getNextCellBySnakeAI();
                    }else{
                        gGameData.snakeMoveSpeed = 0.25;
                        nextCell = this.getNextCellByPlan();
                    }
                    this.computerMoveSnakeAction(this.snake, nextCell, false);
                    this.checkEatAppleAndProduceNewAppleByPlan(this.snake);
                }

            }
        }




    },
    onTouchesEnded:function (touches, event) {
        if (touches.length <= 0)
            return;

        this.gameState = GameState.kGameRunning;
        this.displayTimeStartLabel.setVisible(false);
    },
    clearPath:function(){
        for(var y = 0; y < yLineCount; y++){
            for(var x = 0; x < xLineCount; x++){
                this.gameMap.Get(x, y).setDistance(0);
                this.gameMap.Get(x, y).setLastX(-1);
                this.gameMap.Get(x, y).setLastY(-1);
                this.gameMap.Get(x, y).setMarked(false);
            }
        }
        this.deqPathCell = [];
    },
    fullFillPathData : function(goalX, goalY){
        this.deqPathCell = [];
        var cell = this.gameMap.Get(goalX, goalY);
        while(cell.getLastX() != -1){
            this.deqPathCell.push(cell);
            cell = this.gameMap.Get(cell.getLastX(),cell.getLastY());
        }
    },
    distanceBetweenTwoCells : function(c1X, c1Y, c2X, c2Y){
        return  Math.sqrt(Math.pow(c2X - c1X,2) + Math.pow(c2Y - c1Y,2));
    },
    compareByDistanceBetweenStartAndGoal : function(c1, c2){
        if(c1 != null && c2 != null){
            var distanceOfC1AndGoal = c1.getDistance() +
                Math.sqrt(Math.pow(g_goalX - c1.getX(),2) + Math.pow(g_goalY - c1.getY(),2));

            var distanceOfC2AndGoal = c2.getDistance() +
                Math.sqrt(Math.pow(g_goalX - c2.getX(),2) + Math.pow(g_goalY - c2.getY(),2));
            if(distanceOfC1AndGoal <= distanceOfC2AndGoal){
                return false;
            }else{
                return true;
            }
        }
    },
    compareTwoCellsByDistance : function(c1, c2){
        if(c1 != null && c2 != null){
            if(c1.getDistance() <= c2.getDistance()){
                return false;
            }else{
                return true;
            }
        }

    },
    compareByDistanceBetweenGoal : function(c1, c2){
        if(c1 != null && c2 != null){
            var distanceOfC1AndGoal =
                Math.sqrt(Math.pow(g_goalX - c1.getX(),2) + Math.pow(g_goalY - c1.getY(),2));

            var distanceOfC2AndGoal =
                Math.sqrt(Math.pow(g_goalX - c2.getX(),2) + Math.pow(g_goalY - c2.getY(),2));
            if(distanceOfC1AndGoal <= distanceOfC2AndGoal){
                return true;
            }else{
                return false;
            }
        }

    },
    startPathFinding:function(startX, startY, goalX, goalY,compareMethod){
        this.clearPath();
        g_goalX = goalX;
        g_goalX = goalY;

        var startCell = this.gameMap.Get(startX, startY);
        var vecCells = new Waitingfy.Heap([], compareMethod);
        //vecCells.push(startCell);
        vecCells.push_heap(startCell);
        startCell.setMarked(true);
        var nowProcessCell;

        while(vecCells.getVec().length != 1){
            vecCells.pop_heap();
            nowProcessCell = vecCells.getVec().pop();

            if(nowProcessCell.getX() == goalX && nowProcessCell.getY() == goalY){//the goal is reach
                this.fullFillPathData(goalX, goalY);
                return true;
            }

            for(var i = 0; i < 4; i++){ //check four direction

                var indexX = nowProcessCell.getX() + DIRECTION[i][0];
                var indexY = nowProcessCell.getY() + DIRECTION[i][1];

                if(this.isLegalCell(indexX, indexY)
                    && (this.gameMap.Get(indexX,indexY).getIsCanBeHit() == false || (indexX == goalX
                    && indexY == goalY
                    ))){//check is a OK cell or not
                    var cell = this.gameMap.Get(indexX,indexY);
                    var beforeDistance = 1 + this.gameMap.Get(nowProcessCell.getX(),
                        nowProcessCell.getY()).getDistance();//calculate the distance
                    if(cell.getMarked() == false){
                        cell.setMarked(true);
                        cell.setLastX(nowProcessCell.getX());
                        cell.setLastY(nowProcessCell.getY());
                        cell.setDistance(beforeDistance);
                        vecCells.push_heap(cell);
                    }else{// if find a lower distance, update it
                        if(beforeDistance < cell.getDistance()){
                            cell.setDistance(beforeDistance);
                            cell.setLastX(nowProcessCell.getX());
                            cell.setLastY(nowProcessCell.getY());
                            vecCells.makeHeap();// distance change,so make heap again
                        }
                    }
                }

            }
        }

        return false;

    },
    restoreSnakeMarkInMap : function(snake){
        for(var y = 0; y < yLineCount; y++){
            for(var x = 0; x < xLineCount; x++){
                this.gameMap.Get(x, y).setIsCanBeHit(false);
            }
        }
        for(var i = 0; i < snake.length; i++){
            this.gameMap.Get(snake[i].getX(), snake[i].getY()).setIsCanBeHit(true);
        }

        if(gGameMode == GameMode.kGameVSAI){
            for(var i = 0; i < this.playerSnake.getLength(); i++){
                this.gameMap.Get(this.playerSnake.getPartByIndex(i).getX(), this.playerSnake.getPartByIndex(i).getY()).setIsCanBeHit(true);
            }
        }
    },
    getNextCellByPlan:function(){
        var result;
        result = this.gameMap.Get(drawLovePath[this.drawLovePathIndex][0], drawLovePath[this.drawLovePathIndex][1]);
        this.drawLovePathIndex++;

        return result;


    },
    tryUseAStarToEatApple:function(){
        var canFindPath = false;
        var canFindTail = false;
        canFindPath = this.startPathFinding(this.snake.getHead().getX(), this.snake.getHead().getY(),
            this.appleCell.getX(), this.appleCell.getY(),this.compareByDistanceBetweenStartAndGoal);
        if(canFindPath){//if snake can find apple, try to eat the apple,after move a fake snake, check it can find path to its tail or not.
            var copySnake = this.snake.fork();
            var savePath = this.deqPathCell;
            this.safePathCells = this.deqPathCell.slice(0);
            while(savePath.length > 0){
                this.computerMoveSnakeAction(copySnake, savePath.pop(), true);
            }
            //after move check if the head can reach tail
            //do not forget after the fake snake eat the apple, its length change
            copySnake.getSnakeBody().push(copySnake.getPreviousTail());
            canFindTail = this.startPathFinding(copySnake.getHead().getX(), copySnake.getHead().getY(),
                copySnake.getTail().getX(), copySnake.getTail().getY(),this.compareByDistanceBetweenStartAndGoal);
            //restore snake
            this.restoreSnakeMarkInMap(this.snake.getSnakeBody());
            if(canFindTail){
                return this.safePathCells.pop();
            }
        }
        //if can not find path to apple or can not find path to its tail, we just move to a cell that is farthest to the apple
        // and still can find the path to its tail
        if(canFindPath == false || canFindTail == false ){
            return this.getACellThatIsFarthestToGoal();
        }
    },
    tryMoveToCellThatIsFarthestToGoal:function(){
        var canFindPath = false;
        var canFindTail = false;
        var nextCellX, nextCellY;
        var nextCell;
        var distanceBetweenGoal;
        var maxDistanceBetweenNextCellAndGoal = 0;
        var maxDistanceCell = null;
        var nextCellIsGoal = false;
        for(var i = 0; i < 4; i++){
            nextCellX = this.snake.getHead().getX() + DIRECTION[i][0];
            nextCellY = this.snake.getHead().getY() + DIRECTION[i][1];
            if(this.isLegalCell(nextCellX, nextCellY)){
                nextCell = this.gameMap.Get(nextCellX, nextCellY);
                if(nextCell.getIsCanBeHit() == false ){
                    var copySnake = this.snake.fork();
                    this.computerMoveSnakeAction(copySnake,nextCell, true);
                    if(nextCell.isSamePosition(this.appleCell)){
                        copySnake.getSnakeBody().push(this.snake.getTail());
                        nextCellIsGoal = true;
                    }
                    var canFindTheTail = this.startPathFinding(nextCell.getX(), nextCell.getY(),copySnake.getTail().getX(),
                        copySnake.getTail().getY(),this.compareByDistanceBetweenStartAndGoal);
                    if(nextCellIsGoal && canFindTheTail){
                        return nextCell;
                    }
                    distanceBetweenGoal = this.deqPathCell.length;
                    canFindPath = this.startPathFinding(nextCell.getX(),  nextCell.getY(),
                        this.appleCell.getX(), this.appleCell.getY(),this.compareByDistanceBetweenStartAndGoal);
                    this.restoreSnakeMarkInMap(this.snake.getSnakeBody());
                    if(canFindTheTail && canFindPath){
                        if(distanceBetweenGoal > maxDistanceBetweenNextCellAndGoal){
                            maxDistanceBetweenNextCellAndGoal = distanceBetweenGoal;
                            maxDistanceCell = nextCell;
                        }
                    }
                }
            }
        }
        if(maxDistanceCell != null){
            return maxDistanceCell;
        }else{
            return this.getACellThatIsFarthestToGoal();
        }
    },

    getACellThatIsFarthestToGoal:function(){
        this.safePathCells = [];
        var nextCellX, nextCellY;
        var nextCell;
        var maxDistanceBetweenNextCellAndGoal = 0;
        var distanceWithGoal = 0;
        var maxDistanceCell = null;
        for(var i = 0; i < 4; i++){
            nextCellX = this.snake.getHead().getX() + DIRECTION[i][0];
            nextCellY = this.snake.getHead().getY() + DIRECTION[i][1];
            if(this.isLegalCell(nextCellX, nextCellY)){
                nextCell = this.gameMap.Get(nextCellX, nextCellY);
                if(nextCell.getIsCanBeHit() == false ){
                    var copySnake = this.snake.fork();
                    this.computerMoveSnakeAction(copySnake,nextCell, true);
                    if(nextCell.isSamePosition(this.appleCell)){
                        copySnake.getSnakeBody().push(this.snake.getTail());
                    }
                    var canFindTheTail = this.startPathFinding(nextCell.getX(), nextCell.getY(),copySnake.getTail().getX(),
                        copySnake.getTail().getY(),this.compareByDistanceBetweenStartAndGoal);
                    this.restoreSnakeMarkInMap(this.snake.getSnakeBody());
                    if(canFindTheTail){
                        distanceWithGoal = Math.pow(this.appleCell.getX() - nextCellX, 2) + Math.pow(this.appleCell.getY() - nextCellY, 2) ;
                        if(distanceWithGoal > maxDistanceBetweenNextCellAndGoal){
                            maxDistanceBetweenNextCellAndGoal = distanceWithGoal;
                            maxDistanceCell = nextCell;
                        }
                    }
                }
            }
        }
        //can not find cell, so just move to the tail, a snake can not hit its tail
        if(maxDistanceCell == null){
            maxDistanceCell = this.snake.getTail();
        }
        return maxDistanceCell;
    },


    getNextCellBySnakeAI:function(){
        //cc.log("snake lenght:%d", this.snake.getLength());
        var canFindPath = false;
        var canFindTail = false;
        if(this.snake.getLength() <= xLineCount * yLineCount / 2){
             return this.tryUseAStarToEatApple();
        }else{
            //cc.log("special method, try to keep away with goal");
             return this.tryMoveToCellThatIsFarthestToGoal();
        }



    },
    showGameResult:function(){
        var resultLayer = new ResultLayer;
        resultLayer.initResultData();
        this.onExit();
        cc.Director.getInstance().getRunningScene().addChild(resultLayer,99);
    }
});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainGameLayer();
        this.addChild(layer);
        //layer.init();
    }
});
