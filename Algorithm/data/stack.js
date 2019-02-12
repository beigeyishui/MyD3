/*
    栈(stack): 是一种动态集合,实现的是一种后进先出的策略, 被删除的是最近插入的元素；
    api:
        empty() 判断栈是否是空的
        push(d) 入栈，将数据存入栈中
        pop() 出栈，将数据从栈中取出
*/
function Stack() {
    var s = {}, // 栈对象
        val = [],   // 数据存放数组
        top = 0;    // 栈顶

    // 判断栈是否有值
    s.empty = function() {
        if (top == 0) {
            return true;
        } else {
            return false;
        }
    };

    /* 入栈
        param 
                d : 要存入的数据
     */
    s.push = function(d) {
        val[top] = d;
        top = top + 1;
    };

    // 出栈
    s.pop = function() {
        if (top == 0) {
            throw new Error("underflow");
        }
        top = top - 1;
        return val[top + 1];
    };

    return s;
 }