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
export async function getWeatherStationData(start = null, end = null){
	if (start === null){
		return await d3.json(STATION_LINK);
	}
	// convert dates to YYYY-MM-DD
	start = moment(new Date(start)).format("YYYY-MM-DD");
	end = moment(new Date(end)).format("YYYY-MM-DD");

	return await d3.json(STATION_LINK + '?start=' + start + '&end=' + end);
}