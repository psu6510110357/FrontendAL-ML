// pages/index.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomePage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [riverDischargeData, setRiverDischargeData] = useState<number[]>([]);

  // Fetch data from Flask backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest weather data
        const weatherResponse = await axios.get('http://localhost:5000/api/weather/latest');
        setWeatherData(weatherResponse.data);

        // Fetch river discharge 7-day data
        const dischargeResponse = await axios.get('http://localhost:5000/api/river_discharge_7day');
        setRiverDischargeData(dischargeResponse.data.river_discharge_7day);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare the data for the graph
  const graphData = {
    labels: ['6 Days Ago', '5 Days Ago', '4 Days Ago', '3 Days Ago', '2 Days Ago', 'Yesterday', 'Today'],
    datasets: [
      {
        label: 'River Discharge (m³/s)',
        data: riverDischargeData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Graph options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'River Discharge Over the Last 7 Days',
      },
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Top container for latest weather data */}
      <div style={{ marginBottom: '40px' }}>
        <h2>Latest Weather Data</h2>
        {weatherData ? (
          <div>
            <p>Temperature: {weatherData.latest_weather_data.temperature_2m} °C</p>
            <p>Humidity: {weatherData.latest_weather_data.relative_humidity_2m} %</p>
            <p>Dew Point: {weatherData.latest_weather_data.dew_point_2m} °C</p>
            <p>Pressure: {weatherData.latest_weather_data.pressure_msl} hPa</p>
            <p>Cloud Cover: {weatherData.latest_weather_data.cloud_cover} %</p>
            <p>Wind Speed: {weatherData.latest_weather_data.wind_speed_10m} m/s</p>
            <p>Soil Temperature: {weatherData.latest_weather_data.soil_temperature_0cm} °C</p>
            <p>River Discharge (Latest): {weatherData.latest_river_discharge} m³/s</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>

      {/* Bottom container for river discharge graph */}
      <div>
        <h2>River Discharge Over the Last 7 Days</h2>
        {riverDischargeData.length > 0 ? (
          <Line data={graphData} options={options} />
        ) : (
          <p>Loading river discharge data...</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
