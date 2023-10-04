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

const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.jikan.moe/v4/anime?type=tv&order_by=popularity');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  // console.log('xhr.status:', xhr.status);
  // console.log('xhr.response:', xhr.response);
  for (const title of xhr.response.data) {
    const $titleImage = renderTitles(title);
    $titles.appendChild($titleImage);
  }
});
xhr.send();
