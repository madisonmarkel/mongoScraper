var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/nprScraper", { useNewUrlParser: true });

// =================================== ROUTES

// ================== NPR SCRAPE
app.get("/scrape", function(req, res) {
  // Grab the body of the html with axios
  axios.get("https://www.npr.org/").then(function(response) {
    // Load NPR into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // grabbing class we want to scrape
    $(".story-text").each(function(i, element) {
        
      // Save an empty result object
      var result = {};

      // narrowing down what we want out of div class
      result.title = $(this).children("a").children("h3").text();
      result.link = $(this).children("a").attr("href");
      result.summary = $(this).children("a").children("p").text();

      // Create a new Article (linkingn to Article.js) using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(dbScrape) {
    // If all Notes are successfully found, send them back to the client
    res.json(dbScrape);
  })
  .catch(function(err) {
    // If an error occurs, send the error back to the client
    res.json(err);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({_id: req.params.id})
  .populate("note")
  .then(function(dbScrapeInfo){
    res.json(dbScrapeInfo);
    })
  .catch(function(error){
    res.json(error);
  })
  });

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({_id: req.params.id}, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If the User was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });

});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});