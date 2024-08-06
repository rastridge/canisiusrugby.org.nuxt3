## Development Server

Start the development server on `http://localhost:3000`:

```bash

# yarn
yarn dev

```

## Production

Build the application for production:

```bash

# yarn
yarn build

```

Locally preview production build:

```bash

# yarn
yarn preview
```

# code - canisiusrugby.org

- Built using Nuxt @ v3.12

## Front end Build Setup

- must use node >= v18

```
nvm use stable
```

- install dependencies

```
yarn install
```

- start with hot reload at localhost:3000

```
yarn run dev
```

- build for production

```
yarn run generate
```

- Upload to site (dry run first)

```
rsync -av --dry-run --delete --exclude ".git" --exclude ".gitignore" --exclude ".nojekyll" --exclude "xoda" --exclude "_img" --exclude "imgs" --exclude "templabels" --exclude "thumbs" --exclude "xoda" ~/code/canisiusrugby.org.nuxt3/canisiusrugby.org/dist/  rastridge@vps30249.dreamhostps.com:/home/rastridge/my-test-site.net/public/

```

- Inspect the site

```
ssh rastridge@vps30249.dreamhostps.com
cd my-test-site.net/public
```

# Supporting Services

A number of outside services are used to implement apps

## Sending Emails

ElasticEmail
setup and Usage

```
https://app.elasticemail.com/login
```

## Sending Text Messages

- Twilio - text messaging

```
https://www.twilio.com/login
```
