// ============== DISPLAY ARTICLES FROM DATABASE
// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div data-id='" + data[i]._id + "'>" + "<h2>" + data[i].title + "</h2><p>" + data[i].summary + "</p><a href='" + data[i].link + "'>Read Article</a><br><button id='makenNoteHTML'>Make a Note</button><button id='saveArticleHTML'>Save Article</a></div>");
    }
  });

// ============== ON CLICK TO RESCRAPE NPR (GOES TO SCRAPE ROUTE)
$(document).on("click", "#scrape", function(){
    $.get("/scrape");
    console.log("NPR Scrape Complete");
});

// ============== ON CLICK TO MAKE NOTE (GOES TO NOTE ROUTE)
$(document).on("click", "#makenNoteHTML", function(){

});

// ============== ON CLICK TO SAVE ARTICLE (GOES TO SAVE ROUTE)
$(document).on("click", "#saveArticleHTML", function(){

});