let draw = {
    "init": function() {
        this.link(links);
        this.node(nodes);
        this.tick();
    },
    "node": function(nodes) {
        let node = g.selectAll(".node").data(nodes);

        // 添加节点
        let nodeEnter = node.enter().append("g")
            .classed("node", true);
            //.attr("translate", d => `translate({d.x}, {d.y})`);
        //绘制图标
        nodeEnter.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 100)
            .attr("height", 30)
            //.style("display", "none")
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", 2);

        // 绘制文字
        nodeEnter.append("text") // 添加 <text> 标签
            .attr("dx", "5")    // 设置向左偏移度
            .attr("dy", "20") // 设置向下偏移度
            .text(d => d.text) // 设置文本内容
            //.style("display", "none");

        /*nodeEnter.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 100)
            .attr("height", 30)
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", 2);

        // 绘制文字
        nodeEnter.append("text") // 添加 <text> 标签
            .attr("dx", "5")    // 设置向左偏移度
            .attr("dy", "20") // 设置向下偏移度
            .text(d => "30%"); // 设置文本内容*/
    },
    "link": function(links) {
        let link = g.selectAll(".link").data(links);

        // 添加连线
        let linkEnter = link.enter().append("g")
            .classed("link", true);
        // 绘制路径
        linkEnter.append("path")    // 添加 <path>标签
            //.attr("d", d => getPath(d)) // 设置路径
            .style("fill", "none")  // 设置无填充颜色
            .style("stroke", "red") // 设置边框颜色
            .style("stroke-width", 1);  // 设置边框宽度

        // 更新连线
        //link.each();

        // 删除连线
        link.exit().remove();
    },
    "path": function(d) {
        var x1 = d.source.x + 100,
            y1 = d.source.y + 15,   // 起点坐标
            x2 = d.target.x ,
            y2 = d.target.y + 15;  // 终点坐标

        return "M " + x1 +","+ y1 +
            " L " + x2 +","+ y2;
    },
    "tick": function() {
        let link = g.selectAll("g.link");
        link.select("path")
            .attr("d", d => draw.path(d));

        // 节点位置更新
        let node = g.selectAll("g.node").attr("transform", d => `translate(${d.x}, ${d.y})`);
        /*node.select("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        node.select("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y);*/
    }
};