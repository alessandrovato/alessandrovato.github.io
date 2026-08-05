document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll("section");
    const links = document.querySelectorAll("nav a");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            // Reset all menu items
            links.forEach(link => {
                link.classList.remove("active");
                link.style.color = "#074173";
            });

            // Find the corresponding navigation link
            const activeLink = [...links].find(
                link => link.hash === "#" + entry.target.id
            );

            if (!activeLink) return;

            // Highlight active item
            activeLink.classList.add("active");

            // Change text color according to section theme
            if (entry.target.classList.contains("dark")) {
                activeLink.style.color = "white";
            } else {
                activeLink.style.color = "#074173";
            }

        });

    }, {
        threshold: 0.55
    });

    sections.forEach(section => observer.observe(section));

});