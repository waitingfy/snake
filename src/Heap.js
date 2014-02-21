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