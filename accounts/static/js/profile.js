document.addEventListener("DOMContentLoaded", function () {
  updateStrengthUI();

  const watchFields = [
    "profileName",
    "profileRole",
    "profilePlaceText",
    "profileEmail",
    "profilePhone",
    "profileLinkedin",
    "educationInstitution",
    "educationDegree",
    "educationYear",
  ];

  watchFields.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      const observer = new MutationObserver(updateStrengthUI);
      observer.observe(el, { childList: true, subtree: true });
    }
  });
  /* ============================
     GET CSRF TOKEN
  ============================ */

  const summaryText = document.getElementById("summaryText");

  if (summaryText) {
    summaryText.addEventListener("input", function () {
      localStorage.setItem("summary", this.value);
      updateStrengthUI();
    });
  }
  const savedSummary = localStorage.getItem("summary");

  if (savedSummary) {
    const summaryField = document.getElementById("summaryText");
    if (summaryField) {
      summaryField.value = savedSummary;
    }
  }

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  /* ============================
     PROFILE MODAL (DB SAVE)
  ============================ */

  const profileModal = document.getElementById("profileModal");
  const openProfileBtn = document.getElementById("openProfileModal");
  const closeProfileBtn = document.getElementById("closeProfileModal");
  const saveProfileBtn = document.getElementById("saveProfileBtn");

  if (openProfileBtn) {
    openProfileBtn.addEventListener("click", () => {
      // 🔥 Fill inputs with current profile values
      document.getElementById("inputName").value =
        document.getElementById("profileName")?.innerText.trim() || "";

      document.getElementById("inputRole").value =
        document.getElementById("profileRole")?.innerText.trim() || "";

      document.getElementById("inputPlace").value =
        document.getElementById("profilePlaceText")?.innerText.trim() || "";

      document.getElementById("inputEmail").value =
        document.getElementById("profileEmail")?.innerText.trim() || "";

      document.getElementById("inputPhone").value =
        document.getElementById("profilePhone")?.innerText.trim() || "";

      document.getElementById("inputLinkedin").value =
        document.getElementById("profileLinkedin")?.innerText.trim() || "";

      // ✅ Then open modal
      profileModal.classList.remove("hidden");
      profileModal.classList.add("flex");
      updateStrengthUI();
    });
  }

  if (closeProfileBtn) {
    closeProfileBtn.addEventListener("click", () => {
      profileModal.classList.add("hidden");
      profileModal.classList.remove("flex");
      updateStrengthUI();
    });
  }

  if (profileModal) {
    profileModal.addEventListener("click", (e) => {
      if (e.target === profileModal) {
        profileModal.classList.add("hidden");
        profileModal.classList.remove("flex");
        updateStrengthUI();
      }
    });
  }

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", function () {
      fetch(saveProfileUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          name: document.getElementById("inputName").value,
          role: document.getElementById("inputRole").value,
          place: document.getElementById("inputPlace").value,
          email: document.getElementById("inputEmail").value,
          phone: document.getElementById("inputPhone").value,
          linkedin: document.getElementById("inputLinkedin").value,
          institution: document.getElementById("inputInstitution")?.value,
          degree: document.getElementById("inputDegree")?.value,
          year: document.getElementById("inputYear")?.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Update UI instantly
          document.getElementById("profileName").innerText =
            document.getElementById("inputName").value;

          document.getElementById("profileRole").innerText =
            document.getElementById("inputRole").value;

          document.getElementById("profilePlaceText").innerText =
            document.getElementById("inputPlace").value;

          document.getElementById("profileEmail").innerText =
            document.getElementById("inputEmail").value;

          document.getElementById("profilePhone").innerText =
            document.getElementById("inputPhone").value;

          document.getElementById("profileLinkedin").innerText =
            document.getElementById("inputLinkedin").value;

          profileModal.classList.add("hidden");
          profileModal.classList.remove("flex");
          updateStrengthUI();
        });
    });
  }

  /* ============================
     UNIVERSAL DYNAMIC MODAL
  ============================ */

  const dynamicModal = document.getElementById("dynamicModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeModal = document.getElementById("closeModal");
  const cancelModal = document.getElementById("cancelModal");

  window.openModal = function (title, contentHTML) {
    modalTitle.innerText = title;
    modalContent.innerHTML = contentHTML;
    dynamicModal.classList.remove("hidden");
    dynamicModal.classList.add("flex");
  };

  window.closeDynamicModal = function () {
    dynamicModal.classList.add("hidden");
    dynamicModal.classList.remove("flex");
    updateStrengthUI();
  };

  if (closeModal) closeModal.addEventListener("click", closeDynamicModal);
  if (cancelModal) cancelModal.addEventListener("click", closeDynamicModal);

  if (dynamicModal) {
    dynamicModal.addEventListener("click", (e) => {
      if (e.target === dynamicModal) {
        closeDynamicModal();
      }
    });
  }

  /* ============================
     PROFESSIONAL SUMMARY
  ============================ */

  const editSummaryBtn = document.getElementById("editSummaryBtn");

  if (editSummaryBtn) {
    editSummaryBtn.addEventListener("click", () => {
      const savedSummary = localStorage.getItem("summary") || "";

      openModal(
        "Edit Professional Summary",
        `
        <textarea id="modalSummary" rows="5"
          class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
${savedSummary}
        </textarea>
      `,
      );

      const saveBtn = document.getElementById("modalSaveBtn");

      saveBtn.onclick = function () {
        const textarea = document.getElementById("modalSummary");

        if (!textarea) return;

        const summary = textarea.value;

        localStorage.setItem("summary", summary);

        const mainTextarea = document.getElementById("summaryText");
        if (mainTextarea) {
          mainTextarea.value = summary;
        }

        closeDynamicModal();
      };
    });
  }

  /* ============================
     CORE SKILLS
  ============================ */

  const addSkillBtn = document.getElementById("addSkillBtn");

  if (addSkillBtn) {
    addSkillBtn.addEventListener("click", () => {
      openModal(
        "Add New Skill",
        `
        <input id="newSkill" type="text"
          class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
      `,
      );

      setTimeout(() => {
        const saveBtn = document.getElementById("modalSaveBtn");

        saveBtn.onclick = function () {
          const skill = document.getElementById("newSkill").value;

          if (!skill) return;

          let skills = JSON.parse(localStorage.getItem("skills")) || [];
          skills.push(skill);

          localStorage.setItem("skills", JSON.stringify(skills));

          renderSkills();
          closeDynamicModal();
          updateStrengthUI();
        };
      }, 100);
    });
  }

  /* ============================
     WORK EXPERIENCE
  ============================ */

  const addWorkBtn = document.getElementById("addWorkBtn");

  if (addWorkBtn) {
    addWorkBtn.addEventListener("click", () => {
      openModal(
        "Add Work Experience",
        `
        <input id="workTitle" placeholder="Job Title"
          class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">

        <input id="workCompany" placeholder="Company Name"
          class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">

        <textarea id="workDesc" rows="3"
          class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
        </textarea>
      `,
      );

      setTimeout(() => {
        const saveBtn = document.getElementById("modalSaveBtn");

        saveBtn.onclick = function () {
          const title = document.getElementById("workTitle").value;
          const company = document.getElementById("workCompany").value;
          const desc = document.getElementById("workDesc").value;

          let works = JSON.parse(localStorage.getItem("works")) || [];
          works.push({ title, company, desc });

          localStorage.setItem("works", JSON.stringify(works));

          renderWork();
          closeDynamicModal();
          updateStrengthUI();
        };
      }, 100);
    });
  }

  /* ============================
     EDUCATION
  ============================ */

  const addEducationBtn = document.getElementById("addEducationBtn");

  if (addEducationBtn) {
    addEducationBtn.addEventListener("click", () => {
      const currentInstitution =
        document.getElementById("educationInstitution")?.innerText || "";
      const currentDegree =
        document.getElementById("educationDegree")?.innerText || "";
      const currentYear =
        document.getElementById("educationYear")?.innerText || "";

      openModal(
        "Edit Education",
        `
        <input id="inputInstitution" placeholder="Institution Name"type="text" value="${currentInstitution}"
          class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">

        <input id="inputDegree" placeholder="Degree" type="text" value="${currentDegree}"
          class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">

        <input id="inputYear" placeholder="Year" type="text" value="${currentYear}"
          class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
      `,
      );

      setTimeout(() => {
        const saveBtn = document.getElementById("modalSaveBtn");

        saveBtn.onclick = function () {
          const institution = document.getElementById("inputInstitution").value;
          const degree = document.getElementById("inputDegree").value;
          const year = document.getElementById("inputYear").value;

          fetch(saveProfileUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({
              institution: institution,
              degree: degree,
              year: year,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              document.getElementById("educationInstitution").innerText =
                institution;
              document.getElementById("educationDegree").innerText = degree;
              document.getElementById("educationYear").innerText = year;

              closeDynamicModal();
              updateStrengthUI();
            });
        };
      }, 100);
    });
  }
  renderSkills();
  renderWork();
});

function renderSkills() {
  const skillContainer = document.querySelector(".flex.flex-wrap.gap-2");
  skillContainer.innerHTML = "";

  const skills = JSON.parse(localStorage.getItem("skills")) || [];

  skills.forEach((skill, index) => {
    const skillHTML = `
      <span
        class="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-2">
        ${skill}
        <span class="material-icons text-xs cursor-pointer"
          onclick="deleteSkill(${index})">close</span>
      </span>
    `;
    skillContainer.innerHTML += skillHTML;
  });
}

window.deleteSkill = function (index) {
  let skills = JSON.parse(localStorage.getItem("skills")) || [];
  skills.splice(index, 1);
  localStorage.setItem("skills", JSON.stringify(skills));
  renderSkills();
  updateStrengthUI();
};

function renderWork() {
  const workContainer = document.querySelector(".p-6.space-y-8");
  workContainer.innerHTML = "";

  const works = JSON.parse(localStorage.getItem("works")) || [];

  works.forEach((work, index) => {
    workContainer.innerHTML += `
      <div class="border p-4 rounded-lg relative">
        <h4 class="font-bold">${work.title}</h4>
        <p class="text-primary">${work.company}</p>
        <p class="text-sm mt-2">${work.desc}</p>
        <button onclick="deleteWork(${index})"
          class="absolute top-2 right-2 text-red-500">
          Delete
        </button>
      </div>
    `;
  });
}

window.deleteWork = function (index) {
  let works = JSON.parse(localStorage.getItem("works")) || [];
  works.splice(index, 1);
  localStorage.setItem("works", JSON.stringify(works));
  renderWork();
  updateStrengthUI();
};

/* ============================
   PROFILE STRENGTH
============================ */
function calcProfileStrength() {
  let score = 0;

  // Personal Details (DB) — 6 fields = 30 pts total (5 pts each)
  const personalFields = [
    document.getElementById("profileName")?.innerText.trim(),
    document.getElementById("profileRole")?.innerText.trim(),
    document.getElementById("profilePlaceText")?.innerText.trim(),
    document.getElementById("profileEmail")?.innerText.trim(),
    document.getElementById("profilePhone")?.innerText.trim(),
    document.getElementById("profileLinkedin")?.innerText.trim(),
  ];
  personalFields.forEach((f) => {
    if (f && f.trim().length > 0) score += 5;
  });

  // Professional Summary (localStorage) — 10 pts
  const summary = localStorage.getItem("summary") || "";
  if (summary.trim().length > 0) score += 10;

  // Core Skills (localStorage) — 20 pts
  const skills = JSON.parse(localStorage.getItem("skills") || "[]");
  score += Math.min(skills.length * 5, 20);

  // Work Experience (localStorage) — 20 pts
  const works = JSON.parse(localStorage.getItem("works") || "[]");
  score += Math.min(works.length * 10, 20);

  // Education (DB) — 3 fields = 20 pts total (~6.67 pts each)
  const eduFields = [
    document.getElementById("educationInstitution")?.innerText.trim(),
    document.getElementById("educationDegree")?.innerText.trim(),
    document.getElementById("educationYear")?.innerText.trim(),
  ];
  const filledEdu = eduFields.filter((f) => f && f !== "").length;
  score += Math.round((filledEdu / 3) * 20);

  return Math.min(score, 100);
}

function updateStrengthUI() {
  const score = calcProfileStrength();

  console.log("Profile strength score:", score); // 👈 ADD THIS

  const bar = document.getElementById("profileStrengthBar");
  const text = document.getElementById("profileStrengthText");
  const hint = document.getElementById("profileStrengthHint");

  if (bar) bar.style.width = score + "%";
  if (text) text.innerText = score + "% Complete";
}

// Run on page load
