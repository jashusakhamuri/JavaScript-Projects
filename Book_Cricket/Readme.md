# 🏏 BOOk_cricket — Multi-User Cricket Game with Leaderboard

A browser-based cricket simulation built with vanilla **HTML, CSS, and JavaScript**. Multiple users can create accounts, play a turn-based 6-ball innings, and compete on a shared leaderboard — all without a backend server.

---

## 📁 File Structure

```
howzat-cricket-game/
├── index.html   → Structure & content (screens, forms, scoreboard)
├── style.css    → Visual design (theme, layout, animations)
└── script.js    → Logic (auth, game engine, leaderboard, storage)
```

---

## ⚙️ Core Concepts Used

### 1. **DOM Manipulation**
Every dynamic part of the UI — score, ball count, outs, leaderboard rows — is created or updated directly through JavaScript using methods like:
- `document.getElementById()` to grab elements
- `element.textContent` / `element.innerHTML` to update displayed values
- `document.createElement()` to generate new elements (e.g. a new ball chip or leaderboard row) on the fly
- `classList.add()` / `classList.remove()` to toggle visual states (hidden warnings, active screens, colored ball outcomes)

```js
const chip = document.createElement("div");
chip.classList.add("ball-chip");
ballsTrackEl.appendChild(chip);
```

### 2. **Event-Driven Programming**
The app reacts to user actions through event listeners rather than running top-to-bottom:
- `submit` on the login form
- `click` on Bowl, Try Again, Logout, Delete, Clear buttons

```js
bowlBtn.addEventListener("click", playBall);
```

### 3. **State Management (without a framework)**
Since there's no React/Vue, the "state" of the app lives in plain JavaScript variables that get mutated and then reflected onto the DOM manually:

```js
let score = 0;
let ballsPlayed = 0;
let outs = 0;
let zeros = 0;
let gameOver = false;
```

Every state change (`score++`, `outs++`) is immediately followed by a matching UI update — this manual sync is the core pattern of vanilla-JS apps.

### 4. **Conditional Logic & Game Rules Engine**
The "rules" of the cricket simulation are expressed as plain conditionals:
- Game ends if `outs >= 2`
- Game ends if `ballsPlayed >= 6`
- Game ends if `zeros >= 2` (two dot balls)
- A warning banner appears one event before a losing condition is met

```js
if (outs >= MAX_OUTS || ballsPlayed >= MAX_BALLS || zeros >= MAX_ZEROS) {
  endGame();
}
```

### 5. **Randomness & Weighted Probability**
Ball outcomes aren't uniformly random — some results (like getting OUT or hitting a 6) are intentionally rarer, simulated using a **weighted array**:

```js
const weighted = [0, 0, 1, 1, 2, 3, 4, 4, 6, "OUT"];
const result = weighted[Math.floor(Math.random() * weighted.length)];
```
Repeating an outcome more times in the array increases its probability without needing complex math.

### 6. **Client-Side Authentication (Frontend-Only)**
There's no real backend/database — instead, `localStorage` is used to simulate user accounts:
- New username → account auto-created
- Existing username → password is checked against the stored value
- A session key tracks who is currently "logged in," so refreshing the page keeps you logged in

```js
if (users[username]) {
  if (users[username].password !== password) { /* reject */ }
} else {
  users[username] = { password, bestScore: 0 }; // auto sign-up
}
```

> ⚠️ This is for demo/learning purposes only — passwords are stored in plain text in the browser, which is **not secure** for real-world apps.

### 7. **Browser Storage (`localStorage`) for Persistence**
All users and scores are saved as a single JSON object in `localStorage`, so data survives page refreshes and browser restarts (on the same device/browser):

```js
function saveUsers(users) {
  localStorage.setItem("howzat_users", JSON.stringify(users));
}
function getUsers() {
  return JSON.parse(localStorage.getItem("howzat_users") || "{}");
}
```

`JSON.stringify` / `JSON.parse` are used because `localStorage` can only store strings, not objects.

### 8. **Array Methods for Data Processing**
The leaderboard is built using functional array methods rather than manual loops:

```js
const entries = Object.entries(users)
  .map(([name, data]) => ({ name, bestScore: data.bestScore || 0 }))
  .sort((a, b) => b.bestScore - a.bestScore);
```
- `Object.entries()` turns the stored user object into an iterable array
- `.map()` reshapes each entry into a clean `{ name, score }` format
- `.sort()` ranks players from highest to lowest score

### 9. **Screen/View Routing (Single Page App pattern)**
Instead of multiple HTML files, all "screens" (Login, Game, Leaderboard) live in one `index.html`, and JavaScript toggles which one is visible — the same idea used by SPA frameworks like React Router, just done manually:

```js
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}
```

### 10. **CSS Custom Properties (Design Tokens)**
The color palette, spacing, and fonts are defined once as CSS variables, making the theme easy to update consistently across the whole app:

```css
:root {
  --pitch-green: #0b3d2e;
  --gold: #e0a526;
  --radius: 14px;
}
```

### 11. **CSS Animations & Transitions**
Small motion details — a ball chip popping in, a screen fading in, a button lifting on hover — are done purely in CSS using `@keyframes` and `transition`, keeping JavaScript focused on logic rather than visuals.

```css
@keyframes popIn {
  from { transform: scale(0.4); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
```

### 12. **Accessibility Basics**
- Visible focus outlines (`:focus-visible`) for keyboard navigation
- `prefers-reduced-motion` media query to respect users who disable animations
- Semantic HTML elements (`<label>`, `<button>`, `<table>`) instead of generic `<div>`s for interactive parts

### 13. **XSS-Safe Rendering**
Usernames are inserted into the DOM through an `escapeHTML()` helper instead of raw string concatenation, preventing a malicious username like `<script>` from being executed as code:

```js
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
```

---

## 🧠 What This Project Demonstrates

| Skill Area | Where It Shows Up |
|---|---|
| JavaScript fundamentals | Variables, functions, conditionals, loops |
| DOM manipulation | Dynamic score, ball chips, leaderboard rows |
| Event handling | Forms, buttons, delete actions |
| State management | Game variables synced to UI manually |
| Data persistence | `localStorage` for users & scores |
| Algorithmic thinking | Weighted randomness, sorting, ranking |
| UI/UX design | Custom theme, responsive layout, motion, accessibility |
| Security awareness | Input escaping, documented limitations of client-side auth |

---

## 🚀 Possible Future Improvements
- Move user data to a real backend (Node.js + database) for a leaderboard shared across devices
- Hash passwords instead of storing them in plain text
- Add difficulty levels or bowler "deliveries" with different odds
- Add sound effects for boundaries and wickets
- Animate the run/wicket result with a transient toast instead of static text

---

## 🛠️ Tech Stack
- **HTML5** — structure
- **CSS3** — styling, animation, responsive design
- **Vanilla JavaScript (ES6+)** — logic, state, storage
- **No frameworks, no build tools** — runs by simply opening `index.html`