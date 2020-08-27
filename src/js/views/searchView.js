import {domElements} from './base';

export const getInput = () => domElements.searchInput.value;

export const clearInput = () => {
    domElements.searchInput.value = '';
};

export const clearResults = () => {
    domElements.resultsList.innerHTML = '';
    domElements.searchResPages.innerHTML = '';
};

export const highlightSelected = (id) => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

export const cutRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
    
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${cutRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    domElements.resultsList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page-1 : page+1}">
        <span>Page ${type === 'prev' ? page-1 : page+1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numOfRes, resPerPage) => {
    const pages = Math.ceil(numOfRes / resPerPage);
    let button;
    if(page === 1 && pages > 1){
        //on first page, only show the 'next page' button
        button = createButton(page,'next');
    } else if (page < pages) {
        // on the middle page, show both buttons
        button = `
            ${createButton(page,'prev')}
            ${createButton(page,'next')}
        `;
    } else if (page === pages && pages > 1){
        // on the last page, only show the 'prev page' button
        button = createButton(page,'prev');
    }
    domElements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    // render results for the current page
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;
    recipes.slice(start,end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resultsPerPage);
};