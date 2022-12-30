/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable max-len */
/** ******************************************************************************
 -----------------------------------Importer-------------------------------------
 ******************************************************************************* */

import './style/style.scss';
import getDataLastHour from './api-smhi-temp-last-hour-gbg';
import getDataWind from './api-smhi-wind-gbg';
import getDataAllStationsLastHour from './api-smhi-lasthour-allstations';
import getChosenStationData from './chosen-station-data';

/** ******************************************************************************
 ------------------------Hämtade element från html-------------------------------
 ******************************************************************************* */

const searchField = document.querySelector('#searchField') as HTMLInputElement; // Sökrutan
const searchDropdownPosition = document.querySelector('#searchDropdown') as HTMLDivElement; // Min position boxen
const searchDropdownStations = document.querySelector('#dropdownStations') as HTMLDivElement; // Diven med förslagna stationer som kommer fram när användaren söker efter ort i sökrutan
const ulSuggestedStation = document.querySelector('#suggestedStations') as HTMLUListElement; // Ul med föslagna stationer som visas när användaren skriver i sökrutan
const backgroundImg = document.querySelector('main') as HTMLElement; // Main, hämtad för att ändra bakgrundsbild
const temperatureNowContainer = document.querySelector('#temperatureNowContainer') as HTMLElement; //  Boxen som innehåller temperatur, hämtad för att ändra bakgrundbild
const rainAmount = document.querySelector('#rainAmount') as HTMLParagraphElement; // P taggen för nederbörd
const windSpeedNow = document.querySelector('#windSpeed') as HTMLParagraphElement; // P taggen för vindstyrka
const temperatureNow = document.querySelector('#temperatureNow') as HTMLParagraphElement; // P taggen för tempratur
const locality = document.querySelector('#locality') as HTMLHeadingElement; // H2 för ort
const positionDoesNotExist = document.querySelector('#positionDoNotExist') as HTMLParagraphElement; // P taggen med information om att platsåtkomst inte är tillgänglig
const myPosition = document.querySelector('#myPosition') as HTMLLIElement; // Li för min position
let stations: Array<object> = []; // Arrayen med alla stationer hämtade från SMHI
let filterStations = [...stations]; // Kopierad array av arrayen stations

/** ******************************************************************************
 -Göteborg-Landvetter Flygplats, som alltid visas när användaren går in på sidan-
 ******************************************************************************* */

async function dataGothenburg() {
  const data: object = (await getDataLastHour()) as object;
  const dataWind: object | null = await getDataWind();

  // Tempratur i Göteborg Landvetter
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
  temperatureNow.innerHTML = `<span>${data.value[0].value}</span>`;

  // Rubrik Göteborg-Landvetter flygplats
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
  locality.innerHTML = `<span>${data.station.name}</span>`;

  // Visar vindhastighet från Göteborg-Landvetter flygplats
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
  windSpeedNow.innerHTML = `<span>${dataWind?.value[0].value}</span>`;

  // Visar att det inte finns något värde på nederbörd
  rainAmount.innerHTML = '<span> - </span>';
}

await dataGothenburg();

/** ******************************************************************************
 ----------------------------------Sökrutan, sök ort-----------------------------
 ******************************************************************************* */

// Öppnar och stänger min position boxen, samt ul med alla förslagna stationer när användaren skriver i inputrutan
function openDropdowns(): void {
  if (searchField.value === '') {
    searchDropdownPosition.classList.remove('display-none');
    searchDropdownStations.classList.add('display-none');
  } else {
    searchDropdownPosition.classList.add('display-none');
    searchDropdownStations.classList.remove('display-none');
  }
}

// Öppnar boxen min position när sökrutan är klickad på och har fokus på sig
function openDropdownPosition(e: Event): void {
  e.stopPropagation();
  searchDropdownPosition.classList.remove('display-none');
}

// Stänger alla boxar som tillhör sökrutan
function closeAllDropdowns(): void {
  searchDropdownPosition.classList.add('display-none');
  searchDropdownStations.classList.add('display-none');
}

// Skapar eventlisteners till när användaren interagerar med sökrutan
searchField?.addEventListener('input', openDropdowns);
searchField?.addEventListener('click', openDropdownPosition);
searchField?.addEventListener('focus', openDropdownPosition);
window.addEventListener('click', closeAllDropdowns);

/** ******************************************************************************
 -------Identifierar station, samt visar temperatur och vind på webbsidan---------
 ******************************************************************************* */

async function setSelectedStation(clickedStationIndex: number, checkFilteredStations: boolean) {
  let checkStations = stations;
  if (checkFilteredStations) {
    checkStations = filterStations;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const clickedStationKey: string = checkStations[clickedStationIndex].key; // Får ut den valda stationens värde i key för att identifiera vilken station som är vald
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const clickedStationName: string = checkStations[clickedStationIndex].name; // Får ut den valda stationens namn
  const data = await getChosenStationData(clickedStationKey, 'latest-hour', 1); // Skickar in parametrar key och period för att hämta ut temperaturen
  const dataWind = await getChosenStationData(clickedStationKey, 'latest-hour', 4); // Skickar in parametrar key och period för att hämta ut vindhastighet
  const dataRain = await getChosenStationData(clickedStationKey, 'latest-hour', 7); // Skickar in key 7 för att hämta ut nederbörd senaste timmen

  // Om värderna vind, temperatur eller nederbörd inte finns skriv stället ut -
  temperatureNow.innerHTML = '<span> - </span>';
  windSpeedNow.innerHTML = '<span> - </span>';
  rainAmount.innerHTML = '<span> - </span>';

  // Skriver ut den valda ortens rubrik på webbsidan
  locality.innerHTML = `<span>${clickedStationName}</span>`;
  if (data.value[0].value) {
    // Skriver ut tempratur om det finns för den valda station på webbsidan
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
    temperatureNow.innerHTML = `<span>${data?.value[0].value}</span>`;
  }

  if (dataWind.value[0].value) {
    // Skriver ut vindhastighet om det finns för den valda station på webbsidan
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
    windSpeedNow.innerHTML = `<span>${dataWind?.value[0].value}</span>`;
  }

  if (dataRain.value[0].value) {
    // Skriver ut nederbörds värde om det finns för den valda station på webbsidan
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
    rainAmount.innerHTML = `<span>${dataRain?.value[0].value}</span>`;
  }
}

async function chosenStation(e: Event) {
  const clickedStationIndex: number = e?.target?.id as number; // Vald station får ett index i listan av förslagna stationer

  await setSelectedStation(clickedStationIndex, true);
}

// Gör så det går att använda enter knappen för att välja station
async function enterOnStation(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    const clickedStationIndex: number = e?.target?.id as number; // Vald station får ett index i listan av förslagna stationer
    await setSelectedStation(clickedStationIndex, true);
  }
}

/** *******************************************************************************************
 Hämtar alla stationer från smhis API samt lokaliserar närmaste station när min position klickas
 ********************************************************************************************* */

// Hämtar alla stationer från API samt min position och visar närmaste station när min position klickas
async function dataAllStationsLastHour(): Promise<void> {
  // Väntar på att all data hämtas från APIn innan den skriver ut datan på sidan
  const data: object = (await getDataAllStationsLastHour()) as object;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  stations = data.station;

  // Räknar ut närmaste station
  async function showPosition(position: object) {
    let shortestDistance = -1;
    let index = NaN;
    // Kollar efter alla stationers longitude och latitude samt jämför avstånd mellan användarens position och stationerna
    for (let i = 0; i < stations.length; i++) {
      // Hämtar alla stationernas longitude och latitude
      const latitude: number = stations[i].latitude as number;
      const longitude: number = stations[i].longitude as number;

      // Jämför avstånd mellan stationer och användarens position genom pytagoras
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      const compareLatitude = latitude - position.coords.latitude;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      const compareLongitude = longitude - position.coords.longitude;
      const diffrenceLongLat = Math.sqrt(compareLatitude ** 2 + compareLongitude ** 2);
      if (diffrenceLongLat < shortestDistance || shortestDistance === -1) {
        shortestDistance = diffrenceLongLat;
        index = i;
      }
    }
    await setSelectedStation(index, false);
  }

  // Begär åtkomst av användarens position
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      searchDropdownPosition.classList.add('display-none');
    } else {
      positionDoesNotExist.innerHTML = 'Ingen position hittad';
    }
  }

  myPosition?.addEventListener('click', getUserLocation);
  myPosition?.addEventListener('keypress', getUserLocation);
}

await dataAllStationsLastHour();

/** ******************************************************************************
 ---------- Filtrera stationerna när användaren skriver i sökfältet---------------
 ******************************************************************************* */

// Jämför ordet som skrivs i sökrutan om det finns med i namet på några av stationerna
function stationSuggetions(): void {
  if (stations) {
    ulSuggestedStation.innerHTML = '';
    // Skapar en ny array varje gång jag skriver en bokstav och jämför namnen med de i sökrutan
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    filterStations = stations.filter(station => station.name.toLowerCase().includes(searchField.value.toLowerCase()));
  }
  // Skriver ut 5 eller färre stationsnamn i form av li element som matchar med de som skrivs i sökrutan
  for (let i = 0; i < 5; i++) {
    if (filterStations[i]) {
      const liItem = document.createElement('li');
      liItem.setAttribute('tabindex', '3');
      liItem.id = String([i]); // Ger varje li ett id i form av indexet
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const suggestedStation = document.createTextNode(filterStations[i].name);
      liItem.appendChild(suggestedStation);
      ulSuggestedStation.appendChild(liItem);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      liItem?.addEventListener('click', chosenStation); // För att kunna klicka och välja en förslagen station i sökrutan
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      liItem?.addEventListener('keypress', enterOnStation);
    }
  }
}

searchField?.addEventListener('input', stationSuggetions);

/** ******************************************************************************
 ---------------------Bakgrundsbild ändras beroende på årstid---------------------
 ******************************************************************************* */
const today = new Date();

if (today.getMonth() === 11 || today.getMonth() <= 1) {
  backgroundImg.classList.add('winter-img');
  temperatureNowContainer.classList.add('winter-decoration-img');
} else if (today.getMonth() === 2 || today.getMonth() <= 4) {
  backgroundImg.classList.add('spring-img');
  temperatureNowContainer.classList.add('spring-decoration-img');
} else if (today.getMonth() === 5 || today.getMonth() <= 7) {
  backgroundImg.classList.add('summer-img');
  temperatureNowContainer.classList.add('summer-decoration-img');
} else {
  backgroundImg.classList.add('fall-img');
  temperatureNowContainer.classList.add('fall-decoration-img');
}
