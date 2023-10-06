const $titles = document.querySelector('#titles');
// D for desktop lines 3-6
// const $homeD = document.querySelector('#home');
const $tvShowsD = document.querySelector('#tv-shows');
const $moviesD = document.querySelector('#movies');
// const $searchD = document.querySelector('#search');
// M for mobile 7-10
// const $homeM = document.querySelector('.home');
const $tvShowsM = document.querySelector('.tv-shows');
const $moviesM = document.querySelector('.movies');
// const $searchM = document.querySelector('.search');
// console.log('home', $homeD.tagName, $homeM.tagName);

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

function getGenreId(category) {
  // Gets an array of objects containing genre-id's from the Jikan API
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
    const getGenre = id => {
      if (category === 'tv-shows') {
        return fetch(
          `https://api.jikan.moe/v4/anime?order_by=popularity&type=tv&genres=${id}`
        );
      } else if (category === 'movies') {
        return fetch(
          `https://api.jikan.moe/v4/anime?order_by=popularity&type=movie&genres=${id}`
        );
      } else {
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
        await delayGetGenreID(1000); // .7s
      }
    }
    runPromises();
  });
  xhr.send();
}

// Default page population
// getGenreId();
// document.addEventListener('DOMContentLoaded', getGenreId);

// filter the page to only show tv or movie categories
function fiterTvMovies(event) {
  // event.target is either tv or movie category button
  const $h2 = document.querySelector('h2');
  const $img = document.querySelector('img');
  if (event.target === $tvShowsD || event.target === $tvShowsM) {
    if ($h2 === null) {
      getGenreId('tv-shows');
    }
  } else if (event.target === $moviesD || event.target === $moviesM) {
    if ($h2 === null) {
      getGenreId('movies');
    } else if ($img.baseURI.includes('index.html#tv-shows')) {
      $titles.childNodes.remove();
      getGenreId('movies');
    }

    // how to clear data thats currently on page if !== movies
  }
  // console.dir($titles);
}
// Populates the homepage with only the TV shows categories when clicked
$tvShowsD.addEventListener('click', fiterTvMovies);
$tvShowsM.addEventListener('click', fiterTvMovies);
// Populates the homepage with only the movie categories when clicked
$moviesD.addEventListener('click', fiterTvMovies);
$moviesM.addEventListener('click', fiterTvMovies);

// ill need a 'DOMContentLoaded' event listener on the document object to populate the page when it gets refreshed with the appropriate data category, all, tv shows or movies, whichever $button's class is 'active'
