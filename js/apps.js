export async function queryClientIds(ids) {
    const apps = []
    const QueryEngine = require('@comunica/query-sparql').QueryEngine;
    const myEngine = new QueryEngine();
    const result = await myEngine.query(`
      SELECT * WHERE {
        ?s <http://www.w3.org/ns/solid/oidc#client_name> ?name .
        ?s <http://www.w3.org/ns/solid/oidc#client_uri> ?uri . 
        OPTIONAL { ?s <http://www.w3.org/ns/solid/oidc#logo_uri> ?logo }
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

        //Placeholder for description
        app.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porttitor et sapien eu efficitur.'

        apps.push(app);
    });
    bindingsStream.on('error', (error) => {
        console.error(error);
    });
    bindingsStream.on('end', () => {
        return apps;
    });
}