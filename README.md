# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Slavko added:    "dev": "vite --host localhost --port 3000",

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Example of integration to WordPress site

### Under menu option 'WPCode plugin' select Global Scripts


  <div>
    <div>
      <br/>
      <div style='background-color: #76a2d3ff; border: 1px solid #ffffff'>Header
          <code>
            &lt;link rel="stylesheet" crossorigin <br />
            &nbsp;&nbsp;&nbsp;href="https://slavkopar.github.io/knowledge-lib/assets/index.css" /&gt;
            <br />
            &lt;base href="https://slavkopar.github.io/knowledge-lib" /&gt;
          </code>
        </div>
      </div>
      <div>
      <br/>
      <div>Body<div style='background-color: #76a2d3ff; border: 1px solid #ffffff'>
        <code>
          &lt;div id="root"&gt;&lt;/div&gt;
        </code>
      </div>
    <div>
    <br/>
    <div>Footer
      <div style='background-color: #76a2d3ff; border: 1px solid #ffffff'>' 
        <code>
          &lt;script type="module" crossorigin
          <br />
          &nbsp;&nbsp;&nbsp;src="https://slavkopar.github.io/knowledge-lib/assets/index.js"&gt;&lt;/script&gt;
        </code>
      </div>
  </div>


