/*
  gallery.js
  Adds lightbox behavior to the Deliverr Trucking gallery:
  - Click any gallery image to open a larger version in a centered overlay
  - Shows the related caption text
  - Close with the X button, clicking outside, or pressing Escape
*/


document.addEventListener("DOMContentLoaded", function () {
    var galleryImages = document.querySelectorAll(".gallery img");

    if (!galleryImages.length) {
        return;
    }

    // Create overlay elements once
    var overlay = document.createElement("div");
    overlay.id = "lightboxOverlay";
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("aria-hidden", "true");

    var dialog = document.createElement("div");
    dialog.className = "lightbox";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", "Enlarged gallery image");

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "lightbox-close";
    closeBtn.innerHTML = "&#215;"; // ×

    var largeImg = document.createElement("img");
    largeImg.className = "lightbox-image";
    largeImg.alt = "";

    var caption = document.createElement("p");
    caption.className = "lightbox-caption";

    dialog.appendChild(closeBtn);
    dialog.appendChild(largeImg);
    dialog.appendChild(caption);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    var lastTrigger = null;

    function openLightbox(src, altText, captionText, trigger) {
        largeImg.src = src;
        largeImg.alt = altText || "";
        caption.textContent = captionText || "";

        overlay.classList.add("lightbox-visible");
        overlay.setAttribute("aria-hidden", "false");
        lastTrigger = trigger || null;

        closeBtn.focus();
    }

    function closeLightbox() {
        overlay.classList.remove("lightbox-visible");
        overlay.setAttribute("aria-hidden", "true");
        largeImg.src = "";

        if (lastTrigger && typeof lastTrigger.focus === "function") {
            lastTrigger.focus();
        }
    }

    // Attach click handlers to all gallery images
    galleryImages.forEach(function (thumbnail) {
        thumbnail.style.cursor = "pointer";

        thumbnail.addEventListener("click", function () {
            var figure = thumbnail.closest("figure");
            var captionEl = figure ? figure.querySelector("figcaption") : null;
            var captionText = captionEl ? captionEl.textContent : "";

            openLightbox(thumbnail.src, thumbnail.alt, captionText, thumbnail);
        });
    });

    // Close when clicking outside the dialog
    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            closeLightbox();
        }
    });

    // Close with the X button
    closeBtn.addEventListener("click", function () {
        closeLightbox();
    });

    // Close with Escape key
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            overlay.classList.contains("lightbox-visible")
        ) {
            closeLightbox();
        }
    });
});