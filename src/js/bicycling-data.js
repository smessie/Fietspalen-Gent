/**
 * Here all functions related to the bicycling stations are implemented if they are generic.
 * Functions related to a specific visualisation should be defined in its own component.
 *
 */
import {assert} from '@vue/compiler-core';
import * as d3 from 'd3';
import fietspalen from '../../public/datasets/fietstelpalen-gent.json';


export const data = {
  'fietspalen': fietspalen,
};

export async function load() {
  const datasets = [
    'bataviabrug-2018', 'bataviabrug-2019', 'bataviabrug-2020', 'bataviabrug-2021', 'bijlokekaai-2021', 'coupure-links-2021',
    'dampoort-zuid-2018', 'dampoort-zuid-2019', 'dampoort-zuid-2020', 'dampoort-zuid-2021', 'gaardeniersbrug-2020',
    'gaardeniersbrug-2021', 'groendreef-2018', 'groendreef-2019', 'groendreef-2020', 'groendreef-2021', 'zuidparklaan-2018',
    'zuidparklaan-2019', 'zuidparklaan-2020', 'zuidparklaan-2021'
  ];

  let loaders = []
  datasets.forEach((dataset) => loaders.push(loadDataset(dataset)))
  await Promise.all(loaders)

  return true;
}

async function loadDataset(dataset) {
  return fetch(`./datasets/fietstelpaal-${dataset}-gent.json`)
    .then((result) => result.json())
    .then((result) => data[dataset] = result)
}

export const unavailable = [
  'Visserij',
  'Isabellakaai',
  'Gaardeniersbrug',
]

export function dataIsAvailable(station) {
  return !unavailable.includes(station.naam);
}

export async function getDataFromStation(station, year = null, start = 0, rows = 100) {
  // v2 // return await d3.json('https://data.stad.gent/api/v2/catalog/datasets/fietstelpaal-' + station + (year == null ? '' : '-' + year) + '-gent/records?offset=' + start +'&limit=' + rows);
  return await d3.json('https://data.stad.gent/api/records/1.0/search/?dataset=fietstelpaal-' + station + (year == null ? '' : '-' + year) + '-gent&q=&start=' + start + '&rows=' + rows + '&sort=-ordening&facet=ordening');
}

export function getDataFromResultObject(records) {
  return records.map(r => r.fields);
}

export async function getAllDataFromStation(station, year = null) {
  return data[station + (year == null ? '' : '-' + year)];
}

export function groupPerDay(data) {
  const dataMap = d3.group(data, (element) => element.datum);
  return Array.from(dataMap).map(([key, value]) => (
    {
      date: new Date(key),
      totaal: value.map(item => parseInt(item.totaal) || 0).reduce((a, b) => a + b),
      hoofdrichting: value.map(item => parseInt(item.hoofdrichting) || 0).reduce((a, b) => a + b),
      tegenrichting: value.map(item => parseInt(item.tegenrichting) || 0).reduce((a, b) => a + b)
    }));
}

export function combineMinutesToHours(data) {
  let result = [];
  let i = 0;
  let obj = ({uur5minuten: '0', datum: '', tegenrichting: '0', hoofdrichting: '0', totaal: '0', locatie: ''});

  for (const d of data) {
    obj.tegenrichting = (parseInt(obj.tegenrichting) || 0) + (parseInt(d.tegenrichting) || 0);
    obj.hoofdrichting = (parseInt(obj.hoofdrichting) || 0) + (parseInt(d.hoofdrichting) || 0);
    obj.totaal = (parseInt(obj.totaal) || 0) + (parseInt(d.totaal) || 0);
    obj.datum = d.datum;
    obj.locatie = d.locatie;
    obj.uur5minuten = parseInt(d.uur5minuten.split(':')[0]) + ':00';
    i += 1;

    if (i === 12) {
      result.push(obj);
      i = 0;
      obj = ({uur5minuten: '0', datum: '', tegenrichting: '0', hoofdrichting: '0', totaal: '0', locatie: ''});
    }
  }
  return result;
}

export function getDataForDate(data, date) {
  return data.filter((el) => el.datum === date);
}

export function getDataLambda(direction) {
  if (direction === 'totaal') {
    return (d) => d.totaal;
  } else if (direction === 'hoofd') {
    return (d) => d.hoofdrichting;
  } else if (direction === 'tegen') {
    return (d) => d.tegenrichting;
  }
  assert(false, 'Given direction that doesn\'t exist.');
}

export function getYScaleLambda(yScale, direction) {
  if (direction === 'totaal') {
    return (d) => yScale(d.totaal);
  } else if (direction === 'hoofd') {
    return (d) => yScale(d.hoofdrichting);
  } else if (direction === 'tegen') {
    return (d) => yScale(d.tegenrichting);
  }
  assert(false, 'Given direction that doesn\'t exist.');
}

export function getStations() {
  return data['fietspalen'].map(el => el.fields);
}

export function getDataset(name) {
  return data[name].map(el => el.fields);
}

export function getCompleteDataset(name) {
  return data[name];
}

export function getDataFor(station, year) {
  const dataSetName = station.toLowerCase().replaceAll(' ', '-') + '-' + year;
  return data[dataSetName];
}

export function getAllYearsFor(station) {
  let years = [];
  let yearItr = station.bouwjaar;
  let currentYear = new Date().getFullYear();
  while (yearItr < currentYear) {
    years.push(yearItr);
    yearItr++;
  }
  return years;
}

export function getNameForDataset(station, year) {
  return station.naam.toLowerCase().replaceAll(' ', '-') + '-' + year;
}

export function getAllDatasetNamesFor(station) {
  return getAllYearsFor(station).map((year) => getNameForDataset(station, year));
}

export function getAllDatasetNames() {
  let stations = getStations();
  let datasets = [];
  stations.forEach((s) => {
    if (dataIsAvailable(s)) {
      datasets = datasets.concat(getAllDatasetNamesFor(s));
    }
  });
  return datasets;
}

export function getAllDatasetNamesWithout(exclude) {
  if (!exclude) return getAllDatasetNames();

  let stations = getStations();
  let datasets = [];
  stations.forEach((s) => {
    if (dataIsAvailable(s) && s.naam !== exclude.naam) {
      datasets = datasets.concat(getAllDatasetNamesFor(s));
    }
  });
  return datasets;
}

export function getDatasets() {
  let stations = getStations();
  let datasets = [];
  stations.forEach((station) => {
    if (dataIsAvailable(station)) {
      let datasetYears = getAllYearsFor(station);
      datasetYears.forEach(year => {
        let name = getNameForDataset(station, year);
        datasets.push({
          name,
          year,
          station,
        });
      });
    }
  });
  return datasets;
}


export function calculateDailyAverages(datasets) {
  let weekdays = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  let total = {Zondag: 0, Maandag: 0, Dinsdag: 0, Woensdag: 0, Donderdag: 0, Vrijdag: 0, Zaterdag: 0};
  let counts = {Zondag: 0, Maandag: 0, Dinsdag: 0, Woensdag: 0, Donderdag: 0, Vrijdag: 0, Zaterdag: 0};

  datasets.forEach(data => {
    let previous;
    let weekday;

    data.forEach(record => {
      let date = new Date(record.datum);
      weekday = weekdays[date.getDay()];
      total[weekday] += (record.totaal | 0);

      if (previous !== weekday) {
        counts[weekday] += 1;
        previous = weekday;
      }
    })
    counts[weekday] += 1;
  })

  let result = [];

  for (let key in total) {
    result.push({day: key, total: total[key] / counts[key]});
  }
  return result;
}

function calculateYearTotal(dataset) {
  return getDataset(dataset.name).reduce((total, newDay) => {
    if (parseInt(newDay.totaal)) {
      return parseInt(newDay.totaal) + total;
    }
    return total;
  }, 0);
}

export function calculateTotalsByYear(datasets) {
  let years = {};
  datasets.forEach(dataset => {
    if (!years[dataset.year]) {
      years[dataset.year] = [];
    }
    years[dataset.year].push({name: dataset.station.naam, amount: calculateYearTotal(dataset)});
  });
  return years;
}

const labelMapper = {
  'bataviabrug': {hoofdrichting: 'Gent uit', tegenrichting: 'Gent in'},
  'bijlokekaai': {hoofdrichting: 'Gent in', tegenrichting: 'Gent uit'},
  'coupure-links': {hoofdrichting: 'Gent uit', tegenrichting: 'Gent in'},
  'dampoort-zuid': {hoofdrichting: 'Gent uit', tegenrichting: 'Gent in'},
  'gaardeniersbrug': {hoofdrichting: 'Gent in', tegenrichting: 'Gent uit'},
  'groendreef': {hoofdrichting: 'Gent in', tegenrichting: 'Gent uit'},
  'zuidparklaan': {hoofdrichting: 'Gent in', tegenrichting: 'Gent uit'},
}
export function getLabelForDirection(station, direction) {
  return labelMapper[station][direction];
}
