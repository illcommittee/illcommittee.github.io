// scripts//default.js

function hideAllSections(){
    var sections = document.querySelectorAll('main selection');
    for(var i = 0; i < sections.length; i++){
        sessions[i].classList.remove('active');
    }
}

function showSection(id){
    hideAllSections();
    var chosen = document.getElementById(id);
    if(chosen){
        chosen.classList.add('active');
        //Keeps URL in sync
        if(location.hash != '#' + id){
            location.hash = '#' + id;
        }
        //moves focus to the section heading
        var h2 = chosen.querySelector('h2');
        if(h2){
            h2.setAttribute('tabindex', '-1');
            h2.focus({preventScroll: false});
        }
    }
}

function wireNav(){
    var links = document.querySelectorAll('header nav a[data-target]');
    for(var i = 0; i < links.length; i++){
        links[i].addEventListener('click', function(evt){
            evt.preventDefault();
            var id = this.getAttribute('data-target');
            showSection(id);
        });
    }
}

function initSPA(){
    wireNav();
    if(location.hash){
        showSection(location.hash.substring(1));
    }else{
        showSection('what');
    }
}

//Favorite Part form -> save locally
function wireFavoriteForm(){
    var form = document.querySelector('#who form');
    if(!form) return;

    form.addEventListener('submit', function (e){
        e.preventDefault();
        var input = (input && input.value) ? input.value.trim() : '';
        if(!value){
            alert('Please enter your favorite part!');
        }
        //Save to browser local storage
        var key = 'camping_favorites';
        var list = [];
        try { list  = JSON.parse(localStorage.getItem(key)) || []; } catch (err) {}
        list.push({value: value, time: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(list));
        input.value = '';
        alert('Thanks for sharing your favorite part! (Saved locally in your browser)');
    });
}

function wireWaterHelper(){
    var btn = document.getElementById('tool');
    if(!btn) return;

    btn.addEventListener('click', function(){
        var milesInput = document.getElementById('miles');
        var out = document.getElementById('toolOut');
        var miles = Number(milesInput && milesInput.value ? milesInput.value : 0);
        if(!miles){
            out.textContent = 'Enter the planned miles';
            return;
        }
        //Simple rule,: ~0.5 L/hour, assuming ~2 mph then ~0.25 L/mile
        var liters = Math.round((miles * 0.25) * 2) / 2; //round to nearest 0.5
        out.textContent = 'Recommended water to carry: ' + liters + ' L';
    });
}

//Init on page load
document.addEventListener('DOMContentLoaded', function(){
    initSPA();
    wireFavoriteForm();
    wireWaterHelper();
});
