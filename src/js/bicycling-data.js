/**
 * Here all functions related to the bicycling stations are implemented if they are generic.
 * Functions related to a specific visualisation should be defined in its own component.
 *
 */
import { assert } from '@vue/compiler-core';
import * as d3 from 'd3';
import bataviabrug2018 from '../assets/datasets/fietstelpaal-bataviabrug-2018-gent.json';
import bataviabrug2019 from '../assets/datasets/fietstelpaal-bataviabrug-2019-gent.json';
import bataviabrug2020 from '../assets/datasets/fietstelpaal-bataviabrug-2020-gent.json';
import bataviabrug2021 from '../assets/datasets/fietstelpaal-bataviabrug-2021-gent.json';
import bijlokekaai2021 from '../assets/datasets/fietstelpaal-bijlokekaai-2021-gent.json';
import coupureLinks2021 from '../assets/datasets/fietstelpaal-coupure-links-2021-gent.json';
import dampoortZuid2018 from '../assets/datasets/fietstelpaal-dampoort-zuid-2018-gent.json';
import dampoortZuid2019 from '../assets/datasets/fietstelpaal-dampoort-zuid-2019-gent.json';
import dampoortZuid2020 from '../assets/datasets/fietstelpaal-dampoort-zuid-2020-gent.json';
import dampoortZuid2021 from '../assets/datasets/fietstelpaal-dampoort-zuid-2021-gent.json';
import gaardeniersbrug2020 from '../assets/datasets/fietstelpaal-gaardeniersbrug-2020-gent.json';
import gaardeniersbrug2021 from '../assets/datasets/fietstelpaal-gaardeniersbrug-2021-gent.json';
import groendreef2018 from '../assets/datasets/fietstelpaal-groendreef-2018-gent.json';
import groendreef2019 from '../assets/datasets/fietstelpaal-groendreef-2019-gent.json';
import groendreef2020 from '../assets/datasets/fietstelpaal-groendreef-2020-gent.json';
import groendreef2021 from '../assets/datasets/fietstelpaal-groendreef-2021-gent.json';
import zuidparklaan2018 from '../assets/datasets/fietstelpaal-zuidparklaan-2018-gent.json';
import zuidparklaan2019 from '../assets/datasets/fietstelpaal-zuidparklaan-2019-gent.json';
import zuidparklaan2020 from '../assets/datasets/fietstelpaal-zuidparklaan-2020-gent.json';
import zuidparklaan2021 from '../assets/datasets/fietstelpaal-zuidparklaan-2021-gent.json';


export const data = {
  'bataviabrug-2018': bataviabrug2018,
  'bataviabrug-2019': bataviabrug2019,
  'bataviabrug-2020': bataviabrug2020,
  'bataviabrug-2021': bataviabrug2021,
  'bijlokekaai-2021': bijlokekaai2021,
  'coupure-links-2021': coupureLinks2021,
  'dampoort-zuid-2018': dampoortZuid2018,
  'dampoort-zuid-2019': dampoortZuid2019,
  'dampoort-zuid-2020': dampoortZuid2020,
  'dampoort-zuid-2021': dampoortZuid2021,
  'gaardeniersbrug-2020': gaardeniersbrug2020,
  'gaardeniersbrug-2021': gaardeniersbrug2021,
  'groendreef-2018': groendreef2018,
  'groendreef-2019': groendreef2019,
  'groendreef-2020': groendreef2020,
  'groendreef-2021': groendreef2021,
  'zuidparklaan-2018': zuidparklaan2018,
  'zuidparklaan-2019': zuidparklaan2019,
  'zuidparklaan-2020': zuidparklaan2020,
  'zuidparklaan-2021': zuidparklaan2021,
};


export async function getDataFromStation(station, year = null, start = 0, rows = 100) {
  // v2 // return await d3.json('https://data.stad.gent/api/v2/catalog/datasets/fietstelpaal-' + station + (year == null ? '' : '-' + year) + '-gent/records?offset=' + start +'&limit=' + rows);
  return await d3.json('https://data.stad.gent/api/records/1.0/search/?dataset=fietstelpaal-' + station + (year == null ? '' : '-' + year) + '-gent&q=&start=' + start + '&rows=' + rows + '&sort=-ordening&facet=ordening');
}

export function getDataFromResultObject(result) {
  return result.records.map(r => r.fields);
}

export async function getAllDataFromStation(station, year = null) {
  return data[station + (year == null ? '' : '-' + year)];
}

export function groupPerDay(data) {
  const dataMap = d3.group(data, (element) => element.fields.datum);
  const groupedData = Array.from(dataMap).map(([key, value]) => (
    {
      date: new Date(key),
      totaal: value.map(item => parseInt(item.fields.totaal) || 0).reduce((a, b) => a + b),
      hoofdrichting: value.map(item => parseInt(item.fields.hoofdrichting) || 0).reduce((a, b) => a + b),
      tegenrichting: value.map(item => parseInt(item.fields.tegenrichting) || 0).reduce((a, b) => a + b)
    }));
  return groupedData;
}

export function combineMinutesToHours(data){
  let result = []
  let i = 0
  let obj = ({uur5minuten: "0", datum: "", tegenrichting: "0", hoofdrichting: "0", totaal: "0", locatie: ""})

  for (const d of data){
    obj.tegenrichting = (parseInt(obj.tegenrichting) || 0) + (parseInt(d.tegenrichting) || 0);
    obj.hoofdrichting = (parseInt(obj.hoofdrichting) || 0)+ (parseInt(d.hoofdrichting) || 0);
    obj.totaal = (parseInt(obj.totaal) || 0) + (parseInt(d.totaal) || 0);
    obj.datum = d.datum;
    obj.locatie = d.locatie;
    obj.uur5minuten = parseInt(d.uur5minuten.split(":")[0]) + ":00";
    i += 1;

    if (i == 12){
      result.push(obj);
      i = 0;
      obj = ({uur5minuten: "0", datum: "", tegenrichting: "0", hoofdrichting: "0", totaal: "0", locatie: ""})
    }
  }
  return result;
}

export function getDataFromDate(data, date){
  return data.filter(function (el) {
    return el.datum == date;
  });
}

export function getDataLambda(direction){
  if (direction == "totaal"){
    return (d) => d.totaal;
  } else if (direction == "hoofd"){
    return (d) => d.hoofdrichting;
  } else if (direction == "tegen") {
    return (d) => d.tegenrichting;
  }
  assert(false, "Given direction that doesn't exist.");
}

export function getYScaleLambda(yScale, direction){
  if (direction == "totaal"){
    return (d) => yScale(d.totaal);
  } else if (direction == "hoofd"){
    return (d) => yScale(d.hoofdrichting);
  } else if (direction == "tegen") {
    return (d) => yScale(d.tegenrichting);
  }
  assert(false, "Given direction that doesn't exist.");
}
