import { GoogleStorage } from "./GdriveStorageService";
import { DropboxStorage } from "./DropboxStorageService";

(async ()=>{

    let files;

    let google_service = new GoogleStorage();
    files = await google_service.files();
    console.log(files)
    // google_service.download("18EEAc3_k7Nz70eZZMcPuMDOq8FZPQ_h3", "items/test.jpg")

    let dropbox_service = new DropboxStorage();
    files = await dropbox_service.files();
    console.log(files)

})();
