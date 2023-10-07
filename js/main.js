const $titles = document.querySelector('#titles');
// D for desktop lines 3-6
const $homeD = document.querySelector('#home');
const $tvShowsD = document.querySelector('#tv-shows');
const $moviesD = document.querySelector('#movies');
const $searchD = document.querySelector('#search');
// M for mobile 7-10
const $homeM = document.querySelector('.home');
const $tvShowsM = document.querySelector('.tv-shows');
const $moviesM = document.querySelector('.movies');
const $searchM = document.querySelector('.search');

// Creates DOM tree for each <ul> row and appends the title images
function renderRow(genreName, data) {
  const $h2 = document.createElement('h2');
  $h2.textContent = genreName.toUpperCase();
  const $div = document.createElement('div');
  $div.className = 'relative';
  const $i = document.createElement('i');
  $i.className = 'fa-solid fa-chevron-left';
  const $ul = document.createElement('ul');
  $ul.className = 'row';
  const $i2 = document.createElement('i');
  $i2.className = 'fa-solid fa-chevron-right';

  $titles.appendChild($h2);
  $titles.appendChild($div);
  $div.appendChild($i);
  for (const title of data) {
    const $titleImage = renderTitleImages(title);
    $ul.appendChild($titleImage);
  }
  $div.appendChild($ul);
  $div.appendChild($i2);
}

// Creates DOM tree for the title images
function renderTitleImages(title) {
  const $li = document.createElement('li');
  const $div = document.createElement('div');
  $div.className = 'relative';
  const $img = document.createElement('img');
  $img.setAttribute('src', title.images.jpg.image_url);
  $img.setAttribute('alt', 'title image');
  const $span = document.createElement('span');
  $span.className = 'fa-solid fa-ellipsis-vertical';
  $li.appendChild($div);
  $div.appendChild($img);
  $div.appendChild($span);
  return $li;
}

function setActive(view) {
  switch (view) {
    case $homeD:
    case $homeM:
      $homeD.className = 'active';
      $homeM.className = 'home active';
      $tvShowsD.className = '';
      $tvShowsM.className = 'tv-shows';
      $moviesD.className = '';
      $moviesM.className = 'movies';
      $searchD.className = '';
      $searchM.className = 'search';
      break;
    case $tvShowsD:
    case $tvShowsM:
      $homeD.className = '';
      $homeM.className = 'home';
      $tvShowsD.className = 'active';
      $tvShowsM.className = 'tv-shows active';
      $moviesD.className = '';
      $moviesM.className = 'movies';
      $searchD.className = '';
      $searchM.className = 'search';
      break;
    case $moviesD:
    case $moviesM:
      $homeD.className = '';
      $homeM.className = 'home';
      $tvShowsD.className = '';
      $tvShowsM.className = 'tv-shows';
      $moviesD.className = 'active';
      $moviesM.className = 'movies active';
      $searchD.className = '';
      $searchM.className = 'search';
      break;
    case $searchD:
    case $searchM:
      $homeD.className = '';
      $homeM.className = 'home';
      $tvShowsD.className = '';
      $tvShowsM.className = 'tv-shows';
      $moviesD.className = '';
      $moviesM.className = 'movies';
      $searchD.className = 'active';
      $searchM.className = 'search active';
  }
}

// Shows page view specified by parameter
function showPageView(view) {
  // Gets an array of objects containing genre-id's from the Jikan API
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/genres/anime?filter=genres');
  xhr.responseType = 'json';
  xhr.addEventListener('load', async function () {
    // Delays the function from running all at once,
    // instead will run every <specified> miliseconds (ms)
    function delayShowPageView(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Uses the Jikan API endpoint to search for <interpolated id>
    // Update page view data and sets activated button
    const getGenre = id => {
      if (view === 'tv-shows') {
        data.lastView = 'tv-shows';
        console.log('data.lastView:', data.lastView);
        setActive($tvShowsD);
        setActive($tvShowsM);
        return fetch(
          `https://api.jikan.moe/v4/anime?order_by=popularity&type=tv&genres=${id}`
        );
      } else if (view === 'movies') {
        data.lastView = 'movies';
        console.log('data.lastView:', data.lastView);
        setActive($moviesD);
        setActive($moviesM);
        return fetch(
          `https://api.jikan.moe/v4/anime?order_by=popularity&type=movie&genres=${id}`
        );
      } else {
        data.lastView = 'home';
        console.log('data.lastView:', data.lastView);
        setActive($homeD);
        setActive($homeM);
        return fetch(
          `https://api.jikan.moe/v4/anime?order_by=popularity&genres=${id}`
        );
      }
    };
    // Promise function that will run when the promise is met
    // runPromises will generate a DOM tree for each genre of the
    // array of genres returned from getGenre function call
    async function runPromises() {
      for (const genre of xhr.response.data) {
        const response = await getGenre(genre.mal_id);
        const endpointGenreId = await response.json();
        renderRow(genre.name, endpointGenreId.data);
        await delayShowPageView(1000); // 1s
      }
    }

    runPromises();
  });
  xhr.send();
}

function showSearchView() {
  console.log('showSearchView function running line 160');
  data.lastView = 'search';
  console.log('showSearchView data.lastView:', data.lastView);
  setActive($searchD);
  setActive($searchM);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/anime?order_by=popularity');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log('xhr.response:', xhr.response);
    renderRow('Search Results', xhr.response.data);
    renderRow('Popular Picks', xhr.response.data);
  });
  xhr.send();
  // const response = await fetch('https://api.jikan.moe/v4/anime?order_by=popularity');
  // const popularPicks = await response.json();
  // console.log(popularPicks);
}

// Uses previous view data to keep user on same page if window is refreshed
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded event handler running line 181');
  if (data.lastView === 'home') {
    showPageView();
    console.log('DOMContentLoaded if "home" running line 184');
  } else if (data.lastView === 'tv-shows') {
    showPageView('tv-shows');
    console.log('DOMContentLoaded if "tv-shows" running line 187');
  } else if (data.lastView === 'movies') {
    showPageView('movies');
    console.log('DOMContentLoaded if "movies" running line 190');
  } else if (data.lastView === 'search') {
    showSearchView();
    console.log('DOMContentLoaded if "search" running line 193');
  } else {
    showPageView();
    console.log('DOMContentLoaded "else" running line 196');
  }
});

// Populates the homepage with both the TV shows and Movies when clicked
$homeD.addEventListener('click', showAllTitles);
$homeM.addEventListener('click', showAllTitles);
function showAllTitles() {
  console.log('showAllTitles event handler running line 204');
  if (data.lastView !== 'home') {
    window.stop();
    $titles.innerHTML = '';
    showPageView();
    data.lastView = 'home';
  }
}

// Populates the homepage with only the TV shows when clicked
$tvShowsD.addEventListener('click', fiterTv);
$tvShowsM.addEventListener('click', fiterTv);
function fiterTv() {
  console.log('filterTv event listener running line 217');
  if (data.lastView !== 'tv-shows') {
    window.stop();
    $titles.innerHTML = '';
    showPageView('tv-shows');
    data.lastView = 'tv-shows';
  }
}

// Populates the homepage with only the movies when clicked
$moviesD.addEventListener('click', filterMovies);
$moviesM.addEventListener('click', filterMovies);
function filterMovies() {
  console.log('filterMovies event listener running line 230');
  if (data.lastView !== 'movies') {
    window.stop();
    $titles.innerHTML = '';
    showPageView('movies');
    data.lastView = 'movies';
  }
}

// Shows the search page
$searchD.addEventListener('click', showSearchPage);
$searchM.addEventListener('click', showSearchPage);
function showSearchPage() {
  console.log('showSearchPage event listener running line 243');
  if (data.lastView !== 'search') {
    window.stop();
    $titles.innerHTML = '';
    showSearchView();
    data.lastView = 'search';
  }
}

// referto lines 18-21 in code journal to handle input
// also will need to set a timeout or setInterval and maybe clear timeout
// also the submit form function below that

// Need to fix application to refresh and stay on last viewd page

// test setActive(); make sure when event handlers are called that moblie classnames get APPENDED the active class and not overwritten
// console.log($.className);

// Inside the DOMCOntentLoaded
// Need to set view swap in that top function, not nested inside others for it to work on refresh?
// if <ul>includes(#html.) data.lastView = 'home'?
