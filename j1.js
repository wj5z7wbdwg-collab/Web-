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

    /* ---------- 导航滚动状态 + 滚动进度条 ---------- */
    var header = document.querySelector('.site-header');
    var progressBar = document.getElementById('scroll-progress');
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 24);
        if (progressBar) {
            var doc = document.documentElement;
            var max = doc.scrollHeight - window.innerHeight;
            var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
            progressBar.style.transform = 'scaleX(' + ratio + ')';
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- 首屏打字机（JS 用在简历开头） ---------- */
    var typeEl = document.getElementById('typewriter');
    var phrases = [
        '数据挖掘',
        '智能硬件',
        '数学建模',
        '把问题做穿'
    ];
    if (typeEl) {
        var pIdx = 0, cIdx = 0, deleting = false;
        var reduceMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            typeEl.textContent = phrases.join(' · ');
        } else {
            (function typeTick() {
                var word = phrases[pIdx];
                if (!deleting) {
                    cIdx++;
                    typeEl.textContent = word.slice(0, cIdx);
                    if (cIdx === word.length) {
                        deleting = true;
                        setTimeout(typeTick, pIdx === phrases.length - 1 ? 2200 : 1600);
                        return;
                    }
                    setTimeout(typeTick, 130);
                } else {
                    cIdx--;
                    typeEl.textContent = word.slice(0, cIdx);
                    if (cIdx === 0) {
                        deleting = false;
                        pIdx = (pIdx + 1) % phrases.length;
                        setTimeout(typeTick, 420);
                        return;
                    }
                    setTimeout(typeTick, 60);
                }
            })();
        }
    }

    /* ---------- 数字滚动 count-up ---------- */
    var countEls = document.querySelectorAll('.count');
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function countUp(el) {
        var target = parseInt(el.getAttribute('data-target'), 10) || 0;
        var dur = 900, start = null;
        function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = pad2(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window && countEls.length) {
        var countIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    countIO.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        countEls.forEach(function (el) { countIO.observe(el); });
    } else {
        countEls.forEach(function (el) {
            el.textContent = pad2(parseInt(el.getAttribute('data-target'), 10) || 0);
        });
    }

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

    /* ---------- 昼夜主题切换（记忆偏好） ---------- */
    var themeBtn = document.getElementById('theme-toggle');
    function applyTheme(night) {
        document.documentElement.classList.toggle('night', night);
        try { localStorage.setItem('tc-theme', night ? 'night' : 'day'); } catch (e) { }
    }
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            applyTheme(!document.documentElement.classList.contains('night'));
        });
    }

    /* ---------- 打印 / 导出 PDF ---------- */
    var printBtn = document.getElementById('print-btn');
    if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

    /* ---------- 复制邮箱 ---------- */
    var copyBtn = document.getElementById('copy-email');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            var email = copyBtn.getAttribute('data-email') || '';
            var done = function () {
                var old = copyBtn.textContent;
                copyBtn.textContent = '已复制 ✓';
                copyBtn.disabled = true;
                setTimeout(function () {
                    copyBtn.textContent = old;
                    copyBtn.disabled = false;
                }, 2600);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                /* 部分环境剪贴板 Promise 会挂起，400ms 未决则走兜底 */
                var settled = false;
                var finish = function () { if (!settled) { settled = true; done(); } };
                setTimeout(function () { fallbackCopy(email, finish); }, 400);
                navigator.clipboard.writeText(email).then(finish).catch(function () { });
            } else {
                fallbackCopy(email, done);
            }
        });
    }
    function fallbackCopy(text, done) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { }
        document.body.removeChild(ta);
        done();
    }

    /* ---------- 返回顶部按钮 ---------- */
    var toTop = document.getElementById('to-top');
    function onScrollForTop() {
        if (toTop) toTop.classList.toggle('show', window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener('scroll', onScrollForTop, { passive: true });
    onScrollForTop();
    if (toTop) {
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
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
        var go = confirm('你好，' + name + '！要跳转到「家乡」页面吗？');
        demoLog('confirm()：返回 ' + go);
        if (go) {
            demoLog('跳转：正在前往「家乡」页面…');
            window.location.href = 'hometown.html';
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
