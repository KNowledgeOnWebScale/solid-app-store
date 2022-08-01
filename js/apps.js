import {QueryEngine} from "@comunica/query-sparql";

/**
 * Query the necessary data from the Solid app(s)
 * @param {Array} ids - Array of the app('s) ClientID(s)
 * @param {Function} callback - Function to handle the retrieved data from an app
 * @returns {Promise<void>}
 */
export async function queryApps(ids, callback) {
    const QueryEngine = require('@comunica/query-sparql').QueryEngine;
    const myEngine = new QueryEngine();
    const result = await myEngine.query(`
      SELECT DISTINCT ?name ?uri ?logo ?description (GROUP_CONCAT(?category) AS ?categories) WHERE {
        ?s <http://www.w3.org/ns/solid/oidc#client_name> ?name .
        ?s <http://www.w3.org/ns/solid/oidc#client_uri> ?uri .
        OPTIONAL { ?s <http://www.w3.org/ns/solid/oidc#logo_uri> ?logo } .
        OPTIONAL { ?s <http://schema.org/description> ?description } .
        OPTIONAL { ?s <http://schema.org/category> ?category } .
      } 
      GROUP BY ?s ?name ?uri ?logo ?description`, {
        sources: ids,
    });
    const bindingsStream = await result.execute()
    bindingsStream.on('data', (binding) => {
        const app = {};
        app.name = binding.get('name').value;
        app.uri = binding.get('uri').value;

        // As both the app's logo and description are optional, check if they are present or use a placeholder
        if (binding.has('logo')) {
            app.logo = binding.get('logo').value;
        } else {
            app.logo = 'https://genr.eu/wp/wp-content/uploads/2018/10/logo.svg';
        }
        if (binding.has('description')) {
            app.description = binding.get('description').value;
        } else {
            // TODO: no description when abscent
            app.description = 'A Solid App'
        }
        if (binding.has('categories')) {
            app.categories = binding.get('categories').value.split(' ');
        }

        callback(app)
    });

    // TODO: make sure this ACTUALLY handles the error and the query doesn't die midway, as this causes no app tiles to be made
    bindingsStream.on('error', (error) => {
        console.error(error);
    });
}

/**
 * Query the necessary data from a category
 * @param {String} categoryID - ID of category that needs to be queried
 * @param {Function} callback - Function to handle the retrieved data from a category
 * @returns {Promise<void>}
 */
export async function queryCategory(categoryID, callback) {
    const QueryEngine = require('@comunica/query-sparql').QueryEngine;
    const myEngine = new QueryEngine();
    const result = await myEngine.query(`
      SELECT DISTINCT * WHERE {
        <${categoryID}> <http://schema.org/name> ?name .
        <${categoryID}> <http://schema.org/description> ?description
      }`, {
        sources: ['https://data.knows.idlab.ugent.be/person/office/application-categories'],
    });
    const bindingsStream = await result.execute()
    bindingsStream.on('data', (binding) => {
        const category = {};
        category.name = binding.get('name').value;
        category.description = binding.get('description').value;
        category.id = categoryID;
        callback(category);
    });
}