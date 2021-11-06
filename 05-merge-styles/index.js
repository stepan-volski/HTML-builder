const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, "styles");
const outputFile = path.join(__dirname, "project-dist", "bundle.css");



fs.writeFile(outputFile, '', function (err) {                               //clear dir before writing

    fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {        //collect files for bundle
        files.forEach(file => {
            if (file.name.split(".")[1] === "css") {
                writeFileToBundle(file.name);                               //bundle files
            }
        })
    });


});


function writeFileToBundle(fileName) {
    const stream = new fs.ReadStream(path.join(stylesDir, fileName));
    stream.on('readable', () => {
        let data;
        while (data = stream.read()) {
            fs.appendFile(outputFile, data.toString(), function (err) { });
        }
    });
}