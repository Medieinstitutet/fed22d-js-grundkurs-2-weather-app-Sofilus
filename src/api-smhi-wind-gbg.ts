// eslint-disable-next-line max-len
const urlWind = 'https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/4/station/72420/period/latest-hour/data.json';

async function getDataWind() {
  return fetch(urlWind)
    .then((data) => data.json())
    .then((json: object) => json)
    .catch((err) => {
      console.error(err);
      return null;
    });
}

export default getDataWind;
