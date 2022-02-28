var main = document.querySelector("main");
var mainRow = document.getElementById("mainRow");
var searchButton = document.getElementById("searchBtn");
var searchContainer = document.getElementById("searchContainer");
var characterContainer = document.getElementById("characterContainer");
var userInput = document.getElementById("charSearch");
var background = document.getElementById("homePic");
var movieContainer = document.getElementById("movieContainer");
var searchHistory = document.getElementById("searchHistory");
var savedSearches = JSON.parse(localStorage.getItem("hero")) || [];
var currentSearch = savedSearches.length;
var buttonNumber = 0;
var imdbApiStart = "https://imdb-api.com/en/API/AdvancedSearch/";
var imdbSecondary = "?companies=marvel&count=5&title=";
var imdbKey = "k_zcmn64r8/";
var marvelApiStart =
  "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=";
var marvelKey = "382f5c01d7625f70f8568701339fda29";
var ts = "thesoer";
var passhash = "e19ce609473ab49e72381d59be07f3e1";
var infinityBtn = document.getElementById("infinityBtn");
var comicContainer = document.getElementById("comicContainer");

init();
function init() {
  for (i = 0; i < savedSearches.length; i++) {
    var searchResult = savedSearches[i];
    var createButton = document.createElement("button");
    createButton.textContent = searchResult.name;
    createButton.setAttribute("value", searchResult.id);
    createButton.setAttribute("id", "characters");
    searchHistory.append(createButton);
    buttonNumber++;
    if (buttonNumber > 5) {
      searchHistory.removeChild(searchHistory.children[0]);
    }
  }
}

function getHeroInfo() {
  var requestUrl =
    "https://gateway.marvel.com/v1/public/characters?ts=" +
    ts +
    "&apikey=" +
    marvelKey +
    "&hash=" +
    passhash +
    "&nameStartsWith=" +
    userInput.value;
  console.log(requestUrl);
  var result = fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      postHeroInfo(data);
    });

  return result;
}

function getMovieInfo(userSearch) {
  var requestUrl = imdbApiStart + imdbKey + imdbSecondary + userSearch;
  var result = fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      postMovieInfo(data);
    });
  return result;
}

function postHeroInfo(data) {
  characterContainer.innerHTML = "";
  movieContainer.innerHTML = "";
  background.style.backgroundImage = "none";
  background.setAttribute("class", "bg-white");
  for (i = 0; i < 10; i++) {
    console.log(data.data.results[i].name);
    var createButton = document.createElement("button");
    createButton.textContent = data.data.results[i].name;
    createButton.classList = "btn btn-secondary";
    createButton.setAttribute("value", data.data.results[i].id);
    createButton.setAttribute("id", "characters");
    characterContainer.append(createButton);
  }
}

function postMovieInfo(data) {
  changeClasses();
  var createH2 = document.createElement("h2");
  movieContainer.append(createH2);
  createH2.textContent = "Movies:";
  if (data.results.length === 0) {
    var createPara = document.createElement("p");
    createPara.textContent = "No movie data found";
    movieContainer.append(createPara);
  } else {
    for (i = 0; i < data.results.length; i++) {
      var createDiv = document.createElement("div");
      var createImg = document.createElement("img");
      var createNewDiv = document.createElement("div");
      var createP = document.createElement("p");
      createDiv.classList = "card col-3 m-2";
      createDiv.setAttribute("style", "width: 18rem;");
      createImg.classList = "card-img-top";
      createImg.setAttribute("src", data.results[i].image);
      createNewDiv.classList = "card-body p-3";
      createP.classList = "card-text";
      createP.textContent = data.results[i].title;
      movieContainer.append(createDiv);
      createDiv.append(createImg);
      createDiv.append(createNewDiv);
      createNewDiv.append(createP);
    }
  }
}

function searchCharacterId(event) {
  characterContainer.innerHTML = "";
  movieContainer.innerHTML = "";
  var requestUrl =
    "https://gateway.marvel.com/v1/public/characters/" +
    event +
    "?ts=" +
    ts +
    "&apikey=" +
    marvelKey +
    "&hash=" +
    passhash;
  console.log(requestUrl);
  var result = fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      postCharacterId(data);
    });
  return result;
}

function postCharacterId(data) {
  changeClasses();
  var createHeader = document.createElement("h2");
  createHeader.textContent = data.data.results[0].name;
  var createP = document.createElement("p");
  if (data.data.results[0].description === "") {
    createP.textContent = "Character description unavailable";
  } else {
    createP.textContent = data.data.results[0].description;
  }
  characterContainer.append(createHeader);
  characterContainer.append(createP);
}

function savedSearchResults(id, name) {
  if (savedSearches.some((savedSearches) => savedSearches.name === name)) {
    return;
  } else {
    var user = {
      id,
      name,
    };
    savedSearches.push(user);
    localStorage.setItem("hero", JSON.stringify(savedSearches));
    postSearches();
  }
}

function postSearches() {
  var searchResult = savedSearches[currentSearch];
  var createButton = document.createElement("button");
  createButton.textContent = searchResult.name;
  createButton.setAttribute("value", searchResult.id);
  createButton.setAttribute("id", "characters");
  searchHistory.append(createButton);
  currentSearch++;
  buttonNumber++;
  if (buttonNumber > 5) {
    searchHistory.removeChild(searchHistory.children[0]);
  }
}

function changeClasses () {
  main.classList = "container";
  mainRow.classList = "row my-3";
  searchContainer.classList = "col-4 m-1 w-25";
  searchContainer.setAttribute("style", "");
  characterContainer.classList = "col-8";
  movieContainer.classList = "row";
  userInput.classList = "w-75";
}

searchButton.addEventListener("click", getHeroInfo);
document.addEventListener("click", function (event) {
  if (event.target.id === "characters") {
    searchCharacterId(event.target.value);
    getMovieInfo(event.target.textContent);
    savedSearchResults(event.target.value, event.target.textContent);
    background.style.backgroundImage = "none";
    background.setAttribute("class", "bg-white");
  } else {
    return;
  }
});

