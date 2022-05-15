<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1>Fietsend Gent, een leugen of toch wel frequent?</h1>
        <h4>Freya Van Speybroeck, Thor Dossche & Ieben Smessaert</h4>
      </el-header>
      <el-main v-if="!bicycleDataLoaded || !weatherDataLoaded">
        <span class="loader"></span>
        <p>De data wordt momenteel ingeladen...</p>
      </el-main>
      <el-main v-else>
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="Fietspalen" name="first">
            <h3>In welke fietstelpaal bent u geïnteresseerd?</h3>
            <Map :selectedStation="selectedStation" @change-selected="changeSelected"/>
              <br>
              <br>
              <h3>Hoeveel fietsers komen hier per dag?</h3>
              <p>Hier wordt per jaar getoond hoeveel fietsers er waren op alle dagen van het jaar. Neem eens een kijkje over de jaren heen,
                of door de weken heen!</p>
              <p>Er is ook de optie om een overzicht te krijg over alle fietstelpalen van een bepaald jaar, zo kan er ook
              vergeleken worden tussen de fietstelpalen.</p>
              <Heatmaps id="heatmaps" :datasets="datasets" :offset-x="offsetX" :offset-y="offsetY"
                        :selectedStation="selectedStation"/>
              <br>
              <h3>Wat is de evolutie over de jaren heen?</h3>
              <p>Bekijk hieronder de verschillende jaren met elkaar vergeleken. Geen zorgen als de lijn van een jaar plots stopt, 
              dit is het gevolg van een niet-functionerende fietstelpaal.</p>
              <yearly-line-graph :datasets="datasets" :selectedStation="selectedStation"/>
              <br>
              <h3>Hoe ziet een gemiddelde week eruit?</h3>
              <p>Als u benieuwd bent hoeveel fietsers er per dag deze fietstelpaal passeren, is hier een overzicht gegeven voor het
                gemiddeld aantal fietsers per dag van de week. Vergelijk eens de weekdagen met het weekend, valt er iets op? Het is vaak
                zo dat er minder gefietst wordt tijdens het weekend.
              </p>
              <BarchartDailyAverages :datasets="datasets" :selectedStation="selectedStation"/>
              <h3>Liever wat meer details?</h3>
              <p>Selecteer hieronder de datum waarvoor u het exact aantal fietsers wilt zien. Er wordt zowel een totaal getoond, als de 2
                mogelijke richtingen. Om te weten hoeveel fietsers er weggaan uit Gent, kijk naar "Gent uit". Het aantal fietsers dat
                richting Gent rijdt, wordt aangeduid door "Gent in".</p>
              <DailyLineGraph :datasets="datasets" :selectedStation="selectedStation"/>
          </el-tab-pane>
          <el-tab-pane label="Weer" name="second">
            <weather-influence :datasets="datasets"/>
            <h2>Visualisatie van gemiddeldes op regen en niet-regen dagen</h2>
            <BarchartsRain :datasets="datasets"/>
          </el-tab-pane>
          <el-tab-pane label="Uitgelicht" name="third">
            <h2>Populariteit van de locaties per jaar</h2>
            <YearData :datasets="datasets"/>

            <h2>Kan jij zien wanneer de eerste Covid-19 lockdown inging?</h2>
            <CalendarHeatmap :max="specialHeatmapLockdownMaxValue"
                             :name="specialHeatmapLockdownDataset.station.naam"
                             :offset-x="offsetX"
                             :offset-y="offsetY"
                             :value="specialHeatmapLockdownDataset.name"
                             :values="groupDataset(specialHeatmapLockdownDataset.name)"
                             :year="specialHeatmapLockdownDataset.year"
                             highlight="80"
            />
            <p>Herinner je je 18 maart 2020 nog? Waarschijnlijk helaas wel, het is de dag waarop de Belgische overheid
              de eerste lockdown aankondigde omwille van Covid-19. Plots mochten we niet meer buiten komen, het ganse
              leven viel stil, alsook onze fiets. Vanaf 18 maart zie je namelijk dat het aantal fietsers die langs de
              fietspaal op Dampoort-Zuid passeren drastisch kelderen.</p>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Heatmaps from './components/Heatmaps.vue';
import DailyLineGraph from './components/DailyLineGraph.vue';
import BarchartDailyAverages from './components/BarchartDailyAverages.vue';
import Map from './components/Map.vue';
import YearData from './components/YearData.vue';
import YearlyLineGraph from './components/YearlyLineGraph.vue';
import {getDataset, getDatasets, groupPerDay, load as loadBicyclingData} from '/src/js/bicycling-data.js';
import {ref} from 'vue';
import {load as loadWeatherData} from '/src/js/weather-data.js';
import BarLineGraph from './components/BarLineGraph.vue';
import WeatherInfluence from './components/WeatherInfluence.vue';
import BarchartsRain from './components/BarchartsRain.vue';
import * as d3 from 'd3';
import CalendarHeatmap from './components/CalendarHeatmap.vue';

export default {
  components: {
    BarLineGraph,
    Heatmaps,
    DailyLineGraph,
    Map,
    BarchartDailyAverages,
    YearData,
    YearlyLineGraph,
    WeatherInfluence,
    BarchartsRain,
    CalendarHeatmap
  },
  data() {
    return {
      selectedStation: null,
      datasets: getDatasets(),
      activeName: ref('first'),
      bicycleDataLoaded: false,
      weatherDataLoaded: false,
      offsetX: 0,
      offsetY: 0,
      specialHeatmapLockdownDataset: null,
      specialHeatmapLockdownMaxValue: 0
    }
  },
  methods: {
    changeSelected(newStation) {
      this.selectedStation = newStation;
    },
    configureHeatmapsOffset() {
      this.$nextTick(() => {
        const rect = document.getElementById('heatmaps').getBoundingClientRect();
        this.offsetX = rect.x;
        this.offsetY = 240;
      });
    },
    groupDataset(name) {
      return groupPerDay(getDataset(name));
    },
    setupSpecialHeatmapLockdown() {
      this.specialHeatmapLockdownDataset = this.datasets.find(dataset => dataset.name === 'dampoort-zuid-2020');
      this.specialHeatmapLockdownMaxValue = d3.max(this.groupDataset(this.specialHeatmapLockdownDataset.name).flat(), d => d.totaal);
    }
  },
  mounted() {
    loadWeatherData().then(() => {
      this.weatherDataLoaded = true;
      if (this.bicycleDataLoaded) {
        this.configureHeatmapsOffset();
      }
    });
    loadBicyclingData().then(() => {
      this.bicycleDataLoaded = true;
      this.setupSpecialHeatmapLockdown();
      if (this.weatherDataLoaded) {
        this.configureHeatmapsOffset();
      }
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.el-main {
  margin-top: 5em;
  overflow: visible; /* Fix scrollbar showing up for loading animation */
}

h2 {
  padding-top: 32px;
}

/* BICYCLING LOADING ANIMATION, src: https://cssloaders.github.io */
.loader {
  width: 106px;
  height: 86px;
  display: block;
  margin: 30px auto;
  background-image: linear-gradient(#e15b64 50px, transparent 0), linear-gradient(#f8b26a 50px, transparent 0), linear-gradient(#f47e60 50px, transparent 0), linear-gradient(#f47e60 50px, transparent 0), radial-gradient(circle 14px, #f8b26a 100%, transparent 0);
  background-size: 48px 15px, 15px 35px, 15px 35px, 25px 15px, 28px 28px;
  background-position: 25px 5px, 58px 20px, 25px 17px, 2px 37px, 76px 0px;
  background-repeat: no-repeat;
  position: relative;
  transform: rotate(-45deg);
  box-sizing: border-box;
}

.loader::after,
.loader::before {
  content: '';
  position: absolute;
  width: 56px;
  height: 56px;
  border: 6px solid #abbd81;
  border-radius: 50%;
  left: -45px;
  top: -10px;
  background-repeat: no-repeat;
  background-image: linear-gradient(#f8b26a 64px, transparent 0), linear-gradient(#f47e60 66px, transparent 0), radial-gradient(circle 4px, #abbd81 100%, transparent 0);
  background-size: 40px 1px, 1px 40px, 8px 8px;
  background-position: center center;
  box-sizing: border-box;
  animation: rotation 0.3s linear infinite;
}

.loader::before {
  left: 25px;
  top: 60px;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
