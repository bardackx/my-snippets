const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
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
      mode: "closed",
    });
    this.#shadom.adoptedStyleSheets = [sheet];
    this.#shadom.innerHTML = "hello world";
  }

  static get observedAttributes() {
    return ["example-attribute"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "example-attribute") {
      // Do something with the new attribute value
      console.log(`example-attribute changed from ${oldValue} to ${newValue}`);
    }
  }
}
window.customElements.define("example-element", ExampleElement);
export { ExampleElement as default };
