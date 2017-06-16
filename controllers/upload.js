const fs = require('fs');

Upload = app => {
  app.post('/upload/photo', (req, res) => {
    const file = req.headers.filename;
    req.pipe(fs.createWriteStream("files/" + file))
      .on('finish', () => {
        res.status(201).send('ok');
      });

  });
}

module.exports = Upload;
