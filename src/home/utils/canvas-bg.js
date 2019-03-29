class CanvasBg {
    constructor() {
        let $cas = document.getElementById('cas');
        if (!$cas) {
            $cas = window.document.createElement('canvas');
            $cas.id = 'cas';
            window.document.body.appendChild($canvas);
        }
        $cas.width = $cas.offsetWidth;
        $cas.height = $cas.offsetHeight;
        this.$cas = $cas;
        this.offset = this.getOffset(this.$cas);
        this.ctx = this.$cas.getContext('2d');
        this.rgb = '255'; // 线条颜色值
        this.extendDis = 5; // 可超出的画布边界
        this.lineDis = 100 * 100; // 连线距离
        if (!window.raf) {
            window.raf = (function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                    window.setTimeout(callback, 16);
                };
            })();
        }
        this.warea = { x: null, y: null };
        this.bindEvents();
        this.createParticle();
    }
    createParticle() { // 创建粒子
        const points = Math.ceil(this.$cas.width * this.$cas.height / 8000);
        var dots = [];
        for (var i = 0; i < points; i++) {
            var x = Math.random() * (this.$cas.width + 2 * this.extendDis) - this.extendDis;
            var y = Math.random() * (this.$cas.height + 2 * this.extendDis) - this.extendDis;
            var xa = (Math.random() * 2 - 1) / 1.5;
            var ya = (Math.random() * 2 - 1) / 1.5;
            dots.push({ x: x, y: y, xa: xa, ya: ya });
        }
        this.dots = dots;
    }
    runAnime() {
        this.ctx.clearRect(0, 0, this.$cas.width, this.$cas.height);
        this.bubDrawLine([this.warea].concat(this.dots));
        window.raf(this.runAnime.bind(this));
    }
    bubDrawLine(ndots) {
        let ndot;
        this.dots.forEach((dot) => {
            this.move(dot);
            // 循环比对粒子间的距离
            for (let i = 0; i < ndots.length; i++) {
                ndot = ndots[i];
                if (dot === ndot || ndot.x === null || ndot.y === null) continue;
                let xc = dot.x - ndot.x;
                let yc = dot.y - ndot.y;
                // 如果x轴距离或y轴距离大于max,则不计算粒子距离
                if (xc > ndot.max || yc > this.lineDis) continue;
                // 两个粒子之间的距离
                let dis = xc * xc + yc * yc;
                // 如果粒子距离超过max,则不做处理
                if (dis > this.lineDis) continue;
                // 距离比
                let ratio;
                // 如果是鼠标，则让粒子向鼠标的位置移动
                if (ndot === this.warea && dis < 20000) {
                    dot.x -= xc * 0.01;
                    dot.y -= yc * 0.01;
                }
                // 计算距离比
                ratio = (this.lineDis - dis) / this.lineDis;
                // 粒子间连线
                this.ctx.beginPath();
                this.ctx.lineWidth = ratio / 2;
                this.ctx.strokeStyle = 'rgba(' + this.rgb + ', ' + this.rgb + ', ' + this.rgb + ', 1';
                this.ctx.moveTo(dot.x, dot.y);
                this.ctx.lineTo(ndot.x, ndot.y);
                this.ctx.stroke();
            }
            // 将已经计算过的粒子从数组中删除
            ndots.splice(ndots.indexOf(dot), 1);
        });
    }
    move(dot) {
        dot.x += dot.xa;
        dot.y += dot.ya;
        // 遇到边界将加速度反向
        dot.xa *= (dot.x > (this.$cas.width + this.extendDis) || dot.x < -this.extendDis) ? -1 : 1;
        dot.ya *= (dot.y > (this.$cas.height + this.extendDis) || dot.y < -this.extendDis) ? -1 : 1;
        // 绘制点
        this.ctx.fillStyle = 'rgba(' + this.rgb + ', ' + this.rgb + ', ' + this.rgb + ', 1';
        this.ctx.fillRect(dot.x - 0.5, dot.y - 0.5, 1, 1);
    }
    bindEvents() {
        window.addEventListener('mousemove', this.moveHandler.bind(this), false);
        window.addEventListener('mouseout', this.outHandler.bind(this), false);
    }
    moveHandler(e) {
        e = e || window.event;
        this.warea.x = e.clientX - this.offset.left;
        this.warea.y = e.clientY - this.offset.top;
    }
    outHandler() {
        this.warea.x = null;
        this.warea.y = null;
    }
    getOffset($el) {
        let top = $el.offsetTop;
        let left = $el.offsetLeft;
        let current = $el.offsetParent;
        while (current !== null) {
            top += current.offsetTop;
            left += current.offsetLeft;
            current = current.offsetParent;
        }
        return { top, left };
    }
    destroy() {
        window.removeEventListener('mousemove', this.moveHandler.bind(this), false);
        window.removeEventListener('mouseout', this.outHandler.bind(this), false);
    }
}

export default CanvasBg;