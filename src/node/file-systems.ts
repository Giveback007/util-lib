import * as fs from 'fs';
import * as fsPath from 'path';

export const deleteFile = (path: string) =>
{
  if (fs.existsSync(path)) {
    if (!fs.lstatSync(path).isDirectory())
      return fs.unlinkSync(path);
    else
      fs.readdirSync(path).forEach((file) =>
        deleteFile(fsPath.join(path, file))
      );

    fs.rmdirSync(path);
  }
}
