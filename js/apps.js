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
        if (binding.has('logo')) {
            app.logo = binding.get('logo').value;
        } else {
            app.logo = 'https://genr.eu/wp/wp-content/uploads/2018/10/logo.svg';
        }

        if (binding.has('description')) {
            app.description = binding.get('description').value;
        } else {
            //Placeholder for description
            app.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porttitor et sapien eu efficitur.'
        }

        callback(app)
    });
    bindingsStream.on('error', (error) => {
        console.error(error);
    });
}