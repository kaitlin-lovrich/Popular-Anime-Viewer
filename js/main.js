const $titles = document.querySelector('#titles');

function renderTitles(title) {
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

function populateRow(urlQuery, genreOrCategoryName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', urlQuery);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    // console.log('xhr.response:', xhr.response);
    const $h2 = document.createElement('h2');
    $h2.textContent = genreOrCategoryName.toUpperCase();
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
    for (const title of xhr.response.data) {
      const $titleImage = renderTitles(title);
      $ul.appendChild($titleImage);
    }
    $div.appendChild($ul);
    $div.appendChild($i2);
  });
  xhr.send();
}

populateRow('https://api.jikan.moe/v4/anime?order_by=popularity', 'Popular');

function getGenreId() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v4/genres/anime?filter=genres');
  xhr.responseType = 'json';
  xhr.addEventListener('load', async function () {
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    const createUser = id => {
      return fetch(
        `https://api.jikan.moe/v4/anime?order_by=popularity&genres=${id}`
      );
    };
    async function runPromises() {
      for (const genre of xhr.response.data) {
        // console.log('genre', genre);
        const response = await createUser(genre.mal_id);
        const genreID = await response.json();

        const $h2 = document.createElement('h2');
        $h2.textContent = genre.name.toUpperCase();
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

        for (const title of genreID.data) {
          const $titleImage = renderTitles(title);
          $ul.appendChild($titleImage);
        }
        $div.appendChild($ul);
        $div.appendChild($i2);
        // console.log('genreID', genreID);
        await delay(1000); // 1s
      }
    }
    runPromises();
  });
  xhr.send();
}

getGenreId();
