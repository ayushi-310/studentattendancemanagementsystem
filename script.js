// console.log("this is a text ");
// const user={
//     name: "ayushi",
//     age: 20,
//     city: "vidisha"
// }
// console.log(user.name);
// console.log(user.age);
// console.log(user.city);
// console.log(user);
// const user2={...user};
// user2.name="ram";
// console.log(user2);
// function greet(name){
//     console.log(`hi ${name} . how are you?`);
// }
// greet("ayushi");
// greet("mohan");
// greet("kumud");
// const greet=(name)=>{
//      console.log(`hi ${name} . how are you?`);
// }
// greet("ayushi");
// greet("mohan");
// greet("kumud");
// function add(num1,num2){
//     let num=num1+num2;
//     console.log(`the addition of ${num1} and ${num2} is ${num} `);
// }

// add(2,4);
// add(93,7);
// add(12,12);
// const greet=()=>{
//     return{
//         name: "ayushi",
//         age: 20
//     }
// }
// const obj=greet();
// console.log(obj);
// const square=(num)=>num*num;
// let nums=square(7);
// console.log(nums);
// let user = {
//   name: "Ayu",
//   age: 20
// };
// const { name, age } = user;
// console.log(name,age);
/* ==========================================================================
   ATTENDLY — script.js
   All app logic: auth, validation, CRUD, attendance, stats, canvas charts.
   Data persistence: localStorage only.
   ========================================================================== */

(function () {
  "use strict";

  /* ========================================================================
     STORAGE KEYS + SEED DATA
     ====================================================================== */
  const KEYS = {
    students: "attendly_students",
    teachers: "attendly_teachers",
    attendance: "attendly_attendance",
    session: "attendly_session",
    theme: "attendly_theme",
    activity: "attendly_activity",
  };

  function seedIfEmpty() {
    if (!localStorage.getItem(KEYS.students)) {
      const students = [
        { id: "s1", name: "Aarav Sharma", age: 19, email: "student@attendly.edu", phone: "9876543210", className: "BCA - 2nd Year", password: "stud123" },
        { id: "s2", name: "Diya Patel", age: 20, email: "diya@attendly.edu", phone: "9876543211", className: "BCA - 2nd Year", password: "stud123" },
        { id: "s3", name: "Rohan Mehta", age: 19, email: "rohan@attendly.edu", phone: "9876543212", className: "BCA - 2nd Year", password: "stud123" },
        { id: "s4", name: "Ishita Rao", age: 21, email: "ishita@attendly.edu", phone: "9876543213", className: "BSc CS - 3rd Year", password: "stud123" },
        { id: "s5", name: "Karan Gupta", age: 21, email: "karan@attendly.edu", phone: "9876543214", className: "BSc CS - 3rd Year", password: "stud123" },
      ];
      localStorage.setItem(KEYS.students, JSON.stringify(students));
    }
    if (!localStorage.getItem(KEYS.teachers)) {
      const teachers = [
        { id: "t1", name: "Neha Verma", age: 34, email: "teacher@attendly.edu", phone: "9123456780", subject: "Data Structures", password: "teach123" },
        { id: "t2", name: "Sameer Khan", age: 41, email: "sameer@attendly.edu", phone: "9123456781", subject: "Operating Systems", password: "teach123" },
      ];
      localStorage.setItem(KEYS.teachers, JSON.stringify(teachers));
    }
    if (!localStorage.getItem(KEYS.attendance)) {
      const att = [];
      const today = new Date();
      const classes = ["BCA - 2nd Year", "BSc CS - 3rd Year"];
      const studentsByClass = {
        "BCA - 2nd Year": ["s1", "s2", "s3"],
        "BSc CS - 3rd Year": ["s4", "s5"],
      };
      const names = { s1: "Aarav Sharma", s2: "Diya Patel", s3: "Rohan Mehta", s4: "Ishita Rao", s5: "Karan Gupta" };
      for (let d = 6; d >= 0; d--) {
        const date = new Date(today);
        date.setDate(today.getDate() - d);
        const dateStr = toDateStr(date);
        classes.forEach((cls) => {
          studentsByClass[cls].forEach((sid) => {
            const present = Math.random() > 0.22;
            att.push({
              id: "a_" + dateStr + "_" + sid,
              studentId: sid,
              studentName: names[sid],
              className: cls,
              date: dateStr,
              status: present ? "Present" : "Absent",
              markedBy: "Neha Verma",
            });
          });
        });
      }
      localStorage.setItem(KEYS.attendance, JSON.stringify(att));
    }
    if (!localStorage.getItem(KEYS.activity)) {
      localStorage.setItem(KEYS.activity, JSON.stringify([
        { text: "System initialized with demo data", time: Date.now() - 1000 * 60 * 60 },
      ]));
    }
  }

  /* ========================================================================
     SMALL UTILS
     ====================================================================== */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function readJSON(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (e) { return []; }
  }
  function writeJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  function toDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function formatDatePretty(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }
  function timeAgo(ts) {
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);
    if (min < 1) return "just now";
    if (min < 60) return min + "m ago";
    const hr = Math.floor(min / 60);
    if (hr < 24) return hr + "h ago";
    const day = Math.floor(hr / 24);
    return day + "d ago";
  }
  function initials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  }
  function uid(prefix) { return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function logActivity(text) {
    const list = readJSON(KEYS.activity);
    list.unshift({ text, time: Date.now() });
    writeJSON(KEYS.activity, list.slice(0, 30));
  }

  function showToast(message, isError) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.toggle("error", !!isError);
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  /* ========================================================================
     VALIDATION
     ====================================================================== */
  const Validators = {
    name(value) {
      const v = value.trim();
      if (!v) return "Name is required.";
      if (!/^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(v)) return "Only alphabets, spaces and . ' - are allowed.";
      return "";
    },
    age(value) {
      const v = value.trim();
      if (!v) return "Age is required.";
      if (!/^\d+$/.test(v)) return "Only numbers are allowed.";
      const n = Number(v);
      if (n < 5 || n > 100) return "Age must be between 5 and 100.";
      return "";
    },
    email(value, existingEmails) {
      const v = value.trim();
      if (!v) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email address.";
      if (existingEmails && existingEmails.includes(v.toLowerCase())) return "This email is already in use.";
      return "";
    },
    phone(value) {
      const v = value.trim();
      if (!v) return "Phone number is required.";
      if (!/^\d{10}$/.test(v)) return "Phone number must be exactly 10 digits.";
      return "";
    },
    requiredText(value, label) {
      if (!value.trim()) return `${label} is required.`;
      return "";
    },
    password(value) {
      if (!value.trim()) return "Password is required.";
      if (value.trim().length < 6) return "Password must be at least 6 characters.";
      return "";
    },
  };

  function setFieldState(inputEl, errorEl, message) {
    const fieldWrap = inputEl.closest(".field");
    errorEl.textContent = message;
    if (fieldWrap) {
      fieldWrap.classList.toggle("invalid", !!message);
      fieldWrap.classList.toggle("valid", !message && inputEl.value.trim() !== "");
    }
  }

  // Attach live validation to an input
  function liveValidate(inputId, errorId, validatorFn) {
    const input = $("#" + inputId);
    const err = $("#" + errorId);
    if (!input || !err) return;
    const run = () => {
      const msg = validatorFn(input.value);
      setFieldState(input, err, msg);
      return msg;
    };
    input.addEventListener("input", run);
    input.addEventListener("blur", run);
    return run;
  }

  /* ========================================================================
     THEME
     ====================================================================== */
  function initTheme() {
    const saved = localStorage.getItem(KEYS.theme) || "light";
    document.documentElement.setAttribute("data-theme", saved);
  }
  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(KEYS.theme, next);
    // redraw charts so canvas colors match new theme
    if (window.__attendlyRedraw) window.__attendlyRedraw();
  }

  /* ========================================================================
     SESSION / AUTH
     ====================================================================== */
  function getSession() {
    try { return JSON.parse(localStorage.getItem(KEYS.session)); }
    catch (e) { return null; }
  }
  function setSession(sess) { localStorage.setItem(KEYS.session, JSON.stringify(sess)); }
  function clearSession() { localStorage.removeItem(KEYS.session); }

  const HARDCODED_ADMIN = { email: "admin@attendly.edu", password: "admin123", name: "System Admin" };

  function login(role, email, password) {
    email = email.trim().toLowerCase();
    password = password.trim();

    if (role === "admin") {
      if (email === HARDCODED_ADMIN.email && password === HARDCODED_ADMIN.password) {
        return { ok: true, user: { id: "admin", name: HARDCODED_ADMIN.name, email, role: "admin" } };
      }
      return { ok: false, message: "Invalid admin email or password." };
    }

    if (role === "teacher") {
      const teachers = readJSON(KEYS.teachers);
      const found = teachers.find(t => t.email.toLowerCase() === email);
      if (!found) return { ok: false, message: "No teacher account with that email." };
      if (found.password !== password) return { ok: false, message: "Incorrect password." };
      return { ok: true, user: { id: found.id, name: found.name, email: found.email, role: "teacher" } };
    }

    if (role === "student") {
      const students = readJSON(KEYS.students);
      const found = students.find(s => s.email.toLowerCase() === email);
      if (!found) return { ok: false, message: "No student account with that email." };
      if (found.password !== password) return { ok: false, message: "Incorrect password." };
      return { ok: true, user: { id: found.id, name: found.name, email: found.email, role: "student" } };
    }
    return { ok: false, message: "Unknown role." };
  }

  /* ========================================================================
     ROLE NAV CONFIG
     ====================================================================== */
  const NAV_CONFIG = {
    admin: [
      { id: "admin-overview", label: "Overview", icon: iconGrid() },
      { id: "admin-students", label: "Students", icon: iconUsers() },
      { id: "admin-teachers", label: "Teachers", icon: iconTeacher() },
      { id: "admin-records", label: "All Records", icon: iconClipboard() },
    ],
    teacher: [
      { id: "teacher-mark", label: "Mark Attendance", icon: iconCheck() },
      { id: "teacher-records", label: "Records", icon: iconClipboard() },
      { id: "teacher-summary", label: "Summary", icon: iconChart() },
    ],
    student: [
      { id: "student-overview", label: "My Attendance", icon: iconGrid() },
    ],
  };
  function iconGrid() { return `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`; }
  function iconUsers() { return `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`; }
  function iconTeacher() { return `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M8 7h8M8 11h6"/></svg>`; }
  function iconClipboard() { return `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3h6v3H9z"/><path d="M9 11h6M9 15h6"/></svg>`; }
  function iconCheck() { return `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 12l2.5 2.5L16 9"/></svg>`; }
  function iconChart() { return `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-5 3 3 5-7"/></svg>`; }

  const PAGE_META = {
    "admin-overview": ["Dashboard overview", "Welcome back — here's how the institution is doing today."],
    "admin-students": ["Students", "Add, search, and manage every enrolled student."],
    "admin-teachers": ["Teachers", "Add, search, and manage teaching staff."],
    "admin-records": ["All attendance records", "Every entry logged across every class, filterable by date and status."],
    "teacher-mark": ["Mark attendance", "Pick a class and date, then mark every student present or absent."],
    "teacher-records": ["Attendance records", "Review and correct any previously saved entry."],
    "teacher-summary": ["Summary", "Your attendance-marking activity at a glance."],
    "student-overview": ["My attendance", "Your personal record, percentage, and history."],
  };

  /* ========================================================================
     APP STATE
     ====================================================================== */
  let currentUser = null;
  let activeViewId = null;

  /* ========================================================================
     INIT
     ====================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    seedIfEmpty();
    initTheme();
    bindThemeToggles();
    bindLoginScreen();
    bindSidebarToggle();
    bindLogout();
    setTodayChip();

    const session = getSession();
    if (session && session.role) {
      currentUser = session;
      enterApp();
    }
  });

  function setTodayChip() {
    const chip = $("#todayChip");
    if (chip) chip.textContent = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  }

  function bindThemeToggles() {
    $all("#themeToggle, #themeToggle2").forEach(btn => btn.addEventListener("click", toggleTheme));
  }

  /* ========================================================================
     LOGIN SCREEN BEHAVIOR
     ====================================================================== */
  let selectedRole = "admin";

  function bindLoginScreen() {
    $all(".role-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        $all(".role-pill").forEach(p => { p.classList.remove("active"); p.setAttribute("aria-selected", "false"); });
        pill.classList.add("active");
        pill.setAttribute("aria-selected", "true");
        selectedRole = pill.getAttribute("data-role");
      });
    });

    const idErr = $("#err-loginId");
    const passErr = $("#err-loginPass");
    liveValidate("loginId", "err-loginId", (v) => v.trim() ? "" : "Email is required.");
    liveValidate("loginPass", "err-loginPass", (v) => v.trim() ? "" : "Password is required.");

    $("#loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#loginId").value;
      const password = $("#loginPass").value;

      let hasError = false;
      if (!email.trim()) { setFieldState($("#loginId"), idErr, "Email is required."); hasError = true; }
      if (!password.trim()) { setFieldState($("#loginPass"), passErr, "Password is required."); hasError = true; }
      if (hasError) return;

      const result = login(selectedRole, email, password);
      if (!result.ok) {
        showToast(result.message, true);
        setFieldState($("#loginPass"), passErr, result.message);
        return;
      }
      currentUser = result.user;
      setSession(currentUser);
      logActivity(`${capitalize(currentUser.role)} ${currentUser.name} signed in`);
      showToast(`Welcome, ${currentUser.name.split(" ")[0]}!`);
      enterApp();
    });

    drawBrandRing();
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function drawBrandRing() {
    const canvas = $("#brandRing");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 32, cy = 32, r = 24;
    let progress = 0;
    const target = 0.83;
    function frame() {
      progress += 0.02;
      if (progress > target) progress = target;
      ctx.clearRect(0, 0, 64, 64);
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.strokeStyle = getCSSVar("--border-soft") || "rgba(0,0,0,0.1)";
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

      const grad = ctx.createLinearGradient(0, 0, 64, 64);
      grad.addColorStop(0, "#7c5cff");
      grad.addColorStop(1, "#4f8ef7");
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.stroke();

      if (progress < target) requestAnimationFrame(frame);
    }
    frame();
  }

  function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  /* ========================================================================
     ENTER APP / NAV RENDER
     ====================================================================== */
  function enterApp() {
    $("#loginScreen").hidden = true;
    $("#appShell").hidden = false;

    $("#sideAvatar").textContent = initials(currentUser.name);
    $("#sideUserName").textContent = currentUser.name;
    $("#sideUserRole").textContent = currentUser.role;

    renderNav();
    const firstView = NAV_CONFIG[currentUser.role][0].id;
    navigateTo(firstView);
  }

  function renderNav() {
    const nav = $("#sideNav");
    nav.innerHTML = "";
    NAV_CONFIG[currentUser.role].forEach(item => {
      const btn = document.createElement("button");
      btn.className = "nav-item";
      btn.dataset.view = item.id;
      btn.innerHTML = `${item.icon}<span>${item.label}</span>`;
      btn.addEventListener("click", () => navigateTo(item.id));
      nav.appendChild(btn);
    });
  }

  function navigateTo(viewId) {
    activeViewId = viewId;
    $all(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === viewId));
    $all(".view").forEach(v => v.hidden = (v.id !== "view-" + viewId));

    const meta = PAGE_META[viewId];
    if (meta) {
      $("#pageTitle").textContent = meta[0];
      $("#pageSubtitle").textContent = meta[1];
    }

    closeSidebar();
    renderView(viewId);
  }

  function renderView(viewId) {
    switch (viewId) {
      case "admin-overview": renderAdminOverview(); break;
      case "admin-students": renderAdminStudents(); break;
      case "admin-teachers": renderAdminTeachers(); break;
      case "admin-records": renderAdminRecords(); break;
      case "teacher-mark": renderTeacherMark(); break;
      case "teacher-records": renderTeacherRecords(); break;
      case "teacher-summary": renderTeacherSummary(); break;
      case "student-overview": renderStudentOverview(); break;
    }
  }

  /* ========================================================================
     SIDEBAR (mobile) TOGGLE
     ====================================================================== */
  function bindSidebarToggle() {
    $("#hamburger").addEventListener("click", openSidebar);
    $("#sidebarClose").addEventListener("click", closeSidebar);
    $("#sidebarOverlay").addEventListener("click", closeSidebar);
  }
  function openSidebar() {
    $("#sidebar").classList.add("open");
    $("#sidebarOverlay").classList.add("show");
  }
  function closeSidebar() {
    $("#sidebar").classList.remove("open");
    $("#sidebarOverlay").classList.remove("show");
  }

  /* ========================================================================
     LOGOUT
     ====================================================================== */
  function bindLogout() {
    $("#logoutBtn").addEventListener("click", () => {
      logActivity(`${capitalize(currentUser.role)} ${currentUser.name} signed out`);
      clearSession();
      currentUser = null;
      $("#appShell").hidden = true;
      $("#loginScreen").hidden = false;
      $("#loginForm").reset();
      $all(".field").forEach(f => f.classList.remove("invalid", "valid"));
      $all(".err").forEach(e => e.textContent = "");
    });
  }

  /* ========================================================================
     STATS CALCULATION (shared)
     ====================================================================== */
  function calculateStats(records) {
    const total = records.length;
    const present = records.filter(r => r.status === "Present").length;
    const absent = total - present;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, pct };
  }

  /* ========================================================================
     ADMIN: OVERVIEW
     ====================================================================== */
  function renderAdminOverview() {
    const students = readJSON(KEYS.students);
    const teachers = readJSON(KEYS.teachers);
    const attendance = readJSON(KEYS.attendance);
    const stats = calculateStats(attendance);

    animateNumber($("#statTotalStudents"), students.length);
    animateNumber($("#statTotalTeachers"), teachers.length);
    $("#statAttendancePct").textContent = stats.pct + "%";
    animateNumber($("#statTotalRecords"), attendance.length);

    renderActivity();
    drawTrendChart(attendance);
    drawCompositionChart(students.length, teachers.length);
  }

  function animateNumber(el, target) {
    if (!el) return;
    let start = 0;
    const duration = 700;
    const startTime = performance.now();
    function frame(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const val = Math.round(start + (target - start) * easeOutCubic(p));
      el.textContent = val;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }

  function renderActivity() {
    const list = $("#activityList");
    if (!list) return;
    const items = readJSON(KEYS.activity).slice(0, 8);
    list.innerHTML = items.length ? items.map(it => `
      <li>
        <span class="activity-dot"></span>
        <span class="activity-text">${escapeHTML(it.text)}</span>
        <span class="activity-time">${timeAgo(it.time)}</span>
      </li>
    `).join("") : `<li><span class="activity-text">No activity yet.</span></li>`;
  }

  /* ---- Canvas: 7-day trend (grouped bar) ---- */
  function drawTrendChart(attendance) {
    const canvas = $("#chartTrend");
    if (!canvas) return;
    setupCanvasDPR(canvas);
    const ctx = canvas.getContext("2d");

    // group by date, last 7 distinct dates present in data
    const byDate = {};
    attendance.forEach(r => {
      byDate[r.date] = byDate[r.date] || { present: 0, absent: 0 };
      if (r.status === "Present") byDate[r.date].present++; else byDate[r.date].absent++;
    });
    const dates = Object.keys(byDate).sort().slice(-7);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    ctx.clearRect(0, 0, W, H);

    if (dates.length === 0) {
      drawEmptyCanvasMsg(ctx, W, H, "No attendance data yet");
      return;
    }

    const maxVal = Math.max(1, ...dates.map(d => byDate[d].present + byDate[d].absent));
    const padL = 36, padB = 28, padT = 14, padR = 10;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const groupW = chartW / dates.length;
    const barW = Math.min(22, groupW * 0.3);

    const textColor = getCSSVar("--text-3") || "#888";
    const gridColor = getCSSVar("--border-soft") || "rgba(0,0,0,0.08)";
    const presentColor = getCSSVar("--success") || "#1aa179";
    const absentColor = getCSSVar("--danger") || "#e0445b";

    // gridlines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = textColor;
    for (let i = 0; i <= 4; i++) {
      const y = padT + chartH - (chartH * i) / 4;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
      const val = Math.round((maxVal * i) / 4);
      ctx.fillText(String(val), 4, y + 3);
    }

    dates.forEach((date, i) => {
      const groupX = padL + i * groupW + groupW / 2;
      const pVal = byDate[date].present;
      const aVal = byDate[date].absent;
      const pH = (pVal / maxVal) * chartH;
      const aH = (aVal / maxVal) * chartH;

      roundRectBar(ctx, groupX - barW - 3, padT + chartH - pH, barW, pH, presentColor);
      roundRectBar(ctx, groupX + 3, padT + chartH - aH, barW, aH, absentColor);

      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      const d = new Date(date + "T00:00:00");
      ctx.fillText(d.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" }), groupX, H - 8);
      ctx.textAlign = "left";
    });
  }

  function roundRectBar(ctx, x, y, w, h, color) {
    if (h <= 0) h = 0.001;
    const r = Math.min(4, w / 2);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
  }

  function drawEmptyCanvasMsg(ctx, W, H, msg) {
    ctx.fillStyle = getCSSVar("--text-3") || "#999";
    ctx.font = "13px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(msg, W / 2, H / 2);
    ctx.textAlign = "left";
  }

  function setupCanvasDPR(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssW = rect.width || canvas.clientWidth || 300;
    const cssH = parseInt(canvas.getAttribute("height") || "220", 10);
    canvas.style.height = cssH + "px";
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    Object.defineProperty(canvas, "clientWidth", { configurable: true, get() { return cssW; } });
    Object.defineProperty(canvas, "clientHeight", { configurable: true, get() { return cssH; } });
  }

  /* ---- Canvas: composition pie chart ---- */
  function drawCompositionChart(studentCount, teacherCount) {
    const canvas = $("#chartComposition");
    if (!canvas) return;
    setupCanvasDPR(canvas);
    const ctx = canvas.getContext("2d");
    const W = canvas.clientWidth, H = canvas.clientHeight;
    ctx.clearRect(0, 0, W, H);

    const total = studentCount + teacherCount;
    const legend = $("#compositionLegend");

    if (total === 0) {
      drawEmptyCanvasMsg(ctx, W, H, "No users yet");
      if (legend) legend.innerHTML = "";
      return;
    }

    const cx = W / 2, cy = H / 2;
    const r = Math.min(W, H) / 2 - 16;
    const data = [
      { label: "Students", value: studentCount, color: "#7c5cff" },
      { label: "Teachers", value: teacherCount, color: "#4f8ef7" },
    ];
    let startAngle = -Math.PI / 2;
    data.forEach(seg => {
      const angle = (seg.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + angle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      startAngle += angle;
    });

    // donut hole
    const bgColor = getCSSVar("--bg-1") || "#fff";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--glass-bg-strong") || bgColor;
    ctx.globalAlpha = 1;
    ctx.fill();

    ctx.fillStyle = getCSSVar("--text-1") || "#222";
    ctx.font = "700 20px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(total), cx, cy + 2);
    ctx.font = "11px Inter, sans-serif";
    ctx.fillStyle = getCSSVar("--text-3") || "#999";
    ctx.fillText("total users", cx, cy + 18);
    ctx.textAlign = "left";

    if (legend) {
      legend.innerHTML = data.map(d => `
        <span class="legend-item"><span class="legend-dot" style="background:${d.color}"></span>${d.label} (${d.value})</span>
      `).join("");
    }
  }

  /* ========================================================================
     ADMIN: STUDENTS
     ====================================================================== */
  function renderAdminStudents() {
    bindAddStudentForm();
    renderStudentsTable();
    const search = $("#studentSearch");
    if (search && !search._bound) {
      search._bound = true;
      search.addEventListener("input", renderStudentsTable);
    }
  }

  function bindAddStudentForm() {
    const form = $("#addStudentForm");
    if (form._bound) return;
    form._bound = true;

    liveValidate("stuName", "err-stuName", Validators.name);
    liveValidate("stuAge", "err-stuAge", Validators.age);
    liveValidate("stuEmail", "err-stuEmail", (v) => Validators.email(v, readJSON(KEYS.students).map(s => s.email.toLowerCase())));
    liveValidate("stuPhone", "err-stuPhone", Validators.phone);
    liveValidate("stuClass", "err-stuClass", (v) => Validators.requiredText(v, "Class"));
    liveValidate("stuPassword", "err-stuPassword", Validators.password);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      addStudent();
    });
  }

  function addStudent() {
    const name = $("#stuName").value;
    const age = $("#stuAge").value;
    const email = $("#stuEmail").value;
    const phone = $("#stuPhone").value;
    const className = $("#stuClass").value;
    const password = $("#stuPassword").value;

    const students = readJSON(KEYS.students);
    const existingEmails = students.map(s => s.email.toLowerCase());
    const teacherEmails = readJSON(KEYS.teachers).map(t => t.email.toLowerCase());

    const errors = {
      stuName: Validators.name(name),
      stuAge: Validators.age(age),
      stuEmail: Validators.email(email, existingEmails.concat(teacherEmails)),
      stuPhone: Validators.phone(phone),
      stuClass: Validators.requiredText(className, "Class"),
      stuPassword: Validators.password(password),
    };

    let hasError = false;
    Object.keys(errors).forEach(id => {
      const msg = errors[id];
      setFieldState($("#" + id), $("#err-" + id), msg);
      if (msg) hasError = true;
    });
    if (hasError) { showToast("Please fix the highlighted fields.", true); return; }

    const newStudent = {
      id: uid("s"),
      name: name.trim(),
      age: Number(age.trim()),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      className: className.trim(),
      password: password.trim(),
    };
    students.push(newStudent);
    writeJSON(KEYS.students, students);
    logActivity(`Admin added student "${newStudent.name}"`);
    showToast(`${newStudent.name} added successfully.`);

    $("#addStudentForm").reset();
    $all("#addStudentForm .field").forEach(f => f.classList.remove("invalid", "valid"));
    $all("#addStudentForm .err").forEach(e => e.textContent = "");

    renderStudentsTable();
  }

  function renderStudentsTable() {
    const tbody = $("#studentsTableBody");
    if (!tbody) return;
    const students = readJSON(KEYS.students);
    const attendance = readJSON(KEYS.attendance);
    const query = ($("#studentSearch") && $("#studentSearch").value || "").trim().toLowerCase();

    const filtered = students.filter(s =>
      !query || s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query) || s.className.toLowerCase().includes(query)
    );

    $("#studentCountSub").textContent = `${students.length} student${students.length === 1 ? "" : "s"} enrolled`;
    $("#studentsEmpty").hidden = filtered.length !== 0;

    tbody.innerHTML = filtered.map(s => {
      const records = attendance.filter(r => r.studentId === s.id);
      const stats = calculateStats(records);
      return `
        <tr>
          <td><div class="cell-name"><span class="mini-avatar">${initials(s.name)}</span>${escapeHTML(s.name)}</div></td>
          <td>${escapeHTML(s.className)}</td>
          <td>${escapeHTML(s.email)}</td>
          <td>${escapeHTML(s.phone)}</td>
          <td>${s.age}</td>
          <td>
            <div class="pct-bar-wrap">
              <div class="pct-bar-track"><div class="pct-bar-fill" style="width:${stats.pct}%"></div></div>
              <span class="pct-bar-num">${stats.pct}%</span>
            </div>
          </td>
          <td>
            <div class="row-actions">
              <button class="icon-btn" title="Delete student" data-delete-student="${s.id}">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    $all("[data-delete-student]").forEach(btn => {
      btn.addEventListener("click", () => deleteStudent(btn.getAttribute("data-delete-student")));
    });
  }

  function deleteStudent(id) {
    const students = readJSON(KEYS.students);
    const student = students.find(s => s.id === id);
    if (!student) return;
    if (!confirm(`Remove ${student.name}? This also deletes their attendance history.`)) return;

    writeJSON(KEYS.students, students.filter(s => s.id !== id));
    const attendance = readJSON(KEYS.attendance).filter(r => r.studentId !== id);
    writeJSON(KEYS.attendance, attendance);
    logActivity(`Admin removed student "${student.name}"`);
    showToast(`${student.name} removed.`);
    renderStudentsTable();
  }

  /* ========================================================================
     ADMIN: TEACHERS
     ====================================================================== */
  function renderAdminTeachers() {
    bindAddTeacherForm();
    renderTeachersTable();
    const search = $("#teacherSearch");
    if (search && !search._bound) {
      search._bound = true;
      search.addEventListener("input", renderTeachersTable);
    }
  }

  function bindAddTeacherForm() {
    const form = $("#addTeacherForm");
    if (form._bound) return;
    form._bound = true;

    liveValidate("teaName", "err-teaName", Validators.name);
    liveValidate("teaAge", "err-teaAge", Validators.age);
    liveValidate("teaEmail", "err-teaEmail", (v) => Validators.email(v, readJSON(KEYS.teachers).map(t => t.email.toLowerCase())));
    liveValidate("teaPhone", "err-teaPhone", Validators.phone);
    liveValidate("teaSubject", "err-teaSubject", (v) => Validators.requiredText(v, "Subject"));
    liveValidate("teaPassword", "err-teaPassword", Validators.password);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      addTeacher();
    });
  }

  function addTeacher() {
    const name = $("#teaName").value;
    const age = $("#teaAge").value;
    const email = $("#teaEmail").value;
    const phone = $("#teaPhone").value;
    const subject = $("#teaSubject").value;
    const password = $("#teaPassword").value;

    const teachers = readJSON(KEYS.teachers);
    const existingEmails = teachers.map(t => t.email.toLowerCase());
    const studentEmails = readJSON(KEYS.students).map(s => s.email.toLowerCase());

    const errors = {
      teaName: Validators.name(name),
      teaAge: Validators.age(age),
      teaEmail: Validators.email(email, existingEmails.concat(studentEmails)),
      teaPhone: Validators.phone(phone),
      teaSubject: Validators.requiredText(subject, "Subject"),
      teaPassword: Validators.password(password),
    };

    let hasError = false;
    Object.keys(errors).forEach(id => {
      const msg = errors[id];
      setFieldState($("#" + id), $("#err-" + id), msg);
      if (msg) hasError = true;
    });
    if (hasError) { showToast("Please fix the highlighted fields.", true); return; }

    const newTeacher = {
      id: uid("t"),
      name: name.trim(),
      age: Number(age.trim()),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      password: password.trim(),
    };
    teachers.push(newTeacher);
    writeJSON(KEYS.teachers, teachers);
    logActivity(`Admin added teacher "${newTeacher.name}"`);
    showToast(`${newTeacher.name} added successfully.`);

    $("#addTeacherForm").reset();
    $all("#addTeacherForm .field").forEach(f => f.classList.remove("invalid", "valid"));
    $all("#addTeacherForm .err").forEach(e => e.textContent = "");

    renderTeachersTable();
  }

  function renderTeachersTable() {
    const tbody = $("#teachersTableBody");
    if (!tbody) return;
    const teachers = readJSON(KEYS.teachers);
    const query = ($("#teacherSearch") && $("#teacherSearch").value || "").trim().toLowerCase();

    const filtered = teachers.filter(t =>
      !query || t.name.toLowerCase().includes(query) || t.email.toLowerCase().includes(query) || t.subject.toLowerCase().includes(query)
    );

    $("#teacherCountSub").textContent = `${teachers.length} teacher${teachers.length === 1 ? "" : "s"} on staff`;
    $("#teachersEmpty").hidden = filtered.length !== 0;

    tbody.innerHTML = filtered.map(t => `
      <tr>
        <td><div class="cell-name"><span class="mini-avatar">${initials(t.name)}</span>${escapeHTML(t.name)}</div></td>
        <td>${escapeHTML(t.subject)}</td>
        <td>${escapeHTML(t.email)}</td>
        <td>${escapeHTML(t.phone)}</td>
        <td>${t.age}</td>
        <td>
          <div class="row-actions">
            <button class="icon-btn" title="Delete teacher" data-delete-teacher="${t.id}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    $all("[data-delete-teacher]").forEach(btn => {
      btn.addEventListener("click", () => deleteTeacher(btn.getAttribute("data-delete-teacher")));
    });
  }

  function deleteTeacher(id) {
    const teachers = readJSON(KEYS.teachers);
    const teacher = teachers.find(t => t.id === id);
    if (!teacher) return;
    if (!confirm(`Remove ${teacher.name} from staff?`)) return;

    writeJSON(KEYS.teachers, teachers.filter(t => t.id !== id));
    logActivity(`Admin removed teacher "${teacher.name}"`);
    showToast(`${teacher.name} removed.`);
    renderTeachersTable();
  }

  /* ========================================================================
     ADMIN: ALL RECORDS
     ====================================================================== */
  function renderAdminRecords() {
    const dateInput = $("#adminRecordsDate");
    const statusSelect = $("#adminRecordsStatus");
    const clearBtn = $("#adminRecordsClear");

    if (!dateInput._bound) {
      dateInput._bound = true;
      dateInput.addEventListener("change", paintAdminRecords);
      statusSelect.addEventListener("change", paintAdminRecords);
      clearBtn.addEventListener("click", () => {
        dateInput.value = "";
        statusSelect.value = "all";
        paintAdminRecords();
      });
    }
    paintAdminRecords();
  }

  function paintAdminRecords() {
    const tbody = $("#adminRecordsBody");
    const attendance = readJSON(KEYS.attendance).slice().sort((a, b) => b.date.localeCompare(a.date));
    const dateFilter = $("#adminRecordsDate").value;
    const statusFilter = $("#adminRecordsStatus").value;

    const filtered = attendance.filter(r =>
      (!dateFilter || r.date === dateFilter) &&
      (statusFilter === "all" || r.status === statusFilter)
    );

    $("#adminRecordsEmpty").hidden = filtered.length !== 0;

    tbody.innerHTML = filtered.map(r => `
      <tr>
        <td>${formatDatePretty(r.date)}</td>
        <td>${escapeHTML(r.studentName)}</td>
        <td>${escapeHTML(r.className)}</td>
        <td>${escapeHTML(r.markedBy || "—")}</td>
        <td><span class="badge ${r.status === "Present" ? "badge-present" : "badge-absent"}">${r.status}</span></td>
      </tr>
    `).join("");
  }

  /* ========================================================================
     TEACHER: MARK ATTENDANCE
     ====================================================================== */
  let markState = {}; // studentId -> "Present"/"Absent"

  function renderTeacherMark() {
    const classInput = $("#markClassInput");
    const dateInput = $("#markDateInput");

    if (!dateInput.value) dateInput.value = toDateStr(new Date());
    if (!classInput.value) {
      const students = readJSON(KEYS.students);
      if (students.length) classInput.value = students[0].className;
    }

    if (!classInput._bound) {
      classInput._bound = true;
      classInput.addEventListener("input", paintMarkTable);
      dateInput.addEventListener("change", paintMarkTable);
      $("#markAllPresent").addEventListener("click", () => bulkMark("Present"));
      $("#markAllAbsent").addEventListener("click", () => bulkMark("Absent"));
      $("#saveAttendanceBtn").addEventListener("click", saveMarkedAttendance);
    }
    paintMarkTable();
  }

  function paintMarkTable() {
    const className = $("#markClassInput").value.trim();
    const date = $("#markDateInput").value;
    const students = readJSON(KEYS.students).filter(s =>
      !className || s.className.toLowerCase().includes(className.toLowerCase())
    );

    const existing = readJSON(KEYS.attendance).filter(r => r.date === date);
    markState = {};
    students.forEach(s => {
      const rec = existing.find(r => r.studentId === s.id);
      markState[s.id] = rec ? rec.status : "Present";
    });

    const tbody = $("#markTableBody");
    $("#markEmpty").hidden = students.length !== 0;

    tbody.innerHTML = students.map(s => `
      <tr data-student-row="${s.id}">
        <td><div class="cell-name"><span class="mini-avatar">${initials(s.name)}</span>${escapeHTML(s.name)}</div></td>
        <td>${escapeHTML(s.className)}</td>
        <td>
          <div class="status-toggle">
            <button type="button" class="status-btn present ${markState[s.id] === "Present" ? "active" : ""}" data-mark="${s.id}" data-status="Present">Present</button>
            <button type="button" class="status-btn absent ${markState[s.id] === "Absent" ? "active" : ""}" data-mark="${s.id}" data-status="Absent">Absent</button>
          </div>
        </td>
      </tr>
    `).join("");

    $all("[data-mark]").forEach(btn => {
      btn.addEventListener("click", () => {
        const sid = btn.getAttribute("data-mark");
        const status = btn.getAttribute("data-status");
        markState[sid] = status;
        const row = tbody.querySelector(`[data-student-row="${sid}"]`);
        row.querySelectorAll(".status-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-status") === status));
        updateMarkProgress(students.length);
      });
    });

    updateMarkProgress(students.length);
  }

  function updateMarkProgress(total) {
    const marked = Object.keys(markState).length;
    $("#markProgress").textContent = `${marked} / ${total} marked`;
  }

  function bulkMark(status) {
    $all("[data-mark]").forEach(btn => {
      const sid = btn.getAttribute("data-mark");
      markState[sid] = status;
    });
    paintMarkTableFromState();
  }

  function paintMarkTableFromState() {
    $all("[data-student-row]").forEach(row => {
      const sid = row.getAttribute("data-student-row");
      row.querySelectorAll(".status-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-status") === markState[sid]));
    });
  }

  function markAttendance(studentId, status, date, className, studentName, markedBy) {
    const attendance = readJSON(KEYS.attendance);
    const id = "a_" + date + "_" + studentId;
    const idx = attendance.findIndex(r => r.id === id);
    const record = { id, studentId, studentName, className, date, status, markedBy };
    if (idx >= 0) attendance[idx] = record; else attendance.push(record);
    writeJSON(KEYS.attendance, attendance);
    return record;
  }

  function saveMarkedAttendance() {
    const className = $("#markClassInput").value.trim();
    const date = $("#markDateInput").value;
    if (!className) { showToast("Enter a class name first.", true); return; }
    if (!date) { showToast("Select a date first.", true); return; }

    const students = readJSON(KEYS.students).filter(s =>
      s.className.toLowerCase().includes(className.toLowerCase())
    );
    if (students.length === 0) { showToast("No students found for that class.", true); return; }

    students.forEach(s => {
      const status = markState[s.id] || "Present";
      markAttendance(s.id, status, date, s.className, s.name, currentUser.name);
    });

    logActivity(`${currentUser.name} marked attendance for ${className} on ${formatDatePretty(date)}`);
    showToast(`Attendance saved for ${students.length} student${students.length === 1 ? "" : "s"}.`);
  }

  /* ========================================================================
     TEACHER: RECORDS (filter + inline edit)
     ====================================================================== */
  function renderTeacherRecords() {
    const dateInput = $("#teacherRecordsDate");
    const classInput = $("#teacherRecordsClass");
    const clearBtn = $("#teacherRecordsClear");

    if (!dateInput._bound) {
      dateInput._bound = true;
      dateInput.addEventListener("change", paintTeacherRecords);
      classInput.addEventListener("input", paintTeacherRecords);
      clearBtn.addEventListener("click", () => {
        dateInput.value = ""; classInput.value = "";
        paintTeacherRecords();
      });
    }
    paintTeacherRecords();
  }

  function paintTeacherRecords() {
    const tbody = $("#teacherRecordsBody");
    const dateFilter = $("#teacherRecordsDate").value;
    const classFilter = $("#teacherRecordsClass").value.trim().toLowerCase();

    const attendance = readJSON(KEYS.attendance).slice().sort((a, b) => b.date.localeCompare(a.date));
    const filtered = attendance.filter(r =>
      (!dateFilter || r.date === dateFilter) &&
      (!classFilter || r.className.toLowerCase().includes(classFilter))
    );

    $("#teacherRecordsEmpty").hidden = filtered.length !== 0;

    tbody.innerHTML = filtered.map(r => `
      <tr>
        <td>${formatDatePretty(r.date)}</td>
        <td>${escapeHTML(r.studentName)}</td>
        <td>${escapeHTML(r.className)}</td>
        <td><span class="badge ${r.status === "Present" ? "badge-present" : "badge-absent"}">${r.status}</span></td>
        <td>
          <button class="icon-btn edit-btn" title="Toggle status" data-toggle-record="${r.id}">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
          </button>
        </td>
      </tr>
    `).join("");

    $all("[data-toggle-record]").forEach(btn => {
      btn.addEventListener("click", () => toggleRecordStatus(btn.getAttribute("data-toggle-record")));
    });
  }

  function toggleRecordStatus(recordId) {
    const attendance = readJSON(KEYS.attendance);
    const rec = attendance.find(r => r.id === recordId);
    if (!rec) return;
    rec.status = rec.status === "Present" ? "Absent" : "Present";
    rec.markedBy = currentUser.name;
    writeJSON(KEYS.attendance, attendance);
    logActivity(`${currentUser.name} changed ${rec.studentName}'s status to ${rec.status} (${formatDatePretty(rec.date)})`);
    showToast(`Updated ${rec.studentName} to ${rec.status}.`);
    paintTeacherRecords();
  }

  /* ========================================================================
     TEACHER: SUMMARY
     ====================================================================== */
  function renderTeacherSummary() {
    const attendance = readJSON(KEYS.attendance).filter(r => r.markedBy === currentUser.name);
    const stats = calculateStats(attendance);
    const uniqueClassDates = new Set(attendance.map(r => r.className + "|" + r.date));

    animateNumber($("#teaStatClasses"), uniqueClassDates.size);
    animateNumber($("#teaStatPresent"), stats.present);
    animateNumber($("#teaStatAbsent"), stats.absent);
    $("#teaStatPct").textContent = stats.pct + "%";

    drawTeacherClassChart(attendance);
  }

  function drawTeacherClassChart(attendance) {
    const canvas = $("#chartTeacherClasses");
    if (!canvas) return;
    setupCanvasDPR(canvas);
    const ctx = canvas.getContext("2d");
    const W = canvas.clientWidth, H = canvas.clientHeight;
    ctx.clearRect(0, 0, W, H);

    const byClass = {};
    attendance.forEach(r => {
      byClass[r.className] = byClass[r.className] || { present: 0, total: 0 };
      byClass[r.className].total++;
      if (r.status === "Present") byClass[r.className].present++;
    });
    const classNames = Object.keys(byClass);

    if (classNames.length === 0) {
      drawEmptyCanvasMsg(ctx, W, H, "No attendance marked yet");
      return;
    }

    const padL = 40, padR = 14, padT = 16, padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const barH = Math.min(34, chartH / classNames.length - 14);
    const gap = chartH / classNames.length;

    const textColor = getCSSVar("--text-2") || "#555";
    const trackColor = getCSSVar("--border-soft") || "rgba(0,0,0,0.08)";

    ctx.font = "12px Inter, sans-serif";

    classNames.forEach((cls, i) => {
      const pct = byClass[cls].total ? byClass[cls].present / byClass[cls].total : 0;
      const y = padT + i * gap + (gap - barH) / 2;

      ctx.fillStyle = trackColor;
      roundRectBar(ctx, padL, y, chartW, barH, trackColor);

      const grad = ctx.createLinearGradient(padL, 0, padL + chartW, 0);
      grad.addColorStop(0, "#7c5cff");
      grad.addColorStop(1, "#4f8ef7");
      roundRectBar(ctx, padL, y, chartW * pct, barH, grad);

      ctx.fillStyle = textColor;
      ctx.textAlign = "left";
      ctx.fillText(cls, padL + 8, y + barH / 2 + 4);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      if (chartW * pct > 40) ctx.fillText(Math.round(pct * 100) + "%", padL + chartW * pct - 8, y + barH / 2 + 4);
      ctx.textAlign = "left";
    });
  }

  /* ========================================================================
     STUDENT: OVERVIEW
     ====================================================================== */
  function renderStudentOverview() {
    const dateInput = $("#studentHistoryDate");
    const clearBtn = $("#studentHistoryClear");
    if (!dateInput._bound) {
      dateInput._bound = true;
      dateInput.addEventListener("change", paintStudentHistory);
      clearBtn.addEventListener("click", () => { dateInput.value = ""; paintStudentHistory(); });
    }

    const attendance = readJSON(KEYS.attendance).filter(r => r.studentId === currentUser.id);
    const stats = calculateStats(attendance);

    animateNumber($("#stuStatTotal"), stats.total);
    animateNumber($("#stuStatPresent"), stats.present);
    animateNumber($("#stuStatAbsent"), stats.absent);
    $("#stuStatPct").textContent = stats.pct + "%";

    drawStudentRing(stats.pct);
    paintStudentStatus(stats);
    paintStudentHistory();
  }

  function drawStudentRing(pct) {
    const canvas = $("#chartStudentRing");
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = 240;
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = size + "px"; canvas.style.height = size + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2, cy = size / 2, r = 96;
    let progress = 0;
    const target = pct / 100;
    const color = pct >= 75 ? (getCSSVar("--success") || "#1aa179") : pct >= 50 ? (getCSSVar("--amber") || "#c9821a") : (getCSSVar("--danger") || "#e0445b");

    function frame() {
      progress += 0.015;
      if (progress > target) progress = target;
      ctx.clearRect(0, 0, size, size);

      ctx.lineWidth = 18;
      ctx.lineCap = "round";
      ctx.strokeStyle = getCSSVar("--border-soft") || "rgba(0,0,0,0.08)";
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = getCSSVar("--text-1") || "#222";
      ctx.font = "800 34px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(Math.round(progress * 100) + "%", cx, cy + 6);
      ctx.font = "12px Inter, sans-serif";
      ctx.fillStyle = getCSSVar("--text-3") || "#999";
      ctx.fillText("present rate", cx, cy + 28);
      ctx.textAlign = "left";

      if (progress < target) requestAnimationFrame(frame);
    }
    frame();
  }

  function paintStudentStatus(stats) {
    const box = $("#studentStatusBox");
    if (!box) return;
    let pillClass = "good", pillText = "On track", message = "";

    if (stats.total === 0) {
      pillClass = "warn"; pillText = "No data yet";
      message = "Your teacher hasn't marked any attendance for you yet. Check back after your first class is logged.";
    } else if (stats.pct >= 75) {
      pillClass = "good"; pillText = "Meets requirement";
      message = `You're at ${stats.pct}% attendance, comfortably above the typical 75% minimum requirement. Keep it up.`;
    } else if (stats.pct >= 50) {
      pillClass = "warn"; pillText = "Below requirement";
      message = `You're at ${stats.pct}% attendance, which is below the usual 75% minimum. Attend upcoming classes to recover your percentage.`;
    } else {
      pillClass = "bad"; pillText = "At risk";
      message = `You're at ${stats.pct}% attendance — significantly below the 75% minimum. Speak with your teacher or advisor as soon as possible.`;
    }

    box.innerHTML = `
      <span class="status-pill ${pillClass}">${pillText}</span>
      <p>${message}</p>
      <div class="mini-stats">
        <div><strong>${stats.total}</strong><span>Total classes</span></div>
        <div><strong>${stats.present}</strong><span>Present</span></div>
        <div><strong>${stats.absent}</strong><span>Absent</span></div>
      </div>
    `;
  }

  function paintStudentHistory() {
    const tbody = $("#studentHistoryBody");
    const dateFilter = $("#studentHistoryDate").value;
    const attendance = readJSON(KEYS.attendance)
      .filter(r => r.studentId === currentUser.id && (!dateFilter || r.date === dateFilter))
      .sort((a, b) => b.date.localeCompare(a.date));

    $("#studentHistoryEmpty").hidden = attendance.length !== 0;

    tbody.innerHTML = attendance.map(r => `
      <tr>
        <td>${formatDatePretty(r.date)}</td>
        <td>${escapeHTML(r.className)}</td>
        <td><span class="badge ${r.status === "Present" ? "badge-present" : "badge-absent"}">${r.status}</span></td>
      </tr>
    `).join("");
  }

  /* ========================================================================
     REDRAW ON THEME CHANGE (canvas colors are read from CSS vars)
     ====================================================================== */
  window.__attendlyRedraw = function () {
    if (!activeViewId) return;
    renderView(activeViewId);
  };

  /* ========================================================================
     REDRAW ON RESIZE (debounced)
     ====================================================================== */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (activeViewId) renderView(activeViewId);
    }, 200);
  });

})();