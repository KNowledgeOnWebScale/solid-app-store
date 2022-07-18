import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'font-awesome/css/font-awesome.css'

window.onload = async () => {
    const apps = [
        {
            name: 'App 1',
            description: 'App 1'
        },
        {
            name: 'App 2',
            description: 'App 2'
        },
        {
            name: 'App 2',
            description: 'App 2'
        },
        {
            name: 'App 2',
            description: 'App 2'
        },
    ]
    const categories = [
        "Business",
        "Entertainment",
        "Graphics & Design",
        "Medical"
    ]
    apps.forEach(makeAppTile);
    categories.forEach(makeCategory);
}

async function makeAppTile(app) {
    const $applist = document.getElementById('app-list');
    const $div = document.createElement('div');
    const $line = document.createElement('p');
    $line.innerText = app.name;
    $div.appendChild($line);
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