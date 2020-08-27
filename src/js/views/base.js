export const domElements = {
    searchInput : document.querySelector('.search__field'),
    searchForm : document.querySelector('.search'),
    searchResPages : document.querySelector('.results__pages'),
    resultsList : document.querySelector('.results__list'),
    results : document.querySelector('.results'),
    recipe : document.querySelector('.recipe'),
    shoppingList : document.querySelector('.shopping__list'),
    likesMenu : document.querySelector('.likes__field'),
    likesList : document.querySelector('.likes__list')
}

export const elementStrings = {
    loader : 'loader'
}

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const hideLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader){
        loader.parentElement.removeChild(loader);
    }
}