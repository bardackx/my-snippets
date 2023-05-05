const sheet = new CSSStyleSheet();
sheet.replaceSync(`
:host {
  background: red;
  display: block;
  color: white;
}
`);

class ExampleElement extends HTMLElement {
  #shadom: ShadowRoot;

  constructor() {
    super();
    this.#shadom = this.attachShadow({
      mode: "closed"
    });
    this.#shadom.adoptedStyleSheets = [sheet];
    this.#shadom.innerHTML = 'hello world';
  }
}
window.customElements.define("example-element", ExampleElement);
export { ExampleElement as default };
