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