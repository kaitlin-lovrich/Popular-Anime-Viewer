const $titles = document.querySelector('#titles');
// D for desktop lines 3-6
const $homeD = document.querySelector('#home');
const $tvShowsD = document.querySelector('#tv-shows');
const $moviesD = document.querySelector('#movies');
// const $searchD = document.querySelector('#search');
// M for mobile 7-10
const $homeM = document.querySelector('.home');
const $tvShowsM = document.querySelector('.tv-shows');
const $moviesM = document.querySelector('.movies');
// const $searchM = document.querySelector('.search');

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

// Gets an array of objects containing genre-id's from the Jikan API
function getGenreId(category) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/genres/anime?filter=genres');
  xhr.responseType = 'json';
  xhr.addEventListener('load', async function () {
    // Delays the function from running all at once,
    // instead will run every <specified> miliseconds (ms)
    function delayGetGenreID(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Uses the Jikan API endpoint to search for <interpolated id>
    // Update page view data and sets activated button
    const getGenre = id => {
      if (category === 'tv-shows') {
        data.lastView = 'tv-shows';
        $tvShowsD.className = 'active';
        $tvShowsM.className = 'tv-shows active';
        $moviesD.className = '';
        $moviesM.className = 'movies';
        $homeD.className = '';
        $homeM.className = 'home';
        return fetch(
          `https://api.jikan.moe/v4/anime?order_by=popularity&type=tv&genres=${id}`
        );
      } else if (category === 'movies') {
        data.lastView = 'movies';
        $moviesD.className = 'active';
        $moviesM.className = 'movies active';
        $tvShowsD.className = '';
        $tvShowsM.className = 'tv-shows';
        $homeD.className = '';
        $homeM.className = 'home';
        return fetch(
          `https://api.jikan.moe/v4/anime?order_by=popularity&type=movie&genres=${id}`
        );
      } else {
        data.lastView = 'home';
        $homeD.className = 'active';
        $homeM.className = 'home active';
        $tvShowsD.className = '';
        $tvShowsM.className = 'tv-shows';
        $moviesD.className = '';
        $moviesM.className = 'movies';
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
        await delayGetGenreID(1000); // 1s
      }
    }
    runPromises();
  });
  xhr.send();
}

// Uses previous view data to keep user on same page if window is refreshed
document.addEventListener('DOMContentLoaded', function () {
  if (data.lastView === 'home') {
    showAllTitles();
  } else if (data.lastView === 'tv-shows') {
    fiterTv();
  } else if (data.lastView === 'movies') {
    filterMovies();
  } else {
    showAllTitles();
  }
});

// Populates the homepage with both the TV shows and Movies when clicked
$homeD.addEventListener('click', showAllTitles);
$homeM.addEventListener('click', showAllTitles);
function showAllTitles() {
  if (data.lastView !== 'home') {
    window.stop();
    $titles.innerHTML = '';
    getGenreId();
  }
}

// Populates the homepage with only the TV shows when clicked
$tvShowsD.addEventListener('click', fiterTv);
$tvShowsM.addEventListener('click', fiterTv);
function fiterTv() {
  if (data.lastView !== 'tv-shows') {
    window.stop();
    $titles.innerHTML = '';
    getGenreId('tv-shows');
  }
}

// Populates the homepage with only the movies when clicked
$moviesD.addEventListener('click', filterMovies);
$moviesM.addEventListener('click', filterMovies);
function filterMovies() {
  if (data.lastView !== 'movies') {
    window.stop();
    $titles.innerHTML = '';
    getGenreId('movies');
    data.lastView = 'movies';
  }
}
