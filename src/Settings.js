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
