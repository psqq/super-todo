
function getTemplate(sel) {
  return document.querySelector(sel).outerHTML;
}

function getFileContent(id) {
  return JSON.parse(localStorage.getItem(id)).content;
}

const state = {
  statusBar: {
    msg: '',
  },
  currentComponent: null,
  googleDrive: {
    statusMsg: '',
    firstInitDone: false,
    clientInited: false,
  },
  files: [],
  currentFile: {
    id: '',
    name: '',
    content: '',
  },
};

const fileEditor = Vue.component('file-editor', {
  template: getTemplate('.file-editor'),
  data: () => state,
  props: ['idx'],
  computed: {
    content: function () {
      return getFileContent(this.files[this.idx].id);
    }
  },
  methods: {
    save: async function (event) {
      state.statusBar.msg = `saving file ${state.currentFile.name}...`;
      localStorage.setItem(state.currentFile.id, JSON.stringify({
        id: state.currentFile.id,
        name: state.currentFile.name,
        content: state.currentFile.content,
      }));
      await upload(state.currentFile.id, state.currentFile.content);
      state.statusBar.msg = `file ${state.currentFile.name} saved!`;
    },
    back: function (event) {
      state.currentComponent = mainMenu;
    }
  },
});

const fileItem = Vue.component('file-item', {
  template: getTemplate('.file-item'),
  data: () => state,
  props: ['idx'],
  computed: {
    name: function () {
      return this.files[this.idx].name;
    }
  },
  methods: {
    edit: function (event) {
      this.currentFile.id = this.files[this.idx].id;
      this.currentFile.name = this.files[this.idx].name;
      this.currentFile.content = getFileContent(this.files[this.idx].id);
      state.currentComponent = fileEditor;
    }
  },
});

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
  methods: {
    addFile: async function (event) {
      const name = prompt("Filename");
      state.statusBar.msg = 'Creating new empty file...';
      await createEmptyFile(name);
      reloadFiles();
    }
  }
});

const statusBar = Vue.component('status-bar', {
  template: getTemplate('.status-bar'),
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
  state.statusBar.msg = newStatus;
}
