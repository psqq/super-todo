const defaultEl = document.querySelector('.app');
const { el, mount } = redom;

class List {
  items = [];
  add(item) {
    this.items.push(item);
  }
  render(el) {
    let s = '';
    for (let item of this.items) {
      s += `<li>${item}</li>`;
    }
    s = `<ul>${s}</ul>`;
    renderHtml(s, el);
  }
}

function getJsonItem(key) {
  return JSON.parse(localStorage.getItem(key));
}

function renderHtml(htmlStr, parent) {
  if (!parent) parent = defaultEl;
  parent.innerHTML = htmlStr;
}

function renderRedom(elForRender, parent) {
  if (!parent) parent = defaultEl;
  redom.
}

function makeButton(title, fn, ...args) {
  return `<button onclick="${fn.name}(${args.join(',')})">${title}</button>`
}

function editFile(id) {
  let file = getJsonItem(id);
  console.log(file);
  renderHtml(`
    <b>${file.name}</b><br>
    <textarea>${file.content}</textarea><br>
    ${makeButton("Show main menu", showMainMenu)}
  `);
}

function showListOfFiles(el) {
  let list = new List();
  let files = getJsonItem('files');
  for (let { id, name } of files) {
    list.add(name);
    list.add(makeButton("edit", editFile, `'${id}'`));
  }
  list.add(makeButton("Show main menu", showMainMenu));
  list.render(el);
}

function showMainMenu(el) {
  let list = new List();
  list.add(makeButton("Show list of files", showListOfFiles));
  list.render(el);
}

let loadingStatus = '';

function showLoading() {
  renderHtml(`Loading... ${loadingStatus}`);
}

function changeLoadingStatus(newStatus) {
  console.log(newStatus);
  loadingStatus = newStatus;
  showLoading();
}

function stopLoading() {
  showMainMenu();
}

showLoading();
