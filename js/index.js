import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'font-awesome/css/font-awesome.css';

import {queryApps, queryCategory, queryIDs} from './apps';

// Store the queried apps, so they can be filtered and built again later on
let apps = [];

// Store the queried category IDs so duplicates can be avoided
let categoryIDs = [];

// Store names of categories by id for updating app amounts per category
let categoryNames = new Map();

// Store the id of the category that is currently being filtered on
let categoryIDFilter = '';

// Store the keyword that is currently being filtered on
let keywordFilter = '';

// Store whether a view for a category has been created
let categoryViewCreated = new Map()

window.onload = async () => {
    const appIDs = await queryIDs(['https://data.knows.idlab.ugent.be/person/office/trusted-solid-applications']);
    await queryApps(appIDs,
        [
            'https://data.knows.idlab.ugent.be/person/office/software',
            'https://data.knows.idlab.ugent.be/person/office/external-software']
        , handleNewApp, handleAppQueryFinished);

    const $searchbar = document.getElementById('search');
    $searchbar.addEventListener('change', () => {
        filter(categoryIDFilter, $searchbar.value.toLowerCase())
    });
}

/**
 * Callback function to handle a newly queried app
 * @param {Object} app - app object returned by query
 * @returns {Promise<void>}
 */
async function handleNewApp(app) {
    apps.push(app);
    makeAppTile(app);
    for (const categoryID of app.categories) {
        if (!categoryIDs.includes(categoryID)) {
            categoryIDs.push(categoryID);
            categoryViewCreated.set(categoryID, false);
            await queryCategory(categoryID, handleNewCategory);
        } else if (categoryViewCreated.get(categoryID)) {
            updateCategoryView(apps, categoryID);
        }
    }
}

/**
 * (Callback) function to handle newly queried category (or hardcoded 'All' category)
 * @param {Object} category - category object that needs to be handled
 */
function handleNewCategory(category) {
    makeCategoryView(category);
    categoryViewCreated.set(category.id, true);
    updateCategoryView(apps, category.id);
}

/**
 * Handle various document elements when app query has ended
 */
function handleAppQueryFinished() {
    document.getElementById('loader').classList.add('hidden');
    if (apps.length === 0) {
        document.getElementById('no-results-title').classList.remove('hidden');
    }
    categoryIDs.push('all');
    handleNewCategory({
        name: 'All',
        id: 'all',
        description: 'All apps'
    });
    categoryIDFilter = 'all';
    document.getElementById('all').classList.add('category-selected');
}

/**
 * Update amount of apps displayed in category view
 * @param {Array} apps - Array of apps that need to be checked for category
 * @param {String} categoryID - ID of category that needs view updated
 */
function updateCategoryView(apps, categoryID) {
    let appCount = 0;
    if (categoryID === 'all') {
        appCount = apps.length;
    } else {
        for (const app of apps) {
            if (app.categories.includes(categoryID)) {
                appCount++;
            }
        }
    }
    document.getElementById(categoryID).innerText = `${categoryNames.get(categoryID)} (${appCount})`;
}

/**
 * Create the HTML elements for an app tile and add them to HTML page.
 * @param {Object} app - An object describing the app.
 */
function makeAppTile(app) {
    const $appList = document.getElementById('app-list');
    const $div = document.createElement('div');
    $div.setAttribute('class', 'card app-tile-div');

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
    $appList.appendChild($div);
}

/**
 * Create the HTML elements for a category list item
 * @param {Object} category - category object
 */
function makeCategoryView(category) {
    categoryNames.set(category.id, category.name);
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
    $line.setAttribute('id', category.id);
    $button.appendChild($line);
    $div.appendChild($button);
    $categorylist.appendChild($div);
}

/**
 * Filter apps/app tiles by category and/or keyword
 * @param {String} categoryID - ID of category to be filtered
 * @param {String} keyword - keyword to be filtered
 */
function filter(categoryID, keyword) {
    document.getElementById('app-list').innerHTML = '';
    document.getElementById(categoryIDFilter).classList.remove('category-selected');
    document.getElementById(categoryID).classList.add('category-selected');
    let filteredApps = apps.filter(
        app => (app.name.toLowerCase().includes(keyword) || app.description.toLowerCase().includes(keyword))
    );
    if (keyword !== keywordFilter) {
        for (const categoryID of categoryIDs) {
            updateCategoryView(filteredApps, categoryID);
        }
    }
    filteredApps = filteredApps.filter(
        app => (categoryID === "all" || app.categories.includes(categoryID))
    );
    if (filteredApps.length === 0) {
        document.getElementById('no-results-title').classList.remove('hidden');
    } else {
        document.getElementById('no-results-title').classList.add('hidden');
        filteredApps.forEach(makeAppTile);
    }
    categoryIDFilter = categoryID;
    keywordFilter = keyword;
}