const fs = require('fs');

Upload = app => {
  app.post('/upload/photo', (req, res) => {
    const file = req.headers.filename;
    console.log('file', file);
    req.pipe(fs.createWriteStream("files/" + file))
      .on('finish', () => {
        console.log('arquivo escrito');
        res.status(201).send('ok');
      });

  });
}

module.exports = Upload;
