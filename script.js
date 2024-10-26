// Smooth Scroll for Header Links
document.querySelectorAll('header nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Experience Content Switcher
const experienceData = {
    internship: `<h3>Front-End Developer Apprentice</h3>
                <p>Sky Portugal- Internship (2024)</p>
                <ul>
                    <li>Led the development of an internal web app for STB devices, improving device monitoring and internal workflows.</li>
                    <li>Expanded the project by integrating API support and adding new features like a download button for key information.</li>
                    <li>Demonstrated adaptability and problem-solving skills by collaborating with cross-functional teams to enhance the app's functionality.</li>
                </ul>`,
    student: `<div class="student-orgs-container">
                <div class="student-org">
                    <h3>Coordinator SINFO</h3>
                    <p>IST Technology Conference (2022-Present)</p>
                    <ul>
                        <li>Currently coordinating a team to organize the largest free tech event in Portugal, managing communication with key stakeholders and sponsors.</li>
                        <li>Ensuring smooth event operations by overseeing speaker sessions and managing on-site logistics.</li>
                        <li>Contributing to event planning by identifying trends and suggesting relevant tech topics, driving audience engagement and attendance.</li>
                    </ul>
                </div>
                <div class="student-org">
                    <h3>Human Resources Coordinator</h3>
                    <p>Diferencial (2021 - 2023)</p>
                    <ul>
                        <li>Managed recruitment campaigns for both writers and technical staff, enhancing team organization and fostering a positive work environment.</li>
                        <li>Conducted interviews and onboarded new recruits, demonstrating strong interpersonal skills and leadership.</li>
                        <li>Contributed to the newspaper's ongoing success, ensuring effective communication between editorial and technical departments.</li>
                    </ul>
                </div>
              </div>`,
    tutoring: `<h3>Mathematics and Physics Tutor & Ballet Teacher Assistant</h3>
                <p>Private Tutoring (2020-2022) and Dance Academy (2015-2019)</p>
                <ul>
                    <li>Provided personalized mathematics and physics tutoring, adapting methods to suit individual learning styles and improve academic performance.</li>
                    <li>Assisted in ballet classes, supporting both students and the head teacher by giving constructive feedback and helping maintain a structured learning environment.</li>
                    <li>Demonstrated adaptability in both roles, improving students' academic and extracurricular performance.</li>
                </ul>`,
    volunteering: `<h3>Volunteer</h3>
                <p>ReFood (2016-2020) and Banco Alimentar (2012-2020)</p>
                <ul>
                    <li>Volunteered with teams and food distribution for local communities, ensuring efficient operations and timely deliveries.</li>
                    <li>Coordinated efforts to reduce food waste, helping to serve thousands of meals to those in need.</li>
                    <li>Built strong community relationships, contributing to the success of large-scale charity initiatives.</li>
                </ul>`
};

function showExperience(type) {
    const content = document.getElementById('experience-content');
    content.innerHTML = experienceData[type];
    
    // Update active button state
    document.querySelectorAll('.experience-tabs button').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-type') === type) {
            button.classList.add('active');
        }
    });
}

// Initialize experience tabs and default content
document.addEventListener('DOMContentLoaded', () => {
    // Create buttons for experience tabs
    const tabsContainer = document.querySelector('.experience-tabs');
    tabsContainer.innerHTML = `
        <button data-type="internship" class="active">Internship</button>
        <button data-type="student">Student Organizations</button>
        <button data-type="tutoring">Tutoring</button>
        <button data-type="volunteering">Volunteering</button>
    `;

    // Add click event listeners to buttons
    document.querySelectorAll('.experience-tabs button').forEach(button => {
        button.addEventListener('click', () => {
            showExperience(button.getAttribute('data-type'));
        });
    });

    // Show internship content by default
    showExperience('internship');
});
