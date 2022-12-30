// Hämtar data från smhis api när användaren väljer ort. Den hämtar temp senaste timmen.
async function getChosenStationData(key: string, period: string, parameter: number) {
  // eslint-disable-next-line max-len
  const url = `https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/${parameter}/station/${key}/period/${period}/data.json`;
  return fetch(url)
    .then((data) => data.json())
    .then((json: object) => json)
    .catch((err) => {
      console.error(err);
      return null;
    });
}

export default getChosenStationData;
