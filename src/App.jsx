import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaTemperatureThreeQuarters } from "react-icons/fa6";
import { FaDroplet } from "react-icons/fa6";
import { LuWind } from "react-icons/lu";
import { FaTachometerAlt } from "react-icons/fa";

import { getCountry } from "iso-3166-1-alpha-2";

function App() {
  const [cityName, setCityName] = useState("bhopal");
  const [tempInfo, setTempInfo] = useState({});
  const [error, setError] = useState(null);

  const {
    temp,
    temp_min,
    temp_max,
    feels_like,
    humidity,
    pressure,
    weathermood,
    name,
    speed,
    countryFullName,
    formattedDateTime,
    weatherIconUrl,
  } = tempInfo;

  const getCityInfo = async () => {
    try {
      const apikey = import.meta.env.VITE_API_KEY;
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apikey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        const { temp, temp_min, temp_max, feels_like, humidity, pressure } =
          data.main;
        const { main: weathermood, icon } = data.weather[0];
        const { dt, name } = data;
        const { speed } = data.wind;

        const countryFullName = getCountry(data.sys.country);

        const dateObject = new Date(dt * 1000);
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };
        const formatter = new Intl.DateTimeFormat("en-US", options);
        const formattedDateTime = formatter.format(dateObject);

        const weatherIconUrl = `http://openweathermap.org/img/wn/${icon}.png`;

        const myNewWeatherInfo = {
          temp,
          temp_min,
          temp_max,
          feels_like,
          humidity,
          pressure,
          weathermood,
          name,
          speed,
          countryFullName,
          formattedDateTime,
          weatherIconUrl,
        };

        setTempInfo(myNewWeatherInfo);
        setError(null);
      } else {
        setError("Error fetching data. Please try again");
      }
    } catch (error) {
      setError("Error fetching data. Please try again");
    }
  };

  useEffect(() => {
    getCityInfo();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    getCityInfo();
  };

  return (
    <>
      <section className="container">
        <div className="weather_header">
          <form className="weather_search" onSubmit={handleSubmit}>
            <CiSearch className="icon" />
            <input
              type="text"
              className="city_name"
              placeholder="Search your city..."
              value={cityName}
              onChange={(e) => {
                setCityName(e.target.value);
              }}
            />
          </form>
        </div>
        {error && <p>{error}</p>}
        <div className="weather_body">
          <h1 className="weather_city">
            {name}, {countryFullName}
          </h1>
          <p className="weather_date_time">{formattedDateTime} IST</p>
          <div className="weather_data">
            <p className="weather_forecast">{weathermood}</p>
            <div className="weather_icon">
              {<img src={weatherIconUrl} alt="Weather Icon" />}
            </div>
          </div>
          <p className="weather_temperature">{temp}&deg;</p>
          <div className="weather_minmax">
            <p className="weather_min">Min: {temp_min}&deg;</p>
            <p className="weather_max">Max: {temp_max}&deg;</p>
          </div>
        </div>
        <section className="weather_info">
          <div className="weather_card">
            <FaTemperatureThreeQuarters className="icon" />
            <div>
              <p>Feels Like</p>
              <p className="weather_feelslike">{feels_like}&deg;</p>
            </div>
          </div>
          <div className="weather_card">
            <FaDroplet className="icon" />
            <div>
              <p>Humidity</p>
              <p className="weather_feelslike">{humidity}%</p>
            </div>
          </div>
          <div className="weather_card">
            <LuWind className="icon" />
            <div>
              <p>Wind</p>
              <p className="weather_feelslike">{speed} m/s</p>
            </div>
          </div>
          <div className="weather_card">
            <FaTachometerAlt className="icon" />
            <div>
              <p>Pressure</p>
              <p className="weather_feelslike">{pressure} hPa</p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default App;
