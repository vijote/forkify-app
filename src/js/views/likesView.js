import {domElements} from './base';
import {cutRecipeTitle} from './searchView';

export const toggleLikeBtn = (isLiked) => {
    const iconStr = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconStr}`);
};

export const toggleLikeMenu = numLikes => {
    domElements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${cutRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;

    domElements.likesList.insertAdjacentHTML('beforeend', markup);
}

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);

}