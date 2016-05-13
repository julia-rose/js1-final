'use strict';


var SavedRecipe = new ParseObjectType('SavedRecipe');

$(document).ready(function() {

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
    let intolerance = '';
    if ($('.search-intolerance').val()) {
      intolerance = '&intolerances=' + $('.search-intolerance').val().join('%2C+');
    }

    return (keyword + cuisine + type + veg + intolerance);
  };

  const composeQuery = (e) => {
    e.preventDefault();

    // clear out old results, if any
    $('.results').empty();

    let url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?' + getSearchTerms() + '&number=12';

    searchAPI(url);
  };

  const searchAPI = (url) => {
    $.ajax({
      url: url,
      headers: {
        "X-Mashape-Key": localStorage.getItem("SPOONACULAR")
      },
      method: 'GET',
      dataType: 'json',
      success: handleSuccess
    });
  };

  const onButtonClick = (e) => {
    e.preventDefault();

    // change text in button
    $(e.target).text('Saved!');

    let recipeTitle = $(e.target).prev()[0].innerHTML;
    let recipeUrl = $(e.target).prev()[0].href;

    // make a recipe object
    let recipeObj = {
      title: recipeTitle,
      recipeUrl: recipeUrl
    };

    SavedRecipe.create({ title: recipeTitle, recipeUrl: recipeUrl}, function(err, result) {
      if (err) {
        console.error(err);
      } else {
        recipeObj.objectId = result.objectId;
      }
    });
  };

  const openFavorites = (e) => {
    e.preventDefault();
    $('.faves-modal').css('display', 'flex');

    // do this or the list will keep multiplying itself every time you open it
    $('.faves-list').empty();

    displayFavorites();
  };

  const closeFavorites = () => {
    $('.faves-modal').css('display', 'none');
  }

  const displayFavorites = () => {
    SavedRecipe.getAll(function(err, recipes) {
      if (err) {
        console.error(err);
      } else {
        console.log(recipes)

        // get rid of that 'add something to your favorites!' message
        if (recipes.length > 0) {
          $('.faves-empty').css('display', 'none');
        }  

        recipes.forEach(renderRecipe);
      }
    });
  }

  const renderRecipe = (recipeData) => {
    let recipeItem = $('<li class="faves-item"></li>').attr('data-id', recipeData.objectId);
    let recipeLink = $('<a class="url" target="_blank"></a>').text(recipeData.title);
    recipeLink.attr('href', recipeData.recipeUrl);
    recipeItem.append(recipeLink);
    let deleteButton = $('<span class="delete-button"></span>').text('delete')
    recipeItem.append(deleteButton);
    $('.faves-list').append(recipeItem);
    $('.delete-button').on('click', deleteRecipe);
  };

  const deleteRecipe = (e) => {
    // get the id of the recipe to be deleted
    let objectId = $(e.target).parent()[0].dataset.id;

    SavedRecipe.remove(objectId, function(err) {
        if (err) {
          console.error(err);
        } else {
          $('[data-id="' + objectId + '"]').remove();
        }
      });
  }

  const handleSuccess = (response) => {
    console.log(response);

    let responseArray = response.results;
    responseArray.forEach(function(item) {
      let container = $('<div class="result"></div>');
      let imageContainer = $('<div class="image-container"></div>');
      let image = $('<img class="result-image" />').attr('src', (response.baseUri + item.image));
      imageContainer.append(image);
      let urlTitle = item.title.replace(/[\. ,:-]+/g, "-");
      let urlBase = 'https://spoonacular.com/recipes/'
      let idString = '-' + item.id;
      let recipeUrl = urlBase + urlTitle + idString;
      let thing = $('<a class="url" target="_blank"></a>').text(item.title).attr('href', recipeUrl);
      let button = $('<button class="button"></button>').text('Save to Favorites');
      container.append(imageContainer).append(thing).append(button);
      $('.results').append(container);
    })
    $('.button').on('click', onButtonClick);
  };

  // Listen for a submit in the search field
  const init = () => {
    $('.search-button').on('click', composeQuery);
    $('.faves-button').on('click', openFavorites);
    $('.close-button').on('click', closeFavorites);
  };

  // Initialize the page
  init();
});






