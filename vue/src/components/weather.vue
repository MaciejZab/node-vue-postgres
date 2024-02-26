<script setup lang="ts">
import axios from "axios";
import { ref, computed } from "vue";

const getWeather = (weatherType: string, icon: boolean = false): string => {
  switch (weatherType) {
    case "clearday":
    case "clearnight":
      return icon ? "weather-sunny" : "Clear sky";
    case "pcloudyday":
    case "pcloudynight":
      return icon ? "weather-partly-cloudy" : "Partly cloudy";
    case "mcloudyday":
    case "mcloudynight":
      return icon ? "weather-cloudy" : "Mostly cloudy";
    case "cloudyday":
    case "cloudynight":
      return icon ? "weather-cloudy" : "Cloudy";
    case "humidday":
    case "humidnight":
      return icon ? "weather-hazy" : "Humid";
    case "lightrainday":
    case "lightrainnight":
      return icon ? "weather-rainy" : "Light rain";
    case "oshowerday":
    case "oshowernight":
      return icon ? "weather-partly-rainy" : "Occasional showers";
    case "ishowerday":
    case "ishowernight":
      return icon ? "weather-partly-rainy" : "Isolated showers";
    case "lightsnowday":
    case "lightsnownight":
      return icon ? "weather-snowy" : "Light snow";
    case "rainday":
    case "rainnight":
      return icon ? "weather-rainy" : "Rainy";
    case "snowday":
    case "snownight":
      return icon ? "weather-snowy" : "Snowy";
    case "rainsnowday":
    case "rainsnownight":
      return icon ? "weather-partly-rainy" : "Rain and snow";
    default:
      return "Unknown";
  }
};

const knotsToKmPerHour = (knots: number): string => `${knots * 1.852}km/h`;

interface Weather {
  timepoint: number; //timepoint
  time: string;
  temp: number; //temp2m
  desc: string; //getWeatherTypeDescription(weather)
  icon: string;
  wind: string; //wind10m.speed
}

function getCurrentForecast(initString: string, dataSeries: Array<any>, count: number): Weather[] {
  const day = parseInt(initString.substring(6, 8), 10);
  const hour = parseInt(initString.substring(8, 10), 10);

  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDate();

  const totalHoursPassed = (currentDay - day) * 24 + (currentHour - hour);
  const totalTimepoints = Math.floor(totalHoursPassed / 3);

  const currentData: Array<any> = dataSeries.slice(totalTimepoints, totalTimepoints + count);

  const mappedData = currentData.map((data) => {
    const timepoint = data.timepoint;
    let forecastHour = hour + timepoint;
    if (forecastHour > 24) forecastHour = forecastHour % 24;
    const timeString = `${forecastHour.toString().padStart(2, "0")}:00`;

    return {
      timepoint: data.timepoint,
      time: timeString,
      temp: data.temp2m,
      desc: getWeather(data.weather),
      icon: getWeather(data.weather, true),
      wind: knotsToKmPerHour(data.wind10m.speed),
      realTime: now,
    };
  });

  return mappedData;
}

const messages = ref<Array<Weather>>([]);

const messagesPresent = computed(() => Object.keys(messages.value).length === 0);

axios
  .get("http://www.7timer.info/bin/api.pl?lon=18.01&lat=53.12&product=civil&output=json")
  .then(function (response) {
    console.log(response);
    messages.value = getCurrentForecast(response.data.init, response.data.dataseries, 4);
    console.log(messages.value);
  })
  .catch(function (error) {
    console.log(error);
  });
</script>

<template>
  <v-skeleton-loader
    v-if="messagesPresent"
    class="bg-primaryVariant"
    type="article"
  ></v-skeleton-loader>
  <v-card v-else title="Weather" class="bg-surface text-onSurface">
    <v-card-text>
      <div class="font-weight-bold ms-1 mb-2">Today</div>

      <v-timeline density="compact" dot-size="12" align="start">
        <v-timeline-item
          v-for="message in messages"
          :key="message.timepoint"
          :icon="`mdi-${message.icon}`"
          icon-color="onPrimary"
          size="large"
          dot-color="primary"
        >
          <div class="mb-4">
            <div>
              @<span class="font-weight-bold">{{ ` ${message.time}` }}</span>
            </div>
            <div>
              <span>{{ `${message.temp}°C` }}</span
              >{{ `, ${message.desc}` }}
            </div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped></style>
