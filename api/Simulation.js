// 力导向图
// 力导向图使用velocity Verlet整合算法实现。
/**
     This module implements a velocity Verlet numerical integrator for simulating physical forces on particles.
   The simulation is simplified: it assumes a constant unit time step Δt = 1 for each step,
   and a constant unit mass m = 1 for all particles. As a result,
   a force F acting on a particle is equivalent to a constant acceleration a over the time interval Δt,
   and can be simulated simply by adding to the particle’s velocity, which is then added to the particle’s position.
     该模块实现了粒子受到物理力的作用速度的变化。
   这是一个简化的仿真：
        假设一个不变的单位时间Δt = 1、单位质量 m = 1 的粒子，因此 一个力 F 作用在粒子上加速度不变 Δt,
    可以简单的通过增加粒子的速度莫模拟计算出粒子的位置。
 */

let simulation =
    d3.forceSimulation([nodes]); // 创建一个力模拟
    /*
        Creates a new simulation with the specified array of nodes and no forces.
        If nodes is not specified, it defaults to the empty array.
        The simulator starts automatically; use simulation.on to listen for tick events as the simulation runs.
        If you wish to run the simulation manually instead, call simulation.stop, and then call simulation.tick as desired.
        使用指定的节点数组创建一个新的模拟，并且不包含 force 的作用。
        如果没有指定 nodes ，默认为空数组。
        模拟自动开启， 使用 simulation.on 可以监听模拟运行的事件，
        可以通过 simulation.stop 停止模拟，然后调用 simulation.tick 以达到预期效果
    */
    simulation.restart()  // 重启力模拟
    /*
        Restarts the simulation’s internal timer and returns the simulation.
        In conjunction with simulation.alphaTarget or simulation.alpha,
        this method can be used to “reheat” the simulation during interaction,
        such as when dragging a node, or to resume the simulation after temporarily pausing it with simulation.stop.
        重新启动模拟的内部计时器， 结合 simulation.alphaTarget or simulation.alpha 设置新的计时
        该方法可用于在交互过程中，如拖动节点的时候，重新启动力布局进行节点位置计算，或者在 simulation.stop 后再次启动仿真
        心得： 在拖拽中, 在数据改变后重新启用
    */
    simulation.stop()   // 停止力模拟
    /*
        Stops the simulation’s internal timer, if it is running, and returns the simulation.
        If the timer is already stopped, this method does nothing.
        This method is useful for running the simulation manually; see simulation.tick.
        停止 模拟内部的计时器，
            如果仿真在执行状态，会返回 simulation，
            如果计时已经暂停，该方法不执行任何操作。
       该方法适用于 人工仿真 simulation.tick.
    */
    simulation.tick([iterations])   //  将力的模拟向前推进一步
    /**
        Manually steps the simulation by the specified number of iterations, and returns the simulation.
        If iterations is not specified, it defaults to 1 (single step).

        For each iteration, it increments the current alpha by (alphaTarget - alpha) × alphaDecay;
        then invokes each registered force, passing the new alpha; then decrements each node’s velocity by velocity × velocityDecay;
        lastly increments each node’s position by velocity.

        This method does not dispatch events; events are only dispatched by the internal timer when the simulation is started automatically upon creation or by calling simulation.restart.
        The natural number of ticks when the simulation is started is ⌈log(alphaMin) / log(1 - alphaDecay)⌉; by default, this is 300.

        This method can be used in conjunction with simulation.stop to compute a static force layout.
        For large graphs, static layouts should be computed in a web worker to avoid freezing the user interface.

        手动设置模拟次数，并返回 simulation；如果没有指定迭代次数，默认执行1步; 注： 可能存在一些版本没有实现迭代次数；

        对于每一次迭代， alpha += (alphaTarget - alpha) * alphaDecay;
        然后调用每个注册的力，force(alpha)；
        每个节点 node.x += node.vx *= velocityDecay;   velocityDecay -- 速度衰减系数
     */
    simulation.nodes([nodes])  //设置力模拟的节点
    /*
        Each node must be an object. The following properties are assigned by the simulation:
            index - the node’s zero-based index into nodes
            x - the node’s current x-position
            y - the node’s current y-position
            vx - the node’s current x-velocity
            vy - the node’s current y-velocity
        To fix a node in a given position, you may specify two additional properties:
            fx - the node’s fixed x-position
            fy - the node’s fixed y-position

        nodes 数据发生改变时， 使用新的数组再次调用此方法
     */
    simulation.alpha([alpha])    // 设置当前的α值
    /*
        范围[0 - 1]之间   没有指定则返回当前的 alpha 值, 默认为 1;
    */
    simulation.alphaMin([min]) // 设置α最小阈值
    /**
     * 范围[0 - 1]之间 没有指定则返回当前最小 alpha 值, 默认0.001；
     * 当当前alpha 值小于 最小alpha值， 模拟器内部计时器停止
     * 默认衰减率 0.0228 对应 300次迭代
     */
    simulation.alphaDecay([decay])   // 设置α指数衰减率
    /**
     *  范围[0 - 1]之间 默认 0.0228 = 1 - pow(0.001, 1 / 300)
     */
    simulation.alphaTarget([target])  // 设置目标α
    /**
     * 范围[0 - 1]之间   没有指定则返回当前的 alphaTarget 值, 默认为 0;
     */
    simulation.velocityDecay([decay])   // 设置速度衰减 (摩擦力)
    /**
     * 范围[0 - 1]之间   没有指定则返回当前的 decay 值, 默认为 0.4;
     */
    simulation.drag // 设置拽引系数

    simulation.force(name[,force])    // 添加或移除力
    /**
     * 如果指定了force，则指定指定名称的force并返回此模拟。如果没有指定force，则返回具有指定名称的force;
     * 如果没有指定名称，则返回undefined。(默认情况下，新的模拟没有任何力量。)
     * to create a new simulation to layout a graph, you might say:
         var simulation = d3.forceSimulation(nodes)
             .force("charge", d3.forceManyBody())
             .force("link", d3.forceLink(links))
             .force("center", d3.forceCenter());
     To remove the force with the given name, pass null as the force. For example, to remove the charge force:
        simulation.force("charge", null);
     */
    simulation.fix  // 固定节点位置

    simulation.unfix    // 释放固定的节点

    simulation.find(x,y[,radius]) // 查找给定位置最近的节点
    /**
     * 返回最近的节点位置⟨x, y⟩给定的搜索半径。如果没有指定半径，则默认为无穷大。如果搜索区域中没有节点，则返回undefined。
     */
    simulation.on   // 添加或移除事件监听器

