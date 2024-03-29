/**
 * Query the necessary data from the Solid app(s).
 * @param {Array} ids - Array of the app('s) ClientID(s).
 * @param {Array} additionalSources - Array of additional sources that need to be queries beside the IDs.
 * @param {Function} handleNewApp - Function to handle the retrieved data from an app.
 * @param {Function} handleAppQueryFinished - Function to call once the complete query is finished.
 * @returns {Promise<void>}
 */
export async function queryApps(ids, additionalSources = [], handleNewApp, handleAppQueryFinished) {
    const QueryEngine = require('@comunica/query-sparql').QueryEngine;
    const myEngine = new QueryEngine();

    // Remove sources that are the same when removing the fragment.
    let sources = ids.concat(additionalSources).map(source => {
        const url = new URL(source);
        const fragment = url.hash;
        return source.replace(fragment, '');
    });
    sources = [...new Set(sources)];

    const result = await myEngine.query(`
      PREFIX oidc: <http://www.w3.org/ns/solid/oidc#>
      PREFIX schema: <http://schema.org/>
      SELECT DISTINCT ?id ?name ?uri ?logo ?description (GROUP_CONCAT(?category) AS ?categories) WHERE {
        {
          ?id oidc:client_name ?name;
             oidc:client_uri ?uri .
          
          OPTIONAL { ?id oidc:logo_uri ?logo } .
        }
        UNION 
        {
          ?id a schema:SoftwareApplication;
             schema:name ?name;
             ^schema:targetProduct [
                schema:codeRepository ?uri
             ] .
          
          OPTIONAL { ?id schema:logo ?logo } .   
        }
     
        OPTIONAL { ?id schema:description ?description } .
        OPTIONAL { ?id schema:category ?category } .
      } 
      GROUP BY ?id ?name ?uri ?logo ?description`, {
        sources,
        lenient: true
    });
    const bindingsStream = await result.execute()
    bindingsStream.on('data', (binding) => {
        // Some data sources might contain information about apps that are not explicitly asked for.
        if (ids.includes(binding.get('id').value)) {
            const app = {
                categories: []
            };
            app.name = binding.get('name').value;
            app.uri = binding.get('uri').value;

            // As both the app's logo and description are optional, check if they are present or use a placeholder
            if (binding.has('logo')) {
                app.logo = binding.get('logo').value;
            } else {
                app.logo = 'https://github.com/KNowledgeOnWebScale/solid-app-store/raw/main/solid-logo.png';
            }
            if (binding.has('description')) {
                app.description = binding.get('description').value;
            } else {
                // TODO: no description when absent
                app.description = 'A Solid App'
            }
            if (binding.has('categories')) {
                app.categories = binding.get('categories').value.split(' ');
            }

            handleNewApp(app);
        }
    });

    bindingsStream.on('end', () => {
        console.log('done');
       handleAppQueryFinished();
    });

    // TODO: make sure this ACTUALLY handles the error and the query doesn't die midway, as this causes no app tiles to be made.
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

/**
 * This function queries for all IDs of trusted apps to show in the store.
 * @param sources - The sources to query for IDs.
 * @returns {Promise<unknown>}
 */
export function queryIDs(sources) {
    return new Promise(async resolve => {
        const QueryEngine = require('@comunica/query-sparql').QueryEngine;
        const myEngine = new QueryEngine();
        const result = await myEngine.query(`
      SELECT DISTINCT ?id WHERE {
        <https://data.knows.idlab.ugent.be/person/office/#> <https://data.knows.idlab.ugent.be/person/office/#trustedApp> ?id .
      }`, {
            sources
        });
        const bindingsStream = await result.execute();
        const ids = [];

        bindingsStream.on('data', (binding) => {
            ids.push(binding.get('id').value);
        });

        bindingsStream.on('end', () => {
            resolve(ids);
        });
    });
}
