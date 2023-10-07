/* exported data */
let data = {
  lastView: ''
};

function stringifyData(event) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storrage', dataJSON);
}
window.addEventListener('beforeunload', stringifyData);

const previousDataJSON = localStorage.getItem('javascript-local-storage');
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}
