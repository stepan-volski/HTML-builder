const fs = require('fs');
const fsP = fs.promises;
const path = require('path');
const distFolder = path.join(__dirname, "project-dist");
const componentsFolder = path.join(__dirname, "components");
const stylesFolder = path.join(__dirname, "styles");


fs.mkdir(distFolder, () => {
    generateIndex();
    generateStyles();
    generateAssets();
});


async function generateAssets() {
    const srcBaseFolder = path.join(__dirname, "assets");
    const destBaseFolder = path.join(distFolder, "assets");

    await fsP.mkdir(destBaseFolder, { recursive: true });

    let files = [];
    let folders = await collectNestedFolders();

    //record all files to array
    for (const folder of folders) {
        await collectAllFilesFromFolder(folder);
    }

    //create dest folders
    for (const folder of folders) {
        await fsP.mkdir(path.join(destBaseFolder, folder), { recursive: true });
    }

    //copy files to dest folders
    files.forEach(file => copyFiles(file));


    async function collectNestedFolders() {
        let arr = await fsP.readdir(srcBaseFolder, { withFileTypes: true });
        return arr.map(folder => folder.name);
    }

    async function collectAllFilesFromFolder(folderName) {
        const folder = path.join(srcBaseFolder, folderName);
        let arr = await fsP.readdir(folder, { withFileTypes: true });
        arr.forEach(file => files.push(path.join(folderName, file.name)));
    }

    async function copyFiles(fileName) {
        fsP.copyFile(path.join(srcBaseFolder, fileName), path.join(destBaseFolder, fileName));
    }

}

async function generateStyles() {
    const outputFile = path.join(distFolder, "style.css");

    await fsP.writeFile(outputFile, '', function (err) { });                    //clear bundle
    const files = await fsP.readdir(stylesFolder, { withFileTypes: true });     //collect css files
    files.forEach(file => { writeFileToBundle(file.name); });

    function writeFileToBundle(fileName) {
        const stream = new fs.ReadStream(path.join(stylesFolder, fileName));
        stream.on('readable', () => {
            let data;
            while (data = stream.read()) {
                fs.appendFile(outputFile, data.toString(), function (err) { });
            }
        });
    }

}

async function generateIndex() {
    let templatePath = path.join(__dirname, "template.html");
    let outputPath = path.join(distFolder, "index.html");

    let components = await getComponentsAsMap();
    let template = await fsP.readFile(templatePath);
    let index = addComponents(template.toString(), components);
    await fsP.writeFile(outputPath, index);

    function addComponents(template, components) {
        let regexp = /\{{(.*?)\}}/g;
        return template.replace(regexp, function (match, p1) {
            return components.get(p1);
        });
    }

}

async function getComponentsAsMap() {
    let componentsMap = new Map();

    const files = await fsP.readdir(componentsFolder, { withFileTypes: true });

    let promises = files.map(file => {
        let filePath = path.join(componentsFolder, file.name);
        return fsP.readFile(filePath).then(data => componentsMap.set(file.name.split('.')[0], data.toString()));
    });

    await Promise.all(promises);
    return componentsMap;
}