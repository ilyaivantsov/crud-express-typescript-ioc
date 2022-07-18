### Configuration (environment variables)

Create `.env` file in the root directory as follows:

```ini
PORT=3000
HOST=localhost
DEBUG=true
```

### Instal dependencies

Install dependencies executing `npm install`.

## Running the app

```bash
# development
$ npm run dev

# build
$ npm run build

# Run after build
$ node ./dist/server.js
```

## Swagger API docs

Swagger docs will be available at [http:://localhost:3000/swagger](http:://localhost:3000/swagger) by default (with parameters as in the example in the file `.env`)