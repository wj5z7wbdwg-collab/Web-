/* ============================================================
   唐楚杰 · 个人简历 交互脚本（原生 JavaScript，无依赖）
   ============================================================ */
(function () {
    'use strict';

    /* ---------- 顶部实时时钟（北京时间） ---------- */
    var clock = document.getElementById('clock');
    function tick() {
        try {
            clock.textContent = new Date().toLocaleTimeString('zh-CN', {
                hour12: false,
                timeZone: 'Asia/Shanghai'
            });
        } catch (e) {
            clock.textContent = '';
        }
    }
    tick();
    setInterval(tick, 1000);

    /* ---------- 页脚年份 ---------- */
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- 导航滚动状态 ---------- */
    var header = document.querySelector('.site-header');
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- 滚动渐入 ---------- */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -6% 0px'
        });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- JS 小实验 ---------- */
    var consoleBox = document.getElementById('js-console');

    function demoLog(msg) {
        if (!consoleBox) return;
        var line = document.createElement('p');
        line.textContent = '\u203A ' + msg;
        consoleBox.insertBefore(line, consoleBox.firstChild);
        while (consoleBox.children.length > 7) {
            consoleBox.removeChild(consoleBox.lastChild);
        }
    }

    function demoAlert() {
        alert('Hello TangChujie');
        demoLog('alert()：已弹出提示框并关闭');
    }

    function demoConfirm() {
        var ans = confirm('确认吗？');
        console.log(ans);
        demoLog('confirm()：返回 ' + ans + (ans ? '（你点了确定）' : '（你点了取消）'));
    }

    function demoPrompt() {
        var name = prompt('请输入你的名字：', '唐楚杰');
        if (name === null) {
            demoLog('prompt()：已取消输入');
            return;
        }
        var go = confirm('你好，' + name + '！要跳转到「家乡」板块吗？');
        demoLog('confirm()：返回 ' + go);
        if (go) {
            demoLog('跳转：正在前往「家乡」板块…');
            var target = document.getElementById('hometown');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /* 自定义函数：say */
    function say(name) {
        return '你好，我是' + name + '，这是我自己写的第一个函数。';
    }

    function demoSay() {
        demoLog('say("唐楚杰")：' + say('唐楚杰'));
    }

    function demoClick() {
        alert('Hello TangChujie');
        demoLog('onclick：按钮被点击，弹出 Hello TangChujie');
    }

    /* 行内式 onclick 调用，需要挂到全局 */
    window.demoAlert = demoAlert;
    window.demoConfirm = demoConfirm;
    window.demoPrompt = demoPrompt;
    window.demoSay = demoSay;
    window.demoClick = demoClick;
})();
