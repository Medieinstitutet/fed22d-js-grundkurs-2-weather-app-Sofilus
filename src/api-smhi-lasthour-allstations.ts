// eslint-disable-next-line max-len
const urlTempLastHourAllStations = 'https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1.json';

async function getDataAllStationsLastHour() {
  return fetch(urlTempLastHourAllStations)
    .then((data) => data.json())
    .then((json: object) => json)
    .catch((err) => {
      console.error(err);
      return null;
    });
}

export default getDataAllStationsLastHour;
