
class List {
  items = [];
  add(item) {
    this.items.push(item);
  }
  render(el) {
    let s = '';
    for(let item of this.items) {
      s += `<li>${item}</li>`;
    }
    s = `<ul>${s}</ul>`;
    el.innerHTML = s;
  }
}

function showListOfFiles(el) {
  if (!el) el = document.body;
  let i = 0;
  let list = new List();
  while (1) {
    let key  = localStorage.key(i);
    if (!key) {
      break;
    }
    list.add(key);
    i++;
  }
  list.add(`<button onclick="showMainMenu()">Show main menu</button>`);
  list.render(el);
}


function showMainMenu(el) {
  if (!el) el = document.body;
  let list = new List();
  list.add(`<button onclick="showListOfFiles()">Show list of files</button>`);
  list.render(el);
}

showMainMenu();
