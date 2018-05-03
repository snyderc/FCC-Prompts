$(document).ready(function() {

  // Activates when click the Random Quote button
  $("#quote-button").on("click",function() {
   // console.log("You clicked me!");
    // Gets JSON object
    $.getJSON("json/rqg.json", function(json) { // manipulates JSON object
      // console.log("You loaded JSON!");
      // console.log(json);
    var length = json.length;

    var quoteNumber = Math.floor(Math.random() * length); // omitted last "+1" so that it will scale to an index value
    // format for Math.random() is Math.random() * (max - min + 1) + 1 for low to high inclusive
     // console.log(`You have ${length} for length and ${quoteNumber} for the quote number!`);

    var quote = json[quoteNumber].quoteText;
    var author = json[quoteNumber].quoteAuthor;

      // console.log(`You have ${quote} for a quote, and ${author} for an author!`);

    $("#quote").html(quote);
    $("#author").html(author);

  });
    });




});
