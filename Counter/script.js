let count = 0

function increase() {
  count++;
  document.getElementById("count").textContent = count;
  document.getElementById("count").style.color = "black";
}

function decrease() {
  count--;
  document.getElementById("count").textContent = count;
  if (count < 0) {
    document.getElementById("count").style.color = "red";
  }
}

function reset() {
  count = 0;
  document.getElementById("count").textContent = count;
  document.getElementById("count").style.color = "black";
}