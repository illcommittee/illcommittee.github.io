/**
 * Estimage.js
 * Handles the estimation form:
 *  Validates required fields
 *  Calculates a rough estimate based on service type and weight
 *  Updates the page with a summary / estimate range
 */


//Helper Functions
/**
 * Caclualte rought estimate from chosen service type and weight
 * Logic here is simple, roughly mirrors pricing summary on page
 * 
 * @param {string} serviceType
 * @param {number} weightLbs
 * @returns {{ low: number, high: number, typical: number }} 
 */

function calculateEstimate(serviceType, weightLbs){
    const weight = Math.max(weightLbs, 100); //Avoid 0 - Tiny weights

    //Base config
    let base = 0;
    let perLb = 0;

    switch (serviceType) {
        case "Local Move (Box Truck + Crew)":
            //Simulates a few hours of work + handling
            base = 175; //Truck + first couple hours
            perLb = 0.15;
            break;
        case "Final Mile Delivery & Install":
            base = 150;
            perLb = 0.14;
            break;
        case "Freight / Hot Shot":
            //Heavier weight but priced more by the lane
            base = 250;
            perLb = 0.08;
            break;
        case "Driver-for-Hire (Your Vehicle)":
            base = 125;
            perLb = 0.05;
            break;
        default:
            //fallback if something unexpected happens
            base = 150;
            perLb = 0.1;
            break;
    }
    const typical = base + weight * perLb;
    const low = typical * 0.9; //-10%
    const high = typical * 1.15; //+15%

    return { low, high, typical };
}

/**
 * Format as USD
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount){
    return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });
}

/**
 * Prevent HTML injection when echoing
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str){
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

//DOM content
document.addEventListener("DOMContentLoaded", () => {
    const estimateForm = document.getElementById("estimateForm");
    const formStatus = document.getElementById("formStatus");

    if (!estimateForm) return;

    //Create a result panel after the form if it doesn't exist
    let resultPanel = document.getElementById("estimateResult");
    if (!resultPanel){
        resultPanel = document.createElement("section");
        resultPanel.id = "estimateResult";
        resultPanel.setAttribute("aria-live", "polite");
        resultPanel.classList.add("estimate-result");
        estimateForm.insertAdjacentElement("afterend", resultPanel);
    }

    estimateForm.addEventListener("submit", (event) => {
        event.preventDefault();

        //Clear previous status/result
        formStatus.textContent = "";
        formStatus.className = "";
        resultPanel.innerHTML = "";

        //Built in validation - form has novalidate
        if (!estimateForm.checkValidity()){
            //Show browser validation bubbles
            estimateForm.reportValidity();

            formStatus.textContent = 
                "Please complete all required fields (marked with *) before requesting an estimate.";
            formStatus.classList.add("form-status", "form-status-error");
            return;
        }

        // Gather form values
        const formData = new FormData(estimateForm);

        // small helper so we don't repeat ourselves
        const getTrimmed = (fieldName) => {
            const value = formData.get(fieldName);
            return value ? value.toString().trim() : "";
        };

        const name = getTrimmed("name") || "Customer";
        const origin = getTrimmed("origin") || "Origin";
        const destination = getTrimmed("destination") || "Destination";
        const serviceType = formData.get("equipment") || "";
        const weight = Number(formData.get("weight")) || 0;
        const pickupDate = formData.get("pickupDate");
        const commodity = getTrimmed("commodity");
        const notes = getTrimmed("notes");

        //Calculate estimate
        const estimate = calculateEstimate(serviceType, weight);
        const laneSummary = `${origin} -> ${destination}`;
        const pickupText = pickupDate ? new Date(pickupDate).toLocaleDateString() : "TBD";

        //Build result HTML
        const { low, high, typical } = estimate;
        const lowStr = formatCurrency(low);
        const highStr = formatCurrency(high);
        const typicalStr = formatCurrency(typical);
        
        resultPanel.innerHTML = `
        <h2>Rough Estimate for ${escapeHTML(name)}</h2>
        <p>
            Based on a <strong>${escapeHTML(serviceType || "selected service")}</strong>
            and an estimated <strong>${weight.toLocaleString("en-US")} lbs</strong>,
            here's a ballpark estimate for your lane:
        </p>
        <p class="estimate-amount">
            Estimated range: <strong>${lowStr} - ${highStr}</strong><br>
            Typical midpoint: <strong>${typicalStr}</strong>
        </p>
        <p>
            Lane: <strong>${escapeHTML(laneSummary)}</strong><br>
            Target pickup: <strong>${escapeHTML(pickupText)}</strong>
        </p>
        ${
            notes
                ? `<p class="estimate-notes">
                    Notes you provided:<br>
                    <span>${escapeHTML(notes)}</span>
                </p>`
            : ""
        }
        <p class="small">
            This is a <strong>rough, non-binding estimate</strong> based on the details you entered.
            Final pricing may change after we review access, schedule, and exact load details.
        </p>
        `;

        //Update status message
        formStatus.textContent = 
            "Thanks for reaching out. We've captured your request and this rough estimate. We'll follow up with a firm quote as soon as we can.";
        formStatus.classList.add("form-status", "form-status-success");
    });
});