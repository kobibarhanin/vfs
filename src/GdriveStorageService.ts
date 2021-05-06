
const fs = require("fs-extra");
const readline = require("readline");
const { google } = require("googleapis");

export class GoogleStorage implements IStorageService {
  SCOPES = ["https://www.googleapis.com/auth/drive"];
  TOKEN_PATH = "token.json";
  CREDENTIALS_PATH = "credentials.json";
  AUTH: any;

  container_dir_id = '1DXpjOEfQr8HV5RviyW4w7Dp-5oPobmte';
  
  constructor() {
    this.authorize();
  }

  authorize() {
    const credentials = JSON.parse(
      fs.readFileSync(this.CREDENTIALS_PATH, "utf8")
    );
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    try {
      const token = JSON.parse(fs.readFileSync(this.TOKEN_PATH, "utf8"));
      oAuth2Client.setCredentials(token);
      this.AUTH = oAuth2Client;
      return true;
    } catch (err) {
      this.AUTH = this.getAccessToken(oAuth2Client);
      return false;
    }
  }

  getAccessToken(oAuth2Client: any) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code: any) => {
      rl.close();
      oAuth2Client.getToken(code, (err: any, token: any) => {
        if (err) return console.error("Error retrieving access token", err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err: any) => {
          if (err) return console.error(err);
          console.log("Token stored to", this.TOKEN_PATH);
        });
        return oAuth2Client;
      });
    });
  }

  async files(query: string = '*', returns: number = 20): Promise<{name: string}[]> {
    let auth = this.AUTH;
    const drive = google.drive({ version: "v3", auth });
    const files_list = await drive.files.list(
      {
        pageSize: returns,
        q: `'${this.container_dir_id}' in parents`,
        fields: '*',
        spaces: 'drive',
      }
    );
    return files_list.data.files.map((a: any) => a.name)
  }

  download(fileId: string, destination: string): boolean {
    let auth = this.AUTH;
    const drive = google.drive({ version: "v3", auth });
    var dest = fs.createWriteStream(destination);
    let progress = 0;

    drive.files
      .get({ fileId, alt: "media" }, { responseType: "stream" })
      .then((res: any) => {
        res.data
          .on("end", () => {
            console.log("Done downloading file.");
          })
          .on("error", (err: any) => {
            console.error("Error downloading file.");
          })
          .on("data", (d: any) => {
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
    const drive = google.drive({ version: "v3", auth });

    var fileMetadata = {
      name: "test.jpg",
    };
    var media = {
      mimeType: "image/jpeg",
      body: fs.createReadStream("items/test.jpg"),
    };
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id",
      },
      function (err: any, file: any) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          console.log("File Id: ", file.id);
        }
      }
    );

    return true;
  }
}




// async files(query: string = '*', returns: number = 20): Promise<string[]> {
//     let auth = this.AUTH;
//     const drive = google.drive({ version: "v3", auth });
//     return await drive.files.list(
//       {
//         pageSize: returns,
//         // look for files in directory:
//         // q: "'1DXpjOEfQr8HV5RviyW4w7Dp-5oPobmte' in parents",
//         // look for folders:
//         // q: "mimeType='application/vnd.google-apps.folder'",
//         // look for file with name:
//         // q: "name contains 'stub'",
//         q: `'${this.container_dir_id}' in parents`,
//         fields: '*',
//         // fields: 'nextPageToken, files(id, name)',
//         spaces: 'drive',
//       },

//       (err: any, res: any) => {
//         if (err) return console.log("The API returned an error: " + err);
//         const files = res.data.files;
//         let files_list: string[] = [];
//         if (files.length) {
//           console.log("Files:");
//           files.map((file: any) => {
//             console.log(`name = ${file.name}, id = ${file.id}`);
//             files_list.push(file.id)
//           });
//         return files_list;
//         } else {
//           console.log("No files found.");
//           return files_list;
//         }
//       }
//     );
