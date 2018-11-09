export function getWindowW() {
    return window.innerWidth || window.document.documentElement.clientWidth;
}

export function getWindowH() {
    return window.innerHeight || document.documentElement.clientHeight;
}

export function getScrollTop(element = window) {
    if (element === window) {
        return Math.max(window.pageYOffset || 0, window.document.documentElement.scrollTop || window.document.body.scrollTop);
    } else {
        return element.scrollTop;
    }
}

export function animeAutoScroll(offset = 0, speed = 30) {
    if (window.animationScrollTimer !== undefined) {
        window.cancelAnimationFrame(window.animationScrollTimer);
        window.animationScrollTimer = undefined;
    }
    let currentScroll = getScrollTop();
    let per = Math.abs(Math.ceil((offset - currentScroll) / speed));
    if (offset > currentScroll) {
        window.animationScrollTimer = window.requestAnimationFrame(function fn() {
            currentScroll = currentScroll + per;
            if (currentScroll > offset) currentScroll = offset;
            if (window.document.body.scrollTop === 0 && currentScroll !== offset) {
                window.document.documentElement.scrollTop = currentScroll;
            } else if (currentScroll !== offset) {
                window.document.body.scrollTop = currentScroll;
            }
            if (currentScroll === offset) {
                window.document.documentElement.scrollTop = window.document.body.scrollTop = offset;
                window.cancelAnimationFrame(window.animationScrollTimer);
                window.animationScrollTimer = undefined;
            } else {
                window.animationScrollTimer = window.requestAnimationFrame(fn);
            }
        });
    } else {
        window.animationScrollTimer = window.requestAnimationFrame(function fn() {
            currentScroll = currentScroll - per;
            if (currentScroll < offset) currentScroll = offset;
            if (window.document.body.scrollTop === 0 && currentScroll !== offset) {
                window.document.documentElement.scrollTop = currentScroll;
            } else if (currentScroll !== offset) {
                window.document.body.scrollTop = currentScroll;
            }
            if (currentScroll === offset) {
                window.document.documentElement.scrollTop = window.document.body.scrollTop = offset;
                window.cancelAnimationFrame(window.animationScrollTimer);
                window.animationScrollTimer = undefined;
            } else {
                window.animationScrollTimer = window.requestAnimationFrame(fn);
            }
        });
    }
}