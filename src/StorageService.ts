interface IStorageService {

  // authorize with the storage service
  authorize(): boolean;

  // upload a file from local fs to storage service
  upload(file_path: any): boolean;

  // download a file from storage service to local fs
  download(file_id: string, file_path: string): boolean;
  
  // return a list of files to some query
  files(query: string, returns: number): Promise<any>;
  
}
