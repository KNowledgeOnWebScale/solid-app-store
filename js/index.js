import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'font-awesome/css/font-awesome.css';

import {queryApps, queryCategory} from './apps';

// Store the queried apps, so they can be filtered and built again later on
let apps = [];

// Store the queried categorie ID's so duplicates can be avoided
let categories = [];

// Store the id of the category that is currently being filtered on
let categoryIDFilter = '';

// Store the keyword that is currently being filtered on
let keywordFilter = '';

window.onload = async () => {
    await makeCategoryView({
        name: 'All',
        id: 'all',
        description: 'All apps'
    });
    categoryIDFilter = 'all';

    await queryApps([
        'https://solid-plato.netlify.app/id',
        'https://solid-md-viewer.netlify.app/id',
        'https://solid-issue-tracker.netlify.app/id'
    ], handleNewApp);
    const $searchbar = document.getElementById('search');
    $searchbar.addEventListener('change', () => {
        filter(categoryIDFilter, $searchbar.value.toLowerCase())
    })
}

/**
 * Callback function to handle a newly queried app
 * @param {Object} app - app object returned by query
 * @returns {Promise<void>}
 */
async function handleNewApp(app) {
    apps.push(app);
    await makeAppTile(app);
    for (const categoryID of app.categories) {
        if (!categories.includes(categoryID)) {
            categories.push(categoryID);
            await queryCategory(categoryID, makeCategoryView);
        }
    }
}

/**
 * Create the HTML elements for an app tile
 * @param {Object} category - app object
 * @returns {Promise<void>}
 */
function makeAppTile(app) {
    const $applist = document.getElementById('app-list');
    const $div = document.createElement('div');
    $div.setAttribute('class', 'card mx-3 my-2 app-tile-div');

    const $link = document.createElement('a');
    $link.setAttribute('href', app.uri);
    $link.setAttribute('target', '_blank');

    const $img = document.createElement('img');
    $img.setAttribute('class', 'card-img-top p-5 app-tile-img');
    $img.setAttribute('src', app.logo);
    $link.appendChild($img)

    $div.appendChild($link);

    const $body = document.createElement('div');
    $body.setAttribute('class', 'card-body');

    const $title = document.createElement('h5');
    $title.setAttribute('class', 'card-title');
    $title.innerText = app.name;
    $body.appendChild($title);

    const $text = document.createElement('p');
    $text.setAttribute('class', 'card-text');
    $text.innerText = app.description;
    $body.appendChild($text);

    $div.appendChild($body);
    $applist.appendChild($div);
}

/**
 * Create the HTML elements for a category list item
 * @param {Object} category - category object
 * @returns {Promise<void>}
 */
function makeCategoryView(category) {
    const $categorylist = document.getElementById('category-list');
    const $div = document.createElement('div');
    const $button = document.createElement('button');
    $button.addEventListener('click', () => {
        filter(category.id, keywordFilter);
    });
    $button.setAttribute('class', 'category-button');
    $button.setAttribute('title', category.description);
    const $line = document.createElement('p');
    $line.innerText = category.name;
    $button.appendChild($line);
    $div.appendChild($button);
    $categorylist.appendChild($div);
}

/**
 * Filter apps/app tiles by category and/or keyword
 * @param {String} categoryID - ID of category to be filtered
 * @param {String} keyword - keyword to be filtered
 * @returns {Promise<void>}
 */
function filter(categoryID, keyword) {
    document.getElementById('app-list').innerHTML = '';
    categoryIDFilter = categoryID;
    keywordFilter = keyword;
    const filteredApps = apps.filter(
        app => (app.name.toLowerCase().includes(keyword) || app.description.toLowerCase().includes(keyword)) &&
            (categoryID === "all" || app.categories.includes(categoryID))
    );
    filteredApps.forEach(makeAppTile);
}