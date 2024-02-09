import "./App.css";
import { useState } from "react";

const api = {
  base: "https://api.openweathermap.org/data/2.5/",
  key: "04e60fd3480011e71d9bebe70e77ab12",
};

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);

  const searchPressed = () => {
    fetch(`${api.base}weather?q=${search}&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.cod === 200) {
          setWeather(result);
          console.log(result);
        } else {
          // Handle errors: display message, log details
          console.error("Error fetching weather:", result.message);
        }
      });

    fetch(`${api.base}forecast?q=${search}&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.cod === "200") {
          // Filter out duplicate entries based on date
          const filteredForecast = result.list.filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  new Date(t.dt_txt).getDate() ===
                  new Date(item.dt_txt).getDate()
              )
          );
          setForecast(filteredForecast);
          console.log(filteredForecast);
        } else {
          console.error("Error fetching forecast:", result.message);
        }
      });
  };

  return (
    <div className="container">
      <div className="App">
        <h1>Weather Forecast</h1>

        <div>
          <input
            type="text"
            placeholder="Search city/state..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={searchPressed}>Search</button>
        </div>

        {weather.hasOwnProperty("name") && (
          <>
            <h2>Today's Weather</h2>
            <p>City: {weather.name}</p>
            <p>Temperature: {Math.round(weather.main.temp - 273.15)}°C</p>
            <p>Description: {weather.weather[0].description}</p>
          </>
        )}
      </div>

      {forecast.length > 0 && (
        <div className="forecast-container">
          <h2>5-Day Forecast:</h2>
          <div className="forecast">
            {forecast.slice(0, 5).map((item, index) => (
              <div key={index} className="forecast-item">
                <p>Date: {item.dt_txt}</p>
                <p>Temperature: {Math.round(item.main.temp - 273.15)}°C</p>
                <p>Description: {item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
