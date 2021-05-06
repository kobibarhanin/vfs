
import { Dropbox } from "dropbox";

const accessToken =
  "rO3g09Rj-5wAAAAAAAAAAZUB5hwaMoamCrIZlhg9diCnCFdGyG5qgKueBSg5xZa5";

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



