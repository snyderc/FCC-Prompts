function getWiki(searchTerm) {

  var searchTermEncoded = encodeURIComponent(searchTerm);

  var wikiData = $.ajax( {
    url: `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchTermEncoded}&utf8=&format=json&callback=?`,
    dataType: 'json',
    type: 'GET',
    // Custom header called for by MediaWiki API but I don't think
    // it's actually being added per my LiveHTTPHeaders plugin
    headers: { 'Api-User-Agent': 'Test Wikipedia Viewer/0.1 (christopher.snyder.m@gmail.com)' },
    success: processData,
    error: function(errorMessage) {
      console.log(`Error: ${errorMessage}`);
    }
  });

}

function processData(data) {
  // console.log(data);

  var resultHTML = "";

  $.each(data.query.search, function(index, value) {

    var resultURL = `http://en.wikipedia.org/?curid=${value.pageid}`;

    resultHTML += `<a href="${resultURL}" class="list-group-item list-group-item-action flex-column align-items-start">`;
    resultHTML += '<div class="d-flex w-100 justify-content-between">';
    resultHTML += `<h5 class="mb-1">${value.title}</h5>`;
    resultHTML += `<small>${value.wordcount} words</small>`;
    resultHTML += '</div>';
    resultHTML += `<p class="mb-1">${value.snippet}</p>`;
    resultHTML += '</a>';

  });

  $('#results').html(resultHTML);

}

function moveSearchBarToTop() {
  // TODO: Come up with a more elegant animation/transition sequence
  $('#large-title').slideUp(function() {
    var smallTitle = '<h1 class="display-5">Just Another Wikipedia Viewer</h1>';
    $('#small-title').addClass('col-sm-4');
    $('#small-title').html(smallTitle);

    $('#main-input').removeClass('col-sm-12');
    $('#main-input').addClass('col-sm-8');

    $('.side-margin').removeClass('col-sm-2');

    $('#center-content').removeClass('col-sm-8');
    $('#center-content').addClass('col-sm-12');
  });

}


$(document).ready(function() {

  $('#search-form').on("submit", function(e) {
    e.preventDefault();
    moveSearchBarToTop();
    getWiki($('#input-search').val());
  });

  // getWiki(sampleSearch);

});
