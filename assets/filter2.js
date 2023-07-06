   var ShopifyTheme = {};
   ShopifyTheme.collection = {

     
   }
   class productListing extends HTMLElement {

    constructor() {
        super()
        this.selectors = {
            productTemplate: "#main-product-grid",
            productImages: ".product-images-wrapper",
            productSku: ".product__sku",
            productPrice: ".product-price-js",
            optionSelectors: ".swatch-option",
            addToCartButton: "[data-role='addToCart']",
            productForm: "[data-role='product-form']",
            productData: "[data-role='product-data']",
            btnIncrement: "[data-role='increment']",
            quantityInput: "[data-role='quantity']",
            btnDecrement: "[data-role='decrement']",
            variantSelector: "[data-role='variant-selector']",
          },
          this.init = function(){
            this.productImages = document.querySelector(
              `${this.selectors.productImages}`,
            );
            this.productTemplate = document.querySelector(
              `${this.selectors.productTemplate}`,
            );
            this.productSlider = document.querySelector(
              `${this.selectors.productSlider}`,
            );
            this.thumbSlider = document.querySelector(
              `${this.selectors.thumbSlider}`,
            );
            this.productPrice = this.productTemplate?.querySelector(
              `${this.selectors.productPrice}`,
            );
            this.productSku = this.productTemplate?.querySelector(
              `${this.selectors.productSku}`,
            );
            this.optionSelectors = this.productTemplate?.querySelectorAll(
              `${this.selectors.optionSelectors}`,
            );
            this.addToCartButton = this.productTemplate?.querySelector(
              `${this.selectors.addToCartButton}`,
            );
            this.productForm = this.productTemplate?.querySelector(
              `${this.selectors.productForm}`,
            );
            this.productData = this.productTemplate
              ? JSON.parse(
                  this.productTemplate?.querySelector(`${this.selectors.productData}`)
                    .textContent,
                )
              : "";
            this.btnDecrement = this.productTemplate?.querySelector(
              `${this.selectors.btnDecrement}`,
            );
            this.btnIncrement = this.productTemplate?.querySelector(
              `${this.selectors.btnIncrement}`,
            );
            this.quantityInput = this.productTemplate?.querySelector(
              `${this.selectors.quantityInput}`,
            );
      
            if (!this.productTemplate) return;
      
            Array.from(this.optionSelectors).forEach(function (el, ind) {
              el.addEventListener("change", this.updateVariant.bind(this, el));
            }, this);
            this.updateQuantity();
          } 

    } 
    updateVariant(el) {
        // alert('varient changed')
        console.log(this.optionSelectors);
        let selectedOptions = Array.from(this.optionSelectors)
          .filter((option) => option.checked)
          .map((option) => option.value);
        console.log("selectedOptions :", this.selectedOptions);
        console.log("this.productData :", this.productData);
        this.selectedOptionData = this.productData.filter(
          (data) =>
            data.options.length == selectedOptions.length &&
            data.options.every((option) => selectedOptions.indexOf(option) != -1),
        )[0];
        console.log("selectedOptionData :", this.selectedOptionData);
        let url =
          window.location.pathname + `?variant=${this.selectedOptionData.id}`;
        let variantInput = this.productForm.querySelector("input[name='id']");
        variantInput.value = this.selectedOptionData.id;
        window.history.pushState({}, "", url);
        this.updateProductUi();
      
   }
   updateQuantity() {
    // //////////////binding quantities
    this.quantityInput.addEventListener("change", function () {
      PLPPage.Product.productForm.querySelector(
        "input[name='quantity']",
      ).value = PLPPage.Product.quantityInput.value;
    });
    PLPPage.Product.btnIncrement.addEventListener("click", function (e) {
      e.preventDefault();
      let currentVal = Number(PLPPage.Product.quantityInput.value);
      let newVal = ++currentVal;
      PLPPage.Product.quantityInput.value = newVal;
    });
    PLPPage.Product.btnDecrement.addEventListener("click", function (e) {
      e.preventDefault();
      let currentVal = Number(PLPPage.Product.quantityInput.value);
      if (currentVal == 1) return;

      let newVal = --currentVal;
      PLPPage.Product.quantityInput.value = newVal;
    });
  }
  async updateProductUi() {
    let sectionUrl =
      window.location.href +
      `${window.location.href.includes("?") ? "&" : "?"}sections=${
        this.productTemplate.dataset.id
      }`;
    let data = await fetch(sectionUrl).then((res) => res.json());
    let parser = new DOMParser();
    let html = parser.parseFromString(
      data[this.productTemplate.dataset.id],
      "text/html",
    );
    this.productPrice
      ? (this.productPrice.innerHTML = html.querySelector(
          `${this.selectors.productPrice}`,
        ).innerHTML)
      : "";
    this.productSku
      ? (this.productSku.innerHTML = html.querySelector(
          `${this.selectors.productSku}`,
        )?.innerHTML)
      : "";

    this.productImages
      ? (this.productImages.innerHTML = html.querySelector(
          `${this.selectors.productImages}`,
        )?.innerHTML)
      : "";

    this.selectedOptionData.available
      ? this.addToCartButton.classList.remove("soldOut")
      : this.addToCartButton.classList.add("soldOut");
    !this.selectedOptionData.available
      ? this.addToCartButton.setAttribute("disabled", "true")
      : this.addToCartButton.removeAttribute("disabled");
    initSlider();
  }
}
customElements.define('product-listing', productListing);

