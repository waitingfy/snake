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
