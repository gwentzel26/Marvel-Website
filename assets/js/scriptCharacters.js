var marvelKey = "382f5c01d7625f70f8568701339fda29";
var ts = "thesoer";
var passhash = "e19ce609473ab49e72381d59be07f3e1";
var imdbApiStart = "https://imdb-api.com/en/API/AdvancedSearch/";
var imdbSecondary = "?companies=marvel&count=5&title=";
var imdbKey = "k_zcmn64r8/";
var charCard = document.querySelector(".charCard");


document.addEventListener("click", function (event) {
    if (event.target.id === "characters") {
        searchCharacterId(event.target.value);
        getMovieInfo(event.target.textContent);
    } else {
        return;
    }
});

function searchCharacterId(event) {
    charCard.textContent = ""
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
        console.log(data)
        postCharacterId(data)
      });
    return result;
  };
  
function postCharacterId (data) {
    var characterContainer = document.createElement("div");
    characterContainer.classList = "col-8 d-flex flex-column align-items-center";
    charCard.append(characterContainer);

    var createHeader = document.createElement("h2");
    createHeader.textContent = data.data.results[0].name;
    characterContainer.append(createHeader);

    var createP = document.createElement("p");
    createP.textContent = data.data.results[0].description;
    characterContainer.append(createP);
  };


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
  };

function postMovieInfo(data) {
    var createH2 = document.createElement("h2");
    createH2.classList = "d-flex justify-content-center"
    charCard.append(createH2);
    createH2.textContent = "Movies:"
  
    var movieContainer = document.createElement("div");
    movieContainer.classList = "d-flex flex-wrap justify-content-center";
    charCard.append(movieContainer);

    if (data.results.length === 0) {
        var createPara = document.createElement("p")
        createPara.textContent = "No movie data found"
        movieContainer.append(createPara)
    } else {
        for (i=0; i<data.results.length; i++) { 
            var createDiv = document.createElement("div");
            var createImg = document.createElement("img");
            var createNewDiv = document.createElement("div")
            var createP = document.createElement("p")
            createDiv.classList = "card col-3 m-2"
            createDiv.setAttribute("style", "width: 18rem;")
            createImg.classList = "card-img-top h-100"
            createImg.setAttribute("src", data.results[i].image)
            createNewDiv.classList = "card-body p-3"
            createP.classList = "card-text"
            createP.textContent = data.results[i].title
            movieContainer.append(createDiv);
            createDiv.append(createImg);
            createDiv.append(createNewDiv);
            createNewDiv.append(createP);
  }}};
  