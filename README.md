# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Slavko added:    "dev": "vite --host localhost --port 3000",

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Example of integration to WordPress site


```js

    <pre> 
      <div className="bg-warning w-auto"><b>Plugin</b></div>
      <div className="bg-warning w-auto"><b>WPCode Code / Global scripts</b></div>
    </pre>
    <pre>
      <div className="bg-warning w-auto"><b>Header</b></div>
      <code>
        &lt;link rel="stylesheet" crossorigin <br />
        &nbsp;&nbsp;&nbsp;href="https://slavkopar.github.io/knowledge-lib/assets/index.css" /&gt;
        <br />
        &lt;base href="https://slavkopar.github.io/knowledge-lib" /&gt;
      </code>
      <br /><br />
      <div className="bg-warning w-auto" style={{ minWidth: '100%' }}><b>Body</b></div>
      <code>
        &lt;div id="root"&gt;&lt;/div&gt;
      </code>
      <br /><br />

      <div className="bg-warning w-auto"><b>Footer</b></div>
      <code>
        &lt;script type="module" crossorigin
        <br />
        &nbsp;&nbsp;&nbsp;src="https://slavkopar.github.io/knowledge-lib/assets/index.js"&gt;&lt;/script&gt;
      </code>
      <br />
      <br />
    </pre>
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
