import { GoogleStorage } from "./GdriveStorageService";
import { DropboxStorage } from "./DropboxStorageService";

(async ()=>{

    // let google_service = new GoogleStorage();
    // const files = await google_service.files();
    // google_service.download("18EEAc3_k7Nz70eZZMcPuMDOq8FZPQ_h3", "items/test.jpg")
    // console.log(files)
    
    let dropbox_service = new DropboxStorage();
    const files = await dropbox_service.files();
    console.log(files)

})();




