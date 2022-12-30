// eslint-disable-next-line max-len
const urlTempLastHourGbg =
  'https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/72420/period/latest-hour/data.json';

async function getDataLastHour() {
  return fetch(urlTempLastHourGbg)
    .then((data) => data.json())
    .then((json: object) => json)
    .catch((err) => {
      console.error(err);
      return null;
    });
}

export default getDataLastHour;
