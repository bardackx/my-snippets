## Hey, this could be outdated, check parcel recipes just in case it is no longer working
Maybe just check https://parceljs.org/recipes/react/ for a more comprehensive example

---

# REACT Instructions

## Create project

This creates the project

```
npm create parcel react-client my-react-app
```

This tells vscode to trust vite (src/vite-env.d.ts)

```
/// <reference types="vite/client" />
```

## Consistent formatting

This gives us consistent formatting (you will need this extension https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

```
npm install --save-dev prettier
```

Now to configure it create `prettier.config.js`

```js
export default {
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: "all",
};
```

Now to tell vscode you want to use prettier for formatting `.vscode/settings.json`
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Routing (with wouter, very light)

```
npm i wouter
```

See https://github.com/molefrog/wouter but basically

```tsx
import { Link, Route, Switch } from "wouter";

const App = () => (
  <>
    <Link href="/users/1">Profile</Link>

    <Route path="/about">About Us</Route>

    {/* 
      Routes below are matched exclusively -
      the first matched route gets rendered
    */}
    <Switch>
      <Route path="/inbox" component={InboxPage} />

      <Route path="/users/:name">
        {(params) => <>Hello, {params.name}!</>}
      </Route>

      {/* Default route in a switch */}
      <Route>404: No such page!</Route>
    </Switch>
  </>
);
```

---

# DENO Instructions

```ts
import { Hono } from "jsr:@hono/hono@4.12.15";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello from Deno 2" });
});

app.get("/users/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ userId: id });
});

Deno.serve(app.fetch);
```
