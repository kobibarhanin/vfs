import { GoogleStorage } from "./GdriveStorageService";
import { DropboxStorage } from "./DropboxStorageService";

(async ()=>{

    // # log files
    let files;

    // let google_service = new GoogleStorage();
    // files = await google_service.files();
    // console.log(files)

    let dropbox_service = new DropboxStorage();
    files = await dropbox_service.files();
    console.log(files)

    // # download files
    // google_service.download("18EEAc3_k7Nz70eZZMcPuMDOq8FZPQ_h3", "items/test.jpg")

})();
