/* Levels: the engine. Static, works from file://. Progress lives in localStorage (KEY). Content format: FORMAT.md */
(function () {
  "use strict";
  var KEY = "hamza-levels-v1", PASS = 0.8, BOSS_PASS = 0.7, XP_DRILL = 15, XP_TASK = 25, XP_PER_LEVEL = 250;
  var C = window.CATALOG || { stages: [] };
  var RANKS = [[0, "مستجد"], [300, "متدرب"], [900, "صانع"], [2000, "محترف"], [3500, "خبير"], [5500, "قائد"], [8000, "أسطورة"]];
  var QUEST = [["pass", 1, "عدّي مستوى واحد"], ["drills", 2, "خلّص تمرينين كتابة"], ["tasks", 1, "حل تحدي واحد"]];

  // ------------------------------------------------------------------ state
  var S = (function () {
    var base = { xp: 0, done: {}, drills: {}, tasks: {}, days: {}, drafts: {}, last: null, stage: null };
    try { return Object.assign(base, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return base; }
  })();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function day() { var k = dayKey(); return (S.days[k] = S.days[k] || { xp: 0, pass: 0, drills: 0, tasks: 0 }); }
  function gain(n, what, counter) {
    S.xp += n; var d = day(); d.xp += n; if (counter) d[counter] += 1; save(); toast(what, n); chip();
  }
  function count(counter) { day()[counter] += 1; save(); }
  function streak() {
    var n = 0, d = new Date();
    if (!(S.days[dayKey(d)] || {}).xp) d.setDate(d.getDate() - 1); // today not started yet: the streak still stands
    while ((S.days[dayKey(d)] || {}).xp) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function rank(xp) {
    var i = 0; while (i + 1 < RANKS.length && xp >= RANKS[i + 1][0]) i++;
    return { name: RANKS[i][1], from: RANKS[i][0], next: RANKS[i + 1] || null };
  }

  // ------------------------------------------------------------------ helpers
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function toast(text, xp) {
    var t = el("div", "toast", esc(text) + (xp ? "<b>+" + xp + " XP</b>" : "")); document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }
  function chip() { var c = $(".xpchip"); if (c) c.textContent = S.xp + " XP"; }
  function stageById(id) { return C.stages.filter(function (s) { return s.id === id; })[0]; }
  function passed(key) { return !!(S.done[key] && S.done[key].passed); }
  function stageDone(st) { return st.levels.every(function (l) { return passed(st.id + "/" + l.id); }); }
  function stageOpen(st) { var need = st.needs && stageById(st.needs); return !need || stageDone(need); }
  function levelOpen(st, i) { return stageOpen(st) && (i === 0 || passed(st.id + "/" + st.levels[i - 1].id)); }
  function stageCount(st) { return st.levels.filter(function (l) { return passed(st.id + "/" + l.id); }).length; }
  function nextUp(st) {
    for (var i = 0; i < st.levels.length; i++) if (!passed(st.id + "/" + st.levels[i].id)) return levelOpen(st, i) ? st.levels[i] : null;
    return null;
  }

  var KW = {
    dart: "abstract as assert async await break case catch class const continue default do dynamic else enum extends extension external factory false final finally for get if implements import in is late library mixin new null on operator part required rethrow return sealed set static super switch this throw true try typedef var void when while with yield int double String bool List Map Set Future Stream Widget override",
    php: "abstract and array as break callable case catch class clone const continue declare default do echo else elseif empty enum extends false final finally fn for foreach function global if implements instanceof interface isset list match namespace new null or print private protected public readonly require require_once return static switch throw trait true try use var while yield int string bool float void mixed self parent",
    js: "async await break case catch class const continue default delete do else export extends false finally for from function if import in instanceof let new null of return static super switch this throw true try typeof undefined var void while yield",
    sql: "select from where and or not null is in like between join inner left right outer on group by order having limit offset insert into values update set delete create table index primary key foreign references unique default as distinct count sum avg min max case when then else end union all exists asc desc alter add drop constraint",
    bash: "if then else fi for in do done while case esac function return exit echo cd git php composer npm flutter dart artisan",
  };
  KW.blade = KW.php; KW.json = "true false null"; KW.yaml = "true false null";
  function hl(src, lang) {
    lang = (lang || "").toLowerCase();
    var words = KW[lang]; if (words == null) return esc(src);
    var set = {}; words.split(" ").forEach(function (w) { set[w] = 1; });
    var comment = lang === "sql" ? "--[^\\n]*" : lang === "bash" || lang === "yaml" ? "#[^\\n]*" : lang === "json" ? "(?!)" : "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" + (lang === "php" || lang === "blade" ? "|#(?!\\[)[^\\n]*" : "");
    var re = new RegExp("(" + comment + ")|(\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*')|\\b(\\d+(?:\\.\\d+)?)\\b|([A-Za-z_][\\w]*)", "g");
    var out = "", last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index)); last = re.lastIndex;
      var word = m[4], low = word && (lang === "sql" ? word.toLowerCase() : word);
      out += m[1] ? '<span class="tk-c">' + esc(m[1]) + "</span>" : m[2] ? '<span class="tk-s">' + esc(m[2]) + "</span>"
        : m[3] ? '<span class="tk-n">' + m[3] + "</span>" : set[low] === 1 ? '<span class="tk-k">' + esc(word) + "</span>" : esc(word);
    }
    return out + esc(src.slice(last));
  }
  function codebox(c) {
    if (typeof c === "string") c = { src: c };
    return '<div class="codebox"><div class="cap"><span>' + esc(c.title || "") + "</span><span>" + esc(c.lang || "") + "</span></div><pre><code>" + hl(clean(c.src), c.lang) + "</code></pre>"
      + (c.note ? '<div class="note">' + c.note + "</div>" : "") + "</div>";
  }
  function clean(src) { return String(src || "").replace(/\r/g, "").replace(/\t/g, "  ").replace(/[ ]+$/gm, "").replace(/^\n+|\n+$/g, ""); }
  function ivq(list) {
    return (list || []).map(function (x) { return '<details class="ivq"><summary>' + x.q + '</summary><div class="a">' + x.a + "</div></details>"; }).join("");
  }

  // ------------------------------------------------------------------ home
  function home() {
    var root = $("#home"); if (!root) return;
    if (!S.stage || !stageById(S.stage)) S.stage = C.stages[0] && C.stages[0].id;
    var r = rank(S.xp), lvl = Math.floor(S.xp / XP_PER_LEVEL) + 1, d = day();
    var total = 0, done = 0; C.stages.forEach(function (s) { total += s.levels.length; done += stageCount(s); });
    var span = r.next ? r.next[0] - r.from : 1, pct = r.next ? Math.min(100, ((S.xp - r.from) / span) * 100) : 100;
    var cont = continueTarget();
    $("#me").innerHTML =
      '<div class="panel host"><img src="img/avatar-stand.webp" alt="" width="687" height="1024"><div><b>حمزة سعيد</b><p>ده البرج اللي بنيته عشان أجهز للإنترفيو. اطلعه دور دور.</p></div></div>'
      + '<div class="panel"><div class="rank"><div class="crest">' + lvl + "</div><div><h1>" + r.name + "</h1><p>المستوى " + lvl + "</p></div></div>"
      + '<div class="xpbar"><i style="width:' + pct + '%"></i></div><div class="xpline"><span>' + S.xp + " XP</span><span>"
      + (r.next ? "باقي " + (r.next[0] - S.xp) + " على رتبة " + r.next[1] : "أعلى رتبة") + "</span></div></div>"
      + '<div class="panel stats"><div><b>' + streak() + "</b><span>يوم ورا بعض</span></div><div><b>" + done + "/" + total + "</b><span>مستوى</span></div><div><b>" + d.xp + "</b><span>XP النهارده</span></div></div>"
      + '<div class="panel quest"><h2>مهمة اليوم</h2><ul>' + QUEST.map(function (q) {
        return '<li class="' + (d[q[0]] >= q[1] ? "done" : "") + '">' + q[2] + " (" + Math.min(d[q[0]], q[1]) + "/" + q[1] + ")</li>";
      }).join("") + "</ul></div>"
      + (cont ? '<a class="btn wide" href="level.html?id=' + cont.key + '">كمّل: ' + esc(cont.title) + "</a>" : "")
      + '<p class="tiny">التقدم محفوظ على المتصفح ده. <button id="exp">حفظ نسخة</button> أو <button id="imp">استرجاع نسخة</button><input id="impf" type="file" accept=".json" hidden></p>';
    $("#exp").onclick = function () {
      var a = el("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: "application/json" })); a.download = "levels-progress-" + dayKey() + ".json"; a.click();
    };
    $("#imp").onclick = function () { $("#impf").click(); };
    $("#impf").onchange = function (e) {
      var f = e.target.files[0]; if (!f) return; var rd = new FileReader();
      rd.onload = function () { try { var x = JSON.parse(rd.result); if (typeof x.xp !== "number") throw 0; localStorage.setItem(KEY, JSON.stringify(x)); location.reload(); } catch (err) { toast("الملف ده مش نسخة تقدم صحيحة"); } };
      rd.readAsText(f);
    };

    var chips = $("#stages"); chips.innerHTML = "";
    C.stages.forEach(function (s) {
      var b = el("button", s.id === S.stage ? "on" : "", '<i style="--c:' + s.color + '"></i>' + esc(s.name) + " <small>" + stageCount(s) + "/" + s.levels.length + "</small>");
      b.onclick = function () { S.stage = s.id; save(); home(); }; chips.appendChild(b);
    });
    var st = stageById(S.stage); if (!st) return;
    var open = stageOpen(st), need = st.needs && stageById(st.needs);
    $("#stagehead").innerHTML = "<h2>" + esc(st.name) + "</h2><p>" + (st.about || "") + "</p>"
      + (open ? "" : '<p class="need">المرحلة دي بتتفتح بعد ما تخلص «' + esc(need.name) + "».</p>");
    var tower = $("#tower"); tower.innerHTML = ""; tower.style.setProperty("--stage", st.color);
    var current = null;
    st.levels.forEach(function (l, i) {
      var key = st.id + "/" + l.id, p = passed(key), o = levelOpen(st, i), now = o && !p && !current;
      var a = el("a", "floor" + (l.kind === "boss" ? " boss" : "") + (p ? " passed" : now ? " now" : o ? "" : " locked"));
      a.href = "level.html?id=" + key;
      var best = S.done[key] && S.done[key].best;
      a.innerHTML = '<div class="no">' + (l.kind === "boss" ? "★" : i + 1) + "</div><div><h3>" + esc(l.title) + "</h3><p>" + esc(l.en || "") + "</p></div>"
        + '<div class="state">' + (p ? "اتعدّى " + Math.round((best || 1) * 100) + "%" : now ? (l.kind === "boss" ? "واجه البوس" : "ادخل") : o ? "مفتوح" : "مقفول") + "</div>";
      if (now) current = a; tower.appendChild(a);
    });
    $("#summit").textContent = stageDone(st) ? "خلصت المرحلة دي كلها. اختار مرحلة تانية من فوق." : "القمة فوق. اطلع دور دور.";
    if (current && home.scrollTo !== S.stage) { home.scrollTo = S.stage; setTimeout(function () { current.scrollIntoView({ block: "center" }); }, 60); }
  }
  function continueTarget() {
    var order = C.stages.slice().sort(function (a, b) { return (b.id === S.stage) - (a.id === S.stage); });
    for (var i = 0; i < order.length; i++) { var l = nextUp(order[i]); if (l) return { key: order[i].id + "/" + l.id, title: l.title }; }
    return null;
  }

  // ------------------------------------------------------------------ level player
  function level() {
    var root = $("#level"); if (!root) return;
    var id = new URLSearchParams(location.search).get("id") || "", parts = id.split("/"), st = stageById(parts[0]);
    var idx = st ? st.levels.findIndex(function (l) { return l.id === parts[1]; }) : -1;
    if (idx < 0) { root.innerHTML = '<div class="empty">المستوى ده مش موجود. <a href="index.html">ارجع للبرج</a></div>'; return; }
    var meta = st.levels[idx]; document.documentElement.style.setProperty("--stage", st.color);
    document.title = meta.title + " | Levels";
    $("#lvlhead").innerHTML = "<div><h1>" + esc(meta.title) + '</h1><div class="en">' + esc(st.name) + " / " + esc(meta.en || "") + '</div></div><a class="btn ghost back" href="index.html">البرج</a>';
    if (!levelOpen(st, idx)) { root.innerHTML = '<div class="empty">المستوى ده لسه مقفول. عدّي اللي قبله الأول. <a href="index.html">ارجع للبرج</a></div>'; return; }
    S.last = id; S.stage = st.id; save();
    var s = el("script"); s.src = "data/" + st.id + "/" + meta.id + ".js";
    s.onload = function () { var data = (window.LEVELS || {})[id]; data ? play(root, id, st, idx, data) : missing(root); };
    s.onerror = function () { missing(root); };
    document.head.appendChild(s);
  }
  function missing(root) { root.innerHTML = '<div class="empty">محتوى المستوى ده لسه بيتكتب. جرّب مستوى تاني من <a href="index.html">البرج</a>.</div>'; }

  function play(root, id, st, idx, data) {
    var meta = st.levels[idx], isBoss = meta.kind === "boss" || (!data.quiz && data.boss);
    var tabs = [];
    if ((data.slides || []).length) tabs.push(["slides", "الشرح", data.slides.length]);
    if ((data.drills || []).length) tabs.push(["drills", "تمرين الكتابة", data.drills.length]);
    if ((data.tasks || []).length) tabs.push(["tasks", "التحديات", data.tasks.length]);
    if ((data.quiz || []).length) tabs.push(["quiz", "الاختبار", data.quiz.length]);
    if ((data.boss || []).length) tabs.push(["boss", "المواجهة", data.boss.length]);
    var bar = $("#tabs"), cur = tabs[0] && tabs[0][0];
    function doneCount(kind) {
      var n = 0, list = data[kind] || [];
      for (var i = 0; i < list.length; i++) if ((kind === "drills" ? S.drills : S.tasks)[id + "#" + i]) n++;
      return n;
    }
    function drawTabs() {
      bar.innerHTML = "";
      tabs.forEach(function (t) {
        var n = t[0] === "drills" || t[0] === "tasks" ? doneCount(t[0]) + "/" + t[2] : t[2];
        var all = (t[0] === "drills" || t[0] === "tasks") && doneCount(t[0]) === t[2] || ((t[0] === "quiz" || t[0] === "boss") && passed(id));
        var b = el("button", (t[0] === cur ? "on" : "") + (all ? " all" : ""), t[1] + " <small>" + n + "</small>");
        b.onclick = function () { cur = t[0]; show(); }; bar.appendChild(b);
      });
    }
    function show() {
      drawTabs(); root.innerHTML = ""; window.scrollTo(0, 0);
      ({ slides: slides, drills: drills, tasks: tasks, quiz: quiz, boss: boss })[cur]();
    }
    function go(kind) { if (tabs.some(function (t) { return t[0] === kind; })) { cur = kind; show(); return true; } return false; }
    function nextTab() { var i = tabs.findIndex(function (t) { return t[0] === cur; }); if (tabs[i + 1]) { cur = tabs[i + 1][0]; show(); } }
    function nextLevelLink() {
      var n = st.levels[idx + 1];
      return n ? '<a class="btn gold" href="level.html?id=' + st.id + "/" + n.id + '">المستوى اللي بعده: ' + esc(n.title) + "</a>" : '<a class="btn gold" href="index.html">ارجع للبرج</a>';
    }

    // ---- slides
    var at = 0, seen = {};
    function slides() {
      var list = data.slides, sl = list[at]; seen[at] = 1;
      var h = '<div class="slide">' + (sl.kicker ? '<p class="kicker">' + esc(sl.kicker) + "</p>" : "") + "<h2>" + esc(sl.title) + "</h2>"
        + (sl.en ? '<p class="en">' + esc(sl.en) + "</p>" : "") + (sl.body ? '<div class="body">' + sl.body + "</div>" : "")
        + (sl.points ? "<ul>" + sl.points.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ul>" : "")
        + (sl.code ? codebox(sl.code) : "") + (sl.codes || []).map(codebox).join("")
        + (sl.terms ? '<table class="terms">' + sl.terms.map(function (t) { return "<tr><td>" + esc(t[0]) + "</td><td>" + esc(t[1] || "") + "</td><td>" + (t[2] || "") + "</td></tr>"; }).join("") + "</table>" : "")
        + (sl.focus || []).map(function (f) { return '<div class="focus"><b>' + esc(f.label || "ركّز") + "</b>" + f.text + "</div>"; }).join("")
        + (sl.pitfall ? '<div class="pitfall"><b>غلطة مشهورة: </b>' + sl.pitfall + "</div>" : "")
        + (sl.interview ? "<h3>بيتسأل في الإنترفيو</h3>" + ivq(sl.interview) : "") + "</div>";
      var last = at === list.length - 1;
      h += '<div class="pager"><button class="btn ghost" id="prev"' + (at ? "" : " disabled") + '>السابق</button><div class="dots">'
        + list.map(function (_, i) { return '<i class="' + (i === at ? "on" : seen[i] ? "seen" : "") + '"></i>'; }).join("")
        + '</div><button class="btn" id="next">' + (last ? (tabs.length > 1 ? "خلصت الشرح، كمّل" : "تمام") : "التالي") + "</button></div>";
      root.innerHTML = h;
      $("#prev").onclick = function () { if (at) { at--; slides(); window.scrollTo(0, 0); } };
      $("#next").onclick = function () { if (!last) { at++; slides(); window.scrollTo(0, 0); } else nextTab(); };
    }
    document.addEventListener("keydown", function (e) {
      if (cur !== "slides" || /TEXTAREA|INPUT/.test(document.activeElement.tagName)) return;
      if (e.key === "ArrowLeft" || e.key === " ") { e.preventDefault(); $("#next") && $("#next").click(); }
      if (e.key === "ArrowRight") { $("#prev") && $("#prev").click(); }
    });

    // ---- typing drills
    function drills() {
      data.drills.forEach(function (d, i) {
        var key = id + "#" + i, target = clean(d.code), lines = target.split("\n");
        var box = el("div", "drill", "<h3>" + esc(d.title || "اكتب الكود ده") + '</h3><p class="hint">' + (d.note || "اكتبه بإيدك حرف حرف. المسافات اللي في أول السطر بتتكتب لوحدها.") + "</p>"
          + '<div class="typebox idle"><pre></pre><textarea spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="اكتب الكود"></textarea></div><div class="meter"></div>');
        var pre = $("pre", box), ta = $("textarea", box), meter = $(".meter", box), tb = $(".typebox", box);
        var started = 0, keys = 0, bad = 0, prev = "", finished = false;
        function paint() {
          var v = ta.value, h = "";
          for (var k = 0; k < target.length; k++) {
            var ch = target[k], shown = ch === "\n" ? (k === v.length ? "⏎\n" : "\n") : esc(ch);
            if (k < v.length) h += '<span class="' + (v[k] === ch ? "ok" : "bad") + '">' + (v[k] !== ch && ch === "\n" ? "⏎\n" : shown) + "</span>";
            else if (k === v.length) h += '<span class="cur">' + shown + "</span>"; else h += shown;
          }
          pre.innerHTML = h;
          var rec = S.drills[key];
          meter.innerHTML = finished ? "" : "<span>الحروف <b>" + v.length + "/" + target.length + "</b></span><span>الأخطاء <b>" + bad + "</b></span>"
            + (rec ? '<span class="done">اتعمل قبل كده: ' + rec.wpm + " كلمة/د، دقة " + rec.acc + "%</span>" : "");
        }
        ta.addEventListener("paste", function (e) { e.preventDefault(); toast("اللصق مقفول هنا. اكتبه بإيدك"); });
        ta.addEventListener("keydown", function (e) {
          if (finished) return;
          if (e.key === "Enter") {
            e.preventDefault(); var n = ta.value.split("\n").length, ind = (lines[n] || "").match(/^ */)[0];
            ta.value += "\n" + ind; ta.dispatchEvent(new Event("input"));
          } else if (e.key === "Tab") { e.preventDefault(); ta.value += "  "; ta.dispatchEvent(new Event("input")); }
          else if (/^Arrow|Home|End|PageUp|PageDown/.test(e.key)) e.preventDefault();
        });
        ta.addEventListener("input", function () {
          if (finished) { ta.value = prev; return; }
          if (!started) { started = Date.now(); tb.classList.remove("idle"); }
          if (ta.value.length > target.length) ta.value = ta.value.slice(0, target.length);
          var v = ta.value;
          if (v.length > prev.length) for (var k = prev.length; k < v.length; k++) { keys++; if (v[k] !== target[k]) bad++; }
          prev = v; ta.setSelectionRange(v.length, v.length); paint();
          if (v === target) {
            finished = true;
            var min = Math.max((Date.now() - started) / 60000, 1 / 600), wpm = Math.round(target.length / 5 / min), acc = Math.max(0, Math.round((1 - bad / Math.max(keys, 1)) * 100));
            var first = !S.drills[key]; S.drills[key] = { wpm: wpm, acc: acc, at: dayKey() }; save();
            if (first) gain(XP_DRILL, "تمرين كتابة خلص", "drills"); else count("drills");
            meter.innerHTML = '<span class="done">خلصت. ' + wpm + " كلمة في الدقيقة، دقة " + acc + '%</span><button class="btn ghost" type="button">اعيده</button>';
            $("button", meter).onclick = function () { ta.value = ""; prev = ""; started = 0; keys = 0; bad = 0; finished = false; tb.classList.add("idle"); paint(); ta.focus(); };
            drawTabs();
          }
        });
        paint(); root.appendChild(box);
      });
      root.appendChild(footer());
    }

    // ---- tasks (write it yourself, then compare with the solution)
    function tasks() {
      data.tasks.forEach(function (t, i) {
        var key = id + "#" + i, shownHints = 0;
        var box = el("div", "task", "<h3>" + esc(t.title) + '</h3><div class="body">' + (t.prompt || "") + "</div>"
          + (t.examples || []).map(function (x) { return '<div class="ex">' + esc(x.in != null ? "in:  " + x.in + "\nout: " + x.out : x) + "</div>"; }).join("")
          + '<textarea class="work" spellcheck="false" placeholder="اكتب حلك هنا' + (t.lang ? " (" + t.lang + ")" : "") + '"></textarea>'
          + '<div class="row"><button class="btn ghost h" type="button">تلميح</button><button class="btn s" type="button">قارن بالحل</button><span class="stamp"></span></div><div class="hints"></div><div class="sol"></div>');
        var ta = $("textarea", box), hints = $(".hints", box), sol = $(".sol", box), stamp = $(".stamp", box);
        ta.value = S.drafts[key] != null ? S.drafts[key] : (t.starter ? clean(t.starter) : "");
        ta.addEventListener("input", function () { S.drafts[key] = ta.value; save(); });
        ta.addEventListener("keydown", function (e) {
          if (e.key === "Tab") { e.preventDefault(); var p = ta.selectionStart; ta.value = ta.value.slice(0, p) + "  " + ta.value.slice(ta.selectionEnd); ta.setSelectionRange(p + 2, p + 2); }
        });
        if (S.tasks[key]) stamp.textContent = "اتحل قبل كده";
        if (!(t.hints || []).length) $(".h", box).remove();
        else $(".h", box).onclick = function () {
          if (shownHints < t.hints.length) { hints.appendChild(el("div", "hintbox", t.hints[shownHints++])); }
          if (shownHints >= t.hints.length) this.disabled = true;
        };
        $(".s", box).onclick = function () {
          if (!ta.value.trim() && !confirm("لسه مكتبتش حاجة. تشوف الحل برضه؟")) return;
          sol.innerHTML = codebox({ src: t.solution, lang: t.lang, title: "الحل", note: t.explain })
            + '<div class="row"><button class="btn ok y" type="button">حلي صح</button><button class="btn ghost n" type="button">محتاج أعيده</button></div>';
          $(".y", sol).onclick = function () {
            var first = !S.tasks[key]; S.tasks[key] = dayKey(); save();
            if (first) gain(XP_TASK, "تحدي اتحل", "tasks"); else count("tasks");
            stamp.textContent = "اتحل"; sol.querySelector(".row").remove(); drawTabs();
          };
          $(".n", sol).onclick = function () { sol.innerHTML = ""; toast("اقفل الحل وجرّب تاني من الأول"); };
        };
        root.appendChild(box);
      });
      root.appendChild(footer());
    }
    function footer() {
      var f = el("div", "pager"), i = tabs.findIndex(function (t) { return t[0] === cur; });
      if (tabs[i + 1]) { var b = el("button", "btn", "كمّل: " + tabs[i + 1][1]); b.onclick = nextTab; f.appendChild(b); }
      return f;
    }

    // ---- quiz
    function norm(s) { return String(s).trim().toLowerCase().replace(/\s+/g, " ").replace(/[;.]$/, ""); }
    function quiz() {
      var wrap = el("div", "quiz"), order = data.quiz.map(function (q) {
        var o = (q.options || []).map(function (_, k) { return k; });
        for (var k = o.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = o[k]; o[k] = o[j]; o[j] = t; }
        return o;
      });
      data.quiz.forEach(function (q, i) {
        var h = '<p><span class="n">' + (i + 1) + "</span>" + q.q + "</p>" + (q.code ? codebox(q.code) : "");
        if (q.options) h += order[i].map(function (k) { return '<label class="opt"><input type="radio" name="q' + i + '" value="' + k + '"><span>' + q.options[k] + "</span></label>"; }).join("");
        else h += '<input class="free" name="q' + i + '" placeholder="اكتب الإجابة" autocomplete="off">';
        wrap.appendChild(el("div", "q", h));
      });
      var btn = el("button", "btn", "صحّح"); wrap.appendChild(btn); root.appendChild(wrap);
      btn.onclick = function () {
        var right = 0, blank = 0;
        data.quiz.forEach(function (q, i) {
          var box = wrap.children[i], ok;
          if (q.options) {
            var pick = box.querySelector("input:checked"); if (!pick) blank++;
            ok = !!pick && +pick.value === q.answer;
            box.querySelectorAll("label.opt").forEach(function (l) {
              var v = +l.querySelector("input").value; l.classList.remove("right", "wrong");
              if (v === q.answer) l.classList.add("right"); else if (pick && v === +pick.value) l.classList.add("wrong");
            });
          } else {
            var inp = box.querySelector("input.free"); if (!inp.value.trim()) blank++;
            ok = [].concat(q.answer).some(function (a) { return norm(a) === norm(inp.value); });
            inp.style.borderColor = ok ? "var(--ok)" : "var(--boss)";
          }
          if (ok) right++;
          var w = box.querySelector(".why") || box.appendChild(el("div", "why"));
          w.innerHTML = (ok ? "<b>صح.</b> " : "<b>غلط.</b> " + (q.options ? "" : "الإجابة: <code>" + esc([].concat(q.answer)[0]) + "</code>. ")) + (q.why || "");
        });
        finish(right / data.quiz.length, PASS, wrap, right + " من " + data.quiz.length);
        btn.textContent = "صحّح تاني";
      };
    }

    // ---- boss: interview questions, answered aloud or typed, then self-rated against the model answer
    function boss() {
      var rates = {}, wrap = el("div");
      data.boss.forEach(function (b, i) {
        var box = el("div", "bossq", "<h3>" + (i + 1) + ". " + b.q + '</h3><textarea placeholder="جاوب بصوت عالي أو اكتب إجابتك هنا"></textarea>'
          + '<div class="row"><button class="btn ghost" type="button">اظهر الإجابة النموذجية</button></div><div class="reveal"></div>');
        $("button", box).onclick = function () {
          $(".reveal", box).innerHTML = '<div class="a">' + b.a + '</div><div class="rate"><button data-v="1">عرفتها</button><button data-v="0.5">نص نص</button><button data-v="0">معرفتهاش</button></div>';
          box.querySelectorAll(".rate button").forEach(function (r) {
            r.onclick = function () {
              rates[i] = +r.dataset.v; box.querySelectorAll(".rate button").forEach(function (x) { x.classList.toggle("on", x === r); });
              if (Object.keys(rates).length === data.boss.length) {
                var sum = 0; Object.keys(rates).forEach(function (k) { sum += rates[k]; });
                finish(sum / data.boss.length, BOSS_PASS, wrap, "قيّمت نفسك في " + data.boss.length + " سؤال");
              }
            };
          });
          this.remove();
        };
        wrap.appendChild(box);
      });
      root.appendChild(wrap);
    }

    function finish(score, need, wrap, detail) {
      var old = $(".result", root); if (old) old.remove();
      var pct = Math.round(score * 100), ok = score >= need, rec = S.done[id] || {}, first = !rec.passed, xp = meta.xp || (isBoss ? 300 : 100);
      S.done[id] = { passed: rec.passed || ok, best: Math.max(rec.best || 0, score), at: dayKey() }; save();
      var r = el("div", "result" + (ok ? "" : " fail"));
      if (ok) {
        if (first) gain(xp, isBoss ? "البوس وقع" : "المستوى اتعدّى", "pass");
        r.innerHTML = '<img class="wave" src="img/avatar-wave.webp" alt="" width="687" height="1024">' + "<h2>" + (isBoss ? "البوس وقع" : "عدّيت المستوى") + " " + pct + "%</h2><p>" + detail + (first ? ' <span class="gain">+' + xp + " XP</span>" : "") + "</p>" + nextLevelLink();
      } else {
        r.innerHTML = "<h2>" + pct + "% ومحتاج " + Math.round(need * 100) + "%</h2><p>" + detail + ". راجع الشرح في النقط اللي غلطت فيها وجرّب تاني.</p>"
          + '<button class="btn" type="button">ارجع للشرح</button>';
        $("button", r).onclick = function () { go("slides"); };
      }
      wrap.appendChild(r); r.scrollIntoView({ block: "center" }); drawTabs();
    }

    if (!tabs.length) return missing(root);
    show();
  }

  // ------------------------------------------------------------------ interview bank
  function bank() {
    var root = $("#bank"); if (!root) return;
    var sel = $("#bankstage"), search = $("#banksearch"), list = $("#banklist");
    C.stages.forEach(function (s) { var o = el("option", "", esc(s.name)); o.value = s.id; sel.appendChild(o); });
    sel.value = S.stage && stageById(S.stage) ? S.stage : C.stages[0].id;
    var cache = {};
    function loadStage(st, cb) {
      if (cache[st.id]) return cb(cache[st.id]);
      var out = [], left = st.levels.length; if (!left) return cb(out);
      st.levels.forEach(function (l, i) {
        var key = st.id + "/" + l.id, s = el("script"); s.src = "data/" + key + ".js";
        s.onload = s.onerror = function () {
          var d = (window.LEVELS || {})[key], qs = [];
          if (d) { (d.slides || []).forEach(function (sl) { (sl.interview || []).forEach(function (x) { qs.push(x); }); }); (d.boss || []).forEach(function (x) { qs.push(x); }); }
          out[i] = { title: l.title, qs: qs };
          if (!--left) { cache[st.id] = out; cb(out); }
        };
        document.head.appendChild(s);
      });
    }
    function draw() {
      var st = stageById(sel.value), term = search.value.trim().toLowerCase();
      loadStage(st, function (groups) {
        var h = "", n = 0;
        groups.forEach(function (g) {
          var qs = g.qs.filter(function (x) { return !term || (x.q + " " + x.a).toLowerCase().indexOf(term) >= 0; });
          if (qs.length) { h += "<h2>" + esc(g.title) + "</h2>" + ivq(qs); n += qs.length; }
        });
        list.innerHTML = h || '<div class="empty">مفيش أسئلة هنا لسه.</div>'; $("#bankcount").textContent = n + " سؤال";
      });
    }
    sel.onchange = draw; search.oninput = draw; draw();
  }

  // Published next to the owner's portfolio (one folder up): link back to it. Opened from disk there is no such page.
  function credit() {
    if (location.protocol === "file:") return;
    var nav = $(".bar nav"); if (!nav) return;
    var a = el("a", "", "البورتفوليو"); a.href = "../"; nav.appendChild(a);
    var h = el("a", "cta", "Hire me"); h.href = "../#hire"; nav.appendChild(h);
  }
  document.addEventListener("DOMContentLoaded", function () { chip(); credit(); home(); level(); bank(); });
})();
