function debounce(fn, wait) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}
function onKeyUpEscape(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if (!openDetailsElement) return;

    const summaryElement = openDetailsElement.querySelector('summary');
    openDetailsElement.removeAttribute('open');
    summaryElement.setAttribute('aria-expanded', false);
    summaryElement.focus();
}

//  global close function
function close(elm, selector) {
    elm.classList.remove(selector)
}
//  global open function
function open(elm, selector) {
    elm.classList.add(selector)
}

function closeFilter() {
    const filterDrawer = document.querySelector('.facets-wrapper');
    const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
    close(filterDrawer, 'open')
    close(drawerOverlay, 'open')
}

function openFilter() {
    const filterDrawer = document.querySelector('.facets-wrapper');
    const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
    open(filterDrawer, 'open')
    open(drawerOverlay, 'open')
}
// listerner

// mobile filter drawer
const fiterClosBtn = document.querySelector('.mobile-filter-drawer-close');
const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
const fiteropenBtn = document.querySelector('.filter-ham');
fiterClosBtn?.addEventListener('click', closeFilter);
drawerOverlay?.addEventListener('click', closeFilter);
fiteropenBtn?.addEventListener('click', openFilter);

// mobile filter drawer end


// collection page  pagination load more
document.addEventListener('DOMContentLoaded', function () {

    // Check if the element for infinite scroll pagination exists
    var infiniteScrollPagination = document.querySelector('.collection #infinite-scroll-pagination');
    if (infiniteScrollPagination != null) { // Get the URL of the next page
        var nextPageUrl = `${infiniteScrollPagination.dataset.nextPage
            }`;


        // Function to load more products
        function loadMoreProducts() {
            fetch(nextPageUrl).then(function (response) {
                return response.text();
            }).then(function (data) {
                var parser = new DOMParser();
                var html = parser.parseFromString(data, 'text/html');

                var productsContainer = document.querySelector('#product-grid');
                var newProducts = html.querySelectorAll('#product-grid .grid__item');
                // Append the newly loaded products
                newProducts.forEach(function (product) {
                    productsContainer.appendChild(product);
                });

                // Update the URL of the next page

                nextPageUrl = html.querySelector('#infinite-scroll-pagination').dataset.nextPage;
                console.log(nextPageUrl, 'check url')
                if (nextPageUrl == null || nextPageUrl == '') {
                    document.querySelector('#infinite-scroll-pagination').classList.add('hide')
                } else {
                    document.querySelector('#infinite-scroll-pagination').dataset.nextPage = nextPageUrl;
                }


            });

        }

        // Event listener on click
        document.addEventListener('click',(e)=>{
            if(e.target.classList.contains('infinite-scroll-pagination') || e.target.closest('.infinite-scroll-pagination')){
                loadMoreProducts();
            }
        })
    }
 
});
// pagination 


