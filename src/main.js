
const state = {
  currentComponent: null,
  googleDrive: {
    statusMsg: '',
    firstInitDone: false
  }
};

const loading = Vue.component('loading', {
  data: state,
  render: (h) => {
    if (!state.googleDrive.firstInitDone) {
      return h(
        'span',
        state.googleDrive.statusMsg,
      )
    } else {
      return h('span', 'Done!');
    }
  }
});

state.currentComponent = loading;

var app = new Vue({
  el: '#app',
  data: state,
  render: (h) => {
    return h(state.currentComponent);
  }
});

function changeGoogleDriveStatus(newStatus) {
  console.log(newStatus);
  state.googleDrive.statusMsg = newStatus;
}
