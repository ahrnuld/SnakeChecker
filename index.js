// IMPORTS
const express = require('express');
const DataStore = require('nedb');
const AdmZip = require("adm-zip");
const bodyParser = require("body-parser");
const path = require('path');
const fsExtra = require('fs-extra');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})

// App setup with express 
const app = express();
const { validate, ValidationError, Joi } = require('express-validation');


// View engine setup
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");


// APP USES 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended:true
}));
app.listen(3000, () => console.log('listening at port 3000'));

app.use(function(err, req, res, next) {
  console.log(err);
  if (err instanceof ValidationError) {
    console.log(err);
    return res.status(err.statusCode).json(err)
  }
  return res.status(500).json(err)
})

const reportValidation = {
  body: Joi.object({
    firstName: Joi
      .required(),
    lastName : Joi
      .required(),
    report: Joi
      .required(),
  }),
}

// DATABASE SETUP 
const database = new DataStore('test.db');
database.loadDatabase();

  async function readZipArchive(zip) {
    try {  
      // Custom code om in het game bestand toe te voegen;
      const customCode = "Window.Game.frameCounterLimit = frameCounterLimit; Window.Game.eatApple = eatApple; Window.Game.pauze = new Proxy(this, { get: function() { return pauze;}}); Window.Game.score = new Proxy(this, { get: function(){ return score;}}); })(Window.Game);"; 
      zipEntries = zip.getEntries();
      for (let zipEntry of zipEntries) {
          switch (zipEntry.name)  {
              case "game.js":
                let gameJavascript = zipEntry.getData().toString();
                gameJavascript =  gameJavascript.replace("})(Window.Game);", customCode);
                fsExtra.outputFile(__dirname + '/public/assets/js/game.js', gameJavascript);
                break;
              case "apple.js"  :
                fsExtra.outputFile(__dirname + '/public/assets/js/apple.js', zipEntry.getData().toString());
                break;
              case "fixes.js"  :
                fsExtra.outputFile(__dirname + '/public/assets/js/fixes.js', zipEntry.getData().toString());
                break;
              case "settings.js" : 
                fsExtra.outputFile(__dirname + '/public/assets/js/settings.js', zipEntry.getData().toString());
                break;
              case "snake.js" : 
                fsExtra.outputFile(__dirname + '/public/assets/js/snake.js', zipEntry.getData().toString());
                break;       
          }
      }
    } catch (e) {
      console.log(`Something went wrong. ${e}`);
    }
  }

// Routing
app.get('/', function(request, response) {
    response.render('index');
});

app.get('/tests', function(request, response) {
    response.render('tests');
});

app.post('/tests' , upload.single('zipFile') , async(request, response) => {
  const maxSize = 20 * 1024; // for 20KB My zipped assets folder was 9KB 
  if (request.file){
    if (request.file.size < maxSize){
        var zip = new AdmZip(request.file.path);
        readZipArchive(zip).then((test) => {
        fsExtra.emptyDir(__dirname + '/uploads');
        response.redirect('/tests');
    });
  }
} else {
  response.writeHead(302, {
    Location: `/`
  }).end();    return;
}
});

app.post('/results',validate(reportValidation), (request, response) => {
  let report = JSON.parse(request.body.report);
  let passes = 0;
  for (let i = 0; i < report.length; i++){
    if (report[i].pass){
      passes++;
    }
  }
  let data = {
    name: request.body.firstName + " " + request.body.lastName, 
    tests_passed : passes,
    report : report
  }
  database.insert(data);
    response.writeHead(302, {
        Location: `/complete   `
      }).end();
});

app.get('/complete',  function(request, response) {
  response.render('complete');
});