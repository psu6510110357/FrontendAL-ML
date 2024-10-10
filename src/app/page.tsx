/** @format */
"use client";

import React, { useEffect, useState, useMemo } from 'react';
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

interface WeatherData {
  temperature_2m: number;
  relative_humidity_2m: number;
  dew_point_2m: number;
  pressure_msl: number;
  cloud_cover: number;
  wind_speed_10m: number;
  soil_temperature_0cm: number;
}


const HomePage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [predictData, setPredictData] = useState<number | null>(null);
  const [riverDischargeData, setRiverDischargeData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [weatherResponse, predictionResponse, dischargeResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/weather/latest'),
          axios.get('http://localhost:5000/api/predict'),
          axios.get('http://localhost:5000/api/river_discharge_7day'),
        ]);

        setWeatherData(weatherResponse.data.latest_weather_data);
        setPredictData(predictionResponse.data.predictions_tomorrow);
        setRiverDischargeData(dischargeResponse.data.river_discharge_7day);
      } catch (error: any) {
        console.error("API Error:", error);
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const graphData = useMemo(() => ({
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
  }), [riverDischargeData]);



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <p className="text-xl font-semibold">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        Flood Monitoring in Phra Nakhon Si Ayutthaya
      </h1>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
        {/* Chart Section */}
        <div className="bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 flex-grow">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
            River Discharge Over the Last 7 Days
          </h2>
          <div className="w-full h-64 sm:h-96">
            <Line
              data={graphData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    ticks: {
                      color: '#fff',
                    },
                  },
                  y: {
                    ticks: {
                      color: '#fff',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Weather and Prediction Section */}
        <div className="flex flex-col gap-6 lg:w-1/3">
          {/* Weather Data Section */}
          <div className="bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Weather Data</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Temperature:</p>
                <p className="text-lg">{weatherData?.temperature_2m ?? 'N/A'} °C</p>
              </div>
              <div>
                <p className="font-medium">Humidity:</p>
                <p className="text-lg">{weatherData?.relative_humidity_2m ?? 'N/A'} %</p>
              </div>
              <div>
                <p className="font-medium">Dew Point:</p>
                <p className="text-lg">{weatherData?.dew_point_2m ?? 'N/A'} °C</p>
              </div>
              <div>
                <p className="font-medium">Pressure:</p>
                <p className="text-lg">{weatherData?.pressure_msl ?? 'N/A'} hPa</p>
              </div>
              <div>
                <p className="font-medium">Cloud Cover:</p>
                <p className="text-lg">{weatherData?.cloud_cover ?? 'N/A'} %</p>
              </div>
              <div>
                <p className="font-medium">Wind Speed:</p>
                <p className="text-lg">{weatherData?.wind_speed_10m ?? 'N/A'} Km/h</p>
              </div>
              <div>
                <p className="font-medium">Soil Temperature:</p>
                <p className="text-lg">{weatherData?.soil_temperature_0cm ?? 'N/A'} °C</p>
              </div>
            </div>
          </div>

          {/* Prediction Data Section */}
          <div className="bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">River Discharge Tommorrow</h2>
            <p className="text-lg">{predictData ?? 'N/A'} m³/s</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
