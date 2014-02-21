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