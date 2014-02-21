var gSharedEngine = cc.AudioEngine.getInstance();

var MUSIC_BACKGROUND  = "audio/musicByFoxSynergy.mp3";
var EFFECT_BUTTON_CHICK  = "audio/effect_buttonClick.ogg";
var EFFECT_GAME_FAIL  = "audio/effect_game_fail.ogg";


var s_BackGround = "background1.png";
var s_Logo = "logo2.png";
var s_Back = "back.png";
var s_Pause = "pause.png";
var s_Resume = "resume.png";
var s_Top = "topNor.png";
var s_TopDown = "topDown.png";
var s_Right = "rightNor.png";
var s_RightDown = "rightDown.png";
var s_Bottom = "bottomNor.png";
var s_BottomDown = "bottomDown.png";
var s_Left = "leftNor.png";
var s_LeftDown = "leftDown.png";
var s_LoveMenuItemNor = "btnLoveModeNor.png";
var s_LoveMenuItemDown = "btnLoveModeDown.png";
var s_ClassicMenuItemNor = "btnClassicModeNor.png";
var s_ClassicMenuItemDown = "btnClassicModeDown.png";
var s_AIMenuItemNor = "btnJustAIModeNor.png";
var s_AIMenuItemDown = "btnJustAIModeDown.png";
var s_VSMenuItemNor = "btnVSModeNor.png";
var s_VSMenuItemDown = "btnVSModeDown.png";
var s_SettingMenuItemNor = "btnSettingsNor.png";
var s_SettingMenuItemDown = "btnSettingsDown.png";
var s_RestartMenuItemNor = "btnResultRestart.png";
var s_RestartMenuItemDown = "btnResultRestartDown.png";
var s_Star = "star.png";
var s_SnakeWeep = "snakeWeep187.png";
var s_SliderTrack = "sliderTrack.png";
var s_SliderProgress = "sliderProgress.png";
var s_SliderThumb = "sliderThumb.png";

var g_resources = [
    //image
    {src:s_BackGround},
    {src:s_Logo},
    {src:s_Back},
    {src:s_Pause},
    {src:s_Resume},
    {src:s_Top},
    {src:s_TopDown},
    {src:s_Right},
    {src:s_RightDown},
    {src:s_Bottom},
    {src:s_BottomDown},
    {src:s_Left},
    {src:s_RightDown},
    {src:s_LoveMenuItemNor},
    {src:s_LoveMenuItemDown},
    {src:s_ClassicMenuItemNor},
    {src:s_ClassicMenuItemDown},
    {src:s_AIMenuItemNor},
    {src:s_AIMenuItemDown},
    {src:s_VSMenuItemNor},
    {src:s_VSMenuItemDown},
    {src:s_SettingMenuItemNor},
    {src:s_SettingMenuItemDown},
    {src:s_RestartMenuItemNor},
    {src:s_RestartMenuItemDown},
    {src:s_Star},
    {src:s_SliderTrack},
    {src:s_SliderProgress},
    {src:s_SliderThumb},
    {src:s_SnakeWeep}
    //plist

    //fnt

    //tmx

    //bgm

    //effect
//    {src:MUSIC_BACKGROUND},
//    {src:EFFECT_BUTTON_CHICK},
//    {src:EFFECT_GAME_FAIL}
];

//var directionMenuPadding = 50;
var directionMenuPadding = 75;
//var menuPositionY = 70;
var menuPositionY = 140;
//var menuTopPadding = 25;
var menuTopPadding = 48;
//var displayScoreFontSize =  28;
//var displayTimeFontSize =  80;
var displayScoreFontSize =  42;
var displayTimeFontSize =  120;
var xLineCount = 20;
var yLineCount = 20;
var cellPadding = 1;

var SnakeMoveDirection = {
    kUpDirection : 0,
    kRightDirection:1,
    kDownDirection:2,
    kLeftDirection:3
};

var GameState = {
    kGameReady : 0,
    kGamePause : 1,
    kGameRunning : 2,
    kGameOver : 3,
    kGamePerfectEnd : 4
} ;

var GameMode = {
    kGameJustAI : 0,
    kGameDebug : 1,
    kGameClassic: 2,
    kGameVSAI : 3,
    kGameLove : 4
};

var SnakeType = {
    kComputerControl : 0,
    kPlayerControl : 1
};


var gGameMode = GameMode.kGameClassic;


var DIRECTION = [[0,1],[1,0],[0,-1],[-1,0]];

var gGameData = {lastScore:0,bestScore:0,snakeMoveSpeed:0.5};

gGameData.setLastScore = function(score){
    this.lastScore = score;

    if (score > this.bestScore)
    {
        this.bestScore = score;
        sys.localStorage.setItem('bestScore',this.bestScore);
    }
    sys.localStorage.setItem('lastScore',this.lastScore);
};

gGameData.getSnakeMoveSpeed = function(){
    return sys.localStorage.getItem('snakeMoveSpeed');
}
gGameData.setSnakeMoveSpeed = function(speed){
    sys.localStorage.setItem('snakeMoveSpeed', speed);
}

gGameData.initData = function(){

    if( sys.localStorage.getItem('gameData1') == null){
        sys.localStorage.setItem('bestScore','0');
        sys.localStorage.setItem('lastScore','0');

        sys.localStorage.setItem('gameData',33) ;
        sys.localStorage.setItem('snakeMoveSpeed','0.5');
        return;
    }

    this.bestScore = parseInt(sys.localStorage.getItem('bestScore'));
};

var g_goalX = 0;
var g_goalY = 0;

//92
var drawLovePath=[
    //[3,11],
    [ 3,12],[ 3,13],[ 2,13],[ 2,12],[ 2,11],[ 2,10],[ 2, 9],[ 2, 8],[ 2, 7],[ 2, 6],
    [ 2, 5],[ 3, 5],[ 3, 6],[ 3, 7],[ 3, 8],[ 3, 9],[ 3,10],[ 4,10],[ 4, 9],[ 4, 8],
    [ 5, 8],[ 5, 7],[ 6, 7],[ 6, 6],[ 7, 6],[ 7, 5],[ 8, 5],[ 8, 6],[ 9, 6],[10, 6],
    [10, 7],[11, 7],[11, 8],[12, 8],[12, 9],[13, 9],[13, 8],[13, 7],[13, 6],[13, 5],
    [14, 5],[15, 5],[16, 5],[17, 5],[18, 5],[18, 6],[18, 7],[18, 8],[18, 9],[18,10],

    [18,11],[18,12],[18,13],[17,13],[17,12],[17,11],[17,10],[17, 9],[17, 8],[17, 7],
    [17, 6],[16, 6],[15, 6],[14, 6],[14, 7],[14, 8],[14, 9],[14,10],[14,11],[14,12],
    [14,13],[13,13],[13,12],[13,11],[13,10],[12,10],[12,11],[11,11],[11,12],[11,13],
    [10,13],[10,12],[ 9,12],[ 9,11],[ 8,11],[ 7,11],[ 7,12],[ 6,12],[ 6,13],[ 5,13],
    [ 5,12],[ 5,11],[ 4,11]
]

var headPath=[
    [ 4,10],[ 4, 9],[ 4, 8],[ 5, 8],[ 5, 7],[ 6, 7],[ 6, 6],[ 7, 6],[ 7, 5],[ 8, 5],
    [ 8, 6],[ 9, 6],[10, 6],[10, 7],[11, 7],[11, 8],[12, 8],[12, 9],[12,10],[12,11],
    [11,11],[11,12],[11,13],[10,13],[10,12],[ 9,12],[ 9,11],[ 8,11],[ 7,11],[ 7,12],
    [ 6,12],[ 6,13],[ 5,13],[ 5,12],[ 5,11],[ 4,11]
]

var applePath=[
    [11,13],[15,10],[10, 9],[19, 6],[13, 3],[ 1,18],[ 7,16],[18, 1],[13, 3],[13, 7],
    [11,18],[ 9, 9],[19,15],[ 5, 0],[ 6, 9],[ 3, 6],[18,11],[ 4,14],[12,16],[ 3,12],
    [ 6, 8],[18,10],[19,12],[19,14],[12, 6],[10,19],[ 7, 8],[ 9, 5],[15, 8],[ 1, 7],
    [17, 8],[ 5,18],[ 0,14],[ 8,16],[14,12],[ 9,14],[18,11],[ 5,10],[ 2,19],[12, 8],
    [11, 3],[14,11],[ 4,17],[11,16],[10, 3],[12,16],[18, 7],[ 2,18],[11, 5],[ 9,14],
    [ 5, 9],[14, 0],[ 4, 9],[15, 4],[18, 7],[13,12],[11,18],[ 4,14],[19,19],[19,11],
    [18,18],[17,11],[16,18],[ 5,18],[ 4,11],

    //begin draw love
    [ 3,11],[ 2,12],[ 2, 8],[ 3, 5],[ 3, 9],[ 4, 8],[ 6, 6],[ 8, 6],[11, 7],[12, 9],
    [13, 9],[13, 7],[15, 5],[18, 6],[18,10],[17,13],[17, 9],[16, 6],[14, 8],[14,12],
    [13,11],[11,11],[10,12],[ 9,12],[ 7,11],[ 5,13],[ 4,11]
]

/**
 * Created by huguangli on 14-2-13.
 */

function Array2D(p_width, p_height){
    this.m_array = new Array(p_width * p_height);
    this.m_width = p_width;
    this.m_height = p_height;
    this.Set = function(x, y, data){
        this.m_array[y * this.m_width + x] = data;
    };
    this.Get = function(x, y){
        return this.m_array[y * this.m_width + x];
    };
};

/**
 * Created by huguangli on 14-2-14.
 */


function Cell(_x, _y){
    this.X = _x;
    this.Y = _y;
    this.LastX = -1;
    this.LastY = -1;
    this.IsMarked = false;
    this.Distance = 0;
    this.IsCanBeHit = false;
}

Cell.prototype = {
    isSamePosition : function(other){
        var result = false;
        if(this.X == other.getX() && this.Y == other.getY()){
            result = true;
        }
        return result;
    },
    getX : function(){
        return this.X;
    },
    getY : function(){
        return this.Y;
    },
    getIsCanBeHit : function(){
        return this.IsCanBeHit;
    },
    setIsCanBeHit : function(_isCanBeHit){
        this.IsCanBeHit = _isCanBeHit;
    },
    setMarked : function(marked){
        this.IsMarked = marked;
    },
    getMarked : function(){
        return this.IsMarked;
    },
    getDistance : function(){
        return this.Distance;
    },
    setDistance : function(distance){
        this.Distance = distance;
    },
    setLastX : function(lastX){
        this.LastX = lastX;
    },
    getLastX : function(){
        return this.LastX;
    },
    setLastY : function(lastY){
        this.LastY = lastY;
    },
    getLastY : function(){
        return this.LastY;
    }
}

/**
 * Created by walle on 2/16/14.
 */

var MAX_VALUE = 999999;
/** Namespace */
var Waitingfy = Waitingfy || {};

/**
 * @class Simple max-heap for priority queues and so on.
 *
 * @author walle
 */
Waitingfy.Heap = function(data, compareFunction) {
    this.items = [];
    this.items.push(MAX_VALUE);
    this.numCounts = 0;
    this.CompareFunction = compareFunction;
};

Waitingfy.Heap.prototype = {
    initHeap : function(data, n){
        for (var i = 0;i < n; i++){
            this.items.push(data[i]);
            this.numCounts++;
        }
    },
    percolateUp : function(holeIndex, adjustValue){
        var parentIndex = parseInt(holeIndex / 2);
        while(holeIndex > 1 && this.CompareFunction(this.items[parentIndex],adjustValue)){
            this.items[holeIndex] = this.items[parentIndex];
            holeIndex = parentIndex;
            parentIndex /= 2;
        }
        this.items[holeIndex] = adjustValue;
    },
    adjustHeap : function(childTree, adjustValue){
        var holeIndex = parseInt(childTree);
        var secondChid = 2 * holeIndex + 1;
        while(secondChid <= this.numCounts)
        {
            if (this.CompareFunction(this.items[secondChid],this.items[secondChid - 1])){
                --secondChid;
            }
            this.items[holeIndex] = this.items[secondChid];
            holeIndex = secondChid;
            secondChid = 2 * secondChid + 1;
        }
        if (secondChid == this.numCounts + 1){
            this.items[holeIndex] = this.items[secondChid - 1];
            holeIndex = secondChid - 1;
        }
        this.items[holeIndex] = adjustValue;
        this.percolateUp(holeIndex,adjustValue);

    },
    push_heap : function(elem){
        this.items.push(elem);
        this.numCounts++;

        this.percolateUp(this.numCounts,this.items[this.numCounts]);
    },
    pop_heap : function(){
        var adjustValue = this.items[this.numCounts];
        this.items[this.numCounts] = this.items[1];
        this.numCounts--;

        this.adjustHeap(1,adjustValue);
    },
    makeHeap : function(){
        if (this.numCounts < 2)
            return;
        var parent = parseInt(this.numCounts / 2);
        while(1)
        {
            this.adjustHeap(parent,this.items[parent]);
            if (1 == parent)
                return;

            --parent;
        }
    },
    getVec : function(){
        return this.items;
    }

}





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


/**
 * Created by huguangli on 14-2-14.
 */
var WelcomeLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        var bRet = false;
        if (this._super()) {
            var screenSize = cc.Director.getInstance().getWinSize();


            var bgSprite = cc.Sprite.create(s_BackGround);
            bgSprite.setPosition(screenSize.width / 2, screenSize.height / 2);
            this.addChild(bgSprite);

            var logoSprite = cc.Sprite.create(s_Logo);
            logoSprite.setPosition(screenSize.width / 2,screenSize.height * 3 / 4);
            this.addChild(logoSprite);

            var LoveModeMenuItem = cc.MenuItemImage.create(
                s_LoveMenuItemNor,
                s_LoveMenuItemDown,
                this.LoveMenuCallBack,
                this
            );

            var classicModeMenuItem = cc.MenuItemImage.create(
                s_ClassicMenuItemNor,
                s_ClassicMenuItemDown,
                this.classicMenuCallBack,
                this
            );

            var AIModeMenuItem = cc.MenuItemImage.create(
                s_AIMenuItemNor,
                s_AIMenuItemDown,
                this.AIMenuCallBack,
                this
            );

            var VSModeMenuItem = cc.MenuItemImage.create(
                s_VSMenuItemNor,
                s_VSMenuItemDown,
                this.VSMenuCallBack,
                this
            );

            var SettingMenuItem = cc.MenuItemImage.create(
                s_SettingMenuItemNor,
                s_SettingMenuItemDown,
                this.SettingsMenuCallBack,
                this
            );
            var menu = cc.Menu.create(LoveModeMenuItem,AIModeMenuItem,VSModeMenuItem,
                classicModeMenuItem ,SettingMenuItem);
            menu.alignItemsVerticallyWithPadding(10);
            menu.setPosition(screenSize.width / 2, screenSize.height / 3);
            this.addChild(menu);



            bRet = true;
        }
        return bRet;
    },
    classicMenuCallBack:function(sender){
//        gSharedEngine.playEffect(EFFECT_BUTTON_CHICK);
        gGameMode = GameMode.kGameClassic;
        var nextScene = cc.Scene.create();
        var nextLayer = new MainGameLayer;
        nextScene.addChild(nextLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(0.4, nextScene));
    },
    LoveMenuCallBack:function(sender){
//        gSharedEngine.playEffect(EFFECT_BUTTON_CHICK);
        cc.log("draw I love you mode");
        gGameMode = GameMode.kGameLove;
        gGameData.snakeMoveSpeed = 0.03;
        var nextScene = cc.Scene.create();
        var nextLayer = new MainGameLayer;
        nextScene.addChild(nextLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(0.4, nextScene));
    },
    AIMenuCallBack:function(sender){
//        gSharedEngine.playEffect(EFFECT_BUTTON_CHICK);
        gGameMode = GameMode.kGameJustAI;
        gGameData.snakeMoveSpeed = 0.02;
        var nextScene = cc.Scene.create();
        var nextLayer = new MainGameLayer;
        nextScene.addChild(nextLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(0.4, nextScene));
    },
    VSMenuCallBack:function(sender){
//        gSharedEngine.playEffect(EFFECT_BUTTON_CHICK);
        gGameMode = GameMode.kGameVSAI;
        var nextScene = cc.Scene.create();
        var nextLayer = new MainGameLayer;
        nextScene.addChild(nextLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(0.4, nextScene));
    },
    SettingsMenuCallBack:function(sender){
//        gSharedEngine.playEffect(EFFECT_BUTTON_CHICK);
        var nextScene = cc.Scene.create();
        var nextLayer = new SettingsLayer;
        nextScene.addChild(nextLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(0.4, nextScene));
    }
});

var WelcomeGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        gGameData.initData();

        //var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        //spriteFrameCache.addSpriteFrames("res/baseResource.plist","res/baseResource.png");

        var layer = new WelcomeLayer;
        //layer.init();
        this.addChild(layer);

//        gSharedEngine.setMusicVolume(1);
//        gSharedEngine.setEffectsVolume(1);
//        gSharedEngine.playMusic(MUSIC_BACKGROUND,true);
    }
});


/**
 * Created by huguangli on 14-2-14.
 */
var SettingsLayer = cc.Layer.extend({
    _displayValueLabel:null,
    _highScoreLabel:null,
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        var bRet = false;
        if (this._super()) {
            var screenSize = cc.Director.getInstance().getWinSize();


            var bgSprite = cc.Sprite.create(s_BackGround);
            bgSprite.setPosition(screenSize.width / 2, screenSize.height / 2);
            this.addChild(bgSprite);


            var backMenuItem = cc.MenuItemImage.create(
                s_Back,
                s_Back,
                this.backMenuCallBack,
                this
            );
            var menu = cc.Menu.create(backMenuItem);
            menu.setPosition(40, screenSize.height - 40);
            this.addChild(menu);

            // Add a label in which the slider value will be displayed
            this._displayValueLabel = cc.LabelTTF.create("Snake Speed: 1.00", "Marker Felt", 32);
            this._displayValueLabel.setString("Snake Speed: " + (0.5 / gGameData.getSnakeMoveSpeed()).toFixed(2));
            this._displayValueLabel.retain();
            this._displayValueLabel.setAnchorPoint(0.5, -1.0);
            this._displayValueLabel.setPosition(screenSize.width / 2, screenSize.height * 2 / 3.0);
            this.addChild(this._displayValueLabel);

            // Add the slider
            var slider = cc.ControlSlider.create(s_SliderTrack,
                s_SliderProgress, s_SliderThumb);
            slider.setAnchorPoint(0.5, 1.0);
            slider.setMinimumValue(1.0); // Sets the min value of range
            slider.setMaximumValue(10.0); // Sets the max value of range
            slider.setPosition(screenSize.width / 2.0, screenSize.height * 2 / 3.0 + 16);
            slider.setValue(0.5 / gGameData.getSnakeMoveSpeed());
            slider.setTag(1);

            // When the value of the slider will change, the given selector will be call
            slider.addTargetWithActionForControlEvents(this, this.valueChanged, cc.CONTROL_EVENT_VALUECHANGED);

            this.addChild(slider);


            // Add a label in which the slider value will be displayed
            this._highScoreLabel = cc.LabelTTF.create("HighScore: 0", "Marker Felt", 32);
            this._highScoreLabel.setString("HighScore: " + gGameData.bestScore);
            this._highScoreLabel.retain();
            this._highScoreLabel.setAnchorPoint(0.5, -1.0);
            this._highScoreLabel.setPosition(screenSize.width / 2, screenSize.height / 3.0);
            this.addChild(this._highScoreLabel);
            bRet = true;
        }
        return bRet;
    },
    backMenuCallBack:function(sender){
        var nextScene = cc.Scene.create();
        var nextLayer = new WelcomeLayer;
        nextScene.addChild(nextLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionSlideInL.create(0.4, nextScene));
    },
    valueChanged:function (sender, controlEvent) {
        // Change value of label.
        if (sender.getTag() == 1){
            this._displayValueLabel.setString("Snake Speed: " + sender.getValue().toFixed(2));
            gGameData.setSnakeMoveSpeed(0.5 / sender.getValue().toFixed(2));
        }

    }

});

var SettingsGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new SettingsLayer;
        //layer.init();
        this.addChild(layer);

    }
});


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


var GameResult_ChickMenu = "GameResult_ChickMenu";

var eGameResultMenuTag = {
    Continue :1,
    Restart:2,
    Quit:3
};

var SCORE_MAX = 9999999;

var ResultLayer = cc.Layer.extend({
    mGameScore:0,
    mStarScores:null,
    mIsSucceed:true,
    mIgnoreTouch:false,
    mStarSprites:null,
    screenSize:null,
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this.screenSize = cc.Director.getInstance().getWinSize();
        var bRet = false;
        if (this._super()) {
            this.mStarSprites ;

            var itemRestart =cc.MenuItemImage.create(
                s_RestartMenuItemNor,
                s_RestartMenuItemDown,
                this.menuCallBack,
                this);
            itemRestart.setTag(eGameResultMenuTag.Restart);
            itemRestart.setPosition(this.screenSize.width / 2, this.screenSize.width / 2);

            var resultMenu = cc.Menu.create(itemRestart);
            resultMenu.setPosition(0,0);
            this.addChild(resultMenu);

            bRet = true;
        }
        return bRet;
    },
    initResultData:function(){
        this.showStar();
    },
    showStar:function(){
        this.mStarSprites = cc.Sprite.create(s_SnakeWeep);
        this.mStarSprites.setScale(0.1);
        this.mStarSprites.setPosition(this.screenSize.width / 2,this.screenSize.height / 2);
        this.addChild(this.mStarSprites);

        this.mStarSprites.runAction(cc.ScaleTo.create(0.7,1.0,1.0));
        this.mStarSprites.runAction(cc.RotateBy.create(0.7,720.0));
    },
    menuCallBack:function(sender){
        //gSharedEngine.playEffect(EFFECT_BUTTON_CHICK);
        if (this.mIgnoreTouch == false){
            this.mIgnoreTouch = true;
            switch(sender.getTag()){
                case eGameResultMenuTag.Restart:
                    var nextScene = cc.Scene.create();
                    var nextLayer = new MainGameLayer;
                    nextScene.addChild(nextLayer);
                    cc.Director.getInstance().replaceScene(cc.TransitionSlideInT.create(0.4, nextScene));
                    break;
            }
        }
    }
});



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
    startPathFinding:function(startX, startY, goalX, goalY){
        this.clearPath();
        g_goalX = goalX;
        g_goalX = goalY;

        var startCell = this.gameMap.Get(startX, startY);
        var vecCells = new Waitingfy.Heap([], this.compareByDistanceBetweenStartAndGoal);
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
    getNextCellBySnakeAI:function(){
        var canFindPath = this.startPathFinding(this.snake.getHead().getX(), this.snake.getHead().getY(),
            this.appleCell.getX(), this.appleCell.getY());
        var canFindTail = false;
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
                copySnake.getTail().getX(), copySnake.getTail().getY());
            //restore snake
            this.restoreSnakeMarkInMap(this.snake.getSnakeBody());
            if(canFindTail){
                return this.safePathCells.pop();
            }
        }
        //if can not find path to apple or can not find path to its tail, we just move to a cell that is farthest to the apple
        // and still can find the path to its tail
        if(canFindPath == false || canFindTail == false){
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
                            copySnake.getTail().getY());
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
