import * as ReactDOM from "react-dom/client";

const DeleteMe = () => (
  <>
    <style>
      {/*css*/ `
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
      .terminal, .code {
        padding: 8px;
        overflow: auto;
        line-height: 1.5em;
      }
      .terminal, .file {
        margin: 12px 0;
        border-radius: 4px;
      }
      .terminal {
        color: #eee;
        background: #111;
      }
      .code {
        background:rgb(215, 227, 243);
        color: #222;
        margin: 0;
      }
      .file {
        background: #313131;
        overflow: hidden;
      }
      .name {
        color: #fff;
        background:rgb(99, 151, 206);
        margin: 0;
        padding: 8px;
      }
    `}
    </style>

    <h1>How was this project made?</h1>

    <pre className="terminal">{`npm init -y
npm install react react-dom
npm install --save-dev typescript @types/react @types/react-dom parcel
npx tsc --init`}</pre>

    <div className="file">
      <pre className="name">{'./tsconfig.json'}</pre>
      <pre className="code">{`{
  "compilerOptions": {
    "jsx": "react-jsx",
    "module": "ESNext",
    "target": "ESNext",
    "moduleResolution": "node",
    "strict": true
  }
}`}</pre>
    </div>

    <pre className="terminal">mkdir src</pre>

    <div className="file">
      <pre className="name">{'./src/index.html'}</pre>
      <pre className="code">
{`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="./index.tsx"></script>
</body>
</html>`}
      </pre>
    </div>

    <div className="file">
      <pre className="name">{'./src/index.tsx'}</pre>
      <pre className="code">{`import React from "react";
import ReactDOM from "react-dom/client";

const App = () => <h1>Hello, React + TypeScript!</h1>;

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
`}</pre>
    </div>

    <div className="file">
      <pre className="name">{'./package.json'}</pre>
      <pre className="code">{`...
"scripts": {
  "dev": "parcel src/index.html --dist-dir .parcel-dist --open",
  "build": "parcel build src/index.html"
},
...
`}</pre>
    </div>

    <h2>for development run:</h2>
    <pre className="terminal">npm run dev</pre>
    <h2>for building run:</h2>
    <pre className="terminal">npm run build</pre>
  </>
);

const App = () => (
  <>
    <DeleteMe />
  </>
);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
