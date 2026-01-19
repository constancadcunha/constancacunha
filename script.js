document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");

      if (href.startsWith("http") || anchor.hasAttribute("download")) {
        return;
      }

      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

/* ================= EXPERIENCE DATA ================= */

const experienceData = {
  sky: `
    <div class="student-orgs-container">
      <div class="student-org">
        <h3>Front-End Developer Apprentice</h3>
        <p><strong>Sky Internship</strong> (2024)</p>
        <ul>
          <li><strong>Spearheaded</strong> the development of a critical internal web application for STB device monitoring and diagnostics using HTML, vanilla JavaScript, and CSS.</li>
          <li>Designed a <strong>user-friendly interface</strong> that streamlined internal workflows and significantly improved team efficiency.</li>
          <li>Implemented <strong>additional features</strong> beyond initial requirements, including API support testing and data export functionality.</li>
          <li>Built intuitive tools for accessing and analyzing device data, enabling <strong>data-driven decision-making</strong>.</li>
          <li>Delivered a <strong>production-ready solution</strong> that meaningfully improved internal support operations.</li>
        </ul>
      </div>
    </div>
  `,

  nextflat: `
    <div class="student-orgs-container">
      <div class="student-org">
        <h3>Full-Stack Developer Intern</h3>
        <p>
          <strong>NextFlat CH</strong> (2025–2026)<br>
          Full-Stack Developer Intern — Zurich, Switzerland (Remote & On-site, including 1 month on-site)
        </p>
        <ul>
          <li><strong>Product Ownership:</strong> Fully integrated member of the core engineering team, contributing across <strong>frontend, backend, and design</strong> for a production application actively used by real clients.</li>
          <li><strong>Frontend & Design Leadership:</strong> Primary owner of frontend quality, UI/UX consistency, and visual architecture; led <strong>major interface redesigns</strong> that significantly improved clarity, usability, and overall product polish.</li>
          <li><strong>High-Impact Improvements:</strong> Implemented extensive frontend and backend changes that simplified code structure, enhanced maintainability, and delivered a <strong>cleaner, more intuitive user experience</strong> across the application.</li>
          <li><strong>Cross-Functional Collaboration:</strong> Worked closely with engineers, product stakeholders, and designers, translating requirements into <strong>scalable technical solutions</strong> while maintaining strong design coherence.</li>
        </ul>
      </div>
    </div>
  `,

  student: `
    <div class="student-orgs-container">
      <div class="student-org">
        <h3>Coordinator SINFO</h3>
        <p>IST Technology Conference (2022–Present)</p>
        <ul>
          <li>Core member of Portugal's largest free technology conference.</li>
          <li>Designed 30+ marketing assets, including top-performing Instagram posts.</li>
          <li>Member of the Coordination Team, managing multiple teams.</li>
          <li>Led creative direction for SINFO 31 recruitment campaigns.</li>
        </ul>
      </div>

      <div class="student-org">
        <h3>Human Resources Coordinator</h3>
        <p>Diferencial (2021–2023)</p>
        <ul>
          <li>Advanced from journalist to Head of Human Resources.</li>
          <li>Led recruitment of 56 new members.</li>
          <li>Boosted team satisfaction by 65%.</li>
          <li>Managed HR operations and team development.</li>
        </ul>
      </div>
    </div>
  `,

  tutoring: `
    <div class="student-orgs-container">
      <div class="student-org">
        <h3>Mathematics & Physics Tutor</h3>
        <p>Private Tutoring (2020–2022)</p>
        <ul>
          <li>Delivered personalized one-on-one tutoring with tailored learning strategies.</li>
          <li>Improved academic performance through structured, interactive methods.</li>
          <li>Demonstrated adaptability, communication, and patience.</li>
        </ul>
      </div>

      <div class="student-org">
        <h3>Ballet Teacher Assistant</h3>
        <p>Dance Academy (2015–2019)</p>
        <ul>
          <li>Assisted in ballet instruction and class coordination.</li>
          <li>Supported choreography planning and live performances.</li>
          <li>Mentored young dancers in technique and discipline.</li>
        </ul>
      </div>
    </div>
  `,

  volunteering: `
    <div class="student-orgs-container">
      <div class="student-org">
        <h3>Volunteer</h3>
        <p>ReFood (2016–2020)</p>
        <ul>
          <li>Reduced food waste and redistributed meals to families in need.</li>
          <li>Sorted, organized, and prepared food donations.</li>
          <li>Collaborated with volunteer teams in high-impact community efforts.</li>
        </ul>
      </div>

      <div class="student-org">
        <h3>Volunteer</h3>
        <p>Banco Alimentar (2012–2020)</p>
        <ul>
          <li>Long-term volunteer commitment across multiple national campaigns.</li>
          <li>Supported large-scale food collection and distribution initiatives.</li>
          <li>Assisted families facing food insecurity.</li>
        </ul>
      </div>
    </div>
  `
};

/* ================= EXPERIENCE TAB LOGIC ================= */

function showExperience(type) {
  const content = document.getElementById("experience-content");
  content.style.opacity = 0;

  setTimeout(() => {
    content.innerHTML = experienceData[type];
    content.style.opacity = 1;

    document.querySelectorAll(".experience-tabs button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.type === type);
    });
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".experience-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      showExperience(button.dataset.type);
    });
  });

  showExperience("sky");
});

/* ================= DARK MODE ================= */

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    toggle.textContent = "☀️";
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const enabled = body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", enabled ? "enabled" : "disabled");
    toggle.textContent = enabled ? "☀️" : "🌙";
  });
});
