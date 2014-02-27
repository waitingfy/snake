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
        gGameData.snakeMoveSpeed = 0.01;
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