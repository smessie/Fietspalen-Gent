const fs = require('fs');

const datasets = [
  'bataviabrug-2018', 'bataviabrug-2019', 'bataviabrug-2020', 'bataviabrug-2021', 'bijlokekaai-2021', 'coupure-links-2021',
  'dampoort-zuid-2018', 'dampoort-zuid-2019', 'dampoort-zuid-2020', 'dampoort-zuid-2021', 'gaardeniersbrug-2020',
  'gaardeniersbrug-2021', 'groendreef-2018', 'groendreef-2019', 'groendreef-2020', 'groendreef-2021', 'zuidparklaan-2018',
  'zuidparklaan-2019', 'zuidparklaan-2020', 'zuidparklaan-2021'
];

const data = {};

async function load() {
  let loaders = []
  datasets.forEach((dataset) => loaders.push(loadDataset(dataset)))
  await Promise.all(loaders)

  return true;
}

async function loadDataset(dataset) {
  const res = require(`../public/datasets/fietstelpaal-${dataset}-gent.json`)
  data[dataset] = res
}

function getDataset(name) {
  return data[name].map(el => el.fields);
}

function combineMinutesToHours(data) {
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
function writeDataset(dataset, d) {
  var jsonContent = JSON.stringify(d);
   
  fs.writeFile(`./transformed/fietstelpaal-${dataset}-gent.json`, jsonContent, 'utf8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File. for" + dataset );
          return console.log(err);
      }
   
      console.log(dataset + "JSON file has been saved.");
  });
}
async function run() {
  await load()
  datasets.forEach(dataset => {
    let d = getDataset(dataset)
    let combined = combineMinutesToHours(d)
    writeDataset(dataset, combined)
  })
}
run()
