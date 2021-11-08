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

rl.setPrompt(`Hi! Please input your text: `);
rl.prompt();

rl.on('line', (input) => {
    if (input === 'exit') {
        endDialog();
        return;
    }
    writeStream.write(input + "\n");
});

rl.on('close', () => endDialog());

function endDialog() {
    writeStream.end();
    rl.close();
    console.log("Dialog closed! Bye-bye!");
}