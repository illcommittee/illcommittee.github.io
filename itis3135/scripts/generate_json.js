//scripts/generate_json.js

//Helpers
function $(sel, root){
    return (root || document).querySelector(sel);
}
function $all(sel, root){
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
}
function getVal(id){
    var el = document.getElementById(id);
    return (el && typeof el.value === "string") ? el.value.trim() : "";
}
function firstChar(s){
    return s ? s.trim().charAt(0) : "";
}

//Collect repeating groups
function collectCourses(){
    // inputs in order: department, number, name, reason
    var rows = $all("#courses .course-row");
    var out = [];
    rows.forEach(function(row){
        var inputs = row.querySelectorAll("input"); //correct casing
        var dept   = (inputs[0] && inputs[0].value) ? inputs[0].value.trim() : "";
        var number = (inputs[1] && inputs[1].value) ? inputs[1].value.trim() : "";
        var name   = (inputs[2] && inputs[2].value) ? inputs[2].value.trim() : "";
        var reason = (inputs[3] && inputs[3].value) ? inputs[3].value.trim() : "";
        if (dept || number || name || reason){
            out.push({ department: dept, number: number, name: name, reason: reason });
        }
    });
    return out;
}

function collectLinks(){
    // 5 fixed pairs -> { name, href }
    var links = [];
    for (var i = 0; i < 5; i++){
        var nameEl = document.getElementById("linkLabel" + i);
        var hrefEl = document.getElementById("linkUrl" + i);
        var name = (nameEl && nameEl.value) ? nameEl.value.trim() : "";
        var href = (hrefEl && hrefEl.value) ? hrefEl.value.trim() : "";
        if (name || href){
            links.push({ name: name, href: href });
        }
    }
    return links;
}

function buildJsonObject(){
    var imgEl = document.getElementById("photoPreview");
    var imagePath = "";
    if (imgEl){
        imagePath = imgEl.getAttribute("src") || imgEl.src || "";
    }

    var dividerEl = document.getElementById("divider");
    var dividerVal = (dividerEl && dividerEl.value) ? dividerEl.value.trim() : "";

    return {
        firstName: getVal("firstName"),
        preferredName: getVal("preferredName"),
        middleInitial: firstChar(getVal("middleName")),
        lastName: getVal("lastName"),
        divider: dividerVal,
        mascotAdjective: getVal("mascotAdjective"),
        mascotAnimal: getVal("mascotAnimal"),
        image: imagePath,
        imageCaption: getVal("picCaption"),
        personalStatement: getVal("personalStatement"),

        // Bullets mapped to required fields
        personalBackground: getVal("bullet1"),
        professionalBackground: getVal("bullet2"),
        academicBackground: getVal("bullet3"),
        primaryComputer: getVal("bullet4"),

        courses: collectCourses(),
        links: collectLinks()
    };
}

//Replace form with highlighted JSON
function replaceFormWithJson(jsonObj){
    var form = $("#form");
    var formBlock = $("#formBlock");
    if (!form || !formBlock) return;

    // Update H2 (assignment text)
    var h2 = $("#pageH2");
    if (h2) h2.textContent = "Introduction HTML";

    // Remove form and show JSON block
    form.remove();

    var section = document.createElement("section");
    section.innerHTML =
        '<p class="hint">Select all to copy your JSON:</p>' +
        '<pre><code class="language-json" id="jsonCode"></code></pre>' +
        '<button id="backBtn" class="back-btn">Back to Form</button>';
    formBlock.appendChild(section);

    // Fill and highlight
    var code = $("#jsonCode", section);
    code.textContent = JSON.stringify(jsonObj, null, 2);

    if (window.hljs && typeof window.hljs.highlightElement === "function"){
        window.hljs.highlightElement(code);
    } else if (window.hljs && typeof window.hljs.highlightAll === "function"){
        window.hljs.highlightAll();
    }

    // Reset path
    $("#backBtn", section).addEventListener("click", function(){
        location.reload();
    });
}

document.addEventListener("DOMContentLoaded", function(){
    var btn = $("#generateJsonBtn");
    if (!btn) return;

    btn.addEventListener("click", function(){
        var data = buildJsonObject();
        replaceFormWithJson(data);
    });
});