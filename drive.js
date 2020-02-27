const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

class Drive {
  async init() { }
  /**
   * @param {string} filename 
   */
  async downloadFile(filename) { }
  /**
   * @param {string} filename 
   * @param {string} contents 
   */
  async uploadFile(filename, contents) { }
}

class GoogleDrive extends Drive {
  // If modifying these scopes, delete token.json.
  static SCOPES = ['https://www.googleapis.com/auth/drive.appdata'];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  static TOKEN_PATH = 'token.json';
  // Load client secrets from a local file.
  readCredentials() {
    return new Promise((resolve, reject) => {
      fs.readFile('credentials.json', (err, content) => {
        if (err) {
          console.error('Error loading client secret file:', err);
          reject(err);
          return;
        }
        // Authorize a client with credentials, then call the Google Drive API.
        this.authorize(JSON.parse(content), auth => {
          resolve(auth);
        });
      });
    });
  }
  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    this.oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]
    );
    // Check if we have previously stored a token.
    fs.readFile(GoogleDrive.TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(this.oAuth2Client, callback);
      this.oAuth2Client.setCredentials(JSON.parse(token));
      callback(this.oAuth2Client);
    });
  }
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  getAccessToken(oAuth2Client, callback) {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: GoogleDrive.SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      this.oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        this.oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(GoogleDrive.TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', GoogleDrive.TOKEN_PATH);
        });
        callback(this.oAuth2Client);
      });
    });
  }
  constructor() {
    super();
  }
  async init() {
    const auth = await this.readCredentials();
    this.drive = google.drive({ version: 'v3', auth });
  }
  async getIdByFilename(filename) {
    return new Promise((resolve, reject) => {
      this.drive.files.list({
        spaces: ['appDataFolder'],
        pageSize: 1,
        fields: 'files(id, name)',
        q: `name = '${filename}'`
      }, (err, res) => {
        if (err) {
          console.error('The API returned an error: ' + err);
          reject(err);
          return;
        }
        const files = res.data.files;
        if (files.length) {
          return resolve(files[0].id);
        } else {
          console.error('No files found.');
          reject('No files found.');
          return;
        }
      });
    });
  }
  async uploadFile(filename, contents) {
    var fileMetadata = {
      'name': filename,
      'parents': ['appDataFolder']
    };
    var media = {
      mimeType: 'text',
      body: contents
    };
    return new Promise((resolve, rejects) => {
      drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
          rejects(err);
        } else {
          console.log('File Id:', file.data.id);
          resolve(file.data.id);
        }
      });
    });
  }
}

module.exports = { Drive, GoogleDrive };
