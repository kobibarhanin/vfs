
import { Dropbox } from "dropbox";
import { accessToken } from "../tokens/dropbox_token.json";
export class DropboxStorage implements IStorageService {
    
    dbx: any;
      
    constructor() {
        this.authorize();        
    }
    
    async files(query: string = '', returns: number = 10): Promise<any> {
        const response = await this.dbx.filesListFolder({ path: "" });
        const files = response.result.entries;
        return files.map((a: any) => a.name)
    }
    
    authorize(): boolean {
        this.dbx = new Dropbox({ accessToken: accessToken });
        return true;
    }
    upload(file_path: any): boolean {
        throw new Error("Method not implemented.");
    }
    download(file_id: string, file_path: string): boolean {
        throw new Error("Method not implemented.");
    }

}



