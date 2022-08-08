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

## How to add app to store

An app has to either offer a Client ID document or
have a schema.org description.

## Solid-OIDC Client ID Document
You find information on Solid-OIDC Client ID documents [here](https://solid.github.io/solid-oidc/#clientids-document).
The Client ID has to be serialized as `application/ld+json`. 
An example looks like this:

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
You find a corresponding SHACL file [here](./shape/client-id.ttl).

### Schema.org description
You can describe an app via [schema.org](http://schema.org).
An example looks like this:

```json
{
  "@context": {
    "@vocab": "http://schena.org/",
    "logo": {"@type": "@id"},
    "codeRepository": {"@type": "@id"},
    "category": {"@type": "@id"},
    "hasGit": {"@reverse": "targetProduct"}
  },
  "@id":"http://app.example",
  "@type": "SoftwareApplication",
  "name": "Solid Application Name",
  "description": "description",
  "logo": "https://app.example/logo.png",
  "category": ["https://data.knows.idlab.ugent.be/person/office/application-categories#reference"],
  "hasGit": {
    "@id": "http://app.example/repo",
    "codeRepository": "https://github.com/example/code"
  }
}
```

Categories are required to have an id from `https://data.knows.idlab.ugent.be/person/office/application-categories`.
Logo, description, and categories are optional.
You find a corresponding SHACL file [here](./shape/schema-org.ttl).

## License

This code is copyrighted by [Ghent University – imec](http://idlab.ugent.be/) and
released under the [MIT license](http://opensource.org/licenses/MIT).
