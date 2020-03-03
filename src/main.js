
function getTemplate(sel) {
  return document.querySelector(sel).outerHTML;
}

const state = {
  currentComponent: null,
  googleDrive: {
    statusMsg: '',
    firstInitDone: false,
    clientInited: false,
  },
  files: [],
};

// const fileItem = Vue.component('main-menu', {
//   template: getTemplate('.file-item'),
//   data: () => state,
//   methods: {
//     edit: function (event) {
//       console.log(edit);
//     }
//   },
//   render: (h) => {
//   },
// });

const mainMenu = Vue.component('main-menu', {
  template: getTemplate('.main-menu'),
  data: () => state,
  methods: {
    gotoListOfFiles: function (event) {
      this.currentComponent = listOfFiles;
    }
  }
});

const listOfFiles = Vue.component('list-of-files', {
  template: getTemplate('.list-of-files'),
  data: () => state,
});

const loading = Vue.component('loading', {
  template: getTemplate('.loading'),
  data: () => state,
});

state.currentComponent = loading;

const app = Vue.component('app', {
  data: () => state,
  render: (h) => {
    if (state.googleDrive.firstInitDone && state.currentComponent == loading) {
      state.currentComponent = mainMenu;
    }
    return h(state.currentComponent);
  }
});

new Vue({
  el: '.app',
  data: () => state,
});

function changeGoogleDriveStatus(newStatus) {
  console.log(newStatus);
  state.googleDrive.statusMsg = newStatus;
}
