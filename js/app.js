'use strict';

const getSearchTerms = () => {
  // get the main search keyword
  let keyword = 'query=' + $('.search-keyword').val();

  // get the cuisine type, if selected
  let cuisine = '&cuisine=' + $('.search-cuisine').val();

  // get the dish type, if selected
  let type = '&type=' + $('.search-type').val();

  // get a veggie diet, if selected
  let veg = '&diet=' + $('.search-veg').val();

  // get any food intolerances, if selected
  let intolerance = '&intolerances=' + $('.search-intolerance').val().join('%2C+');

  return (keyword + cuisine + type + veg + intolerance);
}

const composeQuery = (e) => {
  e.preventDefault();

  // clear out old results, if any
  $('.results').empty();

  let url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?' + getSearchTerms();

  searchAPI(url);
}

const searchAPI = (url) => {
  $.ajax({
    url: url,
    headers: {
    	"X-Mashape-Key": "cPJySWZolCmshX38jPrzJeawUuFLp1ML0DpjsnBhLd1ZrMjwBT"
    },
    method: 'GET',
    dataType: 'json',
    success: handleSuccess
  });
}

const handleSuccess = (response) => {
	console.log(response);
  console.log(response.baseUri + response.results[0].imageUrls[0]);
  let responseArray = response.results;
  responseArray.forEach(function(derp) {
    let thing = $('<div></div>').text(response.baseUri + derp.imageUrls[0]);
    $('.results').append(thing);
  })
}

// Listen for a submit in the search field
const addListeners = () => {
  $('.search').on('submit', composeQuery);
}

// Initialize the page
addListeners();









