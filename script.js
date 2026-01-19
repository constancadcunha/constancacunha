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
  internship: `
    <div class="student-orgs-container">
      <div class="student-org">
        <h3>Front-End Developer Apprentice</h3>
        <p>
          :contentReference[oaicite:0]{index=0} —
          <strong>Sky Internship</strong> (2024)
        </p>
        <ul>
          <li><strong>Spearheaded</strong> the development of a <strong>critical</strong> internal web application for STB (Set-Top Box) device monitoring and diagnostics using <strong>HTML</strong>, <strong>vanilla JavaScript</strong>, and <strong>CSS</strong>.</li>
          <li>Designed a <strong>user-friendly interface</strong> that streamlined internal workflows and enhanced team efficiency.</li>
          <li>Implemented <strong>additional features</strong> beyond initial requirements, including <strong>API support testing</strong> and <strong>data export</strong> functionality.</li>
          <li>Created intuitive tools for accessing and analyzing device data, enabling <strong>data-driven decision-making</strong>.</li>
          <li>Delivered a <strong>production-ready solution</strong> that significantly improved internal support operations.</li>
        </ul>
      </div>

      <div class="student-org">
        <h3>Full-Stack Developer Intern</h3>
        <p>
          :contentReference[oaicite:1]{index=1} —
          <strong>NextFlat CH Internship</strong> (2025–2026)
        </p>
        <ul>
          <li><strong>6-month internship</strong> starting <strong>September 2025</strong>.</li>
          <li>Based in <strong>Zurich, Switzerland</strong> with a <strong>hybrid setup</strong> (remote & on-site).</li>
          <li>Completed <strong>1 month on-site</strong> in Zurich, collaborating closely with cross-functional teams.</li>
          <li>Worked as a <strong>Full-Stack Developer Intern</strong>, contributing to both front-end and back-end features.</li>
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
          <li><strong>Core member</strong> of Portugal's largest free technology conference.</li>
          <li>Designed <strong>30+</strong> marketing assets, including top-performing Instagram posts.</li>
          <li>Member of the <strong>Coordination Team</strong>, managing multiple teams.</li>
          <li>Led creative direction for SINFO 31 recruitment campaigns.</li>
        </ul>
      </div>

      <div class="student-org">
        <h3>Human Resources Coordinator</h3>
        <p>Diferencial (2021–2023)</p>
        <ul>
          <li>Advanced from journalist to <strong>Head of Human Resources</strong>.</li>
          <li>Led recruitment of <strong>56 new members</strong>.</li>
          <li>Boosted team satisfaction by <strong>65%</strong>.</li>
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

  showExperience("internship");
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
