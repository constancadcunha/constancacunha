document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");

      // Allow external links and downloads to open normally
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
          <li>Designed a user-friendly interface that streamlined internal workflows and improved team efficiency.</li>
          <li>Implemented additional features beyond initial requirements, including API support testing and data export functionality.</li>
          <li>Created intuitive tools for accessing and analyzing device data, enabling data-driven decision-making.</li>
          <li>Delivered a production-ready solution that significantly improved internal support operations.</li>
        </ul>
      </div>
    </div>
  `,

  nextflat: `
    <div class="student-orgs-container">
      <div class="student-org">
        <h3>Full-Stack Developer Intern</h3>
        <p><strong>NextFlat CH Internship</strong> (2025–2026)</p>
        <ul>
          <li>6-month internship starting September 2025.</li>
          <li>Based in Zurich, Switzerland with a hybrid setup (remote & on-site).</li>
          <li>Completed 1 month on-site in Zurich, collaborating closely with cross-functional teams.</li>
          <li>Worked as a Full-Stack Developer Intern, contributing to both front-end and back-end features.</li>
          <li>Participated in real-world product development within a fast-paced startup environment.</li>
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
          <li>One-on-one tutoring with personalized learning strategies.</li>
          <li>Improved academic performance through interactive methods.</li>
          <li>Demonstrated adaptability and patience.</li>
        </ul>
      </div>

      <div class="student-org">
        <h3>Ballet Teacher Assistant</h3>
        <p>Dance Academy (2015–2019)</p>
        <ul>
          <li>Assisted in ballet instruction and class management.</li>
          <li>Supported choreography planning and recitals.</li>
          <li>Mentored young dancers.</li>
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
          <li>Reduced food waste and redistributed meals.</li>
          <li>Sorted and organized food donations.</li>
          <li>Collaborated with volunteer teams.</li>
        </ul>
      </div>

      <div class="student-org">
        <h3>Volunteer</h3>
        <p>Banco Alimentar (2012–2020)</p>
        <ul>
          <li>Long-term volunteer commitment.</li>
          <li>Participated in national food collection campaigns.</li>
          <li>Supported families facing food insecurity.</li>
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

  // Default tab
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
