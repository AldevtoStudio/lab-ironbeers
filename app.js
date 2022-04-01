// Getting modules.
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');
const helpers = require('handlebars-helpers')({
  handlebars: hbs
});

// Creating the express app.
const app = express();
const punkAPI = new PunkAPIWrapper();

// Setting view engine.
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Creating the middleware function that servers statis files on requests.
app.use(express.static(path.join(__dirname, 'public')));

// Default page title
app.locals.pageTitle = 'IronBeers - Alberto Cárdenas';

// Registering partials.
hbs.registerPartials(__dirname + '/views/partials');

// Add the route handlers here:
app.get('/', (req, res) => {
  res.render('index', {
    selected: 'Home',
    pageTitle: 'Home',
    pageStyles: [{ style: '/stylesheets/home.css' }]
  });
});

app.get('/beers', (req, res) => {
  punkAPI
    .getBeers()
    .then(beersFromApi => {
      res.render('beers', {
        selected: 'Beers',
        pageTitle: 'Beers',
        pageStyles: [{ style: '/stylesheets/beers.css' }],
        beers: beersFromApi
      });
    })
    .catch(error => console.log(error));
});

app.get('/beers/:id', (req, res) => {
  const beerId = req.params.id;

  punkAPI
    .getBeer(beerId)
    .then(beerFromApi => {
      res.render('random-beer', {
        pageTitle: beerFromApi[0].name,
        pageStyles: [{ style: '/stylesheets/beer.css' }],
        beerData: beerFromApi
      });
    })
    .catch(error => console.log(error));
});

app.get('/random-beer', (req, res) => {
  punkAPI
    .getRandom()
    .then(responseFromAPI => {
      res.render('random-beer', {
        selected: `Random Beer`,
        pageTitle: `Random Beer`,
        pageStyles: [{ style: '/stylesheets/beer.css' }],
        beerData: responseFromAPI
      });
    })
    .catch(error => console.log(error));
});

app.listen(3000, () => console.log('Running on port 3000'));
