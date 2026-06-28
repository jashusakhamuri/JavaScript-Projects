/* ============================================
   STORAGE HELPERS
   ============================================ */
const USERS_KEY = "Book_Cricket_users";       // { username: { password, bestScore } }
const SESSION_KEY = "Book_Cricket_session";    // username of logged-in user

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
  return localStorage.getItem(SESSION_KEY);
}
function setSession(username) {
  localStorage.setItem(SESSION_KEY, username);
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ============================================
   SCREEN NAVIGATION
   ============================================ */
const screens = {
  login: document.getElementById("login-screen"),
  game: document.getElementById("game-screen"),
  leaderboard: document.getElementById("leaderboard-screen"),
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

/* ============================================
   LOGIN
   ============================================ */
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    loginError.textContent = "Please fill in both fields.";
    return;
  }

  const users = getUsers();

  if (users[username]) {
    // existing user -> verify password
    if (users[username].password !== password) {
      loginError.textContent = "Incorrect password. Try again.";
      return;
    }
  } else {
    // new user -> auto create account
    users[username] = { password, bestScore: 0 };
    saveUsers(users);
  }

  loginError.textContent = "";
  setSession(username);
  enterGame(username);
});

document.getElementById("logout-btn").addEventListener("click", () => {
  clearSession();
  usernameInput.value = "";
  passwordInput.value = "";
  showScreen("login");
});

document.getElementById("login-lb-btn").addEventListener("click", () => {
  renderLeaderboard();
  showScreen("leaderboard");
});

/* ============================================
   GAME STATE
   ============================================ */
let currentUser = null;
let score = 0;
let ballsPlayed = 0;
let outs = 0;
let zeros = 0;
const MAX_BALLS = 6;
const MAX_OUTS = 2;
const MAX_ZEROS = 2;
let gameOver = false;

const playerNameEl = document.getElementById("player-name");
const scoreValueEl = document.getElementById("score-value");
const ballsValueEl = document.getElementById("balls-value");
const outsValueEl = document.getElementById("outs-value");
const ballsTrackEl = document.getElementById("balls-track");
const warningBannerEl = document.getElementById("warning-banner");
const bowlBtn = document.getElementById("bowl-btn");
const ballResultEl = document.getElementById("ball-result");
const resultPanelEl = document.getElementById("result-panel");
const resultTitleEl = document.getElementById("result-title");
const resultScoreEl = document.getElementById("result-score");

function enterGame(username) {
  currentUser = username;
  playerNameEl.textContent = username;
  resetGame();
  showScreen("game");
}

function resetGame() {
  score = 0;
  ballsPlayed = 0;
  outs = 0;
  zeros = 0;
  gameOver = false;

  scoreValueEl.textContent = "0";
  ballsValueEl.textContent = `0/${MAX_BALLS}`;
  outsValueEl.textContent = `0/${MAX_OUTS}`;
  ballsTrackEl.innerHTML = "";
  ballResultEl.textContent = "";
  warningBannerEl.classList.add("hidden");
  warningBannerEl.textContent = "⚠ One chance left — next OUT ends your innings";
  resultPanelEl.classList.add("hidden");
  bowlBtn.disabled = false;
}

bowlBtn.addEventListener("click", playBall);

function playBall() {
  if (gameOver) return;

  const outcomes = [0, 1, 2, 3, 4, 6, "OUT"];
  // Weighted: OUT is somewhat rarer than runs
  const weighted = [0, 0, 1, 1, 2, 3, 4, 4, 6, "OUT"];
  const result = weighted[Math.floor(Math.random() * weighted.length)];

  ballsPlayed++;

  const chip = document.createElement("div");
  chip.classList.add("ball-chip");

  if (result === "OUT") {
    outs++;
    chip.classList.add("out");
    chip.textContent = "W";
    ballResultEl.textContent = "🔴 OUT!";
  } else {
    score += result;
    chip.textContent = result;
    if (result === 0) {
      zeros++;
      chip.classList.add("dot");
    }
    if (result === 4) chip.classList.add("runs-4");
    if (result === 6) chip.classList.add("runs-6");
    ballResultEl.textContent = result === 0 ? "Dot ball" : `+${result} run${result > 1 ? "s" : ""}`;
  }

  ballsTrackEl.appendChild(chip);

  scoreValueEl.textContent = score;
  ballsValueEl.textContent = `${ballsPlayed}/${MAX_BALLS}`;
  outsValueEl.textContent = `${outs}/${MAX_OUTS}`;

  // warning when one out left, or one dot ball away from the two-zero rule
  if (!gameOver && (outs === MAX_OUTS - 1 || zeros === MAX_ZEROS - 1)) {
    warningBannerEl.classList.remove("hidden");
    warningBannerEl.textContent = outs === MAX_OUTS - 1
      ? "⚠ One chance left — next OUT ends your innings"
      : "⚠ One more dot ball ends your innings";
  }

  // check end conditions
  if (outs >= MAX_OUTS || ballsPlayed >= MAX_BALLS || zeros >= MAX_ZEROS) {
    endGame();
  }
}

function endGame() {
  gameOver = true;
  bowlBtn.disabled = true;
  warningBannerEl.classList.add("hidden");

  let reason = "Innings Complete";
  if (outs >= MAX_OUTS) reason = "All Out!";
  else if (zeros >= MAX_ZEROS) reason = "Game Ends — Too Many Dot Balls!";

  resultTitleEl.textContent = reason;
  resultScoreEl.innerHTML = `You scored <strong>${score}</strong> run${score !== 1 ? "s" : ""} off ${ballsPlayed} ball${ballsPlayed !== 1 ? "s" : ""}`;
  resultPanelEl.classList.remove("hidden");

  updateLeaderboardScore(currentUser, score);
}

document.getElementById("try-again-btn").addEventListener("click", resetGame);
document.getElementById("view-leaderboard-btn").addEventListener("click", () => {
  renderLeaderboard();
  showScreen("leaderboard");
});

/* ============================================
   LEADERBOARD
   ============================================ */
function updateLeaderboardScore(username, newScore) {
  const users = getUsers();
  if (!users[username]) return;
  users[username].bestScore = newScore;
  saveUsers(users);
}

const lbBody = document.getElementById("lb-body");
const lbEmpty = document.getElementById("lb-empty");

function renderLeaderboard() {
  const users = getUsers();
  const entries = Object.entries(users)
    .map(([name, data]) => ({ name, bestScore: data.bestScore || 0 }))
    .sort((a, b) => b.bestScore - a.bestScore);

  lbBody.innerHTML = "";

  if (entries.length === 0) {
    lbEmpty.classList.remove("hidden");
    return;
  }
  lbEmpty.classList.add("hidden");

  entries.forEach((entry, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="lb-rank">#${index + 1}</td>
      <td class="lb-name">${escapeHTML(entry.name)}</td>
      <td class="lb-score">${entry.bestScore}</td>
      <td><button class="lb-delete" data-name="${escapeHTML(entry.name)}" title="Delete player">🗑️</button></td>
    `;
    lbBody.appendChild(tr);
  });

  // attach delete handlers
  lbBody.querySelectorAll(".lb-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const users = getUsers();
      delete users[name];
      saveUsers(users);
      if (currentUser === name) {
        clearSession();
        currentUser = null;
        showScreen("login");
        return;
      }
      renderLeaderboard();
    });
  });
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById("leaderboard-back-btn").addEventListener("click", () => {
  showScreen(currentUser ? "game" : "login");
});

document.getElementById("clear-lb-btn").addEventListener("click", () => {
  if (confirm("Clear all leaderboard data? This removes every player account.")) {
    saveUsers({});
    clearSession();
    currentUser = null;
    renderLeaderboard();
    showScreen("login");
  }
});

/* ============================================
   INIT — restore session if one exists
   ============================================ */
(function init() {
  const session = getSession();
  const users = getUsers();
  if (session && users[session]) {
    enterGame(session);
  } else {
    showScreen("login");
  }
})();