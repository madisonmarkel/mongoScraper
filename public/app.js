// ============== DISPLAY ARTICLES FROM DATABASE
// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").prepend("<div data-id='" + data[i]._id + "'>" + "<h2>" + data[i].title + "</h2><p>" + data[i].summary + "</p><a href='" + data[i].link + "'>Read Article</a><br><button id='makeNoteHTML' data-id='"+ data[i]._id +"'>Make a Note</button><button data-id='" + data[i]._id + "' id='saveArticleHTML' data-title='" + data[i].title + "' data-summary='" + data[i].summary + "' data-link='" + data[i].link + "'>Save Article</button></div>");
    }
  });

// ============== ON CLICK TO RESCRAPE NPR (GOES TO SCRAPE ROUTE)
$(document).on("click", "#scrape", function(){
  $("#articles").empty();
    $.get("/scrape");
    console.log("NPR Scrape Complete");
});

// ============== ON CLICK TO MAKE NOTE (GOES TO NOTE ROUTE)
$(document).on("click", "#makeNoteHTML", function(){
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      $("#notes").addClass("notes_padding");
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<h4>Title:</h4><input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<h4>Body:</h4><textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote' data-title='" + data.title + "' data-summary='" + data.summary + "'>Save Note</button>");


      // If there's a note in the article
      if (data.note) {
        console.log("DATA NOTE APP.JS LINE 46");
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
        $("#notes").append("<a href='/notes/" + data._id + "'>See Note</a>")
      }
    });

});

// ============== ON CLICK TO SAVE NOTES
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      //change color of note button
      $.this("#savenote").addClass("savebuttonClick")
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// ============== ON CLICK TO SAVE ARTICLE (GOES TO SAVE ROUTE)
$(document).on("click", "#saveArticleHTML", function(){
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  var data_title = $(this).attr("data-title");
  var data_summary = $(this).attr("data-summary");
  var data_link = $(this).attr("data-link")

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/saved/" + thisId,
    data: {
      title: data_title,
      body: data_summary,
      link: data_link
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      //$("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
});