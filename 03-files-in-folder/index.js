const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, "secret-folder");

fs.readdir(dir, { withFileTypes: true }, (err, files) => {
  files.forEach(file => {
    if (!file.isDirectory()) {
      let filePath = path.join(dir, file.name);
      fs.stat(filePath, (err, stats) => {
        console.log(file.name.split(".")[0] + " - " + file.name.split(".")[1] + " - " + Math.ceil(stats.size / 1024) + "kb");
      });
    }
  });
});