function generateTweet(quote, author) {
  var concatenatedQuote = `"${quote}" -${author}`;
  var processedQuote = encodeURIComponent(concatenatedQuote);
  return `https://twitter.com/intent/tweet?text=${processedQuote}`;
}

function outputQuote(data) {
  var quoteNumber = Math.floor(Math.random() * data.length); // omitted last "+1" so that it will scale to an index value
  // format for Math.random() is Math.random() * (max - min + 1) + 1 for low to high inclusive
   // console.log(`You have ${length} for length and ${quoteNumber} for the quote number!`);

  var quote = data[quoteNumber].quoteText;
  var author = data[quoteNumber].quoteAuthor;
  var tweetUrl = generateTweet(quote, author);

    // console.log(`You have ${quote} for a quote, and ${author} for an author!`);

  document.querySelector("#quote").innerHTML = quote;
  document.querySelector("#author").innerHTML = author;
  document.querySelector("#tweet").setAttribute('href', tweetUrl);
}

// json/rqg.json
function randomQuote() {
  // Gets JSON object
  var request = new XMLHttpRequest();
  request.open('GET', './json/rqg.json', true);
  // Workaround for Firefox parsing error...
  // except it doesn't seem to solve the error yet.
  // request.setRequestHeader('mimeType', 'application/json');

  request.onload = function() {
    if (this.status >=200 && this.status < 400) {
      var data = JSON.parse(this.response);
      outputQuote(data);
    } else {
      // Error
    }
  };

  request.onerror = function() {
    // Connection error
  };

  request.send();
}

randomQuote();
document.querySelector("#quote-button").onclick = randomQuote;
