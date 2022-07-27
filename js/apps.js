
// function that will query the necessary data from a Solid app using their ClientID's and the Comunica SPARQL query
export async function queryClientIds(ids, callback) {
    const QueryEngine = require('@comunica/query-sparql').QueryEngine;
    const myEngine = new QueryEngine();
    const result = await myEngine.query(`
      SELECT DISTINCT * WHERE {
        ?s <http://www.w3.org/ns/solid/oidc#client_name> ?name .
        ?s <http://www.w3.org/ns/solid/oidc#client_uri> ?uri . 
        OPTIONAL { ?s <http://www.w3.org/ns/solid/oidc#logo_uri> ?logo } .
        OPTIONAL { ?s <http://schema.org/description> ?description }
      }`, {
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

        callback(app)
    });

    // TODO: make sure this ACTUALLY handles the error and the query doesn't die midway, as this causes no app tiles to be made
    bindingsStream.on('error', (error) => {
        console.error(error);
    });
}