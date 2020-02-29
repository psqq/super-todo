
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
    renderHtml(el, s);
  }
}

function renderHtml(parent, htmlStr) {
  if (!parent) parent = document.body;
  parent.innerHTML = htmlStr;
}

function makeButton(title, fn) {
  return `<button onclick="${fn.name}()">${title}</button>`
}

function showListOfFiles(el) {
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
  list.add(makeButton("Show main menu", showMainMenu));
  list.render(el);
}


function showMainMenu(el) {
  let list = new List();
  list.add(makeButton("Show list of files", showListOfFiles));
  list.render(el);
}

showMainMenu();
