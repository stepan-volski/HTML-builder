const fs = require('fs');
const path = require('path');
const srcFolder = path.join(__dirname, "files");
const destFolder = path.join(__dirname, "files-copy");

fs.readdir(srcFolder, { withFileTypes: true }, (err, files) => {
    fs.rmdir(destFolder, { recursive: true }, () => {
        fs.mkdir(destFolder, { recursive: true }, () => {
            files.forEach(file => {
                let src = path.join(srcFolder, file.name);
                let dest = path.join(destFolder, file.name);
                fs.copyFile(src, dest, () => { });
            })
        });
    });
});