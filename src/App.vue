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
        <el-tabs v-model="activeName" class="demo-tabs" :stretch="true">
          <el-tab-pane label="Fietstelpalen" name="first">
            <h3>In welke locatie bent u geïnteresseerd?</h3>
            <Map :selectedStation="selectedStation" @change-selected="changeSelected"/>
            <br>
            <br>
            <div v-if="!selectedStation">
              <p>Selecteer een fietstelpaal op de kaart om specifieke visualisaties te zien te krijgen.</p>
            </div>
            <div v-if="selectedStation">
              <h3>Hoeveel fietsers komen hier per dag?</h3>
              <p>Hier wordt per jaar getoond hoeveel fietsers er waren op alle dagen van het jaar. Neem eens een kijkje
                over de jaren heen,
                of door de weken heen!
              Om je nog wat meer te verdiepen, is er ook de optie om een overzicht te krijg over alle fietstelpalen van een bepaald jaar. Selecteer
                hier of u per paal of per jaar wilt kijken:
              </p>
            </div>
            <Heatmaps id="heatmaps" :datasets="datasets" :offset-x="offsetX"
                      :offset-y="offsetY"
                      :selectedStation="selectedStation"/>
            <div v-if="selectedStation">
              <br>
              <h3>Wat is de evolutie over de jaren heen?</h3>
              <p>Bekijk hieronder de verschillende jaren met elkaar vergeleken. Een lijn die plots stopt en/of start is het gevolg
                van
                tijdelijk problemen bij de fietstelpaal, of een teken dat die fietstelpaal pas later in het jaar is geactiveerd.
              </p>
            </div>
            <yearly-line-graph :datasets="datasets" :selectedStation="selectedStation"/>
            <div v-if="selectedStation">
              <br>
              <h3>Hoe ziet een gemiddelde week eruit?</h3>
              <p>Als u benieuwd bent hoeveel fietsers er per dag deze fietstelpaal passeren, is hier een overzicht
                gegeven
                voor het
                gemiddeld aantal fietsers per dag van de week. Vergelijk eens de weekdagen met het weekend, valt er iets
                op? Het is vaak
                zo dat er minder gefietst wordt tijdens het weekend. Dit kan het gevolg zijn van de plaatsing van de fietstelpalen, 
                die op locaties staan waar veel pendelaars moeten passeren, zoals studenten en mensen die werken binnen of buiten Gent.
              </p>
            </div>
            <BarchartDailyAverages :datasets="datasets" :selectedStation="selectedStation"/>
            <div v-if="selectedStation">
              <br>
              <h3>Liever wat meer details?</h3>
              <p>Selecteer hieronder de datum waarvoor u het exact aantal fietsers wilt zien. Er wordt zowel een totaal
                getoond, als de twee 
                mogelijke richtingen. Om te weten hoeveel fietsers er weggaan uit Gent, kijk naar "Gent uit". Het aantal
                fietsers dat
                richting Gent rijdt, wordt aangeduid door "Gent in".</p>
            </div>
            <DailyLineGraph :datasets="datasets" :selectedStation="selectedStation"/>
          </el-tab-pane>
          <el-tab-pane label="Weer" name="second">
            <h2>De invloed van het weer op fietsend Gent</h2>
            <br>
            <weather-influence :datasets="datasets"/>
            <br>
            <p>Om toch een beter overzicht te kunnen krijgen van de algemene invloed van de regen, tonen we hier het verschil
              tussen het gemiddeld aantal fietsers over alle locaties op een regendag of een droge dag doorheen de week.
              Voor sommige dagen is er een kleine invloed, of zijn er zelfs wat meer fietsers. We zien voor dinsdag t.e.m. vrijdag
              dat er veel minder fietsers zijn. Een verklaring hiervoor kan zijn dat de pendelaars die normaal voorbij de fietstelpalen
              passeren, opteren om met de auto of het openbaar vervoer zich te verplaatsen, aangezien zij een langere afstand moeten
              afleggen dan de niet-pendelaars. Natuurlijk is dit niet het geval voor maandag.. is dit een uitzondering, of is er toch meer data nodig
              om betere conclusies te kunnen trekken?
            </p>
            <BarchartsRain :datasets="datasets"/>
          </el-tab-pane>
          <el-tab-pane label="Uitgelicht" name="third">
            <h2>Wat zijn de populairste locaties van het jaar?</h2>
            <p>Bekijk hier welke fietsstraten het meest gebruikt werden. Er wordt procentueel vergeleken tussen
              het gemiddeld aantal fietsters per dag. Ga met uw muis over de grafieken voor meer informatie.</p>
            <YearData :datasets="datasets"/>

            <h2>Kan jij zien wanneer de eerste Covid-19 lockdown inging?</h2>
            <CalendarHeatmap :max="specialHeatmapLockdownMaxValue"
                             :name="specialHeatmapLockdownDataset.station.naam"
                             :offset-x="offsetX"
                             :offset-y="offsetY"
                             :value="specialHeatmapLockdownDataset.name"
                             :values="groupDataset(specialHeatmapLockdownDataset.name)"
                             :year="specialHeatmapLockdownDataset.year"
                             highlight="79"
            />
            <p>Herinner je je 18 maart 2020 nog? Waarschijnlijk helaas wel, het is de dag waarop de Belgische overheid
              de <b>eerste lockdown</b> aankondigde omwille van Covid-19. Plots mochten we niet meer buiten komen, het
              hele leven viel stil, alsook onze fiets. Vanaf 18 maart zie je namelijk dat het aantal fietsers die langs
              de fietspaal op <b>Dampoort-Zuid</b> passeren drastisch kelderen.</p>

            <h2>Fietsend Nieuwjaar tijdens Corona, daar stak de avondklok toch flink een stokje voor!</h2>
            <HighlightNewYearLineGraph></HighlightNewYearLineGraph>
            <p>Helaas, nog een Corona-highlight, maar wel een mooie! Tijdens de jaarwissel van 2020 naar <b>2021</b>
              geldde er een <b>avondklok</b> in ons land wat ons niet toeliet buiten te komen na middernacht. Laten we
              even inzoomen op het aantal fietsers tijdens deze bijzondere jaarwisseling en deze van het jaar ervoor
              voor de fietstelpaal aan <b>Dampoort-Zuid</b>. We zien meteen een groot verschil in het aantal fietsers na
              middernacht. Waar er begin 2020 na middernacht nog veel fietsers reden, was dit begin 2021 totaal niet het
              geval. Slechts enkelingen waagden zich nog op de fiets om middernacht, maar daarna is er voor enkele uren
              nagenoeg niemand op de baan.</p>


            <h2>Ochtendstond heeft goud in de mond, maar precies niet tijdens het weekend.</h2>
            <HighlightWeekVsWeekendLineGraph></HighlightWeekVsWeekendLineGraph>
            <p>Laten we nu even kijken naar het verschil tussen een weekdag en een dag in het weekend. Bijvoorbeeld <b>zondag
              19 september</b> 2021 en <b>maandag 20 september</b> 2021 bij de fietstelpaal <b>Coupure-Links</b>. We
              zien duidelijk dat op de weekdag er veel fietsverkeer is rond 8 uur. Dit is hoogswaarschijnlijk te
              verklaren door alle volwassenen en jongeren die naar hun werk of de les moeten. Dit is niet het geval op
              een zondag en dat zien we dan ook duidelijk terug op bovenstaande grafiek, waar het fietsverkeer pas
              gestaag opgang komt vanaf 10 uur. Ook de piek in de avond rond 17 uur wanneer mensen gedaan hebben met
              werken of met school en huiswaarts keren valt niet te bespeuren tijdens het <b>weekend</b>. Daar merken we
              eerder een <b>constante drukte</b> de hele dag door, eerder dan <b>2 pieken</b> tijdens een
              <b>werkdag</b>.</p>

            <br>
            <p>Laten we nu even inzoomen naar enkel deze maandag en het totaal aantal fietsers opsplitsen tussen deze
              die Gent inwaarts fietsen en deze die Gent uitwaarts fietsen. Dit doen we voor dezelfde fietstelpaal <b>Coupure-Links</b>
              en op deze zelfde maandag.</p>

            <HighlightPeaksLineGraph></HighlightPeaksLineGraph>
            <p>Zoals reeds naar gehint kan dus ook opgemerkt worden dat de piek die we op een <b>weekdag</b> merken in
              de <b>ochtend veel hoger en smaller</b> is dan deze in de avond. Dit zouden we logisch kunnen verklaren
              door het feit dat velen rond 8:30 beginnen met werken of aan hun schooldag beginnen. Iedereen moet dus
              rond hetzelfde tijdstip op locatie zijn in de ochtend. Als we dit nu dus vergelijken met de
              <b>avondpiek</b> dan zien we dat deze <b>veel meer verspreid</b> is. Niet iedereen heeft namelijk op
              hetzelfde moment gedaan met school of werk, en sommigen passeren misschien nog langs bijvoorbeeld de
              winkel voor ze hun fietsroute huiswaarts aanvatten of verderzetten.</p>
            <p>Kijken we specifiek naar het verschil tussen de 2 lijnen, dan kunnen we opmerken dat voor deze
              fietstelpaal er een duidelijk verschil te merken is. We zien dat mensen die deze weg nemen voornamelijk
              buiten het stadscentrum wonen en voor hun werk of school inwaarts moeten aangezien de piek in de ochtend
              het grootst is voor Gent in.</p>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <footer>
      <small>Gevisualiseerd met dank aan de datasets van <a href="https://data.stad.gent/explore/?disjunctive.keyword&disjunctive.theme&sort=modified&q=fietstelpaal">Open Data Portaal Stad Gent</a> en het <a href="https://vlinder.ugent.be/">VLINDER project</a>.</small>
    </footer>
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
import HighlightNewYearLineGraph from './components/HighlightNewYearLineGraph.vue';
import HighlightWeekVsWeekendLineGraph from './components/HighlightWeekVsWeekendLineGraph.vue';
import HighlightPeaksLineGraph from './components/HighlightPeaksLineGraph.vue';

export default {
  components: {
    HighlightPeaksLineGraph,
    HighlightWeekVsWeekendLineGraph,
    HighlightNewYearLineGraph,
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
      if (newStation !== null) {
        this.configureHeatmapsOffset();
      }
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
    });
    loadBicyclingData().then(() => {
      this.bicycleDataLoaded = true;
      this.setupSpecialHeatmapLockdown();
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

p {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

footer {
  margin-top: 4em;
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
