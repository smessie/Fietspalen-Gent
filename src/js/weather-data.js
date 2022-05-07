import * as d3 from 'd3';
import moment from 'moment';

export const STATION_LINK = 'https://mooncake.ugent.be/api/measurements/zZ6ZeSg11dJ5zp5GrNwNck9A'; // UGent campus Sterre

export let data = [];

export async function load() {
  const start = new Date('01/01/2020');
  const end = new Date();
  data = await getWeatherData(start, end);
}

// example:
// https://mooncake.ugent.be/api/measurements/0xwg6AsDvbnxXzB4S3c2BRyJ?start=2022-03-22&end=2022-03-23
// this will get all weather data until the day before end day!
// this takes some time, but it might be good because else we would send the requests too fast
// solution: loading image (for now it doesn't really matter)
async function getWeatherData(start = null, end = null) {
  let result = [];

  if (start === null) {
    return await d3.json(STATION_LINK);
  }

  // convert dates to YYYY-MM-DD
  start = new Date(start);
  end = new Date(end);

  let nextDate = new Date(start);
  nextDate = new Date(nextDate.setMonth(nextDate.getMonth() + 1));

  while (nextDate < end) {
    let startString = moment(start).format('YYYY-MM-DD');
    let nextDateString = moment(nextDate).format('YYYY-MM-DD');

    let month = await d3.json(STATION_LINK + '?start=' + startString + '&end=' + nextDateString);
    result = result.concat(month);

    start = new Date(nextDate);
    nextDate = new Date(nextDate.setMonth(nextDate.getMonth() + 1));
  }

  start = moment(start).format('YYYY-MM-DD');
  end = moment(end).format('YYYY-MM-DD');
  let month = await d3.json(STATION_LINK + '?start=' + start + '&end=' + end);

  result = result.concat(month);

  return result;
}

/**
 * year should be integer!
 */
export async function getWeatherDataForYear(year) {
  let start = new Date('01/01/' + year.toString());
  let end = new Date('01/01/' + (year + 1).toString());
  return data.filter(x => new Date(x.time) >= start && new Date(x.time) < end);
}

export function groupPerMonth() {
  const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'Septempber', 'Oktober', 'November', 'December'];
  const dataMap = d3.group(data, (element) => new Date(element.time).getMonth());
  return Array.from(dataMap).map(([key, value]) => (
    {
      month: key,
      monthName: monthNames[key],
      rainVolume: value.map(item => item.rainVolume).reduce((a, b) => a + b)
    }));
}
