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
