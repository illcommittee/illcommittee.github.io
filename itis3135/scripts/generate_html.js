// scripts/generate_html.js

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

    btn.addEventListener("click", function (e) {
        e.preventDefault();

        var firstName   = getVal("firstName");
        var middleName  = getVal("middleName");
        var lastName    = getVal("lastName");
        var preferred   = getVal("preferredName");
        var mascotAdj   = getVal("mascotAdjective");
        var mascotAnimal= getVal("mascotAnimal");


    var nameBits = [];

    if (firstName) nameBits.push(firstName);
    if (middleName) nameBits.push(middleName.charAt(0) + ".");
    if (preferred) {
        if (firstName || middleName) {
            nameBits[nameBits.length - 1] += ` "${preferred}"`;
        } else {
            nameBits.push(`"${preferred}"`);
        }
    }
    if (lastName) nameBits.push(lastName);

    var nameLine = escapeHtml(nameBits.join(" "));
    if (mascotAdj || mascotAnimal) {
        nameLine += " ★ " + escapeHtml((mascotAdj + " " + mascotAnimal).trim());
    }

    // ---------- ACKNOWLEDGEMENT ----------
    var ackStatement = getVal("ackStatement");
    var ackDate      = getVal("ackDate");

    // ---------- PHOTO ----------
    var photo = document.getElementById("photoPreview");
    var photoSrc = photo ? (photo.getAttribute("src") || photo.src || "") : "";
    var photoAlt = photo ? (photo.getAttribute("alt") || "Profile photo") : "Profile photo";
    var picCaption = getVal("picCaption");

    // ---------- SEVEN BULLETS ----------
    var bulletInputs = document.querySelectorAll('input[name="bullets"]');
    var bulletLabels = [
        "Personal Background:",
        "Professional Background:",
        "Academic Background:",
        "Primary Computer:",
        "Current Interests:",
        "Goals:",
        "Fun Facts:"
    ];

    var bulletsHtml = "";
    bulletInputs.forEach(function (inp, i) {
        var val = (inp.value || "").trim();
        if (!val) return;
        var label = bulletLabels[i] || "";
        bulletsHtml +=
            `    <li><strong>${escapeHtml(label)}</strong> ${escapeHtml(val)}</li>\n`;
    });

    // ---------- COURSES ----------
    var courseRows = document.querySelectorAll("#courses .course-row");
    var coursesList = "";
    if (courseRows.length) {
        var items = Array.prototype.map.call(courseRows, function (row) {
            var inputs = row.querySelectorAll("input");
            var dept = inputs[0] ? inputs[0].value.trim() : "";
            var num = inputs[1] ? inputs[1].value.trim() : "";
            var name = inputs[2] ? inputs[2].value.trim() : "";
            var reason = inputs[3] ? inputs[3].value.trim() : "";
            
            if (!dept && !num && !name && !reason) return "";

            var line = `<strong>${escapeHtml(dept)} ${escapeHtml(num)}</strong>`;
            if (name)   line += ` - ${escapeHtml(name)}`;
            if (reason) line += ` <em>(${escapeHtml(reason)})</em>`;
            return `      <li>${line}</li>`;
        }).filter(Boolean).join("\n");

        if (items) {
            coursesList =
            `  <h4>Current Courses</h4>
            <ul>
            ${items}
            </ul>
            `;
        }
    }

    // ---------- QUOTE ----------
    var quote       = getVal("quote");
    var quoteAuthor = getVal("quoteAuthor");
    var quoteHtml   = "";
    if (quote) {
        quoteHtml =
        `<blockquote>
        “${escapeHtml(quote)}”${quoteAuthor ? " - " + escapeHtml(quoteAuthor) : ""}
        </blockquote>
        `;
    }

    // ---------- EXTRAS ----------
    var funnyThing = getVal("funnyThing");
    var shareThing = getVal("shareThing");
    var extrasHtml = "";
    if (funnyThing || shareThing) {
      extrasHtml =
      `<h4>Extras</h4>
      <ul>
      ${funnyThing ? `  <li><strong>Funny thing:</strong> ${escapeHtml(funnyThing)}</li>\n` : ""}${shareThing ? `  <li><strong>Something I'd like to share:</strong> ${escapeHtml(shareThing)}</li>\n` : ""}</ul>
      `;
    }

    // ---------- LINKS ----------
    var links = [];
    for (var i = 0; i < 5; i++) {
        var lbl = getVal("linkLabel" + i);
        var url = getVal("linkUrl" + i);
        if (lbl && url) {
            links.push({ label: lbl, url: url });
        }
    }
    var linksHtml = "";
    if (links.length) {
        linksHtml =
        `<h4>Links</h4>
        <ul>
        ${links.map(function (l) {
            return `  <li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a></li>`;
        }).join("\n")}
        </ul>
        `;
    }

    // ---------- FINAL HTML SNIPPET (WHAT WILL BE DISPLAYED AS CODE) ----------
    var snippet =
    `<h2>Introduction HTML</h2>
    <h3>${nameLine}</h3>
    <p>${escapeHtml(ackStatement)}${ackDate ? ` <span>(${escapeHtml(ackDate)})</span>` : ""}</p>
    <figure>
    <img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(photoAlt)}" />
    ${picCaption ? `<figcaption>${escapeHtml(picCaption)}</figcaption>` : ""}
    </figure>
    <ul>
    ${bulletsHtml}</ul>
    ${coursesList}${quoteHtml}${extrasHtml}${linksHtml}`.trim() + "\n";

    // ---------- REPLACE FORM WITH CODE BLOCK ----------
    var form = document.getElementById("form");
    var formBlock = document.getElementById("formBlock");
    var pageH2 = document.getElementById("pageH2");
    if (!form || !formBlock) return;

    // change top H2 text
    if (pageH2) {
      pageH2.textContent = "Introduction HTML";
    }

    // remove the form
    form.parentNode.removeChild(form);

    // insert section + pre > code for nicely formatted copyable HTML
    var wrapper = document.createElement("section");
    wrapper.className = "generated-html-block";
    wrapper.innerHTML = `
        <p class="hint">Select all of the code below to copy your Introduction HTML.</p>
        <section>
        <pre><code class="language-html"></code></pre>
        </section>
        <button type="button" id="backToFormBtn" class="back-btn">Back to Form</button>
        `;
        formBlock.appendChild(wrapper);

        var codeEl = wrapper.querySelector("code");
        codeEl.textContent = snippet;

    // highlight.js
    if (window.hljs) {
        if (typeof window.hljs.highlightElement === "function") {
            window.hljs.highlightElement(codeEl);
        } else if (typeof window.hljs.highlightAll === "function") {
            window.hljs.highlightAll();
        }
    }

    // quick reset option (reload original form)
    var backBtn = wrapper.querySelector("#backToFormBtn");
    backBtn.addEventListener("click", function () {
        location.reload();
    });
  });
});
