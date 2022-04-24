import * as d3 from 'd3';

const STATION_ID = "lPh9kCaXyDhdcmI1dSY4WjDF" // sterrewacht armand pien

export async function getWeatherStationData() {
  // v2 // return await d3.json('https://data.stad.gent/api/v2/catalog/datasets/fietstelpaal-' + station + (year == null ? '' : '-' + year) + '-gent/records?offset=' + start +'&limit=' + rows);
  let data = await d3.json('https://mooncake.ugent.be/api/stations');
	for (let obj of data){
		if (obj['id'] == STATION_ID){
			console.log(obj);
			return await d3.json(obj['measurements']);
		}
	}
}