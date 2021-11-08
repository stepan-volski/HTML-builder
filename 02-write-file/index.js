const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');
const filePath = path.join(__dirname, "text.txt");
let writeStream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt("Hi! Please input your text:"  + "\n");
rl.prompt();

rl.on('line', (input) => {
    if (input === 'exit') {
        rl.close();
        return;
    }
    writeStream.write(input + "\n");
});

rl.on('close', () => console.log("Dialog closed! Bye-bye!"));