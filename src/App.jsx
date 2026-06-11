import { useState, useEffect, useCallback } from "react";

// ── Font injection ─────────────────────────────────────────────────────────
const injectFonts = () => {
  if (document.getElementById("mahee-fonts")) return;
  const link = document.createElement("link");
  link.id = "mahee-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
};
injectFonts();

// ── CSS ────────────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("mahee-styles")) return;
  const style = document.createElement("style");
  style.id = "mahee-styles";
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes slideInRight { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
    @keyframes slideInLeft { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }
    @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
    @keyframes slideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes slideUp { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-12px); } }
    .fade-up { animation: fadeUp 0.7s ease both; }
    .fade-in { animation: fadeIn 0.5s ease both; }
    .slide-in-right { animation: slideInRight 0.45s ease both; }
    .slide-in-left { animation: slideInLeft 0.45s ease both; }
    .d1{animation-delay:0.1s} .d2{animation-delay:0.25s} .d3{animation-delay:0.4s}
    .d4{animation-delay:0.55s} .d5{animation-delay:0.7s} .d6{animation-delay:0.85s}
    .gold-shimmer {
      background: linear-gradient(90deg,#c9a84c,#f0d080,#c9a84c,#a07830,#c9a84c);
      background-size:200% auto; -webkit-background-clip:text;
      -webkit-text-fill-color:transparent; background-clip:text;
      animation:shimmer 4s linear infinite;
    }
    .card-hover { transition:transform 0.3s ease,border-color 0.3s ease,box-shadow 0.3s ease; }
    .card-hover:hover { transform:translateY(-3px); border-color:#c9a84c55 !important; box-shadow:0 12px 40px rgba(201,168,76,0.08); }
    .nav-link { position:relative; transition:color 0.2s; }
    .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:1px; background:#c9a84c; transform:scaleX(0); transition:transform 0.25s ease; }
    .nav-link:hover::after, .nav-link.active::after { transform:scaleX(1); }
    .tag { display:inline-block; padding:3px 10px; border-radius:3px; font-size:10px; font-family:'Outfit',sans-serif; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:#0a0908; }
    ::-webkit-scrollbar-thumb { background:#c9a84c44; border-radius:2px; }
    .grain::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:0.025;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
    .tab-btn { background:none; border:none; cursor:pointer; font-family:'Outfit',sans-serif; font-weight:600; font-size:11px; letter-spacing:2px; padding:12px 20px; text-transform:uppercase; transition:color 0.2s; }
    .module-card { transition: border-color 0.2s, background 0.2s; }
    .module-card:hover { border-color:#c9a84c44 !important; }
    .hamburger-btn { transition: transform 0.3s ease; }
    .hamburger-btn:hover { transform: scale(1.1); }
    .hamburger-line { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

    /* ── Mobile ── */
    @media (max-width: 640px) {
      .desktop-nav { display:none !important; }
      .mobile-menu-btn { display:flex !important; }
      .mobile-nav { display:flex !important; }
      .hero-pad { padding:40px 20px !important; }
      .hero-grid { grid-template-columns:1fr !important; gap:32px !important; }
      .two-col { grid-template-columns:1fr !important; }
      .three-col { grid-template-columns:1fr 1fr !important; }
      .four-col { grid-template-columns:1fr 1fr !important; }
      .page-pad { padding:40px 16px !important; }
      .hero-title { font-size:clamp(40px,14vw,80px) !important; }
      .connect-grid { grid-template-columns:1fr 1fr !important; }
      .week-grid { grid-template-columns:repeat(4,1fr) !important; }
      .phase-btns { flex-direction:column !important; }
      .stats-row { flex-wrap:wrap !important; gap:16px !important; }
      .hero-pfp { justify-content:center !important; order:-1 !important; }
    }
    @media (min-width: 641px) {
      .mobile-menu-btn { display:none !important; }
      .mobile-nav { display:none !important; }
    }
  `;
  document.head.appendChild(style);
};
injectStyles();

// ── DATA ───────────────────────────────────────────────────────────────────
const NAV = ["Home","About","Work","Life","Teach","Journey","Connect"];

const CURRENT_COURSES = [
  { code:"CSE499B", title:"Senior Design Project II",                  day:"T",  time:"1:00–2:30 PM",  faculty:"SnS1", note:"Final project" },
  { code:"CSE498R", title:"Intern / Co-op / Directed Research",        day:"—",  time:"Anytime",        faculty:"TBA",  note:"Research" },
  { code:"CSE422",  title:"Modeling and Simulation",                   day:"ST", time:"4:20–5:50 PM",  faculty:"MSK1", note:"Hardest" },
  { code:"CSE488",  title:"Secure Systems Design & Trusted Computing", day:"MW", time:"4:20–5:50 PM",  faculty:"MUO",  note:"" },
  { code:"EEE452",  title:"Engineering Economics and Management",      day:"RA", time:"2:40–4:10 PM",  faculty:"FKr",  note:"" },
  { code:"HIS102",  title:"Introduction to World Civilization",        day:"ST", time:"2:40–4:10 PM",  faculty:"AFRn", note:"" },
  { code:"PHI104",  title:"Introduction to Ethics",                    day:"MW", time:"2:40–4:10 PM",  faculty:"SYN",  note:"" },
];

const PROJECTS = [
  { id:"aegis", name:"A.E.G.I.S.", full:"Autonomous Emergency Ground Intelligence Swarm", status:"Ongoing", course:"CSE499B — Senior Design", color:"#4a8fa8", icon:"⬡", role:"Built the Warden bot — gas & fire detection with autonomous room sweep", desc:"A trio of autonomous, role-specialised ground robots operating as a fully decentralised swarm for home emergency response. No master bot. No single point of failure.", highlights:["Pathfinder: SLAM mapping with 180° pseudo-LiDAR sweep","Guardian: AI vision for injury/weapon detection + first aid delivery","Warden (my bot): MQ-2 gas sensor + thermal fire detection + door-to-door sweep","ESP-NOW mesh — no router required, true peer-to-peer swarm","Full 3-bot system under 55,670 BDT using COTS components"], tech:["ESP32-S3 Eye","ESP-NOW","SLAM","TensorFlow Lite","Python Dashboard","VL53L0X","MQ-2"], github:"https://github.com/mbamotria/AEGIS_Warden" },
  { id:"5g", name:"5G Lateral Guard", full:"Cross-Slice Lateral Movement Detection in 5G Networks", status:"Ongoing", course:"CSE498R — Research", color:"#7a6ea8", icon:"◈", role:"Co-researcher — currently building the dataset generation pipeline", desc:"A GNN-based detection system for an attack vector that existing IDS tools are completely blind to: a threat actor pivoting from a low-security 5G slice into a hospital or financial network.", highlights:["Attack masquerades as legitimate control-plane signalling — invisible to traditional IDS","Graph Neural Network: devices as nodes, traffic as edges","Open5GS + UERANSIM testbed simulates real multi-slice 5G","Currently: building labeled dataset of benign vs adversarial lateral movement","First open-source testbed for cross-slice security experimentation"], tech:["Graph Neural Networks","Open5GS","UERANSIM","Python","5G NR","Network Slicing","PyTorch"], github:"https://github.com/mbamotria" },
  { id:"ai-desk", name:"AI Desk Assistant", full:"ESP32 Voice Assistant with AI Integration", status:"Completed", course:"CSE299 — Junior Design", color:"#c9a84c", icon:"◎", role:"Lead developer — full hardware + software implementation", desc:"A physical desk device that listens to your voice, thinks with GPT, and talks back — all on a microcontroller. Built to reduce digital distraction.", highlights:["I2S microphone → WAV → Deepgram STT → OpenAI GPT → Google TTS → speaker","FreeRTOS multitasking: recording, transcription, playback as separate tasks","OLED displays time, weather, and AI responses with auto-scroll paging","89% transcription accuracy in quiet environments","Average response time ~30 seconds end-to-end"], tech:["ESP32","C++","FreeRTOS","Deepgram API","OpenAI API","I2S","OLED","PlatformIO"], github:"https://github.com/mbamotria/AIDeskAssistant" },
  { id:"zeroway", name:"ZeroWay", full:"Feature-rich SDDM Login Theme for Linux", status:"Completed", course:"Personal Project", color:"#6aa86a", icon:"◇", role:"Solo — QML frontend + shell installer", desc:"A polished open-source SDDM greeter theme with adaptive scaling, keyboard-first UX, ambient motion, and 40+ configuration options.", highlights:["Adaptive layout scaling for any resolution or aspect ratio","Ambient motion background — configurable opacity and speed","Spotlight focus glow, keyboard shortcuts, on-screen keyboard","Monogram fallback avatars with stable accent color palette","Full CHANGELOG, CONTRIBUTING.md, MIT license — production-quality open source"], tech:["QML","Shell","Makefile","SDDM","Arch Linux","Hyprland"], github:"https://github.com/mbamotria/ZeroWay" },
];

const OTHER_REPOS = [
  { name:"ObstacleAvoidanceRobot", desc:"ESP32 + HC-SR04 reactive robot with median filtering. 91% success rate. Academic paper written.", color:"#4a8fa8", github:"https://github.com/mbamotria/ObstacleAvoidanceRobot" },
  { name:"ShareStuffs", desc:"Full-stack platform where people can share items and others can borrow them.", color:"#7a6ea8", github:"https://github.com/sakibulla/ShareStuffs_Client" },
  { name:"NewsletterHub", desc:"Most polished web project — HTML, CSS, PHP, MySQL. Clean, complete, production-ready.", color:"#c9a84c", github:"https://github.com/mbamotria/NewsletterHub" },
  { name:"MotriasLinuxRice", desc:"Arch Linux dotfiles — Hyprland, KDE, GNOME. Because an OS should look like art.", color:"#6aa86a", github:"https://github.com/mbamotria/MotriasLinuxRice" },
  { name:"GameCollection", desc:"Java game collection with AI-assisted animations. Best Java project I've written.", color:"#a86a4a", github:"https://github.com/mbamotria/GameCollection" },
  { name:"ModernSuperShop", desc:"E-commerce web application.", color:"#888", github:"https://github.com/mbamotria/ModernSuperShop" },
];

const PAPERS = [
  { id:"scam", title:"Audio Scam Detection using Cross-Modal Knowledge Distillation, Meta-Learning, and Attention-Based Segment Scoring for Edge Deployment", course:"CSE465 — Neural Networks", status:"Unpublished", color:"#c85a5a", desc:"Detects phone scam calls using only one side of the conversation — a gap no existing system addresses. Runs on edge devices.", contributions:["Cross-modal KD: GPT-4o teacher → Gemma-3n student model via LoRA","Meta-learning with Prototypical Networks for few-shot adaptation to new scam types","Attention-based segment scoring for early alerts and explainability (LIME)"], results:[{label:"Best Model",val:"Gemma-3n"},{label:"Accuracy",val:"88.2%"},{label:"F1 Score",val:"89.07%"},{label:"Dataset",val:"TeleAntiFraud-28k"}] },
  { id:"purchase", title:"Predicting Customer Purchase Behavior for Targeted Cross-Selling Using Supervised Learning", course:"Machine Learning Project", status:"Unpublished", color:"#7a6ea8", desc:"Supervised learning framework for cross-selling recommendations. Wide & Deep beats all classical approaches on 784k transactions.", contributions:["Transaction-pair classification with fine-grained temporal feature engineering","SMOTE-based class balancing for rare co-purchase events","Wide & Deep hybrid: memorization + generalization combined"], results:[{label:"Best Model",val:"Wide & Deep"},{label:"Accuracy",val:"81%"},{label:"F1 Score",val:"83%"},{label:"AUC",val:"88.62%"}] },
  { id:"robot", title:"An Autonomous Obstacle Avoidance Car", course:"Solo Research Paper", status:"Unpublished", color:"#4a8fa8", desc:"Reactive obstacle avoidance robot using ESP32 and ultrasonic sensing with median filtering for noise reduction.", contributions:["Median filtering over 15 samples for reliable indoor detection","Differential-drive reactive algorithm: stop / reverse / turn logic","30 trials across single, double obstacle and narrow corridor scenarios"], results:[{label:"Best Success",val:"91%"},{label:"Reaction Time",val:"220–260ms"},{label:"Platform",val:"ESP32"},{label:"Trials",val:"30"}] },
  { id:"aideskpaper", title:"AI Desk Assistant — ESP32 Voice Assistant with AI Integration", course:"CSE299 — Junior Design", status:"Submitted to faculty", color:"#c9a84c", desc:"Hardware-software system combining voice recording, AI, and TTS on a microcontroller to create a distraction-free AI interface for students.", contributions:["FreeRTOS multitasking architecture for concurrent recording/transcription/playback","Double buffering for SD card write optimization under memory constraints","Deepgram + OpenAI + Google TTS pipeline on a single low-cost microcontroller"], results:[{label:"Transcription",val:"89%"},{label:"Response Time",val:"~30s"},{label:"Platform",val:"ESP32"},{label:"Grade",val:"A"}] },
];

const BOOKS = [
  { title:"48 Laws of Power", author:"Robert Greene", progress:10, color:"#c85a5a", emoji:"⚔" },
  { title:"Ten Cities That Led the World", author:"Paul Strathern", progress:1, color:"#4a8fa8", emoji:"🏛" },
  { title:"Notes from Underground", author:"Fyodor Dostoevsky", progress:20, color:"#7a6ea8", emoji:"🕯" },
];

const LIFE_CARDS = [
  { icon:"♪", title:"Music", color:"#c9a84c", items:[{l:"Warfaze",s:"Hard Rock and Heavy Metal"},{l:"Skillet",s:"alternative rock"},{l:"Aftermath",s:"Bangla rock"},{l:"Anime OSTs",s:"always, forever"}], note:"Music runs during every workout, every commute, every late-night cook session.", link:{label:"SPOTIFY →",href:"https://open.spotify.com/user/31z4vpugeplruvel67xyf4icct6i?si=0912baeea6bb4f5d"} },
  { icon:"◉", title:"Gaming", color:"#7a6ea8", items:[{l:"Strinova",s:"main — tactical shooter"},{l:"Genshin Impact",s:"open world RPG"}], note:"Gaming channel: Motria. Strinova hits deeper.", link:{label:"YOUTUBE →",href:"https://www.youtube.com/@motria0"} },
  { icon:"▦", title:"Reading", color:"#4a8fa8", items:[{l:"Crime and Punishment",s:"Dostoevsky — the one that hit different"},{l:"Always something next",s:"20 min before sleep, every night"}], note:"Reading is the last thing before sleep. Non-negotiable.", link:{label:"GOODREADS →",href:"https://www.goodreads.com/user/show/169165256-mohammed-bin-ahmed"} },
  { icon:"◎", title:"Anime", color:"#a86a4a", items:[{l:"MyAnimeList",s:"full list — 0Motria"},{l:"Obsessed with openings",s:"they hit differently than the show"}], note:"Ask me for a recommendation. I will not disappoint.", link:{label:"MYANIMELIST →",href:"https://myanimelist.net/profile/0Motria"} },
  { icon:"⚽", title:"Sports", color:"#6aa86a", items:[{l:"Cricket",s:"All formats — test, ODI, T20"},{l:"Table Tennis",s:"Fast reflexes and spin"},{l:"Basketball",s:"Street-court drives"},{l:"Chess",s:"Tactical, positional, rapid"},{l:"Carrom",s:"Precision and timing"}], note:"Sports keep me sharp and competitive. Always ready for a match.", link:null },
  { icon:"⬡", title:"Photography", color:"#6aa86a", items:[{l:"motriasclicks.netlify.app",s:"live portfolio"},{l:"Street & candid",s:"the genre that feels most honest"}], note:"Seeing the world through a lens changes how you look at it without one.", link:{label:"VISIT GALLERY →",href:"https://motriasclicks.netlify.app"} },
  { icon:"◇", title:"Cooking", color:"#c9a84c", items:[{l:"Homemade Shawarma",s:"the signature"},{l:"Potato Curry",s:"the one I'm most proud of"},{l:"Chinese stir fry",s:"carrot, borboti, chicken"}], note:"Cooking is meditation. Music on, phone away.", link:null },
];

const ACADEMICS = [
  {sem:"Fall 2022",gpa:3.31,highlight:null},{sem:"Spring 2023",gpa:3.06,highlight:null},
  {sem:"Summer 2023",gpa:3.26,highlight:null},{sem:"Intersession",gpa:3.85,highlight:"Peak"},
  {sem:"Spring 2024",gpa:3.35,highlight:null},{sem:"Summer 2024",gpa:3.52,highlight:null},
  {sem:"Spring 2025",gpa:3.37,highlight:null},{sem:"Summer 2025",gpa:3.40,highlight:null},
  {sem:"Fall 2025",gpa:2.72,highlight:"Hardest"},{sem:"Spring 2026",gpa:3.19,highlight:null},
];

const SKILLS = [
  {g:"Networking & Security",items:["5G / Network Slicing","IoT Protocols","Cybersecurity","Data Communication","TCP/IP","Intrusion Detection"]},
  {g:"Programming",items:["Python","C / C++","Java","SQL","JavaScript","QML"]},
  {g:"AI / ML",items:["Graph Neural Networks","Knowledge Distillation","Meta-Learning","TensorFlow Lite","XGBoost","Wide & Deep"]},
  {g:"Systems & Hardware",items:["Embedded Systems","ESP32 / ESP32-S3","FreeRTOS","SLAM","Computer Architecture","Operating Systems"]},
  {g:"Linux",items:["Arch Linux","Hyprland","KDE","GNOME","Shell Scripting","System Ricing"]},
];

const CONNECT_LINKS = [
  {label:"Email",icon:"✉",color:"#ea4335",desc:"mohammedbinahmed007",href:"mailto:mohammedbinahmed007@gmail.com"},
  {label:"LinkedIn",icon:"in",color:"#0a66c2",desc:"Mohammed Bin Ahmed",href:"https://linkedin.com/in/mohammed-bin-ahmed-596861255"},
  {label:"GitHub",icon:"◆",color:"#e6edf3",desc:"github.com/mbamotria",href:"https://github.com/mbamotria/"},
  {label:"Facebook",icon:"f",color:"#1877f2",desc:"Mohammed Bin Ahmed",href:"https://www.facebook.com/mohammed.bin.ahmed.mahee/"},
  {label:"Photography",icon:"⬡",color:"#6aa86a",desc:"motriasclicks.netlify.app",href:"https://motriasclicks.netlify.app"},
  {label:"MyAnimeList",icon:"▦",color:"#2e51a2",desc:"0Motria",href:"https://myanimelist.net/profile/0Motria"},
  {label:"Spotify",icon:"♪",color:"#1db954",desc:"What I'm listening to",href:"https://open.spotify.com/user/31z4vpugeplruvel67xyf4icct6i?si=0912baeea6bb4f5d"},
  {label:"YouTube",icon:"▶",color:"#ff4444",desc:"Gaming — @motria0",href:"https://www.youtube.com/@motria0"},
  {label:"Goodreads",icon:"◇",color:"#c9a84c",desc:"Reading list",href:"https://www.goodreads.com/user/show/169165256-mohammed-bin-ahmed"},
];

// ── SYLLABUS DATA (condensed for performance) ──────────────────────────────
const SYLLABUS_PHASES = [
  {
    id:"p1", label:"Phase 1", title:"Networking: Zero to Pro",
    duration:"~3 months · 20 modules", color:"#00d4ff",
    modules:[
      {id:1,title:"Linux Command Line for Networkers & Hackers",hook:"Before you touch a packet, you need to master the environment where all the real work happens — the Linux terminal.",objective:"Build fluency in Linux fundamentals required for networking and security work.",concepts:["Filesystem navigation (ls, cd, find, chmod)","File manipulation (cat, grep, awk, sed, cut)","Process management (ps, kill, top, htop)","User permissions, sudo, and privilege model","Bash scripting basics","Package management (apt)","Environment variables and PATH","SSH basics — connecting to remote systems"],lab:"Write a bash script that scans a subnet using ping to find live hosts. Print results with timestamps.",tools:["bash","grep/awk/sed","ssh","man pages"],cert:"Foundation for all certs — OSCP requires strong Linux fluency",bridge:false},
      {id:2,title:"How the Internet Actually Works",hook:"Every time you load a webpage, hundreds of invisible machines cooperate in milliseconds — here's the full story.",objective:"Understand the end-to-end journey of a packet from your browser to a server and back.",concepts:["Client-server model","ISPs, IXPs & backbone networks","Packets vs circuits","Latency vs bandwidth","Physical internet — fiber, submarine cables, wireless towers","What happens between DNS query and first byte"],lab:"Use traceroute and mtr to visualize hops. Identify where your packet leaves your ISP.",tools:["traceroute","mtr","ping","whois"],cert:null,bridge:false},
      {id:3,title:"The OSI Model — Why Layers Exist",hook:"The OSI model isn't a memory exercise — it's the blueprint engineers used to stop networking from being chaos.",objective:"Understand why abstraction layers exist and what problem each one solves.",concepts:["All 7 layers with real-world analogies","Why layering enables interoperability","PDUs at each layer: bits → frames → packets → segments","Where protocols live: HTTP=L7, TCP=L4, IP=L3, Ethernet=L2","Encapsulation & de-encapsulation","OSI vs reality"],lab:"Open Wireshark. Capture an HTTP request. Identify L2, L3, L4, L7 fields. Label every field.",tools:["Wireshark"],cert:"CompTIA Network+ objective 1.1 — CCNA Domain 1",bridge:false},
      {id:4,title:"The TCP/IP Model — What the Internet Actually Uses",hook:"OSI is the theory. TCP/IP is what runs the internet.",objective:"Map TCP/IP layers to OSI, understand where the models diverge.",concepts:["4-layer TCP/IP stack","Why TCP/IP won over OSI","Encapsulation in practice","IP as the universal glue","Socket programming concepts (IP + Port = socket)"],lab:"Write a minimal TCP echo server + client in Python. Capture in Wireshark.",tools:["Python socket module","Wireshark"],cert:null,bridge:false},
      {id:5,title:"IP Addressing — The Binary Math Behind It",hook:"Every firewall rule, every routing decision comes down to binary arithmetic — and it's simpler than you think.",objective:"Understand IPv4 addressing, binary representation, and subnet masks from first principles.",concepts:["Decimal ↔ Binary conversion","IPv4 structure — 4 octets, 32 bits","Network vs host portion","Subnet masks in binary","Private vs public address ranges (RFC 1918)","Classful addressing history and CIDR","IPv6 basics"],lab:"Without a calculator: derive network address, broadcast, first/last host for 192.168.10.45/26.",tools:["ipcalc","Python"],cert:"Core CompTIA Network+ / CCNA topic",bridge:false},
      {id:6,title:"Subnetting & CIDR — Slicing Networks Like an Engineer",hook:"Subnetting separates 'I know networking' from 'I do networking.'",objective:"Subnet any given IP block manually, design a VLSM addressing scheme.",concepts:["CIDR notation in binary","/VLSM — fitting different-sized subnets","Why we subnet: security, traffic control, address conservation","Supernetting basics","Subnet cheat sheet — magic numbers","/30 and /31 point-to-point links"],lab:"Design a subnet plan for a company: HR=20 hosts, Engineering=50, Servers=10, Management=5. Allocate from 172.16.0.0/16.",tools:["ipcalc","pen + paper","ip addr"],cert:"Heavy CCNA weighting",bridge:false},
      {id:7,title:"Ethernet & MAC Addresses — Layer 2 Reality",hook:"IP gets the glory, but Ethernet is what actually delivers your frame across a local network.",objective:"Understand how Layer 2 delivers frames, switch behavior, and MAC addresses.",concepts:["MAC address structure: OUI + device ID","Ethernet frame anatomy","Switches vs hubs","MAC address table learning","Broadcast domain vs collision domain","ARP's dependence on Layer 2"],lab:"Use ip link, arp -n, and Wireshark. Identify your router's MAC. Watch ARP broadcasts.",tools:["Wireshark","arp -n","ip link","maclookup.app"],cert:null,bridge:false},
      {id:8,title:"VLANs & 802.1Q Trunking — Network Segmentation",hook:"Misconfigured VLANs are one of the most common vulnerabilities in corporate networks.",objective:"Understand VLAN segmentation, 802.1Q tagging, trunk links, and inter-VLAN routing.",concepts:["What a VLAN is and why it exists","Access ports vs trunk ports","802.1Q tagging — the 4-byte tag","Native VLAN security risk","Inter-VLAN routing: Router-on-a-stick vs L3 switch","VLAN hopping attacks overview"],lab:"In GNS3: configure VLAN 10 and VLAN 20. Verify hosts can't reach across VLANs without a router.",tools:["GNS3 or Eve-NG","Wireshark"],cert:"CCNA Network Access domain — 20% of exam",bridge:true,bridgeNote:"⚡ VLAN hopping and native VLAN exploitation appear in Phase 2."},
      {id:9,title:"Spanning Tree Protocol — Preventing Layer 2 Loops",hook:"Without STP, a single loop crashes the entire network in seconds.",objective:"Understand how STP/RSTP prevents loops, elects a root bridge.",concepts:["Why L2 loops are catastrophic","STP root bridge election","Port states: Blocking/Listening/Learning/Forwarding","RSTP (802.1w) faster convergence","PortFast, BPDU Guard","STP attacks: BPDU spoofing"],lab:"In GNS3: create a 3-switch topology with a loop. Disable STP and observe the broadcast storm.",tools:["GNS3","Wireshark"],cert:"CCNA Network Access domain",bridge:false},
      {id:10,title:"ARP — The Protocol That Ties L2 and L3 Together",hook:"ARP has zero authentication — it's one of the most abusable protocols ever designed.",objective:"Understand how ARP resolves IP-to-MAC and why it's stateless and unauthenticated.",concepts:["ARP request/reply cycle","ARP cache: build and TTL","Gratuitous ARP — dangerous","Proxy ARP","ARP table: ip neigh, arp -n","Why ARP has no authentication — 1982 design decision"],lab:"Capture ARP traffic in Wireshark. Clear your ARP cache and watch it rebuild in real time.",tools:["Wireshark","arp -n","ip neigh"],cert:null,bridge:true,bridgeNote:"⚡ This module directly sets up ARP spoofing/MITM in Phase 2."},
      {id:11,title:"DNS — What Really Happens When You Type a URL",hook:"The DNS lookup involves 6 different actors and 8 steps — knowing all of them reveals exactly where attackers can intercept it.",objective:"Trace a full DNS resolution from browser cache to root server and back.",concepts:["DNS hierarchy: root → TLD → authoritative","Recursive vs iterative resolution","Record types: A, AAAA, CNAME, MX, TXT, NS, PTR, SOA","TTL and caching","DoH and DoT","Split-horizon DNS"],lab:"Run dig +trace google.com and annotate every hop. Capture in Wireshark.",tools:["dig","nslookup","Wireshark","host"],cert:"Network+ IP Services — CCNA IP Services",bridge:true,bridgeNote:"⚡ DNS poisoning and spoofing in Phase 2 built directly on this module."},
      {id:12,title:"DHCP, SSH, Telnet, FTP & Core Protocols Deep Dive",hook:"Each of these protocols has a story at the packet level — and several are dangerously insecure by design.",objective:"Understand DORA, the insecurity of cleartext protocols, and how SSH replaced them.",concepts:["DHCP DORA: Discover, Offer, Request, Acknowledge","DHCP options: gateway, DNS, lease time","DHCP starvation attack preview","Telnet — cleartext credentials","FTP active vs passive mode","SSH key-based auth","SMTP basics"],lab:"Capture full DHCP DORA in Wireshark. Compare SSH capture to Telnet — see credentials in cleartext.",tools:["Wireshark","dhclient","ssh","telnet","ftp"],cert:"CCNA IP Services domain",bridge:false},
      {id:13,title:"TCP & UDP — How Data Actually Gets Delivered",hook:"TCP and UDP are opposites — choosing wrong can break an app or expose it to attacks.",objective:"Understand TCP handshake, teardown, flow control, flags, and why UDP exists.",concepts:["3-way handshake: SYN → SYN-ACK → ACK","4-way teardown: FIN/FIN-ACK","TCP flags: SYN, ACK, FIN, RST, PSH, URG","Sequence numbers and ACKs","TCP sliding window & flow control","UDP — no handshake, no guarantee","TCP state machine"],lab:"Open a TCP connection with nc. Capture full handshake and teardown in Wireshark. Annotate every flag.",tools:["Wireshark","Netcat","ss -tan","Python socket"],cert:"Core across Network+, CCNA, Security+",bridge:true,bridgeNote:"⚡ TCP flags are exactly how Nmap fingerprints services. Foundation for all port scanning."},
      {id:14,title:"HTTP & HTTPS — The Web at the Protocol Level",hook:"One missing header is a vulnerability. One wrong response code leaks information.",objective:"Understand HTTP request/response structure and how TLS wraps it into HTTPS.",concepts:["HTTP methods: GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH","Request/response anatomy","Headers that matter: Host, Cookie, Authorization, CORS","Status codes and what they reveal","HTTP/1.1 vs HTTP/2 vs HTTP/3","TLS handshake: ClientHello, ServerHello, Certificate","Certificate chain of trust"],lab:"Use curl -v to inspect raw HTTP headers against 5 sites. Capture HTTPS handshake in Wireshark.",tools:["curl -v","Wireshark","Burp Suite"],cert:null,bridge:true,bridgeNote:"⚡ OWASP Top 10 vulnerabilities in Phase 2 all live at the HTTP layer."},
      {id:15,title:"Routing — How Packets Cross Networks",hook:"Your packet hops through dozens of routers, each making an independent forwarding decision in microseconds.",objective:"Understand routing tables, static vs dynamic routing, administrative distance, and TTL.",concepts:["Routing table anatomy: destination, mask, next-hop, interface, metric","Longest prefix match","Static routes vs dynamic routing protocols","OSPF overview — link-state, areas, LSAs","BGP overview — the protocol that holds the internet together","Administrative distance","TTL and how traceroute exploits it"],lab:"Examine your routing table with ip route. Add and delete a static route. Run traceroute with varying TTLs.",tools:["ip route","traceroute","Wireshark"],cert:"CCNA IP Connectivity — 25% of exam",bridge:false},
      {id:16,title:"Wireless Networking — 802.11, WPA2/WPA3 & Wi-Fi Security",hook:"Wi-Fi is the most attacked network medium in existence.",objective:"Understand 802.11 standards, Wi-Fi authentication, WPA2/WPA3 security, and the 4-way handshake.",concepts:["802.11 standards: a/b/g/n/ac/ax — frequencies, speeds","2.4GHz vs 5GHz","WEP (broken), WPA2-Personal, WPA2-Enterprise","WPA2 4-way handshake — capturable","WPA3 SAE (Dragonfly handshake)","Evil Twin attacks preview"],lab:"Use iw dev to inspect your wireless interface. Capture beacon frames in Wireshark monitor mode.",tools:["iwconfig","iw","Wireshark","airmon-ng"],cert:"CCNA Network Access — wireless; Network+ wireless domain",bridge:true,bridgeNote:"⚡ WPA2 handshake capture and cracking is a Phase 2 module."},
      {id:17,title:"Firewalls, NAT & VPNs — The Guards at the Gate",hook:"A firewall without understanding is a false sense of security.",objective:"Understand stateful firewalls, iptables, NAT translation, ACLs, and VPN tunneling.",concepts:["Stateless vs stateful firewalls","iptables chains: INPUT, OUTPUT, FORWARD","NAT — one public IP serves hundreds (PAT/masquerade)","Port Address Translation","ACLs: standard vs extended","VPN tunneling: IPSec, OpenVPN, WireGuard","Split tunneling"],lab:"Write iptables rules to block Telnet, allow SSH/HTTP, and log dropped packets. Verify with Nmap.",tools:["iptables","ufw","WireGuard","Nmap"],cert:"Network+ / Security+ / CCNA Security Fundamentals",bridge:false},
      {id:18,title:"Network Troubleshooting Methodology",hook:"Randomly trying fixes wastes hours. Working the OSI model layer by layer finds the problem in minutes.",objective:"Develop a systematic, reproducible methodology for diagnosing network problems.",concepts:["Bottom-up vs top-down OSI troubleshooting","Divide and conquer strategy","Layer 1: physical — ip link, NIC state","Layer 2: ARP, MAC table, VLANs","Layer 3: routing table, ping, traceroute","Layer 4: ss -tulnp, port states","Layer 7: DNS resolution, curl, service logs","tcpdump mastery"],lab:"Deliberately break your VM network 3 different ways. Time yourself diagnosing and fixing each one.",tools:["tcpdump","ss","ip route","ping","dig","curl"],cert:"Network+ troubleshooting domain",bridge:false},
      {id:19,title:"IP Services — SNMP, NTP, Syslog & QoS",hook:"These protocols run invisibly in every enterprise — and each one is a potential attack vector.",objective:"Understand NTP, SNMP, Syslog, QoS, and TFTP at a protocol level.",concepts:["NTP — why time synchronization matters (logs, Kerberos, certificates)","SNMP v1/v2c vs v3 — why v1/v2 are a disaster","SNMP community strings","Syslog — severity levels, centralized logging","QoS — DSCP markings, VoIP priority","TFTP — when it's used, why it's dangerous"],lab:"Set up rsyslog server. Scan SNMP with snmpwalk using default 'public' community string.",tools:["snmpwalk","rsyslog","ntpdate"],cert:"CCNA IP Services domain — 10% of exam",bridge:true,bridgeNote:"⚡ SNMP community string enumeration is a real pentesting technique."},
      {id:20,title:"Wireshark & tcpdump Mastery — Reading the Wire",hook:"Once you can read a raw packet capture, every protocol becomes transparent and every attack becomes visible.",objective:"Use Wireshark and tcpdump proficiently to capture, filter, reconstruct sessions, and spot anomalies.",concepts:["Capture filters vs display filters (BPF syntax)","Following TCP/UDP streams","Protocol dissection","Exporting objects (files over HTTP)","Spotting anomalies: retransmits, RST floods, ARP storms","tcpdump CLI for headless capture","Saving pcaps"],lab:"Download 3 public PCAPs from Wireshark's sample page. Identify all hosts, protocols, and reconstruct what happened.",tools:["Wireshark","tshark","tcpdump"],cert:"Network+, CEH, and OSCP labs",bridge:true,bridgeNote:"⚡ Phase 2 begins here. You now have the eyes to see attacks in traffic."},
    ]
  },
  {
    id:"p2", label:"Phase 2", title:"Cybersecurity: From Understanding to Exploitation",
    duration:"~3 months · 19 modules", color:"#ff4444",
    modules:[
      {id:21,title:"The Attacker Mindset, Ethics & Legal Framework",hook:"The best defenders think like attackers — but without understanding the rules, you'll end your career before it starts.",objective:"Adopt a structured attacker's perspective, understand the legal landscape, and learn the kill chain.",concepts:["CIA Triad — Confidentiality, Integrity, Availability","The Cyber Kill Chain — 7 phases","MITRE ATT&CK framework","Threat modeling: assets, threats, attack vectors","Legal framework: CFAA, responsible disclosure","Bug bounty programs","Scope and rules of engagement"],lab:"Threat model your own home network. List every asset, identify threats, map to MITRE ATT&CK.",tools:["MITRE ATT&CK Navigator","draw.io","HackerOne / Bugcrowd"],cert:"CompTIA Security+ / CEH domain 1",bridge:false},
      {id:22,title:"Passive Reconnaissance — Gathering Without Touching",hook:"The best recon leaves no trace — you'd be surprised how much an attacker knows before sending a single packet.",objective:"Perform structured OSINT on a target without any direct interaction.",concepts:["OSINT vs active recon","WHOIS, ARIN, RIPE","Certificate transparency logs (crt.sh)","Shodan — internet-wide scanning","Google dorks","theHarvester","LinkedIn/social OSINT","Wayback Machine"],lab:"Pick a bug bounty company. Passive recon only: IP ranges, subdomains, tech stack, employee data.",tools:["theHarvester","Shodan","crt.sh","whois","Wayback Machine"],cert:"CEH Information Gathering domain",bridge:false},
      {id:23,title:"Active Reconnaissance & Enumeration",hook:"Active recon means you're touching the target — every packet you send can be logged.",objective:"Perform active network enumeration using Nmap and supporting tools.",concepts:["Active vs passive recon","Ping sweeps — ICMP, TCP, ARP-based","Port states: open, closed, filtered","Common port numbers (must-memorize 50)","Banner grabbing","DNS zone transfer attempts (AXFR)","SNMP enumeration","SMB enumeration with enum4linux"],lab:"Set up Metasploitable 2. Run full recon: host discovery → port scan → service enumeration → OS fingerprinting.",tools:["Nmap","Netcat","enum4linux","snmpwalk","Metasploitable 2"],cert:"CEH / OSCP enumeration phase",bridge:false},
      {id:24,title:"Nmap Deep Dive — What Every Scan Actually Sends",hook:"Running nmap -A without knowing what it sends is firing a weapon blindfolded.",objective:"Understand what Nmap transmits at the packet level for each scan type.",concepts:["SYN scan (-sS) vs Connect scan (-sT)","UDP scan (-sU) — why it's slow","OS fingerprinting (-O)","Service/version detection (-sV)","NSE scripts — categories and writing","Timing templates (T0–T5)","Firewall evasion: fragmentation, decoys"],lab:"Run SYN scan + Connect scan against Metasploitable 2. Capture both in Wireshark. Match every output line to actual packets.",tools:["Nmap","Wireshark","Metasploitable 2"],cert:"CEH / OSCP core skill",bridge:false},
      {id:25,title:"Vulnerability Scanning — Nessus & OpenVAS",hook:"Manual enumeration finds the obvious — vulnerability scanners find the hidden CVE nobody noticed.",objective:"Run professional vulnerability scans and interpret results to prioritize findings.",concepts:["Vulnerability scanning vs pentesting","CVE / CVSS scoring","Nessus Essentials — scan policies, credentialed scans","OpenVAS — open-source alternative","Reading scan output: critical/high/medium/low/info","False positives — manual verification","Patch Tuesday and CVE databases"],lab:"Scan Metasploitable 2 with Nessus. For every Critical/High: look up on Exploit-DB. Verify one manually.",tools:["Nessus Essentials","OpenVAS","Exploit-DB","NVD"],cert:"CEH; Security+ domain 2",bridge:false},
      {id:26,title:"ARP Spoofing — MITM at Layer 2",hook:"Because ARP has zero authentication, any device on your LAN can lie about who it is.",objective:"Demonstrate ARP spoofing in a controlled 3-VM lab, intercept traffic, implement detection.",concepts:["ARP cache poisoning step by step","Becoming the MITM — IP forwarding requirement","What you can see (HTTP) vs can't (HTTPS/HSTS)","Detecting ARP spoofing: arpwatch, Wireshark","Defense: Dynamic ARP Inspection (DAI)","HSTS and certificate pinning"],lab:"3-VM lab: use arpspoof to poison both ends. Capture victim's HTTP traffic. Run arpwatch for alerts.",tools:["arpspoof","Wireshark","arpwatch","Ettercap"],cert:null,bridge:false},
      {id:27,title:"DNS Poisoning, Spoofing & Rebinding",hook:"DNS was designed in a more trusting era — those trust assumptions are what attackers exploit.",objective:"Understand DNS cache poisoning, demonstrate DNS spoofing, learn DNSSEC defenses.",concepts:["DNS cache poisoning — Kaminsky attack (2008)","DNS spoofing from MITM position","DNS rebinding — bypassing same-origin policy","DNSSEC chain of trust","DoH and DoT — what they protect against","DNS as C2 channel"],lab:"From ARP MITM: use dnsspoof to redirect victim's DNS query. Configure DNSSEC and verify with dig +dnssec.",tools:["dnsspoof","Wireshark","dig +dnssec"],cert:null,bridge:false},
      {id:28,title:"Metasploit Framework — Professional Exploitation",hook:"Metasploit isn't a magic hack button — it's a structured framework for organizing and executing exploits.",objective:"Use Metasploit proficiently: search, configure, exploit, and post-exploit.",concepts:["Metasploit architecture: exploits, payloads, auxiliaries, post modules","msfconsole workflow","Payload types: singles, stagers, stages; Meterpreter vs shell","Handler setup for reverse shells","Auxiliary modules","Post-exploitation: hashdump, sysinfo, migrate","msfdb for organizing findings"],lab:"On Metasploitable 2: exploit vsftpd 2.3.4 backdoor. Get a shell. Dump /etc/passwd. Document every command.",tools:["Metasploit Framework","msfconsole","Metasploitable 2","Wireshark"],cert:"CEH / OSCP core tool",bridge:false},
      {id:29,title:"Netcat, Shells & Post-Exploitation Basics",hook:"Getting a shell is the goal — what you do in the 30 seconds after determines whether the engagement succeeds.",objective:"Use Netcat for shells, stabilize them, perform basic post-exploitation enumeration.",concepts:["Netcat listen vs connect modes","Reverse shell vs bind shell","Shell stabilization: python pty, stty raw, socat","TTY vs non-TTY shells","Post-exploitation: whoami, uname -a, ip addr, ss -tulnp","Finding interesting files: .bash_history, /etc/shadow","Transferring files: Python HTTP server, nc, wget"],lab:"Exploit a Metasploitable service. Stabilize shell. Enumerate OS, users, network. Transfer a tool via Python HTTP server.",tools:["Netcat","socat","Python3"],cert:"OSCP core skill",bridge:false},
      {id:30,title:"Linux Privilege Escalation",hook:"Privilege escalation is almost always a misconfiguration, not a zero-day.",objective:"Identify and exploit the most common Linux privilege escalation vectors.",concepts:["Enumeration first: LinPEAS, manual checks","SUID/SGID binaries — GTFOBins","Sudo misconfigurations — sudo -l","Writable cron jobs","PATH hijacking","Writable /etc/passwd","Kernel exploits — DirtyCow concept","NFS no_root_squash"],lab:"Deploy TryHackMe Linux PrivEsc room. Run LinPEAS. Exploit at least 3 different vectors.",tools:["LinPEAS","GTFOBins","TryHackMe","pspy"],cert:"OSCP core skill",bridge:false},
      {id:31,title:"Windows Privilege Escalation",hook:"Most corporate networks run Windows — and Windows privesc has its own completely different attack surface.",objective:"Identify and exploit common Windows privilege escalation vectors.",concepts:["Windows access control: SIDs, DACLs, ACEs","WinPEAS — automated enumeration","Service misconfigurations: unquoted service paths","AlwaysInstallElevated MSI abuse","Token impersonation: SeImpersonatePrivilege","DLL hijacking","Scheduled tasks with weak permissions","Registry autoruns"],lab:"Deploy Windows VM with TryHackMe Windows PrivEsc Arena. Exploit unquoted service path and token impersonation.",tools:["WinPEAS","PowerUp.ps1","PrintSpoofer","PowerShell"],cert:"OSCP — Windows machines are 40%+ of the exam",bridge:false},
      {id:32,title:"Password Attacks & Authentication Weaknesses",hook:"Most breaches involve passwords, not exotic exploits. Understanding hashing and cracking is non-negotiable.",objective:"Understand hashing, salting, cracking techniques, and credential-based attacks.",concepts:["Hashing vs encryption","Hash algorithms: MD5/SHA-1 (broken), bcrypt, Argon2, scrypt","Rainbow tables and why salting defeats them","Offline cracking: dictionary, brute-force, hybrid, rule-based","Online attacks: credential stuffing, password spraying","Default credentials","Pass-the-Hash — NTLM hashes without cracking"],lab:"Use Hashcat to crack unsalted MD5 vs bcrypt. Use Hydra to brute-force SSH on Metasploitable 2.",tools:["Hashcat","John the Ripper","Hydra","rockyou.txt"],cert:"CEH credential attacks domain; Security+",bridge:false},
      {id:33,title:"Wireless Attacks — WPA2 Cracking & Evil Twin",hook:"A laptop and a $20 adapter is all it takes to capture handshakes in a parking lot.",objective:"Demonstrate WPA2 handshake capture, offline cracking, and Evil Twin setup.",concepts:["Monitor mode vs managed mode","WPA2 4-way handshake capture — EAPOL packets","Deauthentication attack","Offline dictionary cracking with Hashcat","WPA3 SAE — why the same attack doesn't work","Evil Twin attack — rogue AP, captive portal","PMKID attack"],lab:"On your own WPA2 network: capture 4-way handshake with airodump-ng. Send deauth. Crack with Hashcat.",tools:["aircrack-ng suite","Hashcat","Wireshark"],cert:"CEH wireless hacking domain",bridge:false},
      {id:34,title:"Web Application Security & OWASP Top 10",hook:"The OWASP Top 10 isn't a list of obscure bugs — it's mistakes made in production every single day.",objective:"Understand, identify, and exploit the most critical web vulnerabilities.",concepts:["SQL Injection — error-based, blind boolean, time-based","XSS — reflected vs stored vs DOM","IDOR — broken access control","CSRF — forging requests across origins","Directory traversal","Security misconfigurations","Broken authentication","Burp Suite: intercepting, repeating, intruding"],lab:"DVWA: complete SQLi (all 3 types), XSS (reflected + stored), file inclusion, CSRF at all security levels.",tools:["Burp Suite Community","DVWA","sqlmap","PortSwigger Web Academy"],cert:"CEH; OSCP web section; Security+",bridge:false},
      {id:35,title:"Active Directory Attacks — Kerberoasting, Pass-the-Hash & Lateral Movement",hook:"Active Directory is in 90% of enterprise environments — and it's so complex that misconfigurations are inevitable.",objective:"Understand AD architecture and demonstrate the most common AD attack techniques.",concepts:["AD fundamentals: domains, forests, trusts, DCs","Kerberos: AS-REQ, TGT, TGS, ST — the full flow","Kerberoasting — requesting and cracking service tickets","AS-REP Roasting","Pass-the-Hash — NTLM lateral movement","Pass-the-Ticket — Golden/Silver Ticket concept","BloodHound — graphing AD attack paths","Unconstrained delegation, ACL abuse"],lab:"Build 3-VM AD lab. Use BloodHound. Perform Kerberoasting with Impacket. Crack ticket hash with Hashcat.",tools:["BloodHound","Impacket","CrackMapExec","Rubeus"],cert:"OSCP+; CEH; BTL1",bridge:false},
      {id:36,title:"Social Engineering & Phishing",hook:"The most sophisticated firewall can't stop an employee from clicking a link.",objective:"Understand the psychology and technical implementation of social engineering attacks.",concepts:["Psychological principles: authority, urgency, fear, reciprocity","Phishing vs spear-phishing vs whaling","Email spoofing — SPF, DKIM, DMARC","Phishing email anatomy","GoPhish — simulated campaigns","Pretexting","Vishing and smishing","Defense: security awareness, DMARC, email filtering"],lab:"Set up GoPhish campaign against your own email addresses. Craft a believable pretext. Track open rates.",tools:["GoPhish","SET","dig (DMARC checking)"],cert:"CEH social engineering; Security+",bridge:false},
      {id:37,title:"Introduction to Buffer Overflows",hook:"Understanding buffer overflows at the instruction level separates people who use exploits from people who write them.",objective:"Understand stack-based buffer overflow mechanics and control EIP in a vulnerable application.",concepts:["Memory layout: stack, heap, BSS, text segment","How the stack works: ESP, EBP, EIP","What happens when a buffer overflows","Finding the offset with cyclic patterns","Controlling EIP — pointing to shellcode","Bad characters","JMP ESP — finding a return address","ASLR, NX/DEP, Stack Canaries"],lab:"Use TryHackMe Buffer Overflow Prep room. Fuzz → find offset → control EIP → bad chars → JMP ESP → shellcode → shell.",tools:["Immunity Debugger + Mona.py","pwndbg","msfvenom"],cert:"OSCP; foundational for exploit dev",bridge:false},
      {id:38,title:"Introduction to CTFs — Hack The Box & TryHackMe",hook:"CTFs are where theory becomes instinct — the pressure of an unknown target forces you to combine everything.",objective:"Complete beginner CTF machines end-to-end and develop a repeatable methodology.",concepts:["CTF categories: web, pwn, crypto, forensics, OSINT, steganography","Pentest methodology: recon → scan → enumerate → exploit → escalate → report","Note-taking during CTFs","Getting unstuck without spoilers","Writing a public CTF writeup","HTB vs THM — when to use each"],lab:"Complete: TryHackMe Basic Pentesting → HTB Starting Point Tier 1 → one Easy HTB machine. Write a full walkthrough.",tools:["TryHackMe","HackTheBox","Obsidian","tmux"],cert:null,bridge:false},
      {id:39,title:"Pivoting, Tunneling & Port Forwarding",hook:"In real engagements, the most valuable targets are never directly accessible.",objective:"Understand and demonstrate pivoting techniques to reach hosts in isolated network segments.",concepts:["What pivoting is and why it's needed","SSH local/remote/dynamic port forwarding","Chisel — TCP/UDP tunneling over HTTP","Ligolo-ng — modern pivoting","ProxyChains — routing tool traffic through SOCKS","Meterpreter route and portfwd","Double pivots — two hops deep"],lab:"Build 3-segment VM lab: attacker → pivot host → isolated target. Use SSH dynamic + ProxyChains to Nmap the isolated target.",tools:["SSH","Chisel","Ligolo-ng","ProxyChains","Metasploit route"],cert:"OSCP — multi-machine networks require pivoting",bridge:false},
      {id:40,title:"Blue Team — Logs, Detection, Hardening & Report Writing",hook:"Every attack leaves traces — defenders who think like attackers find those traces before damage is done.",objective:"Analyze attack logs, configure detection, harden systems, and write a professional pentest report.",concepts:["What ARP spoofing, Nmap, brute force leave in logs","Linux auth logs: /var/log/auth.log, journalctl, auditd","Fail2ban — automated SSH brute force response","System hardening checklist","Introduction to SIEM: Splunk or ELK Stack","IDS/IPS: Snort/Suricata rules","Pentest report structure","Writing a finding: severity, description, evidence, impact, fix"],lab:"Replay earlier attacks. Examine logs. Configure Fail2ban. Write a 2-page professional pentest report for Metasploitable 2.",tools:["journalctl","auditd","Fail2ban","Splunk Free","Snort/Suricata"],cert:"Security+, BTL1; OSCP report writing requirement",bridge:false},
    ]
  }
];
const TEACH_COURSES = [
  {
    id: "zero-to-hacker",
    title: "Zero to Hacker",
    subtitle: "Networking → Cybersecurity · Full course content",
    description: "Click to open the full course content currently displayed in the syllabus section. This is a course page, not a syllabus page.",
    color: "#00d4ff",
    highlights: ["Networking fundamentals", "Wireshark & tcpdump", "Active reconnaissance", "Privilege escalation", "Blue team hardening"],
  },
];
// ── HELPERS ────────────────────────────────────────────────────────────────
const Gold = ({ children }) => <span className="gold-shimmer">{children}</span>;

const Divider = () => (
  <div style={{display:"flex",alignItems:"center",gap:16,margin:"48px 0 40px"}}>
    <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,#c9a84c33)"}}/>
    <div style={{width:6,height:6,borderRadius:"50%",background:"#c9a84c",opacity:0.6}}/>
    <div style={{flex:1,height:1,background:"linear-gradient(90deg,#c9a84c33,transparent)"}}/>
  </div>
);

const SLabel = ({children}) => (
  <div style={{fontSize:10,letterSpacing:4,color:"#c9a84c",fontFamily:"'Outfit',sans-serif",fontWeight:600,textTransform:"uppercase",marginBottom:6}}>{children}</div>
);
const STitle = ({children}) => (
  <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,6vw,52px)",fontWeight:600,letterSpacing:1,color:"#f0ece0",margin:"0 0 32px",lineHeight:1.1}}>{children}</h2>
);
const Card = ({children,style={},className=""}) => (
  <div className={className} style={{background:"#111008",border:"1px solid #c9a84c22",borderRadius:8,padding:"24px",...style}}>{children}</div>
);
const GoldTag = ({children,color="#c9a84c"}) => (
  <span className="tag" style={{background:color+"22",color,border:`1px solid ${color}44`}}>{children}</span>
);

// ── DAILY FACT WIDGET ──────────────────────────────────────────────────────
function DailyFactWidget() {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTodayKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchFact = useCallback(async () => {
    const key = `mahee_fact_${getTodayKey()}`;
    const cached = localStorage.getItem(key);
    if (cached) { setFact(JSON.parse(cached)); return; }
    setLoading(true); setError(null);
    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`,"HTTP-Referer":"https://mahee.netlify.app","X-Title":"Mahee Portfolio"},
        body:JSON.stringify({
          model:"anthropic/claude-sonnet-4-5",
          temperature:0.7,
          top_p:0.9,
          max_tokens:300,
          messages:[{role:"user",content:`Generate one genuinely fascinating, research-backed fact from any field of knowledge. It should be surprising, counterintuitive, or deeply interesting. Format as JSON with keys: "fact" (the fact itself, 2-3 sentences), "field" (one word like Physics/History/Biology/Psychology/etc), "source" (a real paper, journal, or institution that backs this). Return only valid JSON, no markdown.`}]
        })
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      localStorage.setItem(key, JSON.stringify(parsed));
      setFact(parsed);
    } catch(e) {
      setError("Could not load today's fact. Check your API key.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchFact(); }, [fetchFact]);

  return (
    <Card style={{background:"linear-gradient(135deg,#1a1508,#0e0c08)",border:"1px solid #c9a84c44",marginBottom:32}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <div>
          <SLabel>Today's Fact</SLabel>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:"#f0ece0"}}>
            {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
          </div>
        </div>
        {fact?.field && <GoldTag>{fact.field}</GoldTag>}
      </div>
      {loading && (
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 0"}}>
          <div style={{width:16,height:16,border:"2px solid #c9a84c44",borderTop:"2px solid #c9a84c",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
          <span style={{color:"#888",fontSize:13}}>Generating today's fact...</span>
        </div>
      )}
      {error && <div style={{color:"#c85a5a",fontSize:13,padding:"8px 0"}}>{error}</div>}
      {fact && !loading && (
        <>
          <p style={{fontSize:15,color:"#ddd",lineHeight:1.9,margin:"0 0 14px",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>"{fact.fact}"</p>
          {fact.source && <div style={{fontSize:11,color:"#888",letterSpacing:0.5}}>Source: {fact.source}</div>}
        </>
      )}
    </Card>
  );
}

// ── MODULE CARD ────────────────────────────────────────────────────────────
function ModuleCard({ module, phaseColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="module-card" onClick={() => setOpen(!open)}
      style={{border:`1px solid ${open?phaseColor+"44":"#1e1c14"}`,borderLeft:`3px solid ${phaseColor}`,borderRadius:6,marginBottom:6,background:open?"#111008":"#0d0c09",cursor:"pointer",overflow:"hidden"}}>
      <div style={{padding:"13px 16px",display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:phaseColor,opacity:0.7,minWidth:28,fontWeight:700}}>
          {String(module.id).padStart(2,"0")}
        </span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:15,color:"#f0ece0",lineHeight:1.3}}>{module.title}</div>
          {!open && <div style={{fontSize:11,color:"#555",marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{module.hook}</div>}
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
          {module.bridge && <GoldTag color="#ff9900">⚡ Bridge</GoldTag>}
          {module.cert && <GoldTag color="#a855f7">🎓 Cert</GoldTag>}
          <span style={{color:"#555",fontSize:18,marginLeft:4}}>{open?"−":"+"}</span>
        </div>
      </div>
      {open && (
        <div style={{padding:"4px 16px 20px 56px"}}>
          <div style={{borderLeft:`2px solid ${phaseColor}44`,paddingLeft:14,marginBottom:16,fontSize:13,color:"#999",fontStyle:"italic",lineHeight:1.65,fontFamily:"'Cormorant Garamond',serif"}}>
            "{module.hook}"
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,color:phaseColor,letterSpacing:2,fontWeight:600,marginBottom:6}}>🎯 OBJECTIVE</div>
            <p style={{fontSize:13,color:"#888",lineHeight:1.7,margin:0}}>{module.objective}</p>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:10,color:phaseColor,letterSpacing:2,fontWeight:600,marginBottom:6}}>📚 CORE CONCEPTS</div>
            <ul style={{margin:0,paddingLeft:18}}>
              {module.concepts.map((c,i) => <li key={i} style={{fontSize:12,color:"#888",lineHeight:1.7,marginBottom:3}}>{c}</li>)}
            </ul>
          </div>
          <div style={{marginBottom:12,background:"#0a0a06",borderRadius:6,padding:"12px 14px"}}>
            <div style={{fontSize:10,color:phaseColor,letterSpacing:2,fontWeight:600,marginBottom:6}}>🔬 LAB</div>
            <p style={{fontSize:12,color:"#9ecf9e",lineHeight:1.7,margin:0}}>{module.lab}</p>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:module.cert?12:0}}>
            {module.tools.map((t,i) => <GoldTag key={i} color={phaseColor}>{t}</GoldTag>)}
          </div>
          {module.cert && (
            <div style={{marginTop:12,fontSize:12,color:"#c4b5fd"}}><span style={{color:"#a855f7",fontWeight:700}}>🎓 </span>{module.cert}</div>
          )}
          {module.bridge && (
            <div style={{marginTop:12,background:"#1a1100",border:"1px solid #ff990033",borderRadius:4,padding:"10px 14px",fontSize:11,color:"#ff9900"}}>{module.bridgeNote}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── BOOKSHELF ──────────────────────────────────────────────────────────────
function BookShelf() {
  return (
    <div style={{marginTop:8}}>
      <SLabel>Currently Reading</SLabel>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {BOOKS.map((book,i) => (
          <div key={i} style={{background:"#111008",border:`1px solid ${book.color}22`,borderRadius:8,padding:"16px 20px",borderLeft:`3px solid ${book.color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:20}}>{book.emoji}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"#f0ece0"}}>{book.title}</div>
                  <div style={{fontSize:11,color:"#666",marginTop:2}}>{book.author}</div>
                </div>
              </div>
              <span style={{fontSize:12,color:book.color,fontWeight:700}}>{book.progress}%</span>
            </div>
            <div style={{background:"#1e1c14",borderRadius:2,height:4,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:2,width:`${book.progress}%`,background:book.color,transition:"width 0.8s ease"}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────────────────────────
export default function MaheePortfolio() {
  const [nav, setNav] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workTab, setWorkTab] = useState("projects");
  const [expandedProject, setExpandedProject] = useState(null);
  const [expandedPaper, setExpandedPaper] = useState(null);
  const [journeyTab, setJourneyTab] = useState("academics");
  const [teachTab, setTeachTab] = useState("courses");
  const [activePhase, setActivePhase] = useState(0);

  const goTo = (page) => { setNav(page); setMobileOpen(false); window.scrollTo(0,0); };

  const pages = {
    Home:    <HomePage setNav={goTo} />,
    About:   <AboutPage />,
    Work:    <WorkPage workTab={workTab} setWorkTab={setWorkTab} expandedProject={expandedProject} setExpandedProject={setExpandedProject} expandedPaper={expandedPaper} setExpandedPaper={setExpandedPaper} />,
    Life:    <LifePage />,
    Teach:   <TeachPage teachTab={teachTab} setTeachTab={setTeachTab} activePhase={activePhase} setActivePhase={setActivePhase} />,
    Journey: <JourneyPage journeyTab={journeyTab} setJourneyTab={setJourneyTab} />,
    Connect: <ConnectPage />,
  };

  return (
    <div className="grain" style={{minHeight:"100vh",background:"#0a0908",color:"#e8e0cc",fontFamily:"'Outfit',sans-serif",overflowX:"hidden"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse at 20% 10%,rgba(201,168,76,0.04) 0%,transparent 50%),radial-gradient(ellipse at 80% 90%,rgba(122,110,168,0.04) 0%,transparent 50%)"}}/>

      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,9,8,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid #c9a84c18",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
        <button onClick={() => goTo("Home")} style={{background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,letterSpacing:2,color:"#c9a84c"}}>M·A·H·E·E</button>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{display:"flex",gap:2,alignItems:"center"}}>
          {NAV.map(item => (
            <button key={item} onClick={() => goTo(item)} className={`nav-link ${nav===item?"active":""}`}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif",fontWeight:500,letterSpacing:1.5,padding:"6px 10px",color:nav===item?"#c9a84c":"#888",transition:"color 0.2s"}}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-menu-btn hamburger-btn" onClick={() => setMobileOpen(!mobileOpen)}
          style={{background:"none",border:"none",cursor:"pointer",color:"#c9a84c",fontSize:20,padding:"4px 8px",display:"flex",flexDirection:"column",gap:4}}>
          <div className="hamburger-line" style={{width:20,height:2,background:mobileOpen?"#c9a84c":"#888",transform:mobileOpen?"rotate(45deg) translate(4px,4px)":""}}/>
          <div className="hamburger-line" style={{width:20,height:2,background:"#888",opacity:mobileOpen?0:1}}/>
          <div className="hamburger-line" style={{width:20,height:2,background:mobileOpen?"#c9a84c":"#888",transform:mobileOpen?"rotate(-45deg) translate(4px,-4px)":""}}/>
        </button>
      </nav>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="mobile-nav" style={{position:"fixed",top:56,left:0,right:0,background:"rgba(10,9,8,0.98)",borderBottom:"1px solid #c9a84c22",zIndex:99,flexDirection:"column",padding:"8px 0",animation:"slideDown 0.3s ease"}}>
          {NAV.map((item,i) => (
            <button key={item} onClick={() => goTo(item)}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif",fontWeight:600,letterSpacing:2,padding:"14px 24px",color:nav===item?"#c9a84c":"#888",textAlign:"left",borderLeft:nav===item?"3px solid #c9a84c":"3px solid transparent",animation:`slideDown 0.3s ease ${i*0.05}s backwards`}}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div style={{position:"relative",zIndex:1}}>{pages[nav]}</div>
    </div>
  );
}

// ── HOME ───────────────────────────────────────────────────────────────────
function HomePage({ setNav }) {
  return (
    <div className="hero-pad" style={{minHeight:"calc(100vh - 56px)",display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 40px",maxWidth:1000,margin:"0 auto"}}>
      <div className="fade-up d2 hero-grid" style={{display:"grid",gridTemplateColumns:"minmax(0,1.4fr) 360px",gap:40,alignItems:"start",marginTop:32}}>
        <div>
          <div><SLabel>Mohammed Bin Ahmed</SLabel></div>
          <h1 className="hero-title" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(48px,10vw,100px)",fontWeight:300,letterSpacing:-1,lineHeight:0.95,margin:"12px 0 0",color:"#f0ece0"}}>
            Built from<br /><Gold>curiosity.</Gold><br />
            <span style={{fontStyle:"italic",color:"#c8b898"}}>Ruled by heart.</span>
          </h1>
          <p style={{maxWidth:520,fontSize:15,color:"#888",lineHeight:1.9,margin:"28px 0 0",fontWeight:300}}>
            Final year CSE at North South University. IoT & Cybersecurity. Builder of swarm robots, 5G security systems, and Linux login screens. Endlessly curious, annoyingly good at things he barely shows up for.
          </p>
          <div style={{display:"flex",gap:16,marginTop:32,flexWrap:"wrap"}}>
            <button onClick={() => setNav("Work")} style={{padding:"12px 28px",borderRadius:2,fontSize:12,fontWeight:600,letterSpacing:2,cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:"#c9a84c",color:"#0a0908",border:"none"}}>View Work</button>
            <a href="https://motriasclicks.netlify.app" target="_blank" rel="noopener noreferrer" style={{padding:"12px 28px",borderRadius:2,fontSize:12,fontWeight:600,letterSpacing:2,textDecoration:"none",border:"1px solid #c9a84c44",color:"#c9a84c",fontFamily:"'Outfit',sans-serif"}}>Photography →</a>
          </div>
        </div>
        <div className="hero-pfp" style={{display:"flex",justifyContent:"flex-end",width:"100%"}}>
          <div style={{position:"relative",width:"clamp(260px, 40vw, 340px)",height:"clamp(260px, 40vw, 340px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{position:"relative",width:"100%",height:"100%",borderRadius:999,overflow:"hidden",background:"#111008",border:"3px solid #c9a84c",display:"flex",alignItems:"center",justifyContent:"center",filter:"brightness(0.8)",boxShadow:"0 0 0 1px rgba(201,168,76,0.12)"}}>
              <img src="/profile.png" alt="Profile picture" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(1.08)"}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ABOUT ──────────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div className="page-pad" style={{maxWidth:860,margin:"0 auto",padding:"64px 32px"}}>
      <div className="fade-up d1"><SLabel>About</SLabel><STitle>Who is Mahee?</STitle></div>
      <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card className="fade-up d2 card-hover" style={{borderLeft:"2px solid #c9a84c"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,marginBottom:12,color:"#f0ece0"}}>The Person</div>
          <p style={{fontSize:13,color:"#999",lineHeight:1.9,margin:0}}>I'm Mohammed Bin Ahmed — people call me <Gold>Mahee</Gold>. Final year CSE at NSU, Dhaka. IoT, Networking, and Cybersecurity. Genuinely curious about everything — not as a personality trait, as a way of life. I read Dostoevsky, cook shawarma from scratch, photograph streets, and stay up thinking about how systems work.</p>
        </Card>
        <Card className="fade-up d3 card-hover" style={{borderLeft:"2px solid #7a6ea8"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,marginBottom:12,color:"#f0ece0"}}>The Real One</div>
          <p style={{fontSize:13,color:"#999",lineHeight:1.9,margin:0}}>My friends would say: happy, funny, always building something — and somehow perpetually napping and skipping class. What surprises people: <Gold>I show up where it counts.</Gold> Written papers, built robots, maintained a 3.25 CGPA while attending roughly half my lectures. Figure that one out.</p>
        </Card>
      </div>
      <Card className="fade-up d4 card-hover" style={{marginBottom:16}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,marginBottom:20,color:"#f0ece0"}}>Skills & Expertise</div>
        <div className="two-col" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20}}>
          {SKILLS.map(s => (
            <div key={s.g}>
              <div style={{fontSize:10,color:"#c9a84c",letterSpacing:2,fontWeight:600,marginBottom:10}}>{s.g.toUpperCase()}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{s.items.map(item => <span key={item} className="tag" style={{background:"#1e1c14",color:"#aaa",border:"1px solid #333"}}>{item}</span>)}</div>
            </div>
          ))}
        </div>
      </Card>
      <div className="four-col" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[{n:"131.5+",l:"Credits"},{n:"3.25",l:"CGPA"},{n:"4",l:"Papers"},{n:"1",l:"AWS Cert"}].map(s => (
          <Card key={s.l} className="card-hover" style={{textAlign:"center",padding:"20px 12px"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:600,color:"#c9a84c",lineHeight:1}}>{s.n}</div>
            <div style={{fontSize:11,color:"#666",marginTop:8,letterSpacing:1}}>{s.l}</div>
          </Card>
        ))}
      </div>
      <Card className="fade-up d5" style={{background:"linear-gradient(135deg,#1a1508,#0e0c08)",border:"1px solid #c9a84c33"}}>
        <div style={{fontSize:10,color:"#c9a84c",letterSpacing:3,fontWeight:600,marginBottom:12}}>CERTIFICATION</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#f0ece0"}}>AWS Cloud Foundations</div>
            <div style={{fontSize:12,color:"#888",marginTop:4}}>AWS Academy · North South University · 2024</div>
          </div>
          <span className="tag" style={{background:"#FF990022",color:"#FF9900",border:"1px solid #FF990044"}}>Completed</span>
        </div>
      </Card>
    </div>
  );
}

// ── WORK ───────────────────────────────────────────────────────────────────
function WorkPage({workTab,setWorkTab,expandedProject,setExpandedProject,expandedPaper,setExpandedPaper}) {
  return (
    <div className="page-pad" style={{maxWidth:860,margin:"0 auto",padding:"64px 32px"}}>
      <div className="fade-up d1"><SLabel>Work</SLabel><STitle>Projects & Papers</STitle></div>
      <div style={{display:"flex",gap:0,marginBottom:32,borderBottom:"1px solid #1e1c14",overflowX:"auto"}}>
        {["projects","papers","repos"].map(tab => (
          <button key={tab} className="tab-btn" onClick={() => setWorkTab(tab)}
            style={{color:workTab===tab?"#c9a84c":"#555",borderBottom:workTab===tab?"2px solid #c9a84c":"2px solid transparent",whiteSpace:"nowrap"}}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {workTab==="projects" && (
        <div className="fade-in">
          {PROJECTS.map((p,i) => (
            <div key={p.id} className={`fade-up card-hover d${i+2}`}
              onClick={() => setExpandedProject(expandedProject===p.id?null:p.id)}
              style={{background:"#111008",border:`1px solid ${expandedProject===p.id?p.color+"55":"#c9a84c22"}`,borderRadius:8,marginBottom:16,cursor:"pointer",overflow:"hidden",transition:"all 0.3s"}}>
              <div style={{padding:"24px 24px 20px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
                    <span style={{fontSize:20,color:p.color}}>{p.icon}</span>
                    <GoldTag color={p.color}>{p.status}</GoldTag>
                    <span className="tag" style={{background:"#1e1c14",color:"#888",border:"1px solid #333"}}>{p.course}</span>
                  </div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:"#f0ece0",marginBottom:2,lineHeight:1.2}}>{p.name}</div>
                  <div style={{fontSize:12,color:"#666",marginBottom:8,fontStyle:"italic"}}>{p.full}</div>
                  <div style={{fontSize:12,color:p.color,marginBottom:10}}>↳ {p.role}</div>
                  <p style={{fontSize:13,color:"#999",lineHeight:1.8,margin:0}}>{p.desc}</p>
                </div>
                <span style={{color:"#c9a84c",fontSize:16,flexShrink:0,marginTop:4}}>{expandedProject===p.id?"▲":"▼"}</span>
              </div>
              {expandedProject===p.id && (
                <div style={{padding:"0 24px 24px",borderTop:"1px solid #1e1c14"}}>
                  <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginTop:20}}>
                    <div>
                      <div style={{fontSize:10,color:p.color,letterSpacing:2,fontWeight:600,marginBottom:10}}>KEY HIGHLIGHTS</div>
                      {p.highlights.map((h,j) => <div key={j} style={{display:"flex",gap:10,fontSize:13,color:"#bbb",marginBottom:7,alignItems:"flex-start",lineHeight:1.6}}><span style={{color:p.color,flexShrink:0}}>→</span>{h}</div>)}
                    </div>
                    <div>
                      <div style={{fontSize:10,color:p.color,letterSpacing:2,fontWeight:600,marginBottom:10}}>TECH STACK</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>{p.tech.map(t => <GoldTag key={t} color={p.color}>{t}</GoldTag>)}</div>
                      <a href={p.github} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:p.color,letterSpacing:2,fontWeight:600,textDecoration:"none"}} onClick={e=>e.stopPropagation()}>VIEW ON GITHUB →</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {workTab==="papers" && (
        <div className="fade-in">
          <p style={{fontSize:13,color:"#888",lineHeight:1.8,marginBottom:24,borderLeft:"2px solid #c9a84c44",paddingLeft:16}}>Four papers across different courses. None published — written for faculty, learning, and the craft. The work is real regardless.</p>
          {PAPERS.map(p => (
            <div key={p.id} className="fade-up card-hover"
              onClick={() => setExpandedPaper(expandedPaper===p.id?null:p.id)}
              style={{background:"#111008",border:`1px solid ${expandedPaper===p.id?p.color+"55":"#c9a84c22"}`,borderRadius:8,marginBottom:14,cursor:"pointer",overflow:"hidden",transition:"all 0.3s"}}>
              <div style={{padding:"20px 22px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}><GoldTag color={p.color}>{p.status}</GoldTag><span className="tag" style={{background:"#1e1c14",color:"#888",border:"1px solid #333"}}>{p.course}</span></div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:"#f0ece0",lineHeight:1.4,marginBottom:8}}>{p.title}</div>
                  <p style={{fontSize:12,color:"#999",lineHeight:1.7,margin:0}}>{p.desc}</p>
                </div>
                <span style={{color:"#c9a84c",fontSize:14,flexShrink:0,marginTop:4}}>{expandedPaper===p.id?"▲":"▼"}</span>
              </div>
              {expandedPaper===p.id && (
                <div style={{padding:"0 22px 22px",borderTop:"1px solid #1e1c14"}}>
                  <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginTop:18}}>
                    <div>
                      <div style={{fontSize:10,color:p.color,letterSpacing:2,fontWeight:600,marginBottom:10}}>CONTRIBUTIONS</div>
                      {p.contributions.map((c,j) => <div key={j} style={{display:"flex",gap:8,fontSize:12,color:"#bbb",marginBottom:7,alignItems:"flex-start",lineHeight:1.6}}><span style={{color:p.color,flexShrink:0}}>→</span>{c}</div>)}
                    </div>
                    <div>
                      <div style={{fontSize:10,color:p.color,letterSpacing:2,fontWeight:600,marginBottom:10}}>RESULTS</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        {p.results.map(r => <div key={r.label} style={{background:"#1e1c14",borderRadius:6,padding:"10px 12px"}}><div style={{fontSize:10,color:"#888",letterSpacing:1}}>{r.label}</div><div style={{fontSize:14,fontWeight:700,color:p.color,marginTop:3}}>{r.val}</div></div>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {workTab==="repos" && (
        <div className="fade-in">
          <p style={{fontSize:13,color:"#888",lineHeight:1.8,marginBottom:24,borderLeft:"2px solid #c9a84c44",paddingLeft:16}}>Everything else on GitHub — coursework, experiments, and a few things built purely for the love of it.</p>
          <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {OTHER_REPOS.map(r => (
              <a key={r.name} href={r.github} target="_blank" rel="noopener noreferrer" className="card-hover"
                style={{background:"#111008",border:`1px solid ${r.color}22`,borderRadius:8,padding:"20px",textDecoration:"none",display:"block",borderTop:`2px solid ${r.color}`}}>
                <div style={{fontSize:13,fontWeight:700,color:"#f0ece0",marginBottom:8}}>{r.name}</div>
                <div style={{fontSize:12,color:"#888",lineHeight:1.7}}>{r.desc}</div>
                <div style={{fontSize:10,color:r.color,letterSpacing:1.5,fontWeight:600,marginTop:12}}>GITHUB →</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── LIFE ───────────────────────────────────────────────────────────────────
function LifePage() {
  return (
    <div className="page-pad" style={{maxWidth:860,margin:"0 auto",padding:"64px 32px"}}>
      <div className="fade-up d1"><SLabel>Beyond the Code</SLabel><STitle>Life</STitle></div>
      <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {LIFE_CARDS.map((s,i) => (
          <div key={s.title} className={`fade-up card-hover d${Math.min(i+2,6)}`}
            style={{background:"#111008",border:`1px solid ${s.color}22`,borderRadius:8,padding:"22px",borderTop:`2px solid ${s.color}`}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
              <span style={{color:s.color,fontSize:20}}>{s.icon}</span>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#f0ece0"}}>{s.title}</div>
            </div>
            {s.items.map((item,j) => <div key={j} style={{marginBottom:7}}><div style={{fontSize:13,color:"#ccc",fontWeight:500}}>{item.l}</div><div style={{fontSize:11,color:"#666",marginTop:1}}>{item.s}</div></div>)}
            <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #1e1c14",fontSize:12,color:"#777",lineHeight:1.7,fontStyle:"italic"}}>{s.note}</div>
            {s.link && <a href={s.link.href} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:10,fontSize:10,color:s.color,letterSpacing:2,fontWeight:600,textDecoration:"none"}}>{s.link.label}</a>}
          </div>
        ))}
      </div>

      <Divider />
      <BookShelf />

      <Divider />
      <div className="fade-up" style={{background:"linear-gradient(135deg,#111008,#0e0c08)",border:"1px solid #c9a84c44",borderRadius:8,padding:"32px",textAlign:"center"}}>
        <div style={{fontSize:10,color:"#c9a84c",letterSpacing:4,fontWeight:600,marginBottom:12}}>COMING SOON</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:"#f0ece0",marginBottom:10}}>A Teaching Channel</div>
        <p style={{fontSize:13,color:"#888",lineHeight:1.8,maxWidth:480,margin:"0 auto"}}>
          Networking concepts explained clearly. Fun facts collected from years of curiosity. The things I wish someone had taught me earlier.
          <br /><span style={{color:"#c9a84c55",fontStyle:"italic"}}>Name TBD. Watch this space.</span>
        </p>
      </div>
    </div>
  );
}

// ── TEACH ──────────────────────────────────────────────────────────────────
function TeachPage({teachTab,setTeachTab,activePhase,setActivePhase}) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [transitionKey, setTransitionKey] = useState("courses-list");
  const phase = SYLLABUS_PHASES[activePhase];
  const total = SYLLABUS_PHASES.reduce((s,p) => s+p.modules.length,0);
  const course = TEACH_COURSES.find(c => c.id === selectedCourse);

  return (
    <div className="page-pad" style={{maxWidth:860,margin:"0 auto",padding:"64px 32px"}}>
      <div className="fade-up d1"><SLabel>Knowledge</SLabel><STitle>Teach</STitle></div>

      <div style={{display:"flex",gap:0,marginBottom:32,borderBottom:"1px solid #1e1c14",overflowX:"auto"}}>
        {["courses","daily fact"].map(tab => (
          <button key={tab} className="tab-btn" onClick={() => setTeachTab(tab)}
            style={{color:teachTab===tab?"#c9a84c":"#555",borderBottom:teachTab===tab?"2px solid #c9a84c":"2px solid transparent",whiteSpace:"nowrap"}}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {teachTab==="daily fact" && (
        <div className="fade-in">
          <p style={{fontSize:13,color:"#888",lineHeight:1.8,marginBottom:24,borderLeft:"2px solid #c9a84c44",paddingLeft:16}}>
            One research-backed fact from any field. Updated daily. Generated fresh every morning so it's always something new.
          </p>
          <DailyFactWidget />
        </div>
      )}

      {teachTab==="courses" && (
        <div className={`fade-in ${selectedCourse?"slide-in-left":"slide-in-right"}`} key={transitionKey}>
          {!selectedCourse && (
            <>
              <p style={{fontSize:13,color:"#888",lineHeight:1.8,marginBottom:24,borderLeft:"2px solid #c9a84c44",paddingLeft:16}}>
                This page shows the teaching courses. Click a course card to open the full course content currently represented by the syllabus.
              </p>
              <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {TEACH_COURSES.map((c,i) => (
                  <div key={c.id} className={`fade-up slide-in-right card-hover d${Math.min(i+2,6)}`} style={{background:"#111008",border:`1px solid ${c.color}22`,borderRadius:8,padding:"24px",borderTop:`3px solid ${c.color}`,cursor:"pointer"}} onClick={() => { setSelectedCourse(c.id); setTransitionKey(`course-${c.id}`); }}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap",marginBottom:14}}>
                      <div style={{minWidth:0,flex:1}}>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#f0ece0",marginBottom:6}}>{c.title}</div>
                        <div style={{fontSize:12,color:"#666"}}>{c.subtitle}</div>
                      </div>
                    </div>
                    <p style={{fontSize:13,color:"#999",lineHeight:1.8,margin:"0 0 18px"}}>{c.description}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {c.highlights.map(item => <span key={item} className="tag" style={{background:"#1e1c14",color:"#aaa",border:"1px solid #333"}}>{item}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedCourse && course && (
            <>
              <button onClick={() => { setSelectedCourse(null); setTransitionKey("courses-list"); }}
                style={{marginBottom:24,padding:"10px 18px",borderRadius:4,border:"1px solid #c9a84c22",background:"transparent",color:"#c9a84c",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:700,letterSpacing:1}}>
                ← Back to courses
              </button>
              <Card style={{background:"linear-gradient(135deg,#1a1508,#0e0c08)",border:"1px solid #c9a84c44",marginBottom:24}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:"clamp(20px,4vw,32px)",color:"#f0ece0",marginBottom:4}}>{course.title}</div>
                <div style={{fontSize:12,color:"#888",marginBottom:20}}>{course.subtitle}</div>
                <div className="stats-row" style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                  {[{l:"Total Modules",v:String(total)},{l:"Phase 1",v:"20 modules · 3 mo"},{l:"Phase 2",v:"19 modules · 3 mo"},{l:"Weekly Pace",v:"3–5 hrs"},{l:"Cert Targets",v:"Net+, Sec+, CEH, OSCP"}].map(s => (
                    <div key={s.l}>
                      <div style={{fontSize:10,color:"#666",letterSpacing:2,textTransform:"uppercase"}}>{s.l}</div>
                      <div style={{fontSize:13,color:"#c9a84c",fontWeight:700,marginTop:3}}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="phase-btns" style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap"}}>
                {SYLLABUS_PHASES.map((p,i) => (
                  <button key={p.id} onClick={() => setActivePhase(i)}
                    style={{background:activePhase===i?p.color:"transparent",color:activePhase===i?"#000":p.color,border:`1px solid ${p.color}`,padding:"8px 20px",borderRadius:4,fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,cursor:"pointer",transition:"all 0.15s",flex:"1 1 auto"}}>
                    {p.label}: {p.title}
                  </button>
                ))}
              </div>
              <div style={{marginBottom:20}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:24,color:phase.color}}>{phase.title}</div>
                <div style={{fontSize:11,color:"#666",marginTop:4}}>{phase.duration}</div>
              </div>
              {phase.modules.map(m => <ModuleCard key={m.id} module={m} phaseColor={phase.color} />)}
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:20,paddingTop:20,borderTop:"1px solid #1e1c14"}}>
                <GoldTag color="#ff9900">⚡ Bridge to cybersecurity</GoldTag>
                <GoldTag color="#a855f7">🎓 Cert alignment</GoldTag>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── JOURNEY ────────────────────────────────────────────────────────────────
function JourneyPage({journeyTab,setJourneyTab}) {
  return (
    <div className="page-pad" style={{maxWidth:860,margin:"0 auto",padding:"64px 32px"}}>
      <div className="fade-up d1"><SLabel>Ongoing</SLabel><STitle>The Journey</STitle></div>
      <div style={{display:"flex",gap:0,marginBottom:32,borderBottom:"1px solid #1e1c14",overflowX:"auto"}}>
        {["academics","transformation"].map(tab => (
          <button key={tab} className="tab-btn" onClick={() => setJourneyTab(tab)}
            style={{color:journeyTab===tab?"#c9a84c":"#555",borderBottom:journeyTab===tab?"2px solid #c9a84c":"2px solid transparent",whiteSpace:"nowrap"}}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {journeyTab==="academics" && (
        <div className="fade-in">
          <Card style={{background:"linear-gradient(135deg,#1a1508,#0e0c08)",border:"1px solid #c9a84c44",marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
              <div>
                <div style={{fontSize:10,color:"#c9a84c",letterSpacing:3,fontWeight:600,marginBottom:4}}>CURRENT SEMESTER</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#f0ece0"}}>Summer 2026 — Final</div>
              </div>
              <GoldTag color="#6aa86a">In Progress</GoldTag>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {CURRENT_COURSES.map(c => (
                <div key={c.code} style={{display:"flex",alignItems:"center",gap:12,background:"#111008",borderRadius:6,padding:"10px 14px",flexWrap:"wrap"}}>
                  <span className="tag" style={{background:c.note==="Hardest"?"#c85a5a22":c.note==="Final project"||c.note==="Research"?"#c9a84c22":"#1e1c14",color:c.note==="Hardest"?"#c85a5a":c.note==="Final project"||c.note==="Research"?"#c9a84c":"#888",border:`1px solid ${c.note==="Hardest"?"#c85a5a33":c.note==="Final project"||c.note==="Research"?"#c9a84c33":"#333"}`,minWidth:64,textAlign:"center"}}>{c.code}</span>
                  <div style={{flex:1,minWidth:120}}>
                    <div style={{fontSize:13,color:"#ccc",fontWeight:500}}>{c.title}</div>
                    <div style={{fontSize:11,color:"#666",marginTop:1}}>{c.day!=="—"?`${c.day} · ${c.time}`:c.time} · {c.faculty}</div>
                  </div>
                  {c.note&&<span style={{fontSize:10,color:c.note==="Hardest"?"#c85a5a":"#c9a84c88",fontWeight:600,letterSpacing:1}}>{c.note.toUpperCase()}</span>}
                </div>
              ))}
            </div>
          </Card>
          <div className="three-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
            {[{n:"3.25",l:"CGPA",c:"#c9a84c"},{n:"131.5+",l:"Credits",c:"#f0ece0"},{n:"Final",l:"Semester",c:"#6aa86a"}].map(s => (
              <Card key={s.l} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:600,color:s.c,lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:11,color:"#666",marginTop:8,letterSpacing:1}}>{s.l}</div>
              </Card>
            ))}
          </div>
          {ACADEMICS.map((s,i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:"1px solid #1a1814"}}>
              <div style={{minWidth:110,fontSize:12,color:"#888"}}>{s.sem}</div>
              <div style={{flex:1,background:"#1e1c14",borderRadius:2,height:5,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:2,width:`${(s.gpa/4)*100}%`,background:s.gpa>=3.5?"#6aa86a":s.gpa>=3.0?"#c9a84c":"#c85a5a"}}/>
              </div>
              <div style={{minWidth:36,fontSize:13,fontWeight:600,color:s.gpa>=3.5?"#6aa86a":s.gpa>=3.0?"#c9a84c":"#c85a5a"}}>{s.gpa}</div>
              {s.highlight&&<span className="tag" style={{background:"#1e1c14",color:"#888",border:"1px solid #333"}}>{s.highlight}</span>}
            </div>
          ))}
          <div style={{marginTop:18,fontSize:12,color:"#666",lineHeight:1.8,fontStyle:"italic",borderLeft:"2px solid #c9a84c44",paddingLeft:16}}>
            Not a perfect record — a real one. Physics twice. A D in Engineering Economics. A tough Fall 2025. Still here, still building. The best semester (3.85) came right after the grind. That's the pattern.
          </div>
        </div>
      )}

      {journeyTab==="transformation" && (
        <div className="fade-in">
          <Card style={{background:"linear-gradient(135deg,#1a1508,#0e0c08)",border:"1px solid #c9a84c44",marginBottom:20}}>
            <div style={{fontSize:10,color:"#c9a84c",letterSpacing:4,fontWeight:600,marginBottom:12}}>THE LIFESTYLE</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:"#f0ece0",marginBottom:10}}>Physical & Mental Transformation</div>
            <p style={{fontSize:13,color:"#999",lineHeight:1.9,margin:0}}>
              No gym. No equipment. No excuses. Fajr at 4:45 AM, bodyweight training, homemade food, and the decision to become the person I've been putting off becoming. Built around 5 daily prayers, NSU schedule, and 90-minute ultradian cycles. This isn't a 90-day challenge — it's a permanent way of living.
            </p>
          </Card>
          <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {[
              {day:"SUN",focus:"Chest & Triceps",color:"#e05c2a"},
              {day:"MON",focus:"Back & Biceps",color:"#5b8fa8"},
              {day:"TUE",focus:"Legs & Glutes",color:"#9b6ec8"},
              {day:"WED",focus:"Shoulders & Arms",color:"#c9a84c"},
              {day:"THU",focus:"Core & Six Pack",color:"#6aab6a"},
              {day:"FRI",focus:"Full Body HIIT",color:"#c85a5a"},
              {day:"SAT",focus:"Active Recovery",color:"#888"},
            ].map(d => (
              <div key={d.day} style={{background:"#111008",border:`1px solid ${d.color}22`,borderRadius:8,padding:"14px 18px",borderLeft:`3px solid ${d.color}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,fontWeight:700,color:d.color,letterSpacing:1}}>{d.day}</span>
                <span style={{fontSize:13,color:"#ccc"}}>{d.focus}</span>
              </div>
            ))}
          </div>
          {[
            {n:"01",title:"Month 1",sub:"Foundation",items:["Stay up after Fajr — the keystone habit","Master form before chasing reps","Cut sugared tea from 10 cups to 6","Hit the plate method at lunch daily","Drink 3L water daily"]},
            {n:"02",title:"Month 2",sub:"Building",items:["Increase reps/sets 20% from Month 1","Add resistance: backpack, heavier bottles","Reduce tea sugar to 0.5 tsp","80% clean eating","Weekly progress photos every Sunday"]},
            {n:"03",title:"Month 3",sub:"Shredding",items:["Push last set to failure every session","90% clean eating — no negotiation","Add cardio 3x/week","Tea fully unsweetened","3.5L water daily"]},
          ].map(p => (
            <div key={p.n} style={{display:"flex",gap:16,marginBottom:14,alignItems:"flex-start"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,color:"#c9a84c",minWidth:40,lineHeight:1,marginTop:4}}>{p.n}</div>
              <Card style={{flex:1,padding:"18px 20px"}}>
                <div style={{fontSize:10,color:"#888",letterSpacing:2,fontWeight:600}}>{p.sub.toUpperCase()}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:"#f0ece0",margin:"4px 0 12px"}}>{p.title}</div>
                {p.items.map((item,j) => <div key={j} style={{display:"flex",gap:8,fontSize:12,color:"#999",marginBottom:6,alignItems:"flex-start"}}><span style={{color:"#c9a84c",flexShrink:0}}>→</span>{item}</div>)}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CONNECT ────────────────────────────────────────────────────────────────
function ConnectPage() {
  return (
    <div className="page-pad" style={{maxWidth:860,margin:"0 auto",padding:"64px 32px"}}>
      <div className="fade-up d1"><SLabel>Say Hello</SLabel><STitle>Connect</STitle></div>
      <Card className="fade-up d2" style={{background:"linear-gradient(135deg,#111008,#0e0c08)",border:"1px solid #c9a84c44",marginBottom:28,textAlign:"center",padding:"32px 24px"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:300,fontStyle:"italic",color:"#c8b898",marginBottom:12}}>"Built from curiosity. Ruled by heart."</div>
        <p style={{fontSize:13,color:"#888",maxWidth:460,margin:"0 auto",lineHeight:1.9}}>Whether it's about my projects, networking, cybersecurity, a book recommendation, anime, or just wanting to talk — reach out. I reply.</p>
      </Card>
      <div className="connect-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {CONNECT_LINKS.map((l,i) => (
          <a key={l.label} href={l.href} target={l.href.startsWith("mailto")?"_self":"_blank"} rel="noopener noreferrer"
            className={`fade-up card-hover d${Math.min(i+3,6)}`}
            style={{background:"#111008",border:`1px solid ${l.color}22`,borderRadius:8,padding:"20px",textDecoration:"none",display:"block",borderTop:`2px solid ${l.color}`}}>
            <div style={{color:l.color,fontSize:20,marginBottom:8,fontWeight:700}}>{l.icon}</div>
            <div style={{fontSize:14,fontWeight:600,color:"#f0ece0",marginBottom:3}}>{l.label}</div>
            <div style={{fontSize:11,color:"#666"}}>{l.desc}</div>
          </a>
        ))}
      </div>
      <div className="fade-up" style={{marginTop:48,textAlign:"center",fontSize:10,color:"#333",letterSpacing:3,fontWeight:500}}>
        MOHAMMED BIN AHMED · DHAKA, BANGLADESH · BSCSE · NSU · 2026
      </div>
    </div>
  );
}