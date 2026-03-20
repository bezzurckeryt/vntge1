import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #18181f;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --accent: #00ff88;
    --accent2: #00cc6a;
    --accent-dim: rgba(0,255,136,0.08);
    --accent-dim2: rgba(0,255,136,0.15);
    --text: #f0f0f5;
    --text2: #8888a0;
    --text3: #555566;
    --danger: #ff4466;
    --warning: #ffaa00;
    --info: #4488ff;
    --font: 'Syne', sans-serif;
    --mono: 'DM Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font); overflow-x: hidden; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; height: 64px;
    background: rgba(10,10,15,0.85); backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
  .nav-logo span { color: var(--accent); }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab {
    padding: 7px 18px; border-radius: 6px; cursor: pointer;
    font-size: 13px; font-weight: 500; color: var(--text2);
    transition: all 0.2s; border: none; background: none; font-family: var(--font);
  }
  .nav-tab:hover { color: var(--text); background: var(--surface2); }
  .nav-tab.active { color: var(--accent); background: var(--accent-dim); }
  .nav-cta {
    padding: 8px 20px; background: var(--accent); color: #000;
    border: none; border-radius: 6px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: var(--font); transition: all 0.2s;
  }
  .nav-cta:hover { background: #00ff99; transform: translateY(-1px); }

  /* PAGES */
  .page { display: none; padding-top: 64px; min-height: 100vh; }
  .page.active { display: block; }

  /* ═══════════════ LANDING ═══════════════ */
  .hero {
    min-height: calc(100vh - 64px);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 80px 40px;
    position: relative; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0; opacity: 0.03;
    background-image: linear-gradient(var(--border2) 1px, transparent 1px),
      linear-gradient(90deg, var(--border2) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .hero-glow {
    position: absolute; top: 20%; left: 50%; transform: translateX(-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(0,255,136,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 20px;
    border: 1px solid rgba(0,255,136,0.2); background: var(--accent-dim);
    font-size: 12px; font-weight: 500; color: var(--accent);
    margin-bottom: 32px; font-family: var(--mono);
  }
  .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .hero h1 {
    font-size: clamp(48px, 7vw, 88px); font-weight: 800; line-height: 1.0;
    letter-spacing: -3px; margin-bottom: 28px; position: relative;
  }
  .hero h1 .line2 { color: var(--accent); }
  .hero-sub {
    font-size: 18px; color: var(--text2); max-width: 520px; line-height: 1.6;
    margin-bottom: 48px; font-weight: 400;
  }
  .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-bottom: 80px; }
  .btn-primary {
    padding: 14px 32px; background: var(--accent); color: #000;
    border: none; border-radius: 8px; font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: var(--font); transition: all 0.2s;
  }
  .btn-primary:hover { background: #00ff99; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,255,136,0.2); }
  .btn-secondary {
    padding: 14px 32px; background: transparent; color: var(--text);
    border: 1px solid var(--border2); border-radius: 8px; font-size: 15px; font-weight: 600;
    cursor: pointer; font-family: var(--font); transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

  .stats-row { display: flex; gap: 48px; flex-wrap: wrap; justify-content: center; position: relative; }
  .stat { text-align: center; }
  .stat-num { font-size: 36px; font-weight: 800; color: var(--accent); letter-spacing: -1px; }
  .stat-label { font-size: 12px; color: var(--text3); font-family: var(--mono); margin-top: 4px; }

  /* HOW IT WORKS */
  .section { padding: 100px 40px; max-width: 1100px; margin: 0 auto; }
  .section-label { font-family: var(--mono); font-size: 11px; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; }
  .section-title { font-size: clamp(32px, 4vw, 48px); font-weight: 800; letter-spacing: -1.5px; margin-bottom: 60px; }

  .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2px; }
  .step {
    padding: 32px; background: var(--surface);
    border: 1px solid var(--border); position: relative; overflow: hidden;
  }
  .step:first-child { border-radius: 12px 0 0 12px; }
  .step:last-child { border-radius: 0 12px 12px 0; }
  .step-num { font-family: var(--mono); font-size: 11px; color: var(--accent); margin-bottom: 20px; }
  .step h3 { font-size: 16px; font-weight: 700; margin-bottom: 10px; }
  .step p { font-size: 13px; color: var(--text2); line-height: 1.6; }
  .step-glow { position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: radial-gradient(ellipse, rgba(0,255,136,0.06) 0%, transparent 70%); }

  /* PRICING */
  .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
  .price-card {
    padding: 36px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; position: relative;
  }
  .price-card.featured { border-color: var(--accent); background: linear-gradient(135deg, var(--surface), #0f1f15); }
  .price-card.featured::before {
    content: 'Most Popular'; position: absolute; top: -1px; left: 50%; transform: translateX(-50%);
    background: var(--accent); color: #000; font-size: 11px; font-weight: 700;
    padding: 3px 12px; border-radius: 0 0 6px 6px; font-family: var(--mono);
  }
  .price-tier { font-family: var(--mono); font-size: 11px; color: var(--text3); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .price-name { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
  .price-amount { font-size: 40px; font-weight: 800; letter-spacing: -2px; color: var(--accent); }
  .price-amount span { font-size: 14px; color: var(--text2); font-weight: 400; }
  .price-desc { font-size: 13px; color: var(--text2); margin: 16px 0; line-height: 1.5; }
  .price-features { list-style: none; margin: 24px 0; }
  .price-features li { font-size: 13px; color: var(--text2); padding: 6px 0; border-bottom: 1px solid var(--border); display: flex; gap: 10px; align-items: center; }
  .price-features li::before { content: '✓'; color: var(--accent); font-weight: 700; }

  /* ═══════════════ DASHBOARD ═══════════════ */
  .dash { padding: 32px 40px; max-width: 1200px; margin: 0 auto; }
  .dash-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; flex-wrap: wrap; gap: 16px; }
  .dash-title { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
  .dash-title span { color: var(--accent); }

  .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .metric-card {
    padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
  }
  .metric-label { font-family: var(--mono); font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .metric-value { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
  .metric-value.green { color: var(--accent); }
  .metric-value.orange { color: var(--warning); }
  .metric-value.blue { color: var(--info); }
  .metric-sub { font-size: 11px; color: var(--text3); margin-top: 6px; font-family: var(--mono); }

  /* UPLOAD ZONE */
  .upload-zone {
    border: 2px dashed var(--border2); border-radius: 12px; padding: 48px;
    text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 32px;
    background: var(--surface);
  }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: var(--accent-dim); }
  .upload-icon { font-size: 32px; margin-bottom: 16px; }
  .upload-zone h3 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
  .upload-zone p { font-size: 13px; color: var(--text2); }
  .upload-input { display: none; }

  /* DEBTOR TABLE */
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 32px; }
  .table-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .table-title { font-size: 14px; font-weight: 700; }
  .table-actions { display: flex; gap: 8px; }
  .tbl { width: 100%; border-collapse: collapse; }
  .tbl th { padding: 12px 16px; text-align: left; font-family: var(--mono); font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border); }
  .tbl td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid var(--border); }
  .tbl tr:last-child td { border-bottom: none; }
  .tbl tr:hover td { background: var(--surface2); }
  .status-badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-family: var(--mono); font-size: 10px; font-weight: 500;
  }
  .status-badge.pending { background: rgba(255,170,0,0.12); color: var(--warning); }
  .status-badge.contacted { background: rgba(68,136,255,0.12); color: var(--info); }
  .status-badge.negotiating { background: rgba(0,255,136,0.1); color: var(--accent); }
  .status-badge.recovered { background: rgba(0,255,136,0.15); color: var(--accent); border: 1px solid rgba(0,255,136,0.2); }
  .status-badge.failed { background: rgba(255,68,102,0.1); color: var(--danger); }
  .amount-col { font-family: var(--mono); font-weight: 500; }
  .recovered-col { font-family: var(--mono); color: var(--accent); }

  .btn-sm {
    padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: var(--font); transition: all 0.2s; border: none;
  }
  .btn-accent { background: var(--accent); color: #000; }
  .btn-accent:hover { background: #00ff99; }
  .btn-ghost { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: rgba(255,68,102,0.1); color: var(--danger); border: 1px solid rgba(255,68,102,0.2); }

  /* ═══════════════ AI ENGINE ═══════════════ */
  .ai-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 32px 40px; max-width: 1200px; margin: 0 auto; }
  @media(max-width:800px){ .ai-layout { grid-template-columns: 1fr; } }

  .ai-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .ai-panel-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
  .ai-panel-title { font-size: 14px; font-weight: 700; }
  .ai-badge { font-family: var(--mono); font-size: 10px; padding: 2px 8px; border-radius: 4px; }
  .ai-badge.live { background: var(--accent-dim); color: var(--accent); }
  .ai-badge.draft { background: rgba(68,136,255,0.1); color: var(--info); }
  .ai-panel-body { padding: 24px; }

  .form-group { margin-bottom: 20px; }
  .form-label { font-family: var(--mono); font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: block; }
  .form-input, .form-select, .form-textarea {
    width: 100%; background: var(--surface2); border: 1px solid var(--border2);
    border-radius: 8px; padding: 10px 14px; color: var(--text); font-family: var(--font);
    font-size: 14px; transition: border 0.2s; outline: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); }
  .form-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
  .form-select { cursor: pointer; }
  .form-select option { background: var(--surface2); }

  .tone-selector { display: flex; gap: 8px; flex-wrap: wrap; }
  .tone-btn {
    padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1px solid var(--border2); background: transparent;
    color: var(--text2); font-family: var(--font); transition: all 0.2s;
  }
  .tone-btn:hover { border-color: var(--accent); color: var(--accent); }
  .tone-btn.active { border-color: var(--accent); background: var(--accent-dim); color: var(--accent); }

  /* AI OUTPUT */
  .ai-output {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    padding: 20px; font-family: var(--mono); font-size: 13px; line-height: 1.7;
    color: var(--text); min-height: 200px; white-space: pre-wrap; position: relative;
  }
  .ai-output.loading { color: var(--text3); }
  .ai-output .cursor { display: inline-block; width: 2px; height: 14px; background: var(--accent); animation: blink 1s infinite; vertical-align: middle; margin-left: 2px; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .ai-output-placeholder { color: var(--text3); font-style: italic; }

  .generate-btn {
    width: 100%; padding: 14px; background: var(--accent); color: #000;
    border: none; border-radius: 8px; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: var(--font); transition: all 0.2s; margin-top: 8px;
  }
  .generate-btn:hover:not(:disabled) { background: #00ff99; }
  .generate-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .output-actions { display: flex; gap: 8px; margin-top: 12px; }

  /* SEQUENCE */
  .sequence { margin-top: 8px; }
  .seq-item {
    display: flex; gap: 12px; align-items: flex-start; padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }
  .seq-item:last-child { border-bottom: none; }
  .seq-day {
    min-width: 48px; height: 48px; border-radius: 8px;
    background: var(--surface2); display: flex; flex-direction: column;
    align-items: center; justify-content: center; font-family: var(--mono);
  }
  .seq-day-num { font-size: 16px; font-weight: 700; line-height: 1; }
  .seq-day-label { font-size: 9px; color: var(--text3); }
  .seq-content { flex: 1; }
  .seq-channel { font-family: var(--mono); font-size: 10px; color: var(--accent); margin-bottom: 4px; }
  .seq-preview { font-size: 12px; color: var(--text2); line-height: 1.5; }

  /* NOTIFICATION */
  .toast {
    position: fixed; bottom: 32px; right: 32px; z-index: 999;
    background: var(--surface2); border: 1px solid var(--border2);
    border-radius: 10px; padding: 16px 20px; font-size: 13px;
    display: flex; align-items: center; gap: 12px;
    animation: slideIn 0.3s ease; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .toast.success { border-color: rgba(0,255,136,0.2); }
  .toast.success .toast-icon { color: var(--accent); }
  .toast-icon { font-size: 18px; }

  /* EMPTY STATE */
  .empty { text-align: center; padding: 80px 40px; }
  .empty-icon { font-size: 48px; margin-bottom: 20px; opacity: 0.3; }
  .empty h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
  .empty p { color: var(--text2); font-size: 14px; }

  /* PROGRESS BAR */
  .progress-bar { height: 4px; background: var(--surface2); border-radius: 2px; overflow: hidden; margin-top: 8px; }
  .progress-fill { height: 100%; background: var(--accent); transition: width 0.3s; border-radius: 2px; }

  .divider { height: 1px; background: var(--border); margin: 0 40px; }
`;

const SAMPLE_DEBTORS = [
  { id: 1, name: "Apex Logistics Ltd", contact: "james@apexlogistics.com", amount: 14500, recovered: 0, status: "pending", days: 45, channel: "email" },
  { id: 2, name: "BlueStar Retail", contact: "+1 555 234 5678", amount: 8200, recovered: 8200, status: "recovered", days: 12, channel: "sms" },
  { id: 3, name: "NovaTech Solutions", contact: "billing@novatech.io", amount: 32000, recovered: 16000, status: "negotiating", days: 28, channel: "email" },
  { id: 4, name: "Sunrise Catering Co.", contact: "+1 555 876 4321", amount: 3400, recovered: 0, status: "contacted", days: 7, channel: "whatsapp" },
  { id: 5, name: "Harmon & Associates", contact: "finance@harmon.law", amount: 56000, recovered: 0, status: "pending", days: 90, channel: "email" },
  { id: 6, name: "GreenLeaf Markets", contact: "+1 555 111 2222", amount: 9100, recovered: 0, status: "failed", days: 120, channel: "sms" },
];

const TONES = ["Professional", "Firm", "Empathetic", "Urgent", "Friendly"];

export default function App() {
  const [page, setPage] = useState("landing");
  const [debtors, setDebtors] = useState(SAMPLE_DEBTORS);
  const [tone, setTone] = useState("Professional");
  const [channel, setChannel] = useState("email");
  const [context, setContext] = useState("");
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [aiOutput, setAiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const outputRef = useRef();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const totalDebt = debtors.reduce((s, d) => s + d.amount, 0);
  const totalRecovered = debtors.reduce((s, d) => s + d.recovered, 0);
  const recoveryRate = Math.round((totalRecovered / totalDebt) * 100);
  const activeCount = debtors.filter(d => ["contacted", "negotiating"].includes(d.status)).length;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newDebtor = {
      id: debtors.length + 1,
      name: "Uploaded Co. " + (debtors.length + 1),
      contact: "contact@uploaded.com",
      amount: Math.floor(Math.random() * 50000) + 5000,
      recovered: 0,
      status: "pending",
      days: Math.floor(Math.random() * 60) + 10,
      channel: "email"
    };
    setDebtors([...debtors, newDebtor]);
    showToast("Debtor list imported successfully");
  };

  const generateOutreach = async () => {
    if (!selectedDebtor) return;
    setIsGenerating(true);
    setAiOutput("");

    const debtor = debtors.find(d => d.id === selectedDebtor);
    const prompt = `You are an expert debt recovery specialist. Write a ${tone.toLowerCase()} ${channel} message to recover a debt.

Debtor: ${debtor.name}
Contact: ${debtor.contact}
Amount owed: $${debtor.amount.toLocaleString()}
Days overdue: ${debtor.days}
Context: ${context || "Standard commercial debt"}
Channel: ${channel.toUpperCase()}

Write a single, compelling ${channel} message. Be ${tone.toLowerCase()}. Keep it under 180 words. Do NOT use placeholders. Write it ready to send. Include a clear call to action.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "Unable to generate message.";

      let i = 0;
      const stream = setInterval(() => {
        if (i < text.length) {
          setAiOutput(text.slice(0, i + 1));
          i += 3;
        } else {
          setAiOutput(text);
          clearInterval(stream);
          setIsGenerating(false);
        }
      }, 18);
    } catch (err) {
      setAiOutput("Error connecting to AI. Please try again.");
      setIsGenerating(false);
    }
  };

  const markStatus = (id, status) => {
    setDebtors(debtors.map(d => {
      if (d.id !== id) return d;
      const recovered = status === "recovered" ? d.amount : d.recovered;
      return { ...d, status, recovered };
    }));
    showToast(`Status updated to ${status}`);
  };

  const SEQUENCE = [
    { day: 1, channel: "EMAIL", preview: "Friendly payment reminder with invoice attached" },
    { day: 3, channel: "SMS", preview: "Quick follow-up text with payment link" },
    { day: 7, channel: "EMAIL", preview: "Firm reminder — consequences of non-payment" },
    { day: 14, channel: "WHATSAPP", preview: "Personal outreach with settlement offer" },
    { day: 21, channel: "EMAIL", preview: "Final notice before escalation" },
  ];

  return (
    <>
      <style>{STYLES}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">Debt<span>Flow</span></div>
        <div className="nav-tabs">
          {["landing", "dashboard", "engine"].map(p => (
            <button key={p} className={`nav-tab ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
              {p === "landing" ? "Home" : p === "dashboard" ? "Dashboard" : "AI Engine"}
            </button>
          ))}
        </div>
        <button className="nav-cta" onClick={() => setPage("dashboard")}>Get Started →</button>
      </nav>

      {/* ═══════════ LANDING PAGE ═══════════ */}
      <div className={`page ${page === "landing" ? "active" : ""}`}>
        <div className="hero">
          <div className="hero-grid" />
          <div className="hero-glow" />
          <div className="hero-badge"><span className="hero-badge-dot" />AI-Powered Debt Recovery Platform</div>
          <h1>Recover what's<br /><span className="line2">yours. Automatically.</span></h1>
          <p className="hero-sub">AI agents that write, send, and negotiate overdue payments across email, SMS, and WhatsApp — on commission only.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setPage("dashboard")}>Start Recovering →</button>
            <button className="btn-secondary" onClick={() => setPage("engine")}>See AI Engine</button>
          </div>
          <div className="stats-row">
            <div className="stat"><div className="stat-num">$4.5T</div><div className="stat-label">global unpaid debt</div></div>
            <div className="stat"><div className="stat-num">35%</div><div className="stat-label">avg commission only</div></div>
            <div className="stat"><div className="stat-num">72hr</div><div className="stat-label">first contact time</div></div>
            <div className="stat"><div className="stat-num">3×</div><div className="stat-label">vs manual recovery</div></div>
          </div>
        </div>

        <div className="divider" />

        <div className="section">
          <div className="section-label">How it works</div>
          <div className="section-title">Upload. Automate. Collect.</div>
          <div className="steps">
            {[
              { n: "01", title: "Upload your debtor list", desc: "CSV, Excel, or manual entry. We ingest any format in seconds." },
              { n: "02", title: "AI drafts the outreach", desc: "Claude writes personalised messages per debtor — tone, amount, days overdue." },
              { n: "03", title: "Multi-channel delivery", desc: "Email, SMS, WhatsApp sequences sent automatically with smart timing." },
              { n: "04", title: "You collect. We earn.", desc: "Only pay us when money lands. 15–35% commission on recovered amounts." },
            ].map(s => (
              <div key={s.n} className="step">
                <div className="step-glow" />
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div className="section">
          <div className="section-label">Pricing</div>
          <div className="section-title">Only pay when you get paid.</div>
          <div className="pricing-grid">
            {[
              { tier: "SME", name: "Starter", amount: "20%", desc: "For freelancers and small businesses. Upload up to 50 debtors/month.", features: ["AI email sequences", "Basic dashboard", "Email support", "Manual review"], featured: false },
              { tier: "AGENCY", name: "Professional", amount: "25%", desc: "For collection agencies and accountants. Unlimited debtors, all channels.", features: ["Email + SMS + WhatsApp", "Full dashboard", "Negotiation AI", "Priority support", "White-label option"], featured: true },
              { tier: "ENTERPRISE", name: "Enterprise", amount: "Custom", desc: "For banks and lenders with large portfolios. Volume discounts available.", features: ["Everything in Pro", "API access", "Custom integrations", "Dedicated manager", "SLA guarantee"], featured: false },
            ].map(p => (
              <div key={p.tier} className={`price-card ${p.featured ? "featured" : ""}`}>
                <div className="price-tier">{p.tier}</div>
                <div className="price-name">{p.name}</div>
                <div className="price-amount">{p.amount}<span> commission</span></div>
                <div className="price-desc">{p.desc}</div>
                <ul className="price-features">{p.features.map(f => <li key={f}>{f}</li>)}</ul>
                <button className="btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={() => setPage("dashboard")}>Get started →</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ DASHBOARD ═══════════ */}
      <div className={`page ${page === "dashboard" ? "active" : ""}`}>
        <div className="dash">
          <div className="dash-header">
            <div>
              <div className="dash-title">Recovery <span>Dashboard</span></div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 6 }}>Manage your debtor portfolio</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-sm btn-ghost" onClick={() => fileRef.current.click()}>+ Import CSV</button>
              <button className="btn-sm btn-accent" onClick={() => setPage("engine")}>AI Engine →</button>
              <input ref={fileRef} type="file" accept=".csv,.xlsx" className="upload-input" onChange={handleFileUpload} />
            </div>
          </div>

          <div className="metrics">
            <div className="metric-card">
              <div className="metric-label">Total debt</div>
              <div className="metric-value">${(totalDebt / 1000).toFixed(0)}k</div>
              <div className="metric-sub">{debtors.length} debtors</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Recovered</div>
              <div className="metric-value green">${(totalRecovered / 1000).toFixed(0)}k</div>
              <div className="metric-sub">{recoveryRate}% recovery rate</div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${recoveryRate}%` }} /></div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Active cases</div>
              <div className="metric-value blue">{activeCount}</div>
              <div className="metric-sub">In outreach now</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Our commission</div>
              <div className="metric-value orange">${Math.round(totalRecovered * 0.25 / 1000)}k</div>
              <div className="metric-sub">25% of recovered</div>
            </div>
          </div>

          {/* Upload Zone */}
          <div
            className={`upload-zone ${dragOver ? "drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); showToast("Debtor list uploaded!"); }}
            onClick={() => fileRef.current.click()}
          >
            <div className="upload-icon">📂</div>
            <h3>Drop your debtor list here</h3>
            <p>CSV or Excel • Name, contact, amount, due date</p>
          </div>

          {/* Debtor Table */}
          <div className="table-wrap">
            <div className="table-header">
              <div className="table-title">Debtor Portfolio ({debtors.length})</div>
              <div className="table-actions">
                <button className="btn-sm btn-ghost">Filter</button>
                <button className="btn-sm btn-ghost">Export</button>
              </div>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Debtor</th>
                  <th>Contact</th>
                  <th>Amount</th>
                  <th>Recovered</th>
                  <th>Days overdue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {debtors.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td style={{ color: "var(--text2)", fontSize: 12 }}>{d.contact}</td>
                    <td className="amount-col">${d.amount.toLocaleString()}</td>
                    <td className="recovered-col">{d.recovered > 0 ? `$${d.recovered.toLocaleString()}` : "—"}</td>
                    <td style={{ color: d.days > 60 ? "var(--danger)" : "var(--text2)" }}>{d.days}d</td>
                    <td><span className={`status-badge ${d.status}`}>{d.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn-sm btn-ghost" onClick={() => { setSelectedDebtor(d.id); setPage("engine"); }}>
                          Generate AI
                        </button>
                        {d.status !== "recovered" && (
                          <button className="btn-sm btn-accent" onClick={() => markStatus(d.id, "recovered")}>✓ Mark paid</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══════════ AI ENGINE ═══════════ */}
      <div className={`page ${page === "engine" ? "active" : ""}`}>
        <div className="ai-layout">
          {/* LEFT: Config */}
          <div>
            <div className="ai-panel" style={{ marginBottom: 24 }}>
              <div className="ai-panel-header">
                <div className="ai-panel-title">Outreach Generator</div>
                <div className="ai-badge live">● LIVE AI</div>
              </div>
              <div className="ai-panel-body">
                <div className="form-group">
                  <label className="form-label">Select debtor</label>
                  <select className="form-select" value={selectedDebtor || ""} onChange={e => setSelectedDebtor(Number(e.target.value))}>
                    <option value="">— Choose debtor —</option>
                    {debtors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} (${d.amount.toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Channel</label>
                  <select className="form-select" value={channel} onChange={e => setChannel(e.target.value)}>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tone</label>
                  <div className="tone-selector">
                    {TONES.map(t => (
                      <button key={t} className={`tone-btn ${tone === t ? "active" : ""}`} onClick={() => setTone(t)}>{t}</button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Additional context (optional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="e.g. Invoice #1234, goods were delivered, partial dispute..."
                    value={context}
                    onChange={e => setContext(e.target.value)}
                  />
                </div>

                <button className="generate-btn" disabled={!selectedDebtor || isGenerating} onClick={generateOutreach}>
                  {isGenerating ? "Generating..." : "Generate outreach message →"}
                </button>
              </div>
            </div>

            {/* Sequence Preview */}
            <div className="ai-panel">
              <div className="ai-panel-header">
                <div className="ai-panel-title">Automated sequence</div>
                <div className="ai-badge draft">AUTO</div>
              </div>
              <div className="ai-panel-body">
                <div className="sequence">
                  {SEQUENCE.map(s => (
                    <div key={s.day} className="seq-item">
                      <div className="seq-day">
                        <div className="seq-day-num">{s.day}</div>
                        <div className="seq-day-label">day</div>
                      </div>
                      <div className="seq-content">
                        <div className="seq-channel">{s.channel}</div>
                        <div className="seq-preview">{s.preview}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="generate-btn" style={{ marginTop: 20 }} onClick={() => showToast("Sequence activated for all pending debtors!")}>
                  Activate sequence for all pending →
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Output */}
          <div>
            <div className="ai-panel" style={{ height: "100%" }}>
              <div className="ai-panel-header">
                <div className="ai-panel-title">Generated message</div>
                {aiOutput && <div className="ai-badge live">Ready to send</div>}
              </div>
              <div className="ai-panel-body">
                {!aiOutput && !isGenerating ? (
                  <div className="ai-output">
                    <span className="ai-output-placeholder">Select a debtor and click Generate to create a personalised outreach message using Claude AI...</span>
                  </div>
                ) : (
                  <div className="ai-output" ref={outputRef}>
                    {aiOutput}{isGenerating && <span className="cursor" />}
                  </div>
                )}

                {aiOutput && !isGenerating && (
                  <div className="output-actions">
                    <button className="btn-sm btn-accent" onClick={() => {
                      navigator.clipboard?.writeText(aiOutput);
                      showToast("Copied to clipboard!");
                    }}>Copy</button>
                    <button className="btn-sm btn-ghost" onClick={() => {
                      if (selectedDebtor) {
                        setDebtors(debtors.map(d => d.id === selectedDebtor ? { ...d, status: "contacted" } : d));
                        showToast("Marked as contacted & message logged!");
                      }
                    }}>Mark as sent</button>
                    <button className="btn-sm btn-ghost" onClick={generateOutreach}>Regenerate</button>
                    <button className="btn-sm btn-danger" onClick={() => setAiOutput("")}>Clear</button>
                  </div>
                )}

                {/* Debtor info card */}
                {selectedDebtor && (
                  <div style={{ marginTop: 24, padding: "16px", background: "var(--surface2)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    {(() => {
                      const d = debtors.find(x => x.id === selectedDebtor);
                      return d ? (
                        <>
                          <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text3)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Selected debtor</div>
                          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{d.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>{d.contact}</div>
                          <div style={{ display: "flex", gap: 16 }}>
                            <div><div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>OWED</div><div style={{ fontWeight: 700, color: "var(--warning)" }}>${d.amount.toLocaleString()}</div></div>
                            <div><div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>OVERDUE</div><div style={{ fontWeight: 700 }}>{d.days} days</div></div>
                            <div><div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>STATUS</div><span className={`status-badge ${d.status}`}>{d.status}</span></div>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-icon">✓</span>
          {toast.msg}
        </div>
      )}
    </>
  );
}
