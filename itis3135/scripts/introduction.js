document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const out = document.getElementById('formOutputData');
    const courses = document.getElementById('courses');
    const addBtn = document.getElementById('addCourseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const clearBtn = document.getElementById('clearBtn');
    const picInput = document.getElementById('picture');
    const picPreview = document.getElementById('photoPreview');
    const formBlock = document.getElementById('formBlock');

    let currentPhotoSrc = picPreview.src;

    const pageH2 = document.getElementById('pageH2');
    const resultSection = document.getElementById('resultArea');

    function hideForm() {
        formBlock.classList.add('hidden');
        resultSection.classList.remove('hidden');
        pageH2.textContent = 'Introduction Form';
        document.title = 'Introduction Form'; 
    }

    function showForm() {
        formBlock.classList.remove('hidden');
        resultSection.classList.add('hidden');
        out.innerHTML = 'Results Will Show Here';
        pageH2.textContent = 'Introduction Form';
        document.title = 'Introduction Form';
    }

    //Set today's date once if empty
    function setTodayIfEmpty() {
        const ackDate = document.getElementById('ackDate');
        if (ackDate && !ackDate.value) {
            ackDate.value = new Date().toISOString().slice(0, 10);
        }
    }
    setTodayIfEmpty();

    //Add course + delete
        function addCourseRow(dept = '', num = '', courseName = '', reason = '') {
        const html = `
        <div class="course-row">
            <input required placeholder="Dept"   value="${dept}">
            <input required placeholder="Num"    value="${num}">
            <input required placeholder="Name"   value="${courseName}">
            <input required placeholder="Reason" value="${reason}">
            <button type="button" class="del">Delete</button>
        </div>`;
        courses.insertAdjacentHTML('beforeend', html);
    }

    //1) Prevent default submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.reportValidity()) return;


        //Gather simple data
        const first    = document.getElementById('firstName').value.trim();
        const middle   = document.getElementById('middleName').value.trim();
        const pref     = document.getElementById('preferredName').value.trim();
        const last     = document.getElementById('lastName').value.trim();
        const personal = document.getElementById('personalStatement').value.trim();

        const divider = (document.getElementById('divider').value || ' | ').trim();
        const mascot  = `${document.getElementById('mascotAdjective').value.trim()} ${divider} ${document.getElementById('mascotAnimal').value.trim()}`;

        const quote      = document.getElementById('quote').value.trim();
        const author     = document.getElementById('quoteAuthor').value.trim();
        const picCaption = document.getElementById('picCaption').value.trim();

        const ackStatement = document.getElementById('ackStatement').value.trim();
        const ackDateStr   = document.getElementById('ackDate').value.trim();

        const bullets = [];
        for (let i = 1; i <= 7; i++) {
            bullets.push(document.getElementById('bullet' + i).value.trim());
        }

        const links = [];
        for (let i = 0; i < 5; i++) {
            const label = document.getElementById('linkLabel' + i).value.trim();
            const url   = document.getElementById('linkUrl' + i).value.trim();
            links.push(`<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`);
        }

        const courseLis = [...courses.querySelectorAll('.course-row')]
        .map((row) => {
            const [dept, num, courseName, reason] = row.querySelectorAll('input');
            return `<li>${dept.value} ${num.value}: ${courseName.value} - ${reason.value}</li>`;
        })
        .join('');

        const nameLine = `${first}${middle ? ' ' + middle : ''}${pref ? ` "${pref}"` : ''} ${last}`;
        const photoSrc = currentPhotoSrc; // use the latest image (default or uploaded)

        //Render result page in place
        out.innerHTML = `
            <h3>${nameLine}</h3>
            <p>${personal}</p>
            <figure>
                <img class="form_photo" src="${photoSrc}" alt="Submitted profile image">
                <figcaption>${picCaption}</figcaption>
            </figure>

            <p>${mascot}</p>

            <h4>Acknowledgement</h4>
            <p>${ackStatement}</p>
            <p><small>${ackDateStr}</small></p>

            <h4>Highlights</h4>
            <ul>${bullets.map((b) => `<li>${b}</li>`).join('')}</ul>

            <h4>Current Courses</h4>
            <ul>${courseLis}</ul>

            <blockquote class="theo-quote">
                <p>${quote}</p><cite>- ${author}</cite>
            </blockquote>

            <h4>Links</h4>
            <ul>${links.join('')}</ul>

            <p><a href="#" id="again" class="btn">Reset and do it again</a></p>
        `;

        hideForm();
        out.setAttribute('tabindex', '-1');
        out.focus();

        // reset link
        document.getElementById('again').addEventListener('click', (ev) => {
            ev.preventDefault();
            form.reset();
            showForm();
            // re-seed one starter row
            courses.innerHTML = '';
            addCourseRow('ITIS', '3135', 'Web App Dev', 'Front-end foundations');
            // reset photo state
            currentPhotoSrc = 'images/me.png';
            picPreview.src  = currentPhotoSrc;
            // scroll back to form
            window.scrollTo({ top: form.offsetTop, behavior: 'smooth' });
            setTodayIfEmpty();
        });
    });

    showForm();

    //dynamic rows
    addBtn.addEventListener('click', () => addCourseRow());
    courses.addEventListener('click', (e) => {
        if (e.target.classList.contains('del')) e.target.parentElement.remove();
    });

    // seed one row on load
    addCourseRow('ITIS', '3135', 'Web App Dev', 'Front-end foundations');


    //clear (manual wipe)
    clearBtn.addEventListener('click', () => {
        form.querySelectorAll('input, textarea, select').forEach((el) => {
        if (el.type === 'file') el.value = '';
        else if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
        });
        courses.innerHTML = '';
        addCourseRow('ITIS', '3135', 'Web App Dev', 'Front-end foundations');
        currentPhotoSrc = 'images/me.png';
        picPreview.src  = currentPhotoSrc;
        setTodayIfEmpty();
    });

    //reset (native)
    resetBtn.addEventListener('click', () => {
    setTimeout(() => {
            courses.innerHTML = '';
            addCourseRow('ITIS', '3135', 'Web App Dev', 'Front-end foundations');
            currentPhotoSrc = 'images/me.png';
            picPreview.src  = currentPhotoSrc;

            // reapply today’s date if cleared
            setTodayIfEmpty();
        }, 0);
    });

    // ---- photo preview & state ----
    picInput.addEventListener('change', () => {
        const f = picInput.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = (ev) => {
        currentPhotoSrc = ev.target.result;
        picPreview.src  = currentPhotoSrc;
        };
        r.readAsDataURL(f);
    });
});