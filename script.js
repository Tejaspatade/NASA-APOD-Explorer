// https://api.nasa.gov/
// https://api.nasa.gov/planetary/apod?api_key=

// Creating & Storing Favorites Section in Local Storage
let favorites = {};

function saveToFavorites(itemURL) {
  // Looping thru fetchedArray to select Img to be added to Favs
  fetchedArray.forEach((item) => {
    if (item.url.includes(itemURL) && !favorites[itemURL]) {
      favorites[itemURL] = item;

      // Display Confirmation MsgBox
      msgBox.style.visibility = "visible";
      setTimeout(() => {
        msgBox.style.visibility = "hidden";
      }, 2000);

      // Saving to localStorage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

// Removing from Favs & Local Storage
function removeFromFavorites(itemURL) {
  if (favorites[itemURL]) {
    delete favorites[itemURL];

    // Saving Changes to localStorage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));

    // Refreshing the Page after Removing this item
    updateDOM("favorites");
  }
}

function showContent() {
  loader.classList.add("hidden");
  container.classList.remove("hidden");
}

// Basic DOM Manipulation
const container = document.getElementById("container");
const navBar = document.getElementById("navigation");
const cardContainer = document.querySelector(".cards-container");
const msgBox = document.getElementById("msg-box");
const loader = document.querySelector(".loader");

function createCards(page) {
  // Setting Page Variable
  const currentArray =
    page === "results" ? fetchedArray : Object.values(favorites);

  currentArray.forEach((obj) => {
    //   Creating a Card
    const card = document.createElement("div");
    card.classList.add("card");

    // Anchor Tag to Hold Image as a Link
    const anchor = document.createElement("a");
    anchor.href = obj.hdurl;
    anchor.title = "View Full Image";
    anchor.target = "_blank";

    // Image
    const image = document.createElement("img");
    image.src = obj.url;
    image.alt = "NASA Picture Of the Day";
    image.loading = "lazy";
    image.classList.add("card-img");

    // Description
    const description = document.createElement("div");
    description.classList.add("card-description");
    // Title
    const cardTitle = document.createElement("h1");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = obj.title;
    //Add To Favs
    const addToFavs = document.createElement("p");
    addToFavs.classList.add("addtofavorites");
    if (page === "results") {
      addToFavs.textContent = "Add To Favorites";
      addToFavs.setAttribute("onclick", `saveToFavorites('${obj.url}')`);
    } else {
      addToFavs.textContent = "Remove From Favorites";
      addToFavs.setAttribute("onclick", `removeFromFavorites('${obj.url}')`);
    }
    // Card Text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = obj.explanation;

    // Footer Container
    const footer = document.createElement("p");
    footer.classList.add("text-muted");
    // Date
    const date = document.createElement("strong");
    date.textContent = obj.date;
    // Copyright
    const copyright = document.createElement("span");
    const copyHolder = obj.copyright === undefined ? "" : obj.copyright;
    copyright.textContent = ` ${copyHolder}`;

    // --------------
    // Appending Card Elements
    cardContainer.appendChild(card);
    card.append(anchor, description);
    anchor.append(image);
    description.append(cardTitle, addToFavs, cardText, footer);
    footer.append(date, copyright);
  });
}

function updateDOM(page) {
  // Get Favs from localStorage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }

  // Refreshes Page by removing Previously appended items to relad items to be displayed
  cardContainer.textContent = "";

  // Creating and displaying Cards
  createCards(page);
  showContent();
}

// ------------------------------------------------
// NASA APOD API URL
const apiKey = config.API_Key;
const count = "10";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let fetchedArray = [];

// Fetching 10 Images from NASA API
async function getNASAImg() {
  // Display Loading Animation
  loader.classList.remove("hidden");
  //  Hide Page Content
  container.classList.add("hidden");

  try {
    const response = await fetch(apiUrl);
    fetchedArray = await response.json();
    updateDOM("results");
  } catch (error) {
    console.log(error);
  }
}

// Load
getNASAImg();
