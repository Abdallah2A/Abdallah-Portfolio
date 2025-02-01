const projects = document.querySelectorAll(".project");

// Set the default active project (center one)
let activeProject = document.querySelector('.project[data-section="objective"]');
if (activeProject) {
    activeProject.classList.add("active");
    activeProject.style.transform = "translate(-50%, -50%)";
}

// Define positions for the 5 surrounding projects
const positions = [
    { x: '-310px', y: '-280px' }, // Top-left
    { x: '-50px', y: '-280px' },  // Top-center
    { x: '210px', y: '-280px' },  // Top-right
    { x: '-310px', y: '0px' },    // Middle-left
    { x: '210px', y: '0px' }      // Middle-right
];

// Get all projects except the active one
let surroundingProjects = [...projects].filter(project => project !== activeProject);

// Assign positions to the surrounding projects
surroundingProjects.forEach((project, index) => {
    project.style.setProperty('--x', positions[index].x);
    project.style.setProperty('--y', positions[index].y);
    project.style.transform = `translate(${positions[index].x}, ${positions[index].y})`;
});

// Add click event to switch positions
projects.forEach((project) => {
    project.addEventListener("click", () => {
        if (activeProject !== project) {
            // Swap positions
            const activeX = activeProject.style.getPropertyValue('--x');
            const activeY = activeProject.style.getPropertyValue('--y');
            const clickedX = project.style.getPropertyValue('--x');
            const clickedY = project.style.getPropertyValue('--y');

            // Move the active project to the clicked project's position
            activeProject.style.transform = `translate(${clickedX}, ${clickedY})`;
            activeProject.style.setProperty('--x', clickedX);
            activeProject.style.setProperty('--y', clickedY);
            activeProject.classList.remove("active");

            // Move the clicked project to the center
            project.style.transform = "translate(-50%, -50%)";
            project.style.setProperty('--x', activeX);
            project.style.setProperty('--y', activeY);
            project.classList.add("active");

            // Update the surrounding projects array
            surroundingProjects = [...projects].filter(p => p !== project);

            // Update active project
            activeProject = project;
        }
    });
});

// Handle content switching when a project is clicked
projects.forEach((element) => {
    element.addEventListener("click", () => {
        const sectionId = element.getAttribute("data-section");

        // Hide all content sections
        document.querySelectorAll(".content").forEach((content) => {
            content.classList.remove("active");
        });

        // Show the selected content section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add("active");
        }
    });
});

// Ensure the default content is active on page load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("objective").classList.add("active");
});
