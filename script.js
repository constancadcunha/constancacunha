document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");

      // Allow external links and downloads to open normally
      if (href.startsWith("http") || anchor.hasAttribute("download")) {
        return; // Don't prevent default behavior for external links or downloads
      }

      // Prevent default only for internal links (smooth scrolling)
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});

// Experience Content Switcher
const experienceData = {
  internship: `<h3>Front-End Developer Apprentice</h3>
                <p>Sky Portugal- Internship (2024)</p>
                <ul>
                    <li><strong>Spearheaded</strong> the development of a <strong>critical</strong> internal web application for STB (Set-Top Box) device monitoring and diagnostics, utilizing <strong>HTML</strong>, <strong>vanilla JavaScript</strong>, and <strong>CSS</strong>.</li>
                    <li>Built a <strong>user-friendly</strong> interface that <strong>streamlined</strong> internal workflows and <strong>enhanced</strong> team efficiency in device monitoring and support operations.</li>
                    <li>Demonstrated <strong>initiative</strong> by implementing <strong>additional features</strong> beyond initial requirements, including <strong>API support testing</strong> functionality and <strong>data export</strong> capabilities.</li>
                    <li>Created an <strong>intuitive</strong> system for accessing and analyzing device information, facilitating <strong>data-driven decision-making</strong> across internal teams.</li>
                    <li>Successfully delivered a <strong>complete</strong>, <strong>production-ready</strong> solution that <strong>significantly improved</strong> the efficiency of device monitoring and support processes.</li>
                </ul>`,

  student: `<div class="student-orgs-container">
                <div class="student-org">
                    <h3>Coordinator SINFO</h3>
                    <p>IST Technology Conference (2022-Present)</p>
                    <ul>
                        <li><strong>Core member</strong> of <strong>SINFO</strong> - Portugal's largest free technology conference, connecting <strong>85+</strong> leading companies with local tech talent and featuring <strong>15+</strong> influential speakers from global IT corporations annually.</li>
                        <li>Created <strong>30+</strong> distinctive <strong>marketing materials</strong>, with two designs becoming <strong>top-performing posts</strong> on SINFO's Instagram profile, driving exceptional audience engagement.</li>
                        <li>Currently serve on the <strong>Coordination Team</strong>, overseeing multiple specialized teams and ensuring cohesive execution of conference initiatives.</li>
                        <li>Led the <strong>creative direction</strong> for SINFO 31's recruitment campaign, developing compelling materials that successfully attracted qualified team members and enhanced the event's visibility.</li>
                    </ul>
                </div>
                <div class="student-org">
                    <h3>Human Resources Coordinator</h3>
                    <p>Diferencial (2021 - 2023)</p>
                    <ul>
                        <li>Rapidly advanced from <strong>journalist</strong> to <strong>Head of Human Resources</strong> at <strong>Diferencial</strong>, Instituto Superior Técnico's student newspaper and cultural events organization.</li>
                        <li>Successfully led <strong>recruitment campaigns</strong> that brought in <strong>56 new members</strong>, significantly expanding and diversifying our contributor base.</li>
                        <li>Developed and implemented engaging <strong>team-building initiatives</strong> that boosted team satisfaction by <strong>65%</strong>, strengthening organizational culture and member retention.</li>
                        <li>Managed comprehensive <strong>HR responsibilities</strong> including member administration, team coordination, and organizational development.</li>
                    </ul>
                </div>
              </div>`,
  tutoring: `<div class="student-orgs-container">
                <div class="student-org">
                    <h3>Mathematics and Physics Tutor</h3>
                    <p>Private Tutoring (2020-2022)</p>
                    <ul>
                        <li>Provided <strong>one-on-one tutoring</strong> in <strong>physics and mathematics</strong> to a middle school student, developing <strong>personalized learning strategies</strong> to address his unique needs.</li>
                        <li>Simplified complex concepts through <strong>real-world examples</strong> and <strong>interactive teaching methods</strong>, resulting in <strong>improved academic performance</strong> and increased confidence in <strong>STEM subjects</strong>.</li>
                        <li>Demonstrated <strong>patience and adaptability</strong> in adjusting teaching approaches to maintain student engagement and ensure comprehensive understanding of fundamental concepts.</li>
                    </ul>
                </div>
                <div class="student-org">
                    <h3>Ballet Teacher Assistant</h3>
                    <p>Dance Academy (2015-2019)</p>
                    <ul>
                        <li>Assisted in teaching <strong>ballet classes</strong> while demonstrating strong <strong>leadership and mentoring</strong> abilities.</li>
                        <li>Supported lead instructor in <strong>class management</strong>, <strong>technique demonstration</strong>, and <strong>individual student guidance</strong>.</li>
                        <li>Helped develop young dancers' skills through <strong>clear communication</strong> and <strong>positive reinforcement</strong>, while ensuring proper form and safety.</li>
                        <li>Contributed to <strong>choreography planning</strong> and <strong>recital preparations</strong>, showcasing organizational skills and attention to detail.</li>
                    </ul>
                </div>
            </div>`,
  volunteering: `<div class="student-orgs-container">
                    <div class="student-org">
                        <h3>Volunteer</h3>
                        <p>ReFood (2016-2020)</p>
                        <ul>
                            <li>Contributed to <strong>ReFood's mission</strong> of <strong>reducing food waste</strong> and <strong>fighting hunger</strong> by collecting and redistributing surplus food from local restaurants and businesses.</li>
                            <li>Assisted in <strong>sorting and organizing</strong> food donations for timely <strong>distribution</strong> to families and individuals in need.</li>
                            <li>Collaborated with a dedicated <strong>team of volunteers</strong> to maintain consistent service and support for community members.</li>
                        </ul>
                    </div>
                    <div class="student-org">
                        <h3>Volunteer</h3>
                        <p>Banco Alimentar (2012-2020)</p>
                        <ul>
                            <li>Engaged in <strong>long-term volunteer service</strong> with <strong>Portugal's largest food bank organization</strong>, demonstrating sustained commitment to addressing <strong>food insecurity</strong>.</li>
                            <li>Participated in <strong>national food collection campaigns</strong> at supermarkets, helping to organize and motivate <strong>community donations</strong>.</li>
                            <li>Supported the organization's mission of providing <strong>essential nutrition</strong> to <strong>thousands of families</strong> across Portugal.</li>
                        </ul>
                    </div>
                </div>`,
};

// Dark Mode Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("dark-mode-toggle");
  const body = document.body;

  // Check for previously saved user preference
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    toggleButton.textContent = "☀️"; // Change to sun icon for switching back
  }

  toggleButton.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
      toggleButton.textContent = "☀️"; // Sun icon
    } else {
      localStorage.setItem("darkMode", "disabled");
      toggleButton.textContent = "🌙"; // Moon icon
    }
  });
});

function showExperience(type) {
  const content = document.getElementById("experience-content");

  // Fade out the content before updating
  content.style.opacity = 0;
  setTimeout(() => {
    content.innerHTML = experienceData[type];

    // Fade in the content after updating
    content.style.opacity = 1;

    // Update active button state
    document.querySelectorAll(".experience-tabs button").forEach((button) => {
      button.classList.remove("active");
      if (button.getAttribute("data-type") === type) {
        button.classList.add("active");
      }
    });
  }, 300); // Adjust this duration to match the CSS transition time
}

// Initialize experience tabs and default content
document.addEventListener("DOMContentLoaded", () => {
  const tabsContainer = document.querySelector(".experience-tabs");
  tabsContainer.innerHTML = `
        <button data-type="internship" class="active">Internship</button>
        <button data-type="student">Student Organizations</button>
        <button data-type="tutoring">Tutoring</button>
        <button data-type="volunteering">Volunteering</button>
    `;

  document.querySelectorAll(".experience-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      showExperience(button.getAttribute("data-type"));
    });
  });

  showExperience("internship");
});

document.addEventListener("DOMContentLoaded", () => {
  const designsContainer = document.querySelector(".designs-container");

  // Fetch the JSON file
  fetch("designs.json")
    .then((response) => response.json())
    .then((designFiles) => {
      designFiles.forEach((design, index) => {
        if (!design.fileName.endsWith(".png")) return; // Skip non-PNG files

        const designItem = document.createElement("div");
        designItem.classList.add("design-item");

        // Create the image element
        const img = document.createElement("img");
        img.src = `sinfo-graphic-designs/${design.fileName}`;
        img.alt = design.title || `Design ${index + 1}`;
        img.classList.add("design-image");

        // Lightbox functionality for images
        img.addEventListener("click", () => {
          const lightbox = document.getElementById("lightbox");
          const lightboxImg = document.createElement("img");
          lightboxImg.src = img.src;
          lightbox.innerHTML = ""; // Clear existing content
          lightbox.appendChild(lightboxImg);
          lightbox.classList.add("active");
        });

        designItem.appendChild(img);
        designsContainer.appendChild(designItem);
      });
    });
});

document.addEventListener("DOMContentLoaded", () => {
  // Courses Data
  const coursesData = {
    ucd: `<h3>User Centered Design</h3>
            <ul>
                <li><strong>Description:</strong> This course focuses on designing interfaces and systems centered on the user's needs and preferences. It covers methodologies for user research, prototyping, and usability testing to create intuitive and effective designs.</li>
                <li><strong>Grade:</strong> 18/20</li>
                <li><strong>Related Project:</strong> <a href='https://group1ccul03.notion.site/78aca85d730543929c78a2d25c008060?v=0ed04df2912d4a379f3af8766f5ae863' target='_blank'>ReMi, Relocation App</a> – A comprehensive study applying user-centered design methodologies to improve accessibility and usability in digital products.</li>
            </ul>`,
    iv: `<h3>Interaction Visualization</h3>
          <ul>
              <li><strong>Description:</strong> This course explores techniques for visualizing data and user interactions effectively. It delves into creating interactive visualizations that enhance user understanding and engagement.</li>
              <li><strong>Grade:</strong> 16/20</li>
              <li><strong>Related Project:</strong> <a href='https://github.com/constancadcunha/MentalHealth-Database' target='_blank'>Mental Health Dashboard</a> – An interactive web application visualizing the relationship between mental health, GDP per capita, alcohol consumption, and age group distributions using D3.js.</li>
          </ul>`,
    dp: `<h3>3D Programming</h3>
          <ul>
              <li><strong>Description:</strong> This course delves into the principles and practices of creating 3D environments and graphics. It includes topics such as GPU programming, real-time rendering, and ray tracing techniques.</li>
              <li><strong>Grade:</strong> 17/20</li>
              <li><strong>Related Project:</strong> <a href='https://github.com/constancadcunha/GPU_PathTracer' target='_blank'>GPU Path Tracer</a> – A GPU-based path tracer capable of rendering photorealistic images by simulating the physics of light.</li>
          </ul>`,
    ids: `<h3>Interaction Design Studio</h3>
          <ul>
              <li><strong>Description:</strong> This course focuses on advanced interaction design methodologies, exploring prototyping, iterative design processes, and user testing to create impactful digital experiences.</li>
              <li><strong>Grade:</strong> 19/20</li>
              <li><strong>Related Project:</strong> <a href='https://www.figma.com/proto/UC2rBn1q2buoAE2SHOHmMg/App?node-id=256-1408&t=P7htnFTlR2wzGlHD-1' target='_blank'>Interactive Mobile App Prototype</a> – A comprehensive Figma-based project showcasing a user-centric mobile application design, iteratively refined based on user feedback.</li>
          </ul>`,    
    cg: `<h3>Computer Graphics</h3>
          <ul>
              <li><strong>Description:</strong> This course covers the fundamentals of rendering, modeling, and graphical algorithms. It includes topics like 3D transformations, lighting, shading, and the development of graphical applications.</li>
              <li><strong>Grade:</strong> 17/20</li>
              <li><strong>Related Project:</strong> <a href='https://github.com/constancadcunha/Project2.CG_22-23' target='_blank'>3D Graphics Engine</a> – A project involving the creation of a basic 3D graphics engine demonstrating rendering and shading techniques.</li>
          </ul>`,
  };

  // Courses Content Switcher
  function showCourse(type) {
    const content = document.getElementById("courses-content");

    // Fade out the content before updating
    content.style.opacity = 0;
    setTimeout(() => {
      content.innerHTML = coursesData[type];

      // Fade in the content after updating
      content.style.opacity = 1;

      // Update active button state
      document.querySelectorAll(".course-tabs button").forEach((button) => {
        button.classList.remove("active");
        if (button.getAttribute("data-type") === type) {
          button.classList.add("active");
        }
      });
    }, 300); // Adjust this duration to match the CSS transition time
  }

  // Initialize courses tabs and default content
  document.querySelectorAll(".course-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      showCourse(button.getAttribute("data-type"));
    });
  });

  showCourse("ucd"); // Default course
});
