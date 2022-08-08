# Solid App Store

An app store for Solid that displays developer tools and apps that exist in the Solid ecosystem

## Setup and run HTTP server

Install dependencies:
```shell script
$ npm install
```

Run development server:
```shell script
$ npm run watch
```

Run production sever:
```shell script
$ npm start
```

## Solid-OIDC Client ID Document
For an app to be added on the app store, it should offer a Client ID, serialized as an `application/ld+json`
document.
The Client ID looks like this:

```json
{
  "@context": ["https://www.w3.org/ns/solid/oidc-context.jsonld"],

  "client_name": "Solid Application Name",
  "client_uri": "https://app.example/",
  "logo_uri" : "https://app.example/logo.png",
  "http://schema.org/description": "description",
  "http://schema.org/category" : [
    {
      "@id": "https://data.knows.idlab.ugent.be/person/office/application-categories#reference"
    }
  ]
}
```

Categories are required to have an id from `https://data.knows.idlab.ugent.be/person/office/application-categories`.
Logo, description, and categories are optional.
More information on Solid-OIDC Client IDs can be found [here](https://solid.github.io/solid-oidc/#clientids-document)

## License

This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/) and
released under the [MIT license](http://opensource.org/licenses/MIT).
