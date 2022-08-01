import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'font-awesome/css/font-awesome.css';

import {queryApps, queryCategory} from './apps';

let apps = [];
let filteredApps = [];
let categories = [];
let keywordFilter = '';
let categoryFilter = '';

window.onload = async () => {
    await queryApps([
        'https://solid-plato.netlify.app/id',
        'https://solid-md-viewer.netlify.app/id'
    ], handleNewApp);
    const $searchbar = document.getElementById('search');
    $searchbar.addEventListener('change', filterSearch)
}

async function handleNewApp(app) {
    apps.push(app);
    await makeAppTile(app);
    for (const categoryID of app.categories) {
        if (!categoryExists(categoryID)) {
            await queryCategory(categoryID, handleNewCategory);
        }
    }
}

async function handleNewCategory(category) {
    categories.push(category);
    await makeCategory(category.name);
}

function categoryExists(categoryID) {
    for (const category of categories) {
        if (Object.values(category).includes(categoryID)) {
            return true;
        }
    }
    return false;
}

async function makeAppTile(app) {
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

async function makeCategory(category) {
    const $categorylist = document.getElementById('category-list');
    // TODO: make button
    const $div = document.createElement('div');
    $div.addEventListener('click', () => {
        filterCategory(category)
    });
    $div.setAttribute('style', 'cursor: pointer;')
    const $line = document.createElement('p');
    $line.innerText = category;
    $div.appendChild($line);
    $categorylist.appendChild($div);
}

async function filterSearch() {
    const $applist = document.getElementById('app-list');
    const keyword = document.getElementById('search').value.toLowerCase();
    $applist.innerHTML = '';
    for (const app of filteredApps) {
        if (app.name.toLowerCase().includes(keyword) || app.description.toLowerCase().includes(keyword)) {
            await makeAppTile(app);
        }
    }
}

async function filterCategory(category) {
    document.getElementById('search').value = '';
    document.getElementById('app-list').innerHTML = '';
    if (category === "All") {
        filteredApps = apps;
        filteredApps.forEach(makeAppTile);
    } else {
        filteredApps = [];
        for (const app of apps) {
            if (app.category === category) {
                filteredApps.push(app);
                await makeAppTile(app);
            }
        }
    }
}