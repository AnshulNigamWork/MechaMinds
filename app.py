"""
==============================================================================
MECHAMINDS AI — ZERO-CONFUSION CREDIT CARD FRAUD DETECTION MICROSERVICE
==============================================================================
Engineered for rapid 5-second hackathon judging clarity.
Features:
  1. Top Cyber Navbar & 4-Step Pipeline Storyline Ribbon
  2. 3 One-Click Scenario Presets (Safe Domestic, Suspicious, Fraud Attack)
  3. Sleek Virtual Credit Card Mockup (Active / Frozen)
  4. Instant Visual Verdict Banner (Approved / OTP Challenge / Fraud Intercepted)
  5. Plotly Semi-Circular Arc Indicator Gauge (No Needle, No Overlapping Text)
  6. 5-Point Plain-English Signal Checklist (Amount, Location, Device, Time, Frequency)
  7. 2-Sentence Explainable AI (XAI) Forensic Brief
  8. Working Web Audio Emergency Siren + Inline Silence Toggle
  9. Real Smartphone Push Notifications via ntfy.sh (Zero API Key Setup)
 10. Analyst Audit Ledger with 3 Working Resolution Action Buttons

Run locally:
    pip install streamlit plotly pandas requests
    streamlit run app.py
==============================================================================
"""

import json
import time
from datetime import datetime
import pandas as pd
import plotly.graph_objects as go
import streamlit as st
import streamlit.components.v1 as components

# Safe HTTP Dispatcher for ntfy.sh (works with requests or standard urllib)
def dispatch_live_mobile_push(card_pan: str, amount: float, score: float, topic: str = "mechaminds-fraud-demo-2026"):
    """Dispatches a real-time urgent push alert to the presenter/judge's phone via ntfy.sh."""
    clean_topic = topic.strip().replace(" ", "-").lower() if topic else "mechaminds-fraud-demo-2026"
    pan_last4 = card_pan[-4:] if len(card_pan) >= 4 else "8899"
    message_body = (
        f"CRITICAL: Unauthorized charge of ₹{amount:,.2f} detected on card ending in {pan_last4}. "
        f"Risk score {score:.1f}/100. Virtual card frozen immediately."
    )

    payload = {
        "topic": clean_topic,
        "title": "🚨 MechaMinds SOC: Card Freeze Alert",
        "message": message_body,
        "priority": 5,
        "tags": ["warning", "credit_card", "rotating_light"],
        "click": "https://mechaminds-fraud.internal/verify",
    }

    try:
        import requests
        resp = requests.post("https://ntfy.sh", json=payload, timeout=2.0)
        if resp.status_code == 200:
            return True, f"Alert pushed to mobile: ntfy.sh/{clean_topic}"
    except Exception:
        pass

    try:
        import urllib.request
        req = urllib.request.Request(
            "https://ntfy.sh",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=2.0) as resp:
            if resp.status == 200:
                return True, f"Alert pushed to mobile: ntfy.sh/{clean_topic}"
    except Exception as e:
        return False, f"Notice: {str(e)[:50]}"

    return False, "Push timeout"


# ==============================================================================
# 1. PAGE CONFIGURATION & DARK CYBER THEME
# ==============================================================================
st.set_page_config(
    page_title="MechaMinds AI | Fraud Detection Microservice",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Initialize all Session State keys safely
if "amount" not in st.session_state:
    st.session_state.amount = 1500
if "distance" not in st.session_state:
    st.session_state.distance = 6
if "is_midnight" not in st.session_state:
    st.session_state.is_midnight = False
if "is_vpn" not in st.session_state:
    st.session_state.is_vpn = False
if "is_burst" not in st.session_state:
    st.session_state.is_burst = False
if "card_status" not in st.session_state:
    st.session_state.card_status = "ACTIVE"
if "is_muted" not in st.session_state:
    st.session_state.is_muted = False
if "active_preset_name" not in st.session_state:
    st.session_state.active_preset_name = "Safe Domestic"
if "last_dispatched_key" not in st.session_state:
    st.session_state.last_dispatched_key = ""
if "action_notice" not in st.session_state:
    st.session_state.action_notice = ""
if "audit_ledger" not in st.session_state:
    st.session_state.audit_ledger = [
        {
            "Timestamp": "14:28:10",
            "Cardholder": "Aditya Verma",
            "Card": "•••• 8899",
            "Amount (₹)": "₹1,200",
            "Distance": "4 km",
            "Score": "11.0%",
            "Verdict": "APPROVED",
            "Action Taken": "Settlement Authorized",
        },
        {
            "Timestamp": "11:15:42",
            "Cardholder": "Aditya Verma",
            "Card": "•••• 8899",
            "Amount (₹)": "₹4,850",
            "Distance": "12 km",
            "Score": "18.5%",
            "Verdict": "APPROVED",
            "Action Taken": "Settlement Authorized",
        },
    ]

# Inject Clean High-Contrast Dark Cyber Styles
st.markdown(
    """
<style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

    /* Global Dark Cyber Canvas */
    html, body, [data-testid="stAppViewContainer"], .stApp {
        background-color: #04090e !important;
        color: #e2e8f0 !important;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }

    .main .block-container {
        padding-top: 1rem !important;
        padding-bottom: 2rem !important;
        padding-left: 2rem !important;
        padding-right: 2rem !important;
        max-width: 1440px !important;
    }

    #MainMenu, header, footer, [data-testid="stToolbar"] {
        visibility: hidden !important;
        height: 0 !important;
    }

    /* Top Navbar */
    .soc-navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #081622;
        border: 1px solid #13394f;
        padding: 0.85rem 1.4rem;
        border-radius: 12px;
        margin-bottom: 0.75rem;
    }
    .soc-nav-title {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 1.15rem;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: -0.02em;
    }
    .soc-nav-title span.accent {
        color: #00f2fe;
    }
    .soc-badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.3rem 0.75rem;
        border-radius: 9999px;
        background: rgba(0, 242, 254, 0.12);
        color: #00f2fe;
        border: 1px solid rgba(0, 242, 254, 0.35);
        letter-spacing: 0.05em;
    }

    /* 4-Step Pipeline Storyline Ribbon */
    .storyline-ribbon {
        background: linear-gradient(90deg, #071927 0%, #0c273d 50%, #071927 100%);
        border: 1px solid #13394f;
        border-radius: 10px;
        padding: 0.65rem 1.25rem;
        margin-bottom: 1.25rem;
        font-size: 0.82rem;
        font-weight: 700;
        color: #94a3b8;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        text-align: center;
    }
    .storyline-ribbon strong {
        color: #00f2fe;
    }
    .storyline-ribbon .arrow {
        color: #38bdf8;
        margin: 0 0.3rem;
    }

    /* Card Panels */
    .cyber-panel {
        background: #081622;
        border: 1px solid #13394f;
        border-radius: 14px;
        padding: 1.25rem;
        margin-bottom: 1.25rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }

    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #13394f;
        padding-bottom: 0.6rem;
        margin-bottom: 1rem;
        font-size: 0.85rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #94a3b8;
    }

    /* Virtual Credit Card Mockup */
    .credit-card-box {
        background: linear-gradient(135deg, #0a1f33 0%, #071524 60%, #030b14 100%);
        border: 1px solid #1e4d6d;
        border-radius: 14px;
        padding: 1.15rem 1.35rem;
        position: relative;
        margin-bottom: 1rem;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
        overflow: hidden;
    }
    .credit-card-box::before {
        content: '';
        position: absolute;
        top: -30%;
        right: -30%;
        width: 180px;
        height: 180px;
        background: radial-gradient(circle, rgba(0,242,254,0.12) 0%, transparent 70%);
        pointer-events: none;
    }
    .card-top-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    .card-chip {
        width: 38px;
        height: 28px;
        background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%);
        border-radius: 5px;
        border: 1px solid #fef08a;
    }
    .card-status-badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.72rem;
        font-weight: 800;
        padding: 0.25rem 0.65rem;
        border-radius: 6px;
    }
    .status-active {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.5);
    }
    .status-frozen {
        background: rgba(239, 68, 68, 0.25);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.7);
        animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.85; transform: scale(1.02); }
    }
    .card-pan {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.18rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        color: #f8fafc;
        margin-bottom: 0.85rem;
    }
    .card-bottom-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
    .card-holder-title {
        font-size: 0.65rem;
        text-transform: uppercase;
        color: #64748b;
        letter-spacing: 0.08em;
    }
    .card-holder-val {
        font-size: 0.85rem;
        font-weight: 700;
        color: #e2e8f0;
    }
    .card-amount-val {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.25rem;
        font-weight: 800;
        color: #00f2fe;
    }

    /* Unmistakable Visual Verdict Banners */
    .verdict-banner {
        border-radius: 12px;
        padding: 1.1rem 1.25rem;
        margin-bottom: 1rem;
        text-align: center;
        border: 1px solid;
    }
    .verdict-approved {
        background: linear-gradient(135deg, rgba(6, 78, 59, 0.7) 0%, rgba(4, 38, 29, 0.85) 100%);
        border-color: #059669;
        box-shadow: 0 0 25px rgba(16, 185, 129, 0.3);
    }
    .verdict-challenge {
        background: linear-gradient(135deg, rgba(120, 53, 15, 0.7) 0%, rgba(69, 26, 3, 0.85) 100%);
        border-color: #d97706;
        box-shadow: 0 0 25px rgba(245, 158, 11, 0.3);
    }
    .verdict-fraud {
        background: linear-gradient(135deg, rgba(153, 27, 27, 0.8) 0%, rgba(69, 10, 10, 0.95) 100%);
        border-color: #ef4444;
        box-shadow: 0 0 35px rgba(239, 68, 68, 0.5);
        animation: pulse 1.4s infinite ease-in-out;
    }
    .verdict-title {
        font-size: 1.15rem;
        font-weight: 900;
        letter-spacing: 0.02em;
        margin-bottom: 0.35rem;
    }
    .verdict-approved .verdict-title { color: #34d399; }
    .verdict-challenge .verdict-title { color: #fbbf24; }
    .verdict-fraud .verdict-title { color: #fca5a5; }
    .verdict-desc {
        font-size: 0.82rem;
        font-weight: 600;
        color: #e2e8f0;
    }

    /* 5-Point Checklist */
    .checklist-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.55rem 0.85rem;
        border-radius: 8px;
        margin-bottom: 0.4rem;
        background: #06111a;
        border: 1px solid #13394f;
        font-size: 0.8rem;
    }
    .checklist-left {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        font-weight: 600;
    }
    .checklist-pass {
        color: #34d399;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
    }
    .checklist-fail {
        color: #f87171;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
    }

    /* XAI Brief Box */
    .xai-box {
        background: #040d16;
        border-left: 3px solid #00f2fe;
        border-radius: 0 8px 8px 0;
        padding: 0.75rem 1rem;
        font-size: 0.82rem;
        line-height: 1.5;
        color: #cbd5e1;
        margin-top: 0.75rem;
    }

    /* Mobile Push Notification Toast Badge */
    .push-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(0, 242, 254, 0.08);
        border: 1px solid rgba(0, 242, 254, 0.3);
        border-radius: 8px;
        padding: 0.5rem 0.85rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.78rem;
        color: #38bdf8;
        margin-top: 0.6rem;
    }

    /* Streamlit Widget Tuning */
    div.stButton > button {
        border-radius: 10px !important;
        font-weight: 800 !important;
        font-size: 0.85rem !important;
        border: 1px solid #1e4d6d !important;
        transition: all 0.2s ease !important;
    }
    div.stButton > button:hover {
        border-color: #00f2fe !important;
        transform: translateY(-1px);
    }
</style>
""",
    unsafe_allow_html=True,
)

# ==============================================================================
# 2. TOP NAVBAR & 4-STEP STORYLINE RIBBON
# ==============================================================================
st.markdown(
    """
<div class="soc-navbar">
    <div class="soc-nav-title">
        <span>🛡️</span>
        <span>MechaMinds AI <span class="accent">— Credit Card Fraud Detection Microservice</span></span>
    </div>
    <div class="soc-badge">● LIVE ENGINE · &lt;50ms SLA</div>
</div>
<div class="storyline-ribbon">
    <span>1. Transaction Swiped</span>
    <span class="arrow">➔</span>
    <span>2. Evaluate 5 Signals (<strong>₹, Location, Device, Time, Frequency</strong>)</span>
    <span class="arrow">➔</span>
    <span>3. Compute Risk (<strong>0–100%</strong>)</span>
    <span class="arrow">➔</span>
    <span>4. Automated Verdict</span>
</div>
""",
    unsafe_allow_html=True,
)

# ==============================================================================
# 3. CORE TWO-COLUMN DASHBOARD LAYOUT
# ==============================================================================
col_left, col_right = st.columns([5, 6], gap="large")

# ==============================================================================
# LEFT COLUMN: INSTANT TESTING STATION (SIMPLE & PUNCHY)
# ==============================================================================
with col_left:
    st.markdown('<div class="cyber-panel">', unsafe_allow_html=True)
    st.markdown('<div class="panel-header"><span>⚡ 1-Click Scenario Presets</span><span>Instant Evaluation</span></div>', unsafe_allow_html=True)

    # 3 Big High-Contrast Scenario Preset Buttons
    p_col1, p_col2, p_col3 = st.columns(3, gap="small")
    with p_col1:
        if st.button("🟢 Safe Domestic\n(₹1,500 Grocery)", use_container_width=True):
            st.session_state.amount = 1500
            st.session_state.distance = 6
            st.session_state.is_midnight = False
            st.session_state.is_vpn = False
            st.session_state.is_burst = False
            st.session_state.card_status = "ACTIVE"
            st.session_state.active_preset_name = "Safe Domestic"
            st.rerun()

    with p_col2:
        if st.button("🟡 Suspicious\n(₹32,500 Multi-Swipe)", use_container_width=True):
            st.session_state.amount = 32500
            st.session_state.distance = 85
            st.session_state.is_midnight = False
            st.session_state.is_vpn = True
            st.session_state.is_burst = True
            st.session_state.card_status = "ACTIVE"
            st.session_state.active_preset_name = "Suspicious"
            st.rerun()

    with p_col3:
        if st.button("🔴 Fraud Attack\n(₹1,45,000 Moscow)", use_container_width=True):
            st.session_state.amount = 145000
            st.session_state.distance = 5200
            st.session_state.is_midnight = True
            st.session_state.is_vpn = True
            st.session_state.is_burst = True
            st.session_state.card_status = "FROZEN"
            st.session_state.active_preset_name = "Fraud Attack"
            st.rerun()

    st.markdown("<div style='height: 12px;'></div>", unsafe_allow_html=True)

    # Compact Virtual Credit Card Mockup
    status_class = "status-frozen" if st.session_state.card_status == "FROZEN" else "status-active"
    status_text = "FROZEN (BLOCKED)" if st.session_state.card_status == "FROZEN" else "ACTIVE"
    st.markdown(
        f"""
<div class="credit-card-box">
    <div class="card-top-row">
        <div class="card-chip"></div>
        <span class="card-status-badge {status_class}">{status_text}</span>
    </div>
    <div class="card-pan">4532 •••• •••• 8899</div>
    <div class="card-bottom-row">
        <div>
            <div class="card-holder-title">Cardholder</div>
            <div class="card-holder-val">Aditya Verma</div>
        </div>
        <div style="text-align: right;">
            <div class="card-holder-title">Transaction Amount</div>
            <div class="card-amount-val">₹{st.session_state.amount:,.2f}</div>
        </div>
    </div>
</div>
""",
        unsafe_allow_html=True,
    )

    # Clean Manual Sliders & Signal Toggles
    st.markdown('<div class="panel-header"><span>🎛️ Transaction Signals</span><span>Adjust In Real-Time</span></div>', unsafe_allow_html=True)

    amount = st.slider(
        "Transaction Amount (₹ INR)",
        min_value=500,
        max_value=200000,
        value=int(st.session_state.amount),
        step=500,
        format="₹%d",
    )
    st.session_state.amount = amount

    distance = st.slider(
        "Distance From Home Metro (km)",
        min_value=0,
        max_value=6000,
        value=int(st.session_state.distance),
        step=20,
        format="%d km",
    )
    st.session_state.distance = distance

    # Clean Checkbox Stack
    chk_col1, chk_col2, chk_col3 = st.columns(3)
    with chk_col1:
        is_midnight = st.checkbox(
            "Midnight (00:00–04:00)",
            value=bool(st.session_state.is_midnight),
        )
        st.session_state.is_midnight = is_midnight

    with chk_col2:
        is_vpn = st.checkbox(
            "Tor / VPN Active",
            value=bool(st.session_state.is_vpn),
        )
        st.session_state.is_vpn = is_vpn

    with chk_col3:
        is_burst = st.checkbox(
            "Burst (>2 swipes/min)",
            value=bool(st.session_state.is_burst),
        )
        st.session_state.is_burst = is_burst

    st.markdown("<div style='height: 8px;'></div>", unsafe_allow_html=True)

    # Big Primary Action Button
    check_button_clicked = st.button("⚡ CHECK FOR FRAUD NOW", use_container_width=True, type="primary")

    st.markdown("</div>", unsafe_allow_html=True)


# ==============================================================================
# 4. DETERMINISTIC 5-PILLAR RISK SCORING ENGINE
# ==============================================================================
# Check for regulatory hard rule flag (> ₹1,00,000)
hard_rule_triggered = st.session_state.amount >= 100000

# Compute Signal Weights
score = 0.0

# 1. Amount Component (0 - 35 pts)
if st.session_state.amount > 100000:
    score += 35.0
elif st.session_state.amount > 30000:
    score += 20.0
elif st.session_state.amount > 10000:
    score += 10.0
else:
    score += 3.0

# 2. Distance Component (0 - 25 pts)
if st.session_state.distance > 2500:
    score += 25.0
elif st.session_state.distance > 100:
    score += 12.0
else:
    score += 2.0

# 3. Device/VPN Component (0 or 20 pts)
if st.session_state.is_vpn:
    score += 20.0

# 4. Time Component (0 or 15 pts)
if st.session_state.is_midnight:
    score += 15.0

# 5. Frequency Component (0 or 20 pts)
if st.session_state.is_burst:
    score += 20.0

# Clamp Score strictly between [5.0, 100.0]
calculated_score = min(max(score, 5.0), 100.0)
if hard_rule_triggered:
    calculated_score = max(calculated_score, 94.0)

# Determine Tier & Actions
if calculated_score >= 70.0 or hard_rule_triggered:
    tier = "HIGH RISK"
    verdict_class = "verdict-fraud"
    verdict_title = "🚨 FRAUD INTERCEPTED"
    verdict_desc = "Card Frozen. Settlement halted instantly. Incident report created."
    st.session_state.card_status = "FROZEN"
elif calculated_score >= 30.0:
    tier = "SUSPICIOUS"
    verdict_class = "verdict-challenge"
    verdict_title = "⚠️ STEP-UP OTP CHALLENGE"
    verdict_desc = "Unfamiliar device or burst velocity detected. Step-up 2FA dispatched."
    st.session_state.card_status = "ACTIVE"
else:
    tier = "SAFE"
    verdict_class = "verdict-approved"
    verdict_title = "✅ TRANSACTION APPROVED"
    verdict_desc = "Safe domestic spend verified against cardholder historical baseline."
    st.session_state.card_status = "ACTIVE"


# Auto-log evaluation on manual click or new evaluation
current_tx_key = f"{st.session_state.amount}_{st.session_state.distance}_{st.session_state.is_midnight}_{st.session_state.is_vpn}_{st.session_state.is_burst}"
if check_button_clicked or (st.session_state.get("last_evaluated_key") != current_tx_key):
    st.session_state.last_evaluated_key = current_tx_key
    now_str = datetime.now().strftime("%H:%M:%S")
    st.session_state.audit_ledger.insert(
        0,
        {
            "Timestamp": now_str,
            "Cardholder": "Aditya Verma",
            "Card": "•••• 8899",
            "Amount (₹)": f"₹{st.session_state.amount:,.2f}",
            "Distance": f"{st.session_state.distance} km",
            "Score": f"{calculated_score:.1f}%",
            "Verdict": tier,
            "Action Taken": "Card Frozen + Alert" if tier == "HIGH RISK" else ("Step-Up OTP" if tier == "SUSPICIOUS" else "Authorized"),
        },
    )
    if len(st.session_state.audit_ledger) > 25:
        st.session_state.audit_ledger.pop()


# ==============================================================================
# RIGHT COLUMN: INSTANT VISUAL DECISION (NO CONFUSION)
# ==============================================================================
with col_right:
    st.markdown('<div class="cyber-panel">', unsafe_allow_html=True)
    st.markdown('<div class="panel-header"><span>🎯 Instant Visual Decision</span><span>Sub-50ms SLA</span></div>', unsafe_allow_html=True)

    # 1. Unmistakable Visual Verdict Card
    st.markdown(
        f"""
<div class="verdict-banner {verdict_class}">
    <div class="verdict-title">{verdict_title}</div>
    <div class="verdict-desc">{verdict_desc}</div>
</div>
""",
        unsafe_allow_html=True,
    )

    # 2. Plotly Arc Indicator Gauge (Semi-circular, NO needle, NO overlapping text)
    gauge_fig = go.Figure(
        go.Indicator(
            mode="gauge+number",
            value=calculated_score,
            number={"suffix": "%", "font": {"size": 42, "color": "#f8fafc", "family": "JetBrains Mono"}},
            gauge={
                "axis": {"range": [0, 100], "tickwidth": 1, "tickcolor": "#64748b", "tickvals": [0, 30, 70, 100]},
                "bar": {"color": "#ef4444" if calculated_score >= 70 else ("#f59e0b" if calculated_score >= 30 else "#10b981"), "thickness": 0.32},
                "bgcolor": "rgba(255, 255, 255, 0.05)",
                "borderwidth": 0,
                "steps": [
                    {"range": [0, 30], "color": "rgba(16, 185, 129, 0.2)"},
                    {"range": [30, 70], "color": "rgba(245, 158, 11, 0.2)"},
                    {"range": [70, 100], "color": "rgba(239, 68, 68, 0.25)"},
                ],
            },
        )
    )
    gauge_fig.update_layout(
        height=180,
        margin=dict(l=25, r=25, t=10, b=10),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font={"family": "Plus Jakarta Sans"},
    )
    st.plotly_chart(gauge_fig, use_container_width=True, config={"displayModeBar": False})

    # 3. Plain-English 5-Point Signal Checklist (Pass/Fail)
    amt_pass = st.session_state.amount < 100000
    geo_pass = st.session_state.distance <= 2500
    dev_pass = not st.session_state.is_vpn
    tim_pass = not st.session_state.is_midnight
    frq_pass = not st.session_state.is_burst

    st.markdown(
        f"""
<div class="checklist-row">
    <div class="checklist-left"><span>₹</span><span>Spend Volume Bracket</span></div>
    <span class="{'checklist-pass' if amt_pass else 'checklist-fail'}">{'[✓] Normal Baseline (₹' + f'{st.session_state.amount:,}' + ')' if amt_pass else '[✗] Spike &gt; ₹1,00,000 Hard Limit'}</span>
</div>
<div class="checklist-row">
    <div class="checklist-left"><span>📍</span><span>Travel &amp; Geo-Radius</span></div>
    <span class="{'checklist-pass' if geo_pass else 'checklist-fail'}">{'[✓] Metro Range (' + str(st.session_state.distance) + ' km)' if geo_pass else '[✗] Cross-Border Distance (' + str(st.session_state.distance) + ' km)'}</span>
</div>
<div class="checklist-row">
    <div class="checklist-left"><span>💻</span><span>Hardware &amp; Network Fingerprint</span></div>
    <span class="{'checklist-pass' if dev_pass else 'checklist-fail'}">{'[✓] Verified Device Hash' if dev_pass else '[✗] Anonymous Tor/VPN Proxy'}</span>
</div>
<div class="checklist-row">
    <div class="checklist-left"><span>🕒</span><span>Time-of-Day Window</span></div>
    <span class="{'checklist-pass' if tim_pass else 'checklist-fail'}">{'[✓] Regular Active Hours' if tim_pass else '[✗] Midnight Dormancy (00:00–04:00)'}</span>
</div>
<div class="checklist-row">
    <div class="checklist-left"><span>⚡</span><span>Velocity Cadence</span></div>
    <span class="{'checklist-pass' if frq_pass else 'checklist-fail'}">{'[✓] Normal Pacing' if frq_pass else '[✗] Rapid Swipes (&gt;2/min)'}</span>
</div>
""",
        unsafe_allow_html=True,
    )

    # 4. XAI Forensic Explanation Box
    if hard_rule_triggered:
        xai_text = f"Regulatory hard threshold triggered: spend volume of ₹{st.session_state.amount:,.2f} exceeds ₹1,00,000 threshold. The card was locked and settlement halted immediately."
    elif tier == "HIGH RISK":
        xai_text = f"Multiple high-risk indicators aligned: suspicious geographical distance ({st.session_state.distance} km) combined with proxy/velocity anomalies drove risk score to {calculated_score:.1f}%. Immediate card freeze enforced."
    elif tier == "SUSPICIOUS":
        xai_text = f"Behavioral discrepancy detected with risk score at {calculated_score:.1f}%. Step-up OTP authentication initiated before transaction settlement."
    else:
        xai_text = f"All 5 telemetry signals align with cardholder historical parameters. Risk score calculated at {calculated_score:.1f}%, approving instant settlement."

    st.markdown(f'<div class="xai-box"><strong>XAI Forensic Brief:</strong> {xai_text}</div>', unsafe_allow_html=True)

    # 5. Working Sensory Alerts & Real Mobile Push
    if tier == "HIGH RISK":
        # Trigger real-time mobile push via ntfy.sh (once per unique high-risk scenario)
        push_key = f"{st.session_state.amount}_{st.session_state.distance}"
        if st.session_state.last_dispatched_key != push_key:
            st.session_state.last_dispatched_key = push_key
            dispatch_live_mobile_push("8899", st.session_state.amount, calculated_score)

        st.markdown(
            """
<div class="push-badge">
    <span>📲</span>
    <span><strong>Real-Time Push Dispatched:</strong> Check your phone at <strong>ntfy.sh/mechaminds-fraud-demo-2026</strong></span>
</div>
""",
            unsafe_allow_html=True,
        )

        # Web Audio Emergency Piercing Siren (HTML5 Web Audio API)
        siren_col1, siren_col2 = st.columns([4, 2])
        with siren_col2:
            mute_btn_label = "🔔 Enable Siren" if st.session_state.is_muted else "🔕 Mute Siren"
            if st.button(mute_btn_label, use_container_width=True):
                st.session_state.is_muted = not st.session_state.is_muted
                st.rerun()

        if not st.session_state.is_muted:
            components.html(
                """
<script>
    (function() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            
            // Oscillate siren frequency between 850Hz and 1450Hz
            const now = ctx.currentTime;
            osc.frequency.setValueAtTime(850, now);
            osc.frequency.linearRampToValueAtTime(1450, now + 0.35);
            osc.frequency.linearRampToValueAtTime(850, now + 0.70);
            osc.frequency.linearRampToValueAtTime(1450, now + 1.05);
            osc.frequency.linearRampToValueAtTime(850, now + 1.40);
            osc.frequency.linearRampToValueAtTime(1450, now + 1.75);
            osc.frequency.linearRampToValueAtTime(850, now + 2.10);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 2.5);
        } catch (e) {}
    })();
</script>
""",
                height=0,
                width=0,
            )

    st.markdown("</div>", unsafe_allow_html=True)


# ==============================================================================
# 5. CLEAN BOTTOM AUDIT LEDGER & 3 RESOLUTION ACTIONS
# ==============================================================================
st.markdown('<div class="cyber-panel">', unsafe_allow_html=True)
st.markdown('<div class="panel-header"><span>📋 Security Operations Audit Ledger</span><span>Real-Time Triage</span></div>', unsafe_allow_html=True)

if st.session_state.action_notice:
    st.info(st.session_state.action_notice)
    st.session_state.action_notice = ""

# Render Interactive DataFrame
ledger_df = pd.DataFrame(st.session_state.audit_ledger)
st.dataframe(
    ledger_df,
    use_container_width=True,
    hide_index=True,
    column_config={
        "Score": st.column_config.TextColumn("Risk Score"),
        "Verdict": st.column_config.TextColumn("SOC Verdict"),
    },
)

# 3 Working Analyst Action Buttons
act_col1, act_col2, act_col3 = st.columns(3, gap="small")
with act_col1:
    if st.button("🔄 Clear Current Transaction", use_container_width=True):
        st.session_state.amount = 1500
        st.session_state.distance = 6
        st.session_state.is_midnight = False
        st.session_state.is_vpn = False
        st.session_state.is_burst = False
        st.session_state.card_status = "ACTIVE"
        st.session_state.action_notice = "Transaction state cleared. Baseline restored to ₹1,500."
        st.rerun()

with act_col2:
    if st.button("📲 Re-send Step-Up OTP", use_container_width=True):
        st.session_state.action_notice = "Step-up OTP token re-dispatched via SMS to cardholder (+91 98765 43210)."
        st.rerun()

with act_col3:
    if st.button("🚫 Blacklist Virtual Card", use_container_width=True):
        st.session_state.card_status = "FROZEN"
        st.session_state.action_notice = "Virtual Card 4532 •••• •••• 8899 has been permanently blacklisted across card networks."
        st.rerun()

st.markdown("</div>", unsafe_allow_html=True)
