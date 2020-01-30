import fs = require('fs');
import fsPath = require('path');

export const deleteFile = (path: string) => {
    if (fs.existsSync(path)) {

        fs.readdirSync(path).forEach((file) => {
          const curPath = fsPath.join(path, file);
          if (fs.lstatSync(curPath).isDirectory())
            deleteFile(curPath);
          else
            fs.unlinkSync(curPath);
        });

        fs.rmdirSync(path);

    }
}
