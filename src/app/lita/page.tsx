<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lita 💋</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      background: linear-gradient(160deg, #0a0612 0%, #1a0a2e 40%, #0d1b2a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Georgia', serif;
      padding: 20px;
      overflow-x: hidden;
    }

    body::before {
      content: '';
      position: fixed;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(200, 80, 160, 0.18) 0%, transparent 70%);
      pointer-events: none;
    }
    body::after {
      content: '';
      position: fixed;
      bottom: -100px;
      right: -80px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(100, 60, 200, 0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    .card {
      position: relative;
      background: rgba(20, 8, 35, 0.85);
      border: 1px solid rgba(200, 80, 160, 0.25);
      border-radius: 24px;
      padding: 40px 36px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      backdrop-filter: blur(20px);
      box-shadow: 0 0 60px rgba(180, 60, 140, 0.12), 0 20px 60px rgba(0,0,0,0.5);
      overflow: hidden;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(220, 100, 180, 0.6), transparent);
    }

    .header { margin-bottom: 8px; }

    .eyebrow {
      font-size: 11px;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: rgba(220, 100, 180, 0.7);
      margin-bottom: 12px;
    }

    h1 {
      font-size: 42px;
      font-weight: normal;
      color: #fff;
      letter-spacing: 2px;
      line-height: 1.1;
      margin-bottom: 4px;
    }

    h1 em {
      font-style: normal;
      background: linear-gradient(135deg, #f472b6, #c084fc, #f472b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .sub {
      font-size: 13px;
      color: rgba(255,255,255,0.4);
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 28px;
    }

    .timer-box {
      background: rgba(200, 60, 120, 0.12);
      border: 1px solid rgba(200, 80, 160, 0.3);
      border-radius: 14px;
      padding: 14px 20px;
      margin-bottom: 28px;
      display: inline-block;
      width: 100%;
    }

    .timer-label {
      font-size: 10px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: rgba(240, 120, 180, 0.7);
      margin-bottom: 6px;
    }

    #timer {
      font-family: 'Courier New', monospace;
      font-size: 38px;
      color: #f472b6;
      letter-spacing: 4px;
      font-weight: bold;
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 28px;
    }

    .option {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      padding: 18px 22px;
      cursor: default;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .option::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(244, 114, 182, 0.08), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .option:hover::after { opacity: 1; }

    .option:hover {
      border-color: rgba(200, 80, 160, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(180, 60, 140, 0.15);
    }

    .option-number {
      font-size: 10px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: rgba(200, 80, 160, 0.6);
      margin-bottom: 6px;
    }

    .option-title {
      font-size: 17px;
      color: #fff;
      font-weight: normal;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }

    .option-desc {
      font-size: 12px;
      color: rgba(255,255,255,0.35);
      letter-spacing: 0.5px;
    }

    .cta {
      display: block;
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #c9184a, #a4133c);
      border: none;
      border-radius: 12px;
      color: #fff;
      font-family: 'Georgia', serif;
      font-size: 15px;
      letter-spacing: 2px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 20px rgba(201, 24, 74, 0.4);
    }

    .cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(201, 24, 74, 0.5);
      background: linear-gradient(135deg, #e0185a, #c9184a);
    }

    .footer {
      margin-top: 20px;
      font-size: 10px;
      color: rgba(255,255,255,0.2);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* Response state */
    #response-msg {
      display: none;
      margin-top: 20px;
      padding: 16px;
      background: rgba(244, 114, 182, 0.1);
      border: 1px solid rgba(244, 114, 182, 0.3);
      border-radius: 12px;
      color: #f472b6;
      font-size: 14px;
      letter-spacing: 1px;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    .urgent #timer {
      animation: pulse 1s ease-in-out infinite;
      color: #ff6b9d;
    }

    .heart {
      position: fixed;
      font-size: 16px;
      color: rgba(244, 114, 182, 0.15);
      pointer-events: none;
      animation: floatUp 8s ease-in infinite;
    }

    @keyframes floatUp {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
    }

    @media (max-width: 480px) {
      .card { padding: 32px 24px; }
      h1 { font-size: 36px; }
      #timer { font-size: 32px; }
    }
  </style>
</head>
<body>

<div class="card" id="card">
  <div class="header">
    <div class="eyebrow">private invitation</div>
    <h1>Hey <em>Lita</em> 💋</h1>
    <div class="sub">tonight, only</div>
  </div>

  <div class="timer-box" id="timerBox">
    <div class="timer-label">offer expires in</div>
    <div id="timer">30:00</div>
  </div>

  <div class="options" id="options">
    <div class="option" onclick="selectOption(1, 'Chill Massage Before Bed')">
      <div class="option-number">option one</div>
      <div class="option-title">Chill Massage Before Bed</div>
      <div class="option-desc">relaxing, slow, all about you</div>
    </div>
    <div class="option" onclick="selectOption(2, 'Massage & Oil Up')">
      <div class="option-number">option two</div>
      <div class="option-title">Massage & Oil Up</div>
      <div class="option-desc">warm oil, full body, unhurried</div>
    </div>
    <div class="option" onclick="selectOption(3, 'Amazing Head All Night')">
      <div class="option-number">option three</div>
      <div class="option-title">Amazing Head All Night</div>
      <div class="option-desc">non-stop, no breaks, you won't be walking tomorrow 😏</div>
    </div>
  </div>

  <button class="cta" id="cta" onclick="confirmChoice()">pick your poison</button>

  <div id="response-msg"></div>

  <div class="footer">this isn't a group chat — it's just us</div>
</div>

<script>
  let chosenOption = null;
  let chosenLabel = '';
  let seconds = 30 * 60;
  const timerEl = document.getElementById('timer');
  const timerBox = document.getElementById('timerBox');
  const ctaEl = document.getElementById('cta');
  const optionsEl = document.getElementById('options');

  function format(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
  }

  function selectOption(num, label) {
    chosenOption = num;
    chosenLabel = label;
    // Highlight selected
    document.querySelectorAll('.option').forEach((el, i) => {
      el.style.borderColor = (i === num - 1) ? 'rgba(200, 80, 160, 0.7)' : 'rgba(255,255,255,0.08)';
      el.style.background = (i === num - 1) ? 'rgba(200, 80, 160, 0.1)' : 'rgba(255,255,255,0.03)';
    });
    ctaEl.textContent = 'confirm — option ' + num;
    ctaEl.style.display = 'block';
  }

  async function confirmChoice() {
    if (!chosenOption) {
      ctaEl.textContent = 'pick one first 💋';
      return;
    }

    ctaEl.textContent = 'sending...';
    ctaEl.disabled = true;

    try {
      const res = await fetch('https://konbit.io/api/lita/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Lita',
          choice: chosenOption + ' — ' + chosenLabel,
          city: '',
          country: ''
        })
      });
      const data = await res.json();
      if (data.ok) {
        ctaEl.style.display = 'none';
        optionsEl.style.display = 'none';
        document.getElementById('response-msg').style.display = 'block';
        document.getElementById('response-msg').innerHTML =
          '✅ he got your choice 💋<br><span style="font-size:12px;opacity:0.6">see you tonight...</span>';
      } else {
        ctaEl.textContent = 'try again';
        ctaEl.disabled = false;
      }
    } catch(e) {
      ctaEl.textContent = 'try again';
      ctaEl.disabled = false;
    }
  }

  const interval = setInterval(() => {
    seconds--;
    timerEl.textContent = format(seconds);
    if (seconds <= 300) timerBox.classList.add('urgent');
    if (seconds <= 0) {
      clearInterval(interval);
      timerEl.textContent = '00:00';
      ctaEl.textContent = 'offer expired 🥺';
      ctaEl.style.background = 'linear-gradient(135deg, #444, #333)';
      ctaEl.style.boxShadow = 'none';
      document.querySelectorAll('.option').forEach(el => {
        el.style.opacity = '0.4';
        el.style.pointerEvents = 'none';
      });
    }
  }, 1000);

  // Floating hearts
  const hearts = ['💋', '✨', '🌙', '💫', '🫧'];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div');
    el.className = 'heart';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDelay = Math.random() * 8 + 's';
    el.style.fontSize = (12 + Math.random() * 14) + 'px';
    document.body.appendChild(el);
  }
</script>
</body>
</html>
