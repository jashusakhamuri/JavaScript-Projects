let inputtext = document.getElementById("username");
let textmessage = document.getElementById("message");
let randomNumber  = Math.ceil(Math.random()*100);
let guessInput = document.getElementById("guess");
let resultMessage = document.getElementById("result");
console.log(randomNumber);

function  displaymessage() {
    let username = inputtext.value;
  let message = "HI " + username + ", Welcome to the Guess the Number Game!";
    textmessage.textContent = message;
}
function checkGuess() {
    let guess = parseInt(guessInput.value);
    if (guess === randomNumber) {
        resultMessage.textContent = "Congratulations! You guessed the number!";
        resultMessage.style.color = "green";
    } else if (guess < randomNumber) {
        resultMessage.textContent = "Too low! Try again.";
        resultMessage.style.color = "red";
    } else {
        resultMessage.textContent = "Too high! Try again.";
        resultMessage.style.color = "red";
    }
}
