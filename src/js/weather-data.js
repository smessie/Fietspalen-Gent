import * as d3 from 'd3';
import moment from 'moment';

const STATION_ID = "lPh9kCaXyDhdcmI1dSY4WjDF" // sterrewacht armand pien (most central station)

export const STATION_LINK = 'https://mooncake.ugent.be/api/measurements/lPh9kCaXyDhdcmI1dSY4WjDF'
 
// is also hardcoded in STATION_LINK
export async function getWeatherStationLink() {
  let data = await d3.json('https://mooncake.ugent.be/api/stations');
	for (let obj of data){
		if (obj['id'] == STATION_ID){
			//return await d3.json(obj['measurements']);
			return obj['measurements'];
		}
	}
}

// example:
// https://mooncake.ugent.be/api/measurements/0xwg6AsDvbnxXzB4S3c2BRyJ?start=2022-03-22&end=2022-03-23
// this will get all weather data until the day before end day!
// this takes some time, but it might be good because else we would send the requests too fast
// solution: loading image (for now it doesn't really matter)
export async function getWeatherData(start = null, end = null){
	let result = [];

	if (start === null){
		return await d3.json(STATION_LINK);
	}

	// convert dates to YYYY-MM-DD
	start = new Date(start)
	end = new Date(end)

	let nextDate = new Date(start);
	nextDate = new Date(nextDate.setMonth(nextDate.getMonth()+1));

	while (nextDate < end) {
		let startString = moment(start).format("YYYY-MM-DD");
		let nextDateString = moment(nextDate).format("YYYY-MM-DD");

		let month = await d3.json(STATION_LINK + '?start=' + startString + '&end=' + nextDateString);
		result = result.concat(month);

		start = new Date(nextDate);
		nextDate = new Date(nextDate.setMonth(nextDate.getMonth()+1));
	}

	start = moment(start).format("YYYY-MM-DD");
	end = moment(end).format("YYYY-MM-DD");
	let month = await d3.json(STATION_LINK + '?start=' + start + '&end=' + end);

	result = result.concat(month);

	return result;
}

// year should be integer!
export async function getWeatherDataForYear(year){
	let start = new Date("01/01/" + year.toString());
	let end = new Date("01/01/" + (year+1).toString());
	if (end > new Date()) {
		end = new Date();
	}
	return await getWeatherData(start, end);
}
