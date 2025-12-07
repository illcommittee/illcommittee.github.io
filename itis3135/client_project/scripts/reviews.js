/*
  reviews.js
  Handles:
  - A simple slider that scrolls through a set of highlight reviews
  - A "Leave a review" form that appends new reviews to the page
*/

document.addEventListener("DOMContentLoaded", function () {
    var highlightContainer = document.getElementById("reviewHighlight");
    var prevBtn = document.getElementById("prevReview");
    var nextBtn = document.getElementById("nextReview");
    var counter = document.getElementById("reviewCounter");

    var reviewForm = document.getElementById("reviewForm");
    var reviewFormStatus = document.getElementById("reviewFormStatus");
    var recentReviewsContainer = document.getElementById("recentReviews");

    if (!highlightContainer) {
        return;
    }

    // Escape HTML helper
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Base highlight reviews (short summary versions)
    var highlightReviews = [
        {
            title: "Parkside Crossing - Final Mile Install",
            meta: "Builder partner • Final mile delivery & install",
            rating: 5,
            text:
                "Crew kept everything documented and communicated clearly with the builder. Protected everyone on site."
        },
        {
            title: "Careful Residential Move",
            meta: "Homeowner • Local move",
            rating: 5,
            text:
                "Showed up on time, handled furniture carefully, and made a stressful moving day a lot easier."
        },
        {
            title: "Hot Shot Freight, Next-Morning Deadline",
            meta: "Manufacturing client • Hot shot lane",
            rating: 5,
            text:
                "Picked up same-day and delivered by the next morning with no issues. Exactly what we needed."
        }
    ];

    var currentIndex = 0;

    function renderHighlight(index) {
        var review = highlightReviews[index];

        if (!review) {
            highlightContainer.innerHTML = "<p>No highlighted reviews available yet.</p>";
            if (counter) {
                counter.textContent = "";
            }
            return;
        }

        var stars = "";
        var i;
        for (i = 0; i < review.rating; i += 1) {
            stars += "★";
        }

        // IMPORTANT: declare and initialize html
        var html = "";
        html += '<article class="testimonial">';
        html += '  <header>';
        html += '    <h3 class="testimonial-title">' + escapeHtml(review.title) + '</h3>';
        html += '    <p class="meta">' + escapeHtml(review.meta) +
            ' • Rating: ' + stars + '</p>';
        html += '  </header>';
        html += '  <blockquote>';
        html += '    <p>' + escapeHtml(review.text) + '</p>';
        html += '  </blockquote>';
        html += '</article>';

        highlightContainer.innerHTML = html;

        if (counter) {
            counter.textContent =
            "Review " + (index + 1) + " of " + highlightReviews.length;
        }
    }

    // Initial render
    renderHighlight(currentIndex);

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            currentIndex =
            (currentIndex - 1 + highlightReviews.length) % highlightReviews.length;
            renderHighlight(currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            currentIndex = (currentIndex + 1) % highlightReviews.length;
            renderHighlight(currentIndex);
        });
    }

    // "Add your review" form
    if (reviewForm && recentReviewsContainer) {
        reviewForm.addEventListener("submit", function (event) {
            event.preventDefault();
            reviewFormStatus.textContent = "";
            reviewFormStatus.className = "";

        if (!reviewForm.checkValidity()) {
            reviewForm.reportValidity();
            reviewFormStatus.textContent =
                "Please fill in all required fields (marked with *).";
            return;
        }

        var formData = new FormData(reviewForm);

        var name = (formData.get("name") || "").toString().trim();
        var location = (formData.get("location") || "").toString().trim();
        var jobType = (formData.get("jobType") || "").toString().trim();
        var rating = Number(formData.get("rating")) || 0;
        var comments = (formData.get("comments") || "").toString().trim();
        var today = new Date().toLocaleDateString();

        // Add to highlight slider too (at the end)
        var sliderMeta = "";
        if (jobType) {
            sliderMeta += jobType + " • ";
        }
        if (location) {
            sliderMeta += location + " • ";
        }
        sliderMeta += today;

        highlightReviews.push({
            title: name ? name + " - New Review" : "New Customer Review",
            meta: sliderMeta,
            rating: rating > 0 ? rating : 5,
            text: comments
        });

        currentIndex = highlightReviews.length - 1;
        renderHighlight(currentIndex);

        // Add a card in "Recent Customer Reviews"
        var article = document.createElement("article");
        article.className = "testimonial";

        var header = document.createElement("header");
        var h3 = document.createElement("h3");
        h3.className = "testimonial-title";
        if (name) {
            h3.textContent = name + " (" + today + ")";
        } else {
            h3.textContent = "Customer Review (" + today + ")";
        }

        var meta = document.createElement("p");
        meta.className = "meta";

        var metaText = "";
        if (location) {
            metaText += location;
        }
        if (jobType) {
            if (metaText) {
            metaText += " • ";
            }
            metaText += jobType;
        }
        if (!metaText) {
            metaText = "Customer";
        }
        meta.textContent = metaText;

        header.appendChild(h3);
        header.appendChild(meta);

        var blockquote = document.createElement("blockquote");
        var p = document.createElement("p");
        p.textContent = comments;
        blockquote.appendChild(p);

        article.appendChild(header);
        article.appendChild(blockquote);

        // Insert new review at top, after the h3 heading inside recentReviews
        var firstChild = recentReviewsContainer.firstElementChild;
        if (firstChild && firstChild.tagName &&
            firstChild.tagName.toLowerCase() === "h3") {
            recentReviewsContainer.insertBefore(article, firstChild.nextSibling);
        } else {
            recentReviewsContainer.insertBefore(article, firstChild);
        }

        reviewForm.reset();
        reviewFormStatus.textContent =
            "Thank you for sharing your experience! Your review has been added below.";
        });
    }
});