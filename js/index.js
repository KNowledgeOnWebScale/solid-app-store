import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'font-awesome/css/font-awesome.css';

import { queryClientIds } from './apps';

let apps = [];

window.onload = async () => {
    await queryClientIds([
        'https://solid-plato.netlify.app/id',
        'https://solid-md-viewer.netlify.app/id'
    ], handleNewApp)
    const categories = [
        "Business",
        "Entertainment",
        "Graphics & Design",
        "Medical",
        'Photo & Video',
        "Developer Tools",
        "Health & Fitness"
    ]
    categories.forEach(makeCategory);

    const $searchbar = document.getElementById('search');
    $searchbar.addEventListener('change', handleSearch)
}

async function handleNewApp(app) {
    apps.push(app);
    await makeAppTile(app);
}

async function makeAppTile(app) {
    const $applist = document.getElementById('app-list');
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
    $applist.appendChild($div);
}

async function makeCategory(category) {
    const $categorylist = document.getElementById('category-list');
    const $div = document.createElement('div');
    const $line = document.createElement('p');
    $line.innerText = category;
    $div.appendChild($line);
    $categorylist.appendChild($div);
}

async function handleSearch() {
    const $applist = document.getElementById('app-list');
    const keyword = document.getElementById('search').value.toLowerCase();
    $applist.innerHTML = '';
    for (const app of apps) {
        if (app.name.toLowerCase().includes(keyword) || app.description.toLowerCase().includes(keyword)) {
            await makeAppTile(app);
        }
    }
}