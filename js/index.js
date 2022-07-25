import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'font-awesome/css/font-awesome.css';

import { queryClientIds } from './apps';

window.onload = async () => {
    const apps = await queryClientIds([
        'https://solid-plato.netlify.app/id',
        'https://solid-plato.netlify.app/id'
    ])
    apps.forEach(makeAppTile);
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
}

async function makeAppTile(app) {
    const $applist = document.getElementById('app-list');
    const $div = document.createElement('div');
    $div.setAttribute('class', 'card mx-3 my-2');
    $div.setAttribute('style', 'width: 13rem');

    const $link = document.createElement('a');
    $link.setAttribute('href', app.uri);
    $link.setAttribute('target', '_blank');

    const $img = document.createElement('img');
    $img.setAttribute('class', 'card-img-top p-5');
    $img.setAttribute('style', 'cursor: pointer');
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