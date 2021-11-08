const fs = require('fs');
const path = require('path');

const stream = new fs.ReadStream(path.join(__dirname, "text.txt"));

stream.on('readable', () => {
    let data;
    while (data = stream.read()) {
        console.log(data.toString());
      }
});