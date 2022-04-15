/**
 * Here all functions related to the bicycling stations are implemented if they are generic.
 * Functions related to a specific visualisation should be defined in its own component.
 *
 */
import * as d3 from 'd3';

export async function getDataFromStation(station, year = null, start = 0, rows = 100) {
  // v2 // return await d3.json('https://data.stad.gent/api/v2/catalog/datasets/fietstelpaal-' + station + (year == null ? '' : '-' + year) + '-gent/records?offset=' + start +'&limit=' + rows);
  return await d3.json('https://data.stad.gent/api/records/1.0/search/?dataset=fietstelpaal-' + station + (year == null ? '' : '-' + year) + '-gent&q=&start=' + start + '&rows=' + rows + '&sort=-ordening&facet=ordening');
}

export function getDataFromResultObject(result) {
  return result.records.map(r => r.fields);
}

export async function getAllDataFromStation(station, year = null) {
  let start = 0
  let rows = 10000
  let total = rows + 1
  let result = []

  // todo: while loop die alle rows ophaalt en ze merged adhv getDataFromResultObject
  // gaatniet want resultObject velden zijn undefined wtf
  let resultObject = (await getDataFromStation(station, year, start, rows));
  return resultObject;
}

export function groupPerDay(data) {
  const dataMap = d3.group(data.records, (element) => element.fields.datum);
  const groupedData = Array.from(dataMap).map(([key, value]) => (
    {
      date: new Date(key),
      count: value.map(item => parseInt(item.fields.totaal) || 0).reduce((a, b) => a + b),
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
    obj.tegenrichting = parseInt(obj.tegenrichting) + parseInt(d.tegenrichting);
    obj.hoofdrichting = parseInt(obj.hoofdrichting) + parseInt(d.hoofdrichting);
    obj.totaal = parseInt(obj.totaal) + parseInt(d.totaal);
    obj.datum = d.datum;
    obj.locatie = d.locatie;
    obj.uur5minuten = parseInt(d.uur5minuten.split(":")[0]) // + ":00";
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
