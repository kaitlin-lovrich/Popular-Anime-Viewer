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
    // console.log('xhr.status:', xhr.status);
    // console.log('xhr.response:', xhr.response);
    const $h2 = document.createElement('h2');
    $h2.textContent = genreOrCategoryName.toUpperCase();
    const $ul = document.createElement('ul');
    $ul.className = 'row';
    $titles.appendChild($h2);

    for (const title of xhr.response.data) {
      const $titleImage = renderTitles(title);
      // console.log('$titleImage', $titleImage);
      $ul.appendChild($titleImage);
    }
    $titles.appendChild($ul);
  });
  xhr.send();
}

populateRow('https://api.jikan.moe/v4/anime?order_by=popularity&genres=fantasy', 'Fantasy');
populateRow('https://api.jikan.moe/v4/anime?order_by=popularity', 'Popular');

// Position arrow so it is relative to the edge of the screen, not the element? make it so it appears IF the ul row is being hovered

// How to make elements scroll off the screen?

// Why wont both queries run?
