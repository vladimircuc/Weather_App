var card_holder = document.getElementById("weather");
var subtitles = card_holder.querySelectorAll("h6");
var images = card_holder.querySelectorAll("i");
var modal_title = document.querySelector(".modal-title");
var list = document.querySelector("ul");
var items = list.querySelectorAll("li");
const cities = ["Lakeland", "Oradea", "Miami", "LA"]; 


const apiUrls = [
    "https://api.open-meteo.com/v1/forecast?latitude=28.0395&longitude=-81.949806&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&temperature_unit=fahrenheit&timezone=America%2FNew_York",
    "https://api.open-meteo.com/v1/forecast?latitude=47.0458&longitude=21.9183&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&temperature_unit=fahrenheit&timezone=America%2FNew_York",
    "https://api.open-meteo.com/v1/forecast?latitude=25.7743&longitude=-80.1937&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&temperature_unit=fahrenheit&timezone=America%2FNew_York",
    "https://api.open-meteo.com/v1/forecast?latitude=34.0522&longitude=-118.2437&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&temperature_unit=fahrenheit&timezone=America%2FNew_York",
];


const jsonResponses = [];

async function fetchAllData() {
    try {
        
        for (const url of apiUrls) {
            const response = await fetch(url); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); 
            
            jsonResponses.push(data); 
        }
        console.log(jsonResponses);
        return jsonResponses;
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    

}

async function init(){
    var jsons = await fetchAllData();
    var temperatures = [];
    var weathers  = [];
    var icons = [];

    for (var json of jsons)
    {
        var temp = json.current.temperature_2m;
        var code = json.current.weather_code;
        temperatures.push(temp);
        var weather = getWeather(code);
        weathers.push(weather[0]);
        icons.push(weather[1]);
    }



    console.log(temperatures);
    subtitles.forEach((subtitle, index) => {
        subtitle.innerHTML = weathers[index] + " - " + temperatures[index] + "&deg;F";
    });

    images.forEach((image, index) => {
        image.className = icons[index];
    });
    card_holder.addEventListener("click", function(event) {
        // Check if the clicked element is an <a>
        if (event.target.tagName === "A") {
            var parent = event.target.parentElement;
            var card = parent.querySelector("h5");
            var location = card.textContent;
            var index = cities.indexOf(location);
            updateModal(index, jsons);
        }
    });
    
}

function getWeather(code){
    switch(code)
    {
        case 0:
        case 1:
            return ["Clear", "bi-sun"];
        case 2:
            return ["Partly Cloudy", "bi-cloud-sun"];
        case 3:
            return ["Cloudy", "bi-cloud"];
        case 45:
        case 48:
            return ["Fog", "bi-cloud-fog"];
        case 51:
        case 53:
        case 55:
            return ["Light Rain", "bi-cloud-drizzle"];
        case 61:
        case 63:
        case 80:
        case 81:
            return ["Rain", "bi-cloud-rain"];
        case 65:
        case 82:
            return ["Heavy Rain", "bi-cloud-rain-heavy"];
        case 56:
        case 57:
        case 66:
        case 67:
            return ["Icy Rain", "bi-cloud-sleet"];
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            return ["Snow", "bi-cloud-snow"];
        case 95:
        case 96:
        case 99:
            return ["Thunderstorm", "bi-cloud-lightning-rain"];
        default:
            return ["Unknown", "x"];
    }
}


init();





function updateModal(index, jsons){
    var currentJson = jsons[index];
    var cityName = cities[index];
    var maxes = [];
    var mins = [];
    var winds = [];
    var weathers = [];
    var icons = [];

    modal_title.textContent = "Forecast for " + cityName;
    for(var i = 0; i< 7; i++)
    {
        var max = currentJson.daily.temperature_2m_max[i];
        var min = currentJson.daily.temperature_2m_min[i];
        var wind = currentJson.daily.wind_speed_10m_max[i];
        var code = currentJson.daily.weather_code[i];
        var weather_icon = getWeather(code);
        maxes.push(max);
        mins.push(min);
        winds.push(wind);
        weathers.push(weather_icon[0]);
        icons.push(weather_icon[1]);
    }

    items.forEach((item, index) => {
        var icon = item.querySelector("i");
        icon.className = icons[index];
        const textNode = document.createTextNode(`    ${maxes[index]}°F / ${mins[index]}°F - ${weathers[index]}, ${winds[index]} mph wind`);
        item.innerHTML = ""; 
        item.appendChild(icon); 
        item.appendChild(textNode); 
        
    });
}
    