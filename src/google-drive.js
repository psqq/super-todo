
function initClient() {
  gapi.client.init({
    // Ваш идентификатор клиента
    clientId: '484762285022-a74l5r4fq7gk71p4b0j0199lkkdjetcf.apps.googleusercontent.com',

    // Указание, что мы хотим использовать Google Drive API v3
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],

    // Запрос доступа к application data folder (см. ниже)
    scope: 'https://www.googleapis.com/auth/drive.appfolder'

  }).then(() => {
    // Начинаем ловить события логина/логаута (см. ниже)
    gapi.auth2.getAuthInstance().isSignedIn.listen(onSignIn)
    // инициализация приложения
    initApp(true)

  }, error => {
    console.log('Failed to init GAPI client', error);
    changeGoogleDriveStatus('Failed to init GAPI client');
    // работаем без гугла
    initApp(false)
  })
}

function isGapiLoaded() {
  return gapi && gapi.auth2
}

function logIn() {
  if (isGapiLoaded()) {
    // откроется стандартное окно Google с выбором аккаунта
    return gapi.auth2.getAuthInstance().signIn()
  } else {
    changeGoogleDriveStatus('Error: gapi is not loaded!');
  }
}

function logOut() {
  if (isGapiLoaded()) {
    return gapi.auth2.getAuthInstance().signOut()
  }
}

function isLoggedIn() {
  return isGapiLoaded() && gapi.auth2.getAuthInstance().isSignedIn.get()
}

function onSignIn() {
  if (isLoggedIn()) {
    // пользователь зашел
  } else {
    // пользователь вышел
  }
  // пример реализации см. ниже в разделе "Синхронизация"
}

function prom(gapiCall, argObj) {
  return new Promise((resolve, reject) => {
    gapiCall(argObj).then(resp => {
      if (resp && (resp.status < 200 || resp.status > 299)) {
        console.log('GAPI call returned bad status', resp)
        reject(resp)
      } else {
        resolve(resp)
      }
    }, err => {
      console.log('GAPI call failed', err)
      reject(err)
    })
  })
}

async function createEmptyFile(name, mimeType) {
  const resp = await prom(gapi.client.drive.files.create, {
    resource: {
      name: name,
      // для создания папки используйте
      // mimeType = 'application/vnd.google-apps.folder'
      mimeType: mimeType || 'text/plain',
      // вместо 'appDataFolder' можно использовать ID папки
      parents: ['appDataFolder']
    },
    fields: 'id'
  })
  // функция возвращает строку — идентификатор нового файла
  return resp.result.id
}

async function upload(fileId, content) {
  // функция принимает либо строку, либо объект, который можно сериализовать в JSON
  return prom(gapi.client.request, {
    path: `/upload/drive/v3/files/${fileId}`,
    method: 'PATCH',
    params: { uploadType: 'media' },
    body: content,
    // body: typeof content === 'string' ? content : JSON.stringify(content)
  })
}

async function download(fileId) {
  const resp = await prom(gapi.client.drive.files.get, {
    fileId: fileId,
    alt: 'media'
  })
  // resp.body хранит ответ в виде строки
  // resp.result — это попытка интерпретировать resp.body как JSON.
  // Если она провалилась, значение resp.result будет false
  // Т.о. функция возвращает либо объект, либо строку
  // return resp.result || resp.body
  return resp.body
}

async function find(query) {
  let ret = []
  let token
  do {
    console.log(1);
    const options = {
      // вместо 'appDataFolder' можно использовать ID папки
      spaces: 'appDataFolder',
      fields: 'files(id, name), nextPageToken',
      pageSize: 100,
      orderBy: 'createdTime',
    };
    if (token) {
      options.token = token;
    }
    if (query) {
      options.q = token;
    }
    const resp = await prom(gapi.client.drive.files.list, options);
    console.log(2);
    ret = ret.concat(resp.result.files)
    token = resp.result.nextPageToken;
  } while (token)
  // результат: массив объектов вида [{id: '...', name: '...'}], 
  // отсортированных по времени создания
  return ret
}

async function deleteFile(fileId) {
  try {
    await prom(gapi.client.drive.files.delete, {
      fileId: fileId
    })
    return true
  } catch (err) {
    changeGoogleDriveStatus(err);
    if (err.status === 404) {
      return false
    }
    throw err
  }
}

async function reloadFiles() {
  state.googleDrive.firstInitDone = false;
  changeGoogleDriveStatus('loading files');
  let files = await find();
  localStorage.setItem('files', JSON.stringify(files));
  // let i = 0;
  // for (let { id, name } of files) {
  //   i++;
  //   changeGoogleDriveStatus(`loading file ${name} (${i} / ${files.length})`);
  //   let content = await download(id);
  //   localStorage.setItem(id, JSON.stringify({
  //     id, name, content
  //   }));
  // }
  state.files = files;
  // changeGoogleDriveStatus('All files loaded');
  changeGoogleDriveStatus('List of files loaded');
  state.googleDrive.firstInitDone = true;
}

async function initApp(withGoogle) {
  state.googleDrive.clientInited = withGoogle;
  if (!withGoogle) {
    state.googleDrive.firstInitDone = true;
    return;
  }
  if (!isLoggedIn()) {
    changeGoogleDriveStatus('login');
    try {
      await logIn();
    } catch (err) {
      changeGoogleDriveStatus(err);
    }
  }
  reloadFiles();
}

class GoogleDrive {
  constructor(gapi) {
    this.gapi = gapi;
  }
  loadClient() {
    return new Promise((res, rej) => {
      gapi.load('client', () => {
        res();
      });
    })
  }
}
