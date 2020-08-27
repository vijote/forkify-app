import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {domElements, renderLoader, hideLoader, elementStrings} from './views/base';

/* Global state of the app
    - Search object (query and result)
    - Current recipe object
    - Shopping list object
    - Liked recipes
*/
const state = {};

/**
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
    // get query from the view
    const query = searchView.getInput();

    if(query){ // if query exists
        // create a new Search object and add it to state
        state.search = new Search(query);

        // prepare ui for results
        searchView.clearInput();
        searchView.clearResults();

        renderLoader(domElements.results);

        try {
            // search for recipes
            await state.search.getResults();

            // render the results in the ui
            hideLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            hideLoader();
            console.log(error);
            alert('Error with search');
        }
    }
}

domElements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

domElements.searchForm.addEventListener('load', e => {
    e.preventDefault();
    controlSearch();
})

domElements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    // get id from the url
    const id = window.location.hash.replace('#', '');

    if (id){
        // prepare ui for the changes
        recipeView.hideRecipe();
        renderLoader(domElements.recipe);
        if (state.search) searchView.highlightSelected(id);

        // create new recipe object
        state.recipe = new Recipe(id);

        try {
            // get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            hideLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            console.log(error);
            alert('Error processing recipe u_u');
        }
    }
};

['hashchange', 'load'].forEach(e => window.addEventListener( e, controlRecipe))


/** 
 * LIST CONTROLLER
*/
const controlList = () => {
    //create new list if there is none yet
    if(!state.list) state.list = new List();

    //add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listView.renderItem(item);
    });
};

// handle delete and update list items
domElements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle deletion
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // delete item from state
        state.list.deleteItem(id);
        // delete from ui
        listView.removeItem(id);

    // handle count update
    } else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    };
});

/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    // get the id of the displayed recipe
    const currentId = state.recipe.id;

    // if the current recipe is not liked yet
    if(!state.likes.isLiked(currentId)){
        // add recipe to the likes list
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );
        // display liked recipe button
        likesView.toggleLikeBtn(true);
        // update likes list in ui
        likesView.renderLike(newLike);

    } else { // recipe is already liked
        // remove recipe from likes list
        state.likes.deleteLike(currentId);

        // display like recipe button
        likesView.toggleLikeBtn(false);

        // remove recipe from the list in ui
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// restore liked recipes on page load
window.addEventListener('load', () => {
    // initialize likes list
    state.likes = new Likes();

    // get likes from local storage
    state.likes.readStorage();

    // display button 
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // render liked recipes in ui
    state.likes.likes.forEach( like => likesView.renderLike(like));
})

// handling recipe button clicks

domElements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        state.recipe.updateServings('dec');
        //decrease button clicked
        if (state.recipe.servings > 1) {
            recipeView.updateServingsIng(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        //decrease button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIng(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
});