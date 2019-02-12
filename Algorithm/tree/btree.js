function Node(data) {
    this.data = data;
    this.depth =
        this.height = 0;
    this.parent = null;
}

// 节点
function node(key, value) {
    this.key = key;
    this.value = value;
}
// 叶子
function Leaf() {
    this.i = 0;
    this.length = 0;
    this.data = null;
    this.children = null;
    this.parent = null;
}

Leaf.prototype = {
    add: left_add,
    log: left_log
};
function left_log() {
    console.log("left_log");
}
function left_add(d) {
    if (this.length == 0) {
        this.data = [d];
        this.length += 1;
        return;
    }
    var n = this.data.length,
        data = this.data;
    var f = true;
    for(var i = 0; i < n; ++i) {
        if (data[i] > d) {
            data.splice(i, 0, d);
            f = false;
            break;
        }
    }
    if (f) {
        data.push(d);
    }
    this.length += 1;
}
// B树
function bTree() {
    var m = 5;
    var b = {};

    var root = new Leaf();
    // 添加节点
    b.push = function (d) {
        var r = find(d);
        // 直接添加
        if (r.length < m - 1) {
            r.add(d);
        } else {  // 拆分
            r.add(d);
            add(r);
        }
    };
    //自增加
    function add(node) {
        if (node.length < m) {
            return
        }
        var n = parseInt(m / 2);
        var l = new Leaf(), // 左
            t = new Leaf(), // 中
            r = new Leaf(); // 右

        // 数据拆分
        for (var i = 0; i < node.length; ++i) {
            if (i < n) {
                l.add(node.data[i]);
            } else if (i > n) {
                r.add(node.data[i]);
            } else {
                t.add(node.data[i]);
            }
        }

        // 组装
        var p = node.parent;

        if (p == null) { // 如果是根节点
            node.data = t.data;
            node.length = t.length;
            node.children = new Array();

            // 添加左叶子
            l.i = 0;
            l.parent = node;
            node.children[l.i] = l;
            // 添加右叶子
            r.i = 1;
            r.parent = node;
            node.children[r.i] = r;
        } else {
            p.add(t.data[0]);

            // 添加左叶子
            l.i = node.i;
            l.parent = p;
            p.children[l.i] = l;
            // 添加右叶子
            r.i = p.length;
            r.parent = p;
            p.children[r.i] = r;
            // 向上递归自适应
            add(p);
        }
    }

    // 定位
    function find(d) {
        if (root.data == null) {
            return root;
        }

        var node = root, next = [node];
        while (node = next.pop()) {
            if (node.children != null) {
                if (node.data[0] > d) {
                    next.push(node.children[0]);
                } else if (node.data[node.length - 1] < d) {
                    next.push(node.children[node.length]);
                } else {
                    for (var i = 0; i < node.length - 1; ++i) {
                        if (d >= node.data[i] && d < node.data[i + 1]) {
                            next.push(node.children[i + 1]);
                        }
                    }
                }
            } else {
                return node;
            }
        }
    };
    //遍历
    b.query = function () {
        var data = [];
        each(root);

        function each(node) {
            if (node.children) {
                for (var i = 0; i < node.length; ++i) {
                    each(node.children[i]);
                    data.push(node.data[i]);
                }
                each(node.children[node.length]);
            } else {
                for (var i = 0; i < node.length; ++i) {
                    data.push(node.data[i]);
                }
            }
        }

        return data;
    };
    b.root = function() {
        return root;
    };
    return b;
}