/**
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions.
 *
 * @param selector
 * @returns {Promise}
 * Example usage:
 * import {elementReady} from ...
 * elementReady('#name-of-element').then( () => { console.log('element is loaded'); });
 */
const elementReady = (selector) => {
    return new Promise((resolve, reject) => {
        let el = document.querySelector(selector);
        if (el) {resolve(el);}
        new MutationObserver((mutationRecords, observer) => {
            // Query for elements matching the specified selector
            Array.from(document.querySelectorAll(selector)).forEach((element) => {
                resolve(element);
                //Once we have resolved we don't need the observer anymore.
                observer.disconnect();
            });
        })
            .observe(document.documentElement, {
                childList: true,
                subtree: true
            });
    });
};

export default {
    elementReady: elementReady
};