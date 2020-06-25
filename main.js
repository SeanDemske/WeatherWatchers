const api = {
    key: '4fe2169bdae668e1facaece3faa424f9',
    baseurl: 'https://api.openweathermap.org/data/2.5',
}

const State = {
    units: 'imperial',
    text: '°F',
    weather: 'wi-cloud'
}

let activeSearch = '';
let metric = false;
let weatherUnits = document.querySelectorAll('.weather-units');
const searchBox = document.querySelector('.search-box');
const selectorCelsius = document.querySelector('#sel-celsius');
const selectorFahrenheit = document.querySelector('#sel-fahrenheit');
let imageIcon = document.querySelector('#image-icon');
searchBox.addEventListener('keypress', setQuery);
selectorCelsius.addEventListener('click', unitSelected);
selectorFahrenheit.addEventListener('click', unitSelected);

function updateState(sel) {
    if (sel.srcElement.id ==="sel-celsius" && metric === false) {
        State.units = 'metric';
        State.text = '°C';
        metric = true;
        selectorCelsius.classList.toggle('selected');
        selectorFahrenheit.classList.toggle('selected');
    } else if (sel.srcElement.id ==="sel-fahrenheit" && metric) {
        State.units = 'imperial';
        State.text = '°F'
        metric = false;
        selectorCelsius.classList.toggle('selected');
        selectorFahrenheit.classList.toggle('selected');
    }
    console.log(activeSearch);
    if (activeSearch) getResults(activeSearch);
}

function unitSelected(event) {
    updateState(event)
    weatherUnits = document.querySelectorAll('.weather-units');
    weatherUnits.forEach(function(unit) {
        unit.innerText = State.text;
    });
}

function setQuery(event) {
    if (event.keyCode === 13) {
        getResults(searchBox.value);
        activeSearch = searchBox.value;
    }
}

function getResults(query) {
    fetch(`${api.baseurl}/weather?q=${query}&units=${State.units}&appid=${api.key}`)
    .then(weather => {
        return weather.json();
    })
    .then(displayResults);
}

function displayResults(weather) {
    console.log(weather);
    let displayCity = document.querySelector('.location .city');
    let now = new Date();
    let displayDate = document.querySelector('.location .date');
    let weatherGeneral = weather.weather[0].main;
    if (weather.cod !== '404') {
        displayCity.innerText = `${weather.name}, ${weather.sys.country}`;
        displayDate.innerText = dateParser(now);
    }


    let displayTemp = document.querySelector('.current .temp');
    displayTemp.innerHTML = `${Math.round(weather.main.temp)}<span class='weather-units'>${State.text}</span>`;

    let displayWeather = document.querySelector('.current .weather');
    displayWeather.innerText = weatherGeneral;

    let displayHiLow = document.querySelector('.hi-low');
    displayHiLow.innerHTML = `${Math.round(weather.main.temp_min)}<span class='weather-units'>
    ${State.text}</span> / 
    ${Math.round(weather.main.temp_max)}<span class='weather-units'>${State.text}</span>`;

    imageIcon.classList.remove(State.weather);
    switch(weatherGeneral)
    {
        case 'Rain': 
            State.weather = 'wi-rain';
            break;
        
        case 'Clear':
            State.weather = 'wi-cloud';
            break;

        case 'Clouds': 
            State.weather = 'wi-cloudy';
            break;
        
        case 'Sunny':
            State.weather = 'wi-day-sunny';
            break;

        default: 
            State.weather = 'wi-cloud';
            break;
    }
    imageIcon.classList.add(State.weather);
}

function dateParser(d) {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}