// Function to get weather
async function getWeather() {

  let city = document.getElementById("city").value;

  // Validate input
  if (city.trim() === "") {
    alert("Please enter a city name");
    return;
  }

  // Show loading
  document.getElementById("cityName").textContent = "Loading...";
  document.getElementById("temp").textContent = "";
  document.getElementById("desc").textContent = "";

  try {
    // API URL
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8b10611a6633dc6b6f1fc4b79e093775&units=metric`;

    // Fetch data
    let res = await fetch(url);

    // Convert to JSON
    let data = await res.json();

    console.log(data);

    // Handle errors
    if (data.cod === "404") {
      alert("City not found");
      return;
    }

    if (data.cod === 401) {
      alert("Invalid API key");
      return;
    }

    // Extract data
    let name = data.name;
    let temp = data.main.temp;
    let desc = data.weather[0].description;

    // Update UI
    document.getElementById("cityName").textContent = name;
    document.getElementById("temp").textContent = "🌡️ " + temp + "°C";
    document.getElementById("desc").textContent = "☁️ " + desc;

    // Optional: Change background
    let weatherType = data.weather[0].main;

    if (weatherType === "Rain") {
      document.body.style.background = "#6c757d";
    } else if (weatherType === "Clear") {
      document.body.style.background = "#4facfe";
    } else if (weatherType === "Clouds") {
      document.body.style.background = "#adb5bd";
    }

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}