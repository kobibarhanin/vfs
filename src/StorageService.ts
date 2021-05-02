
interface IStorageService {
    upload(): boolean;
    download(id: string, url: string): boolean;
    // files(): string[];
    files(): any;
    authorize(): any;
}


const fs = require("fs-extra");
const readline = require('readline');
const { google } = require('googleapis');

class GoogleStorage implements IStorageService {
    
    SCOPES = ['https://www.googleapis.com/auth/drive'];
    TOKEN_PATH = 'token.json';
    CREDENTIALS_PATH = 'credentials.json';
    AUTH: any;

    constructor(){       
        this.authorize();
    }

    authorize() {
        const credentials = JSON.parse(fs.readFileSync(this.CREDENTIALS_PATH, 'utf8'))
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        try {
            const token = JSON.parse(fs.readFileSync(this.TOKEN_PATH, 'utf8'))
            oAuth2Client.setCredentials(token);
            this.AUTH = oAuth2Client;
        } catch (err) {
            this.AUTH = this.getAccessToken(oAuth2Client);
        }
    } 

    getAccessToken(oAuth2Client:any) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code: any) => {
            rl.close();
            oAuth2Client.getToken(code, (err: any, token: any) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err: any) => {
                if (err) return console.error(err);
                console.log('Token stored to', this.TOKEN_PATH);
            });
            return oAuth2Client;
            });
        });
    }

    files(): any {
        let auth = this.AUTH;
        const drive = google.drive({version: 'v3', auth});
        drive.files.list({
          pageSize: 20,
          fields: 'nextPageToken, files(id, name)',
        }, (err: any, res: any) => {
          if (err) return console.log('The API returned an error: ' + err);
          const files = res.data.files;
          if (files.length) {
            console.log('Files:');
            files.map((file: any) => {
              console.log(`${file.name} (${file.id})`);
            });
          } else {
            console.log('No files found.');
          }
        });    
    }

    async download(fileId:string, destination: string): boolean {
        let auth = this.AUTH;
        const drive = google.drive({version: 'v3', auth});
        var dest = fs.createWriteStream(destination);
        let progress = 0;

        drive.files.get(
          { fileId, alt: 'media' },
          { responseType: 'stream' }
        ).then( (res:any) => {
          res.data
            .on('end', () => {
              console.log('Done downloading file.');
            })  
            .on('error', (err:any) => {
              console.error('Error downloading file.');
            })  
            .on('data', (d:any) => {
              progress += d.length;
              if (process.stdout.isTTY) {
                process.stdout.cursorTo(0);
                process.stdout.write(`Downloaded ${progress} bytes`);
              }   
            })  
            .pipe(dest);
        }); 
        return true;
    }

    upload(): boolean {
        let auth = this.AUTH;
        const drive = google.drive({version: 'v3', auth});

        var fileMetadata = {
            'name': 'test.jpg'
          };
          var media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream('test.jpg')
          };
          drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
          }, function (err:any, file:any) {
            if (err) {
              // Handle error
              console.error(err);
            } else {
              console.log('File Id: ', file.id);
            }
          });    

          return true;
        }
    

}

let gs = new GoogleStorage();
// gs.files();
// gs.download("18EEAc3_k7Nz70eZZMcPuMDOq8FZPQ_h3", "test.jpg")
gs.upload()

// const files = gs.files();
// console.log(files)