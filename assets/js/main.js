document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll("section");
    const links = document.querySelectorAll("nav a");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            // Remove active class from all links
            links.forEach(link => {
                link.classList.remove("active");
            });

            // Find matching menu item
            const activeLink = [...links].find(
                link => link.hash === "#" + entry.target.id
            );

            if (activeLink) {
                activeLink.classList.add("active");
            }

        });

    }, {
        threshold: 0.5
    });


    // Observe every section
    sections.forEach(section => {
        observer.observe(section);
    });

});