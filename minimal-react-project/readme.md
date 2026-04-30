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
npm install --save-dev eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks globals
```

but you need to create `eslint.config.js`

```js
import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json", // enables type-aware rules
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // React
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",   // not needed with React 17+
      "react/prop-types": "off",            // TypeScript handles this

      // TypeScript
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",

      // General
      "no-console": "warn",
      "max-params": ["warn", 3],
    },
  },

  {
    ignores: ["dist/**", "node_modules/**", "*.config.js"],
  }
);
```

---

# DENO Instructions

```
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
