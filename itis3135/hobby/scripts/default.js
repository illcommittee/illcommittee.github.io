// scripts//default.js

/**
 * Section Switching:
 * Show exactly one section inside main at a time
 * Toggles the 'active' class. Keeps CSS simple.
 * 
 * Hide all <main> <section> elements*/
function hideAllSections(){
    const sections = document.querySelectorAll('main section');
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
        sections[i].setAttribute('aria-hidden', 'true'); //Accessibility, mark as hidden
    }
}

/**
 * Show exactly one section by its id, update the URL hash
 * and move focus to the section's <h2> for accessibility.
 */
function showSection(id){
    hideAllSections();
    const chosen = document.getElementById(id);
    if (!chosen) return;

    chosen.classList.add('active');
    chosen.setAttribute('aria-hidden', 'false');

    //Keep url like .../#what so back/forward buttons work
    if (location.hash !== '#' + id) {
        location.hash = '#' + id;
    }

    //Move focus to the first <h2> inside the section for keyboard/screen reader users
    const h2 = chosen.querySelector('h2');
    if (h2) {
        //Make h2 temporarily focusable, focus it, then clean blur
        h2.setAttribute('tabindex', '-1');
        h2.focus({ preventScroll: false });
        h2.addEventListener('blur', () => h2.removeAttribute('tabindex'), { once: true });
    }
}

/**
 * Attach click handlers to header nav links like
 * <a href="#what" data-target="what">What</a>
 */
function setupNav(){
    const links = document.querySelectorAll('header nav a[data-target]');
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function (evt) {
            evt.preventDefault(); //Prevent default jump to hash
            const id = this.getAttribute('data-target');
            showSection(id);
        });
    }
}

/**
 * Decide which section to show first
 * If the URL already has a #has, honor it
 * Otherwise default to what
 */
function startApp(){
    setupNav();

    if (location.hash) {
        showSection(location.hash.substring(1));
    } else {
        showSection('what');
    }

    //Keep the UI in sync when user presses Back/Forward
    window.addEventListener('hashchange', () => {
        const id = location.hash.replace('#', '') || 'what';
        showSection(id);
    });
}

/**
 * Setup Favorite Form (Who part, hobby page)
 * On submit, confirm it's been submitted, show output
 */
function setupFavoriteForm(){
    //Find the form inside the #who section
    const form = document.querySelector('#who form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault(); //Prevent actual submit

        const input = document.getElementById('fav');
        const output = document.getElementById('favOutput'); //Spot to show the message
        const value = input.value.trim();

        if (value === '') {
            alert('Please enter your favorite part of camping!');
            return;
        }

        //Show on the page
        output.textContent = 'Your favorite part of camping is: ' + value;

        //Clear box
        input.value = '';
    });
}

/**
 * Simple water helper
 * .25L per mile
 * Round to nearest .5 L
 */
function setupWaterHelper(){
    const btn = document.getElementById('tool');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const milesInput = document.getElementById('miles');
        const out = document.getElementById('toolOut');

        const miles = Number(milesInput && milesInput.value ? milesInput.value : 0);
        if (!miles) {
            out.textContent = 'Enter the planned miles';
            return;
        }

        //0.25 L/mile
        const litersRaw = miles * 0.25;
        const liters = Math.round(litersRaw * 2) / 2;
        out.textContent = 'Recommended water to carry: ' + liters + ' L';
    });
}

/**
 * Page load
 * DOMContentLoaded fires when the HTML is parsed and ready
 
document.addEventListener('DOMContentLoaded', () => {
    startApp();
    setupWaterHelper();
    setupFavoriteForm();
});
*/