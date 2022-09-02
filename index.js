const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const exampleOne = require("./example/exampleOne")
const exampleTwo = require("./example/exampleTwo")
// const { Engine } = require('json-rules-engine');


app.get('/exampleOne', exampleOne.jsonRuleOne)
app.get('/exampleTwo', exampleTwo.jsonRuleTwo)


// set port, listen for requests
var PORT = 5500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
