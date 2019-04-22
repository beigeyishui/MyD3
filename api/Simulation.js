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

//Force

//Centering (定心力)
    /**
     * 定心力转换节点统一所有节点的平均位置(重心如果所有节点有同等重量)是在给定的位置⟨x, y⟩。
     * 该力修改每个应用程序上节点的位置;它不改变速度，因为这样做通常会导致节点超调并围绕期望的中心振荡。
     * 这种力可以帮助节点保持在视图的中心，并且与定位力不同，它不会扭曲节点的相对位置。
     *
     *  心得: 设置中心点的坐标
     */
    let center = d3.forceCenter([x, y]) // 创建一个力中心。
    /*使用指定的x和y坐标创建一个新的定心力。如果x和y是未指定,默认⟨0,0⟩。*/
    center.x([x])  //设置中心的x-坐标。
    /* 如果指定了x，则将定心位置的x坐标设置为指定的数值，并返回这个力。如果没有指定x，则返回默认为0的当前x坐标。*/
    center.y([y]) //设置中心的y-坐标。
    /* 如果指定y，则将定心位置的y坐标设置为指定的数值，并返回此力。如果没有指定y，则返回默认为0的当前y坐标。*/

//Collision (碰撞力)
    /**
     * 碰撞力将节点视为具有给定半径的圆，而不是点，并防止节点重叠。
     * 更正式的说法是，将两个节点a和b分开，使得a和b之间的距离至少为半径(a) +半径(b)。
     * 为了减少抖动，默认情况下这是一个“软”约束，具有可配置的强度和迭代计数。
     */
    let collide = d3.forceCollide([radius]) // 创建一个圆碰撞力。
    /*  创建具有指定半径的新的圆形碰撞力。如果没有指定radius，则默认为所有节点的常量1。*/
    collide.radius([radius])  // 设置圆的半径。
    /**
     * 如果指定了radius，则将radius访问器设置为指定的数字或函数，重新计算每个节点的radius访问器，并返回这个力。
     * 如果没有指定radius，则返回当前radius访问器，其默认值为:
     * function radius() {
             return 1;
        }
     */
    collide.strength([strength])  // 设置碰撞检测强度。
    /** [0,1] 区间的值 */
    collide.iterations([iterations])  // 设置迭代次数。
    /**
     * 如果指定了迭代，则将每个应用程序的迭代次数设置为指定的次数，并返回此强制值。
     * 如果没有指定迭代，则返回默认为1的当前迭代计数。
     *  增加迭代次数大大增加了约束的刚度，避免了节点的部分重叠，也增加了评估力的运行时成本。
     */
//Link (弹力)
    /** 链路力根据所需的链路距离将链路节点推到一起或分开。力的大小与连接节点距离与目标距离的差成正比，类似于弹簧力。 */
    let link =  d3.forceLink([links]) // 创建连接力
    /** 使用指定的链接和默认参数创建新的链接力。如果未指定链接，则默认为空数组。*/
    link.links([links]) // 设置连接数组
    /**
     * 如果指定了链接，则设置与此力关联的链接数组，重新计算每个链接的距离和强度参数，并返回此力。
     * 如果未指定链接，则返回当前链接数组，默认为空数组。
     * Each link is an object with the following properties:
         source - the link’s source node; see simulation.nodes
         target - the link’s target node; see simulation.nodes
         index - the zero-based index into links, assigned by this method
     */
    link.id([id]) // 连接数组
    /**
     * 如果指定了id，则设置指定函数的节点id访问器并返回此力。
     * 如果没有指定id，则返回当前节点id访问器，该访问器默认为数值node.index:
     * function id(d) {
          return d.index;
        }
     * 默认id访问器允许将每个链接的源和目标指定为节点数组中的从零开始的索引。
     */
    link.distance([distance]) // 设置连接距离
    /**
     * 如果指定了距离，则将距离访问器设置为指定的数字或函数，重新计算每个链接的距离访问器，并返回此力。
     * 如果没有指定距离，则返回当前距离访问器，其默认值为:
     * function distance() {
          return 30;
        }
     * 为每个链接调用distance访问器，并传递该链接及其从零开始的索引。然后在内部存储得到的数字，
     * 这样，只有在初始化力或使用新的距离调用此方法时，才会重新计算每个链接的距离，而不是在力的每个应用程序上。
     */
    link.strength([strength]) // 设置连接强度
    /**
     * 如果指定了强度，则将强度访问器设置为指定的数字或函数，重新计算每个链接的强度访问器，并返回此力。
     * 如果没有指定强度，则返回当前强度访问器，其默认值为:
     * function strength(link) {
          return 1 / Math.min(count(link.source), count(link.target));
        }
     */
    link.iterations([iterations]) // 设置迭代次数
    /**
     * 如果指定了迭代，则将每个应用程序的迭代次数设置为指定的次数，并返回此强制值。
* 如果没有指定迭代，则返回默认为1的当前迭代计数。
* 增加迭代次数大大增加了约束的刚度，对网格等复杂结构是有用的，但也增加了计算力的运行时成本。
*/

// Many-Body (多体力)
    /**
     * 多体(或n体)力在所有节点之间相互作用。它可以用来模拟重力(吸引力)如果强度是正的，或静电荷(斥力)如果强度是负的。
     * 该实现使用四叉树和Barnes-Hut近似方法极大地提高了性能;精度可以使用参数自定义。
     * 与只影响两个链接节点的链接不同，电荷力是全局的:每个节点都会影响其他节点，即使它们位于断开连接的子图上。
     */
    let manyBody = d3.forceManyBody() //创建多体力
    /** 使用默认参数创建一个新的多体力。 */
    manyBody.strength([strength]) // 设置力强度
    /*
    * 如果指定了强度，则将强度访问器设置为指定的数量或函数，重新计算每个节点的强度访问器，并返回此力。
    * 正值使节点相互吸引，类似于重力;负值使节点相互排斥，类似于静电荷。
    * 如果没有指定强度，则返回当前强度访问器，其默认值为:
    * function strength() {
          return -30;
      }
    */
    manyBody.theta([theta]) // 设置Barnes-Hut近似精度
    /**
     * 如果指定，将Barnes-Hut近似准则设置为指定的数值，并返回这个力。
     * 如果没有指定，则返回当前值，默认值为0.9。
     *
     * 为了加快计算速度，这个力实现了Barnes-Hut近似，即每个应用程序需要O(n log n)，其中n是节点数。
     * 对于每个应用程序，四叉树存储当前节点的位置;然后，对于每个节点，计算给定节点上所有其他节点的合力。
     * 对于距离较远的一簇节点，电荷力可以近似地将该簇视为一个更大的单个节点。
     * θ参数确定近似的准确性:如果比w / l的四叉树的宽度w细胞l从节点的距离单元的质心小于θ,鉴于细胞中的所有节点被视为一个节点,而不是个人。
     */
    manyBody.distanceMin([distance]) // 当节点关闭限制力
    /**
     * 如果指定了距离，则设置考虑此力的节点之间的最小距离。如果没有指定距离，则返回当前最小距离，默认值为1。
     * 最小距离根据两个相邻节点之间的力的大小确定了一个上界，避免了不稳定。
     * 特别是当两个节点完全重合时，避免了无穷大的力;在这种情况下，力的方向是随机的。
     */
    manyBody.distanceMax([distance]) // 当节点太远限制力。
    /**
     * 如果指定了距离，则设置考虑此力的节点之间的最大距离。
     * 如果没有指定距离，则返回当前最大距离，默认值为无穷大。
     * 指定有限的最大距离可以提高性能，并产生更本地化的布局。
     */
// Positioning (定位力)
    /**
     * x和y定位的力量推动节点沿着给定的维度以可配置的强度向一个期望的位置。
     * 径向力是相似的，除了它将节点推向给定圆上最近的点。力的大小与节点位置到目标位置的一维距离成正比。
     * 虽然这些力可以用于定位单个节点，但它们主要用于应用于所有(或大多数)节点的全局力。
     */
    let x = d3.forceX([x]) // 创建x-定位力
    /** 沿x轴向给定位置x创建一个新的定位力。如果没有指定x，则默认为0。 */
    x.strength([strength]) // 设置力强度
    /**
     * 如果指定了强度，则将强度访问器设置为指定的数量或函数，重新计算每个节点的强度访问器，并返回此力。
     * 增加的强度决定了节点的x-velocity:(x - node.x)×力量。
     * 例如，值0.1表示节点在每个应用程序中从当前x位置移动到目标x位置的距离应为十分之一。
     * 较高的值可以更快地将节点移动到目标位置，通常是以其他力或约束为代价的。不建议使用[0,1]范围之外的值。
     * If strength is not specified, returns the current strength accessor, which defaults to:
        function strength() {
          return 0.1;
        }
     */
    x.x([ x]) // 设置目标x-坐标。
    /**
     * 如果指定了x，则将x坐标访问器设置为指定的数字或函数，重新计算每个节点的x访问器，并返回此力。
     * 如果没有指定x，返回当前的x访问器，默认为:
     * function x() {
          return 0;
        }
     */
    let y = d3.forceY([y]) // 创建x-定位力
    y.strength([strength]) // 设置力强度
    y.y([y]) // 设置目标y-坐标。

    let radial = d3.forceRadial(radius[, x][, y]) // 创建径向力
    /** 创建一个新的定位向指定半径的一个圆的力量集中在⟨x, y⟩。如果x和y是未指定,默认⟨0,0⟩。*/
    radial.strength([strength]) // 设置力强度

    radial.radius([radius]) // 设置力半径
    /**
     * 如果指定半径，则将圆半径设置为指定的数字或函数，重新计算每个节点的半径访问器，并返回此力。
     * 如果没有指定radius，则返回当前的radius访问器。
     */
    radial.x([x]) // 指定圆心x坐标
    /**
     * 如果指定了x，则将圆心的x坐标设置为指定的数值，并返回这个力。
     * 如果没有指定x，则返回中心的当前x坐标，默认值为0。
     */
    radial.y([y]) // 指定圆心y坐标