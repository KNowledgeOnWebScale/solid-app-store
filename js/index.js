import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'font-awesome/css/font-awesome.css'

let apps = [];

window.onload = async () => {
    await handleNewApp({
        name: 'KNoodle',
        description: 'KNoodle is KNoWS\' Solid-based alternative to Doodle.',
        link: 'https://github.com/KNowledgeOnWebScale/knoodle/'
    })
    await handleNewApp({
        name: 'SolidEditor',
        description: 'A Microsoft Monaco based editor for text files on a Solid pod',
        link: 'https://github.com/phochste/SolidEditor'
    })
    await handleNewApp({
        name: 'AcmeUpload',
        description: 'A Solid app that can be used as a dropzone for a container.',
        link: 'https://github.com/phochste/AcmeUpload'
        })
    await handleNewApp({
        name: 'AcmeContainer',
        description: 'A base implementation of a Solid App with login and loading a Container',
        link: 'https://github.com/phochste/AcmeContainer'
        })

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
    $div.setAttribute('class', 'card mx-3 my-2');
    $div.setAttribute('style', 'width: 13rem');

    const $link = document.createElement('a');
    $link.setAttribute('href', app.link);
    $link.setAttribute('target', '_blank');

    const $img = document.createElement('img');
    $img.setAttribute('class', 'card-img-top p-5');
    $img.setAttribute('style', 'cursor: pointer');
    $img.setAttribute('src', 'https://genr.eu/wp/wp-content/uploads/2018/10/logo.svg');
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