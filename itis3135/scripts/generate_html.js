// scripts/generate_html.js
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("generateHtmlBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        // 1) Read the form values (only what already exists)
        const v = (id) => (document.getElementById(id)?.value || "").trim();

        const firstName = v("firstName");
        const middleName = v("middleName");
        const lastName = v("lastName");
        const preferredName = v("preferredName");

        const ackStatement = v("ackStatement");
        const ackDate = v("ackDate");

        const mascotAdj = v("mascotAdjective");
        const mascotAnimal = v("mascotAnimal");
        const divider = document.getElementById("divider")?.value || "";

        const photo = document.getElementById("photoPreview");
        const photoSrc = photo ? (photo.currentSrc || photo.src || "") : "";
        const photoAlt = photo ? (photo.getAttribute("alt") || "Profile photo") : "Profile photo";
        const picCaption = v("picCaption");

        const personalStatement = v("personalStatement");

        const bullets = Array.from(document.querySelectorAll('input[name="bullets"]'))
            .map(i => i.value.trim())
            .filter(Boolean);

        // Links (fixed 5)
        const links = [];
        for (let i = 0; i < 5; i++) {
            const label = v("linkLabel" + i);
            const url = v("linkUrl" + i);
            if (label && url) links.push({ label, url });
        }
    
        const quote = v("quote");
        const quoteAuthor = v("quoteAuthor");

        const funnyThing = v("funnyThing");
        const shareThing = v("shareThing");

        // 2) Build a simple, clean HTML section (copy-paste ready)
        const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ");
        const displayName = preferredName ? `${preferredName} (${fullName})` : fullName;

        const html = `
        <!-- BEGIN: Introduction -->
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
                        ${bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
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

            ${links.length ? `
            <nav class="links">
                <h3>Links</h3>
                <ul>
                    ${links.map(l => `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a></li>`).join("")}
                </ul>
            </nav>` : ""}
        </section>
        <!-- END: Introduction -->`;

        // 3) Replace the form with a highlighted code block + update H2
        const form = document.getElementById("form");
        const formBlock = document.getElementById("formBlock");
        const pageH2 = document.getElementById("pageH2");
        if (!form || !formBlock) return;

        form.remove();
        if (pageH2) pageH2.textContent = "Introduction HTML";

        const wrapper = document.createElement("section");
        wrapper.innerHTML = `
            <p class="hint">Select all and copy this HTML:</p>
            <pre><code class="language-html"></code></pre>
            <button id="backToFormBtn" class="back-btn">Back to Form</button>
        `;
        formBlock.appendChild(wrapper);

        // Fill in and highlight
        const codeEl = wrapper.querySelector("code");
        codeEl.textContent = html;
        if (window.hljs) {
            if (typeof hljs.highlightElement === "function") hljs.highlightElement(codeEl);
            else if (typeof hljs.highlightAll === "function") hljs.highlightAll();
        }

        //back button logic
        const backBtn = wrapper.querySelector("#backToFormBtn");
        backBtn.addEventListener("click", () => {
            //recreates form
            location.reload(); 
        });
    });
});

// tiny escape util (kept inline to stay simple)
function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}