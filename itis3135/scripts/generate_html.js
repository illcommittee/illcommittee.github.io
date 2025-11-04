function escapeHtml(s) {
    s = (s === undefined || s === null) ? "" : String(s);
    return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getVal(id) {
    var el = document.getElementById(id);
    return el && el.value ? el.value.trim() : "";
}
document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("generateHtmlBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
        // 1) Read the form values (only what already exists)
        var firstName = getVal("firstName");
        var middleName = getVal("middleName");
        var lastName = getVal("lastName");
        var preferredName = getVal("preferredName");

        var ackStatement = getVal("ackStatement");
        var ackDate = getVal("ackDate");

        var mascotAdj = getVal("mascotAdjective");
        var mascotAnimal = getVal("mascotAnimal");

        var dividerEl = document.getElementById("divider");
        var divider = (dividerEl && dividerEl.value) ? dividerEl.value : "";

        var photo = document.getElementById("photoPreview");
        var photoSrc = photo ? (photo.getAttribute("src") || photo.src || "") : "";
        var photoAlt = photo ? (photo.getAttribute("alt") || "Profile photo") : "Profile photo";
        var picCaption = getVal("picCaption");

        var personalStatement = getVal("personalStatement");

        // bullets
        var bulletsNodes = document.querySelectorAll('input[name="bullets"]');
        var bullets = Array.prototype.map.call(bulletsNodes, function (i) {
            return (i.value || "").trim();
        }).filter(function (s) { return !!s; });

        // Links (fixed 5)
        var links = [];
        for (var i = 0; i < 5; i++) {
            var lbl = getVal("linkLabel" + i);
            var url = getVal("linkUrl" + i);
            if (lbl && url) links.push({ label: lbl, url: url });
        }
        
        var quote = getVal("quote");
        var quoteAuthor = getVal("quoteAuthor");

        var funnyThing = getVal("funnyThing");
        var shareThing = getVal("shareThing");

        var courseRows = document.querySelectorAll('#courses .course-row');
        var coursesHtml = "";
        if (courseRows.length) {
            var items = Array.prototype.map.call(courseRows, function (row) {
                var inputs = row.querySelectorAll('input');
                var dept   = inputs[0] ? inputs[0].value.trim() : "";
                var num    = inputs[1] ? inputs[1].value.trim() : "";
                var name   = inputs[2] ? inputs[2].value.trim() : "";
                var reason = inputs[3] ? inputs[3].value.trim() : "";
                var line = "<strong>" + escapeHtml(dept) + " " + escapeHtml(num) + "</strong>";
                if (name)   line += " — " + escapeHtml(name);
                if (reason) line += " <em>(" + escapeHtml(reason) + ")</em>";
                return "<li>" + line + "</li>";
            }).join("");

            coursesHtml = `
            <section class="courses">
                <h3>Current Courses</h3>
                <ul>
                    ${items}
                </ul>
            </section>`;
        }

        //Built HTML section
        var nameParts = [];
        if (firstName) nameParts.push(firstName);
        if (middleName) nameParts.push(middleName);
        if (lastName) nameParts.push(lastName);
        var fullName = nameParts.join(" ");
        var displayName = preferredName ? (preferredName + " (" + fullName + ")") : fullName;

        var bulletsHtml = bullets.map(function (b) {
            return "<li>" + escapeHtml(b) + "</li>";
        }).join("");

        var linksHtml = links.map(function (l) {
        return '<li><a href="' + escapeHtml(l.url) + '" target="_blank" rel="noopener">' + escapeHtml(l.label) + "</a></li>";
        }).join("");

        var html = 
        `<!-- BEGIN: Introduction -->
        <section class="introduction">
            <h2>${escapeHtml(displayName)}</h2>
            
            <p class="ack">
                ${escapeHtml(ackStatement)}${ackDate ? ` <time datetime="${escapeHtml(ackDate)}">(${escapeHtml(ackDate)})</time>` : ""}
            </p>

            <h3 class="mascot">Mascot: ${escapeHtml(mascotAdj)} ${escapeHtml(mascotAnimal)}</h3>
            ${divider ? `<div class="divider" aria-hidden="true">${escapeHtml(divider)}</div>` : ""}

            <figure class="profile-photo">
                <img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(photoAlt)}">
                ${picCaption ? `<figcaption>${escapeHtml(picCaption)}</figcaption>` : ""}
            </figure>

            <p class="personal-statement">${escapeHtml(personalStatement)}</p>

            <section class="seven-bullets">
                <h3>Seven Bullets</h3>
                <ul>
                    ${bullets.map(function (b) { return `<li>${escapeHtml(b)}</li>`; }).join("")}
                </ul>
            </section>

            <blockquote class="favorite-quote">
                <p>${escapeHtml(quote)}</p>
                <cite>${escapeHtml(quoteAuthor)}</cite>
            </blockquote>

            ${(funnyThing || shareThing) ? `
            <section class="extras">
                <h3>Extras</h3>
                <ul>
                    ${funnyThing ? `<li><strong>Funny thing:</strong> ${escapeHtml(funnyThing)}</li>` : ""}
                    ${shareThing ? `<li><strong>Something I'd like to share:</strong> ${escapeHtml(shareThing)}</li>` : ""}
                </ul>
            </section>` : ""}

            ${coursesHtml}

            ${links.length ? `
            <nav class="links">
                <h3>Links</h3>
                <ul>
                    ${links.map(function (l) {
                    return `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a></li>`;
                }).join("")}
            </ul>
        </nav>` : ""}
    </section>
    <!-- END: Introduction -->`;

        // 3) Replace the form with a highlighted code block + update H2
        var form = document.getElementById("form");
        var formBlock = document.getElementById("formBlock");
        var pageH2 = document.getElementById("pageH2");
        if (!form || !formBlock) return;

        form.parentNode.removeChild(form);
        if (pageH2) pageH2.textContent = "Introduction HTML";

        var wrapper = document.createElement("section");
        wrapper.innerHTML = `
        <p class="hint">Select all and copy this HTML:</p>
        <pre><code class="language-html"></code></pre>
        <button id="backToFormBtn" class="back-btn">Back to Form</button>
        `;
        formBlock.appendChild(wrapper);

        // Fill in and highlight
        var codeEl = wrapper.querySelector("code");
        codeEl.textContent = html;
        if (window.hljs) {
            if (typeof window.hljs.highlightElement === "function") window.hljs.highlightElement(codeEl);
            else if (typeof window.hljs.highlightAll === "function") window.hljs.highlightAll();
        }

        // Back button: simplest reliable reset
        var backBtn = wrapper.querySelector("#backToFormBtn");
        backBtn.addEventListener("click", function () {
            location.reload();
        });
    });
});