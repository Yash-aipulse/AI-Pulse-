/* AI Pulse – "Ask AI Pulse" chat box.
   Loaded on every page. Stays hidden until CHAT_ENDPOINT is set to the Cloudflare Worker URL. */
(function () {
  var CHAT_ENDPOINT = "https://ai-pulse-chat.yash-jain-workspace.workers.dev/";
  if (!CHAT_ENDPOINT || window.__aipChat) return;
  window.__aipChat = true;

  var page = location.pathname;
  var isArchiveList = /\/archive\/(index\.html)?$/.test(page);
  if (isArchiveList) return; // only on issue pages

  var css = `
  .aip-chat-btn{position:fixed;right:24px;bottom:24px;z-index:150;display:inline-flex;align-items:center;gap:10px;padding:12px 20px;border-radius:100px;border:1px solid var(--accent,#5EEAD4);background:rgba(8,9,10,0.92);color:var(--accent,#5EEAD4);font-family:'Carlito','Calibri','Segoe UI',sans-serif;font-weight:700;font-size:14px;letter-spacing:.01em;box-shadow:0 0 24px rgba(94,234,212,0.25);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:background .3s,color .3s,transform .3s}
  .aip-chat-btn:hover{background:var(--accent,#5EEAD4);color:var(--bg,#08090A);transform:translateY(-2px)}
  .aip-chat-btn .aip-dot{width:8px;height:8px;border-radius:50%;background:currentColor;box-shadow:0 0 10px currentColor}
  .aip-chat-btn[hidden]{display:none}
  .aip-chat-panel{position:fixed;right:24px;bottom:24px;z-index:150;width:400px;max-width:calc(100vw - 32px);height:min(600px,calc(100vh - 120px));display:none;flex-direction:column;background:var(--bg-card,#14171A);border:1px solid var(--border-strong,#2A2F36);border-top:2px solid var(--accent,#5EEAD4);border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(94,234,212,0.08);font-family:'Carlito','Calibri','Segoe UI',sans-serif;color:var(--text,#F4F6F7);overflow:hidden;animation:aipUp .35s cubic-bezier(.16,1,.3,1)}
  .aip-chat-panel.open{display:flex}
  @keyframes aipUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  .aip-chat-head{display:flex;align-items:center;gap:12px;padding:14px 14px 14px 18px;border-bottom:1px solid var(--border,#1E2227)}
  .aip-chat-mark{width:26px;height:26px;flex-shrink:0;background:var(--accent,#5EEAD4);position:relative;box-shadow:0 0 16px rgba(94,234,212,0.3)}
  .aip-chat-mark::after{content:'';position:absolute;left:50%;top:50%;width:9px;height:9px;border-radius:50%;background:var(--bg,#08090A);transform:translate(-50%,-50%)}
  .aip-chat-titles{flex:1;min-width:0}
  .aip-chat-title{font-weight:700;font-size:17px;line-height:1.2}
  .aip-chat-sub{font-size:13px;line-height:1.3;color:var(--text-muted,#7A8189);margin-top:2px}
  .aip-chat-close{width:34px;height:34px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid var(--border-strong,#2A2F36);background:transparent;color:var(--text-secondary,#B8BEC3);font-size:20px;line-height:1;border-radius:50%;padding:0}
  .aip-chat-close:hover{color:var(--bg,#08090A);background:var(--accent,#5EEAD4);border-color:var(--accent,#5EEAD4)}
  .aip-chat-log{flex:1;overflow-y:auto;padding:16px 18px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
  .aip-msg{max-width:92%;padding:11px 14px;border-radius:12px;font-size:15px;line-height:1.6;word-wrap:break-word;overflow-wrap:anywhere}
  .aip-msg p{margin:0 0 8px}.aip-msg p:last-child{margin:0}
  .aip-msg ul{margin:4px 0 8px 18px;padding:0}.aip-msg li{margin:2px 0}
  .aip-msg a{color:var(--accent,#5EEAD4);text-decoration:underline;text-underline-offset:2px}
  .aip-msg.bot{align-self:flex-start;background:var(--bg-elev,#181B1F);border:1px solid var(--border,#1E2227);color:var(--text-secondary,#B8BEC3)}
  .aip-msg.user{align-self:flex-end;background:rgba(94,234,212,0.12);border:1px solid rgba(94,234,212,0.35);color:var(--text,#F4F6F7)}
  .aip-msg.err{border-color:#5a3a3a;color:#E8B4B4}
  .aip-typing{display:inline-flex;gap:5px}.aip-typing i{width:6px;height:6px;border-radius:50%;background:var(--accent,#5EEAD4);opacity:.4;animation:aipBlink 1.2s infinite}
  .aip-typing i:nth-child(2){animation-delay:.2s}.aip-typing i:nth-child(3){animation-delay:.4s}
  @keyframes aipBlink{0%,80%,100%{opacity:.25}40%{opacity:1}}
  .aip-suggest{display:flex;flex-wrap:wrap;gap:6px}
  .aip-suggest button{font-family:inherit;font-size:13px;font-weight:700;padding:7px 12px;border-radius:100px;border:1px solid var(--border-strong,#2A2F36);background:transparent;color:var(--text-secondary,#B8BEC3)}
  .aip-suggest button:hover{border-color:var(--accent,#5EEAD4);color:var(--accent,#5EEAD4)}
  .aip-chat-form{display:flex;gap:8px;padding:12px 14px 8px;border-top:1px solid var(--border,#1E2227)}
  .aip-chat-input{flex:1;min-width:0;padding:11px 14px;background:var(--bg-elev,#181B1F);border:1px solid var(--border,#1E2227);border-radius:10px;color:var(--text,#F4F6F7);font-family:inherit;font-size:15px}
  .aip-chat-input:focus{outline:none;border-color:var(--accent,#5EEAD4);box-shadow:0 0 14px rgba(94,234,212,0.2)}
  .aip-chat-send{padding:0 16px;border-radius:10px;border:1px solid var(--accent,#5EEAD4);background:var(--accent,#5EEAD4);color:var(--bg,#08090A);font-family:inherit;font-weight:700;font-size:14px}
  .aip-chat-send:disabled{opacity:.5}
  .aip-chat-note{padding:0 16px 12px;font-size:11.5px;line-height:1.5;color:var(--text-muted,#7A8189)}
  @media (max-width:720px){
    .aip-chat-btn{right:16px;bottom:16px;padding:11px 16px;cursor:pointer}
    .aip-chat-panel{right:8px;left:8px;bottom:8px;width:auto;max-width:none;height:calc(100vh - 80px);height:calc(100dvh - 80px)}
    .aip-chat-panel button,.aip-chat-btn{cursor:pointer}
  }
  @media (min-width:1100px){
    body{transition:padding-right .35s cubic-bezier(.16,1,.3,1)}
    body.aip-chat-open{padding-right:400px}
    body.aip-chat-open .story-nav{right:428px}
    .aip-chat-panel{top:0;right:0;bottom:0;width:400px;max-width:none;height:auto;border:none;border-left:1px solid var(--border-strong,#2A2F36);border-radius:0;box-shadow:-24px 0 60px rgba(0,0,0,0.45);animation:aipSlide .35s cubic-bezier(.16,1,.3,1)}
    .aip-chat-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--accent,#5EEAD4),transparent)}
  }
  @keyframes aipSlide{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:none}}
  @media (prefers-reduced-motion:reduce){.aip-chat-panel{animation:none}body{transition:none}.aip-typing i{animation:none;opacity:.8}}
  `;
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement("button");
  btn.className = "aip-chat-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Ask AI Pulse about this issue");
  btn.innerHTML = '<span class="aip-dot"></span><span>Ask AI Pulse</span>';

  var panel = document.createElement("div");
  panel.className = "aip-chat-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Ask AI Pulse");
  panel.innerHTML =
    '<div class="aip-chat-head"><div class="aip-chat-mark"></div><div class="aip-chat-titles"><div class="aip-chat-title">Ask AI Pulse</div><div class="aip-chat-sub">Questions about this issue&#39;s stories</div></div>' +
    '<button type="button" class="aip-chat-close" aria-label="Close">&#215;</button></div>' +
    '<div class="aip-chat-log" aria-live="polite"></div>' +
    '<form class="aip-chat-form"><input class="aip-chat-input" type="text" maxlength="500" placeholder="Ask about a story…" aria-label="Your question" autocomplete="off">' +
    '<button class="aip-chat-send" type="submit">Ask</button></form>' +
    '<div class="aip-chat-note">AI-generated answers can be wrong – check the source links. Questions are processed by Google Gemini or Cloudflare; please don\'t share personal information.</div>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var log = panel.querySelector(".aip-chat-log");
  var form = panel.querySelector(".aip-chat-form");
  var input = panel.querySelector(".aip-chat-input");
  var send = panel.querySelector(".aip-chat-send");
  var history = [];
  var started = false;

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function inline(s) {
    var out = escapeHtml(s);
    out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener nofollow">$1</a>');
    out = out.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:])/g, '$1<a href="$2" target="_blank" rel="noopener nofollow">$2</a>');
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return out;
  }
  function format(text) {
    var lines = text.replace(/\r/g, "").split("\n");
    var html = "", list = false;
    lines.forEach(function (line) {
      var t = line.trim();
      var m = t.match(/^[-*•]\s+(.*)$/);
      if (m) {
        if (!list) { html += "<ul>"; list = true; }
        html += "<li>" + inline(m[1]) + "</li>";
      } else {
        if (list) { html += "</ul>"; list = false; }
        if (t) html += "<p>" + inline(t) + "</p>";
      }
    });
    if (list) html += "</ul>";
    return html;
  }
  function add(role, text, isError) {
    var el = document.createElement("div");
    el.className = "aip-msg " + (role === "user" ? "user" : "bot") + (isError ? " err" : "");
    if (role === "user") el.textContent = text; else el.innerHTML = format(text);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }
  function welcome() {
    add("bot", "Ask me about the stories in this issue, or what any term in them means. News facts come straight from the issue, with links to the original sources.");
    var s = document.createElement("div");
    s.className = "aip-suggest";
    ["Summarize this issue in 3 points", "Explain the lead story simply", "What should procurement teams take from this?"].forEach(function (q) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = q;
      b.addEventListener("click", function () { s.remove(); ask(q); });
      s.appendChild(b);
    });
    log.appendChild(s);
  }
  function open() {
    panel.classList.add("open");
    btn.hidden = true;
    document.body.classList.add("aip-chat-open");
    if (!started) { started = true; welcome(); }
    setTimeout(function () { input.focus(); }, 50);
  }
  function close() {
    panel.classList.remove("open");
    btn.hidden = false;
    document.body.classList.remove("aip-chat-open");
    btn.focus();
  }
  function ask(q) {
    q = (q || "").trim();
    if (!q) return;
    var sug = log.querySelector(".aip-suggest");
    if (sug) sug.remove();
    add("user", q);
    input.value = "";
    send.disabled = true; input.disabled = true;
    var typing = document.createElement("div");
    typing.className = "aip-msg bot";
    typing.innerHTML = '<span class="aip-typing"><i></i><i></i><i></i></span>';
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;
    fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, page: page, history: history.slice(-6) })
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (data) {
        typing.remove();
        if (data && data.answer) {
          add("bot", data.answer);
          history.push({ role: "user", text: q }, { role: "assistant", text: data.answer });
        } else {
          add("bot", (data && data.error) || "Sorry – the assistant is busy right now. Please try again in a little while.", true);
        }
      })
      .catch(function () {
        typing.remove();
        add("bot", "Sorry – couldn't reach the assistant. Please check your connection and try again.", true);
      })
      .finally(function () { send.disabled = false; input.disabled = false; input.focus(); });
  }

  btn.addEventListener("click", open);
  panel.querySelector(".aip-chat-close").addEventListener("click", close);
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) close(); });

  // Hook into the site's custom cursor, if present
  var dot = document.getElementById("cursorDot"), trail = document.getElementById("cursorTrail");
  if (dot && trail) {
    [btn].concat([].slice.call(panel.querySelectorAll("button"))).forEach(function (el) {
      el.addEventListener("mouseenter", function () { dot.classList.add("expanded"); trail.classList.add("expanded"); });
      el.addEventListener("mouseleave", function () { dot.classList.remove("expanded"); trail.classList.remove("expanded"); });
    });
  }
})();
