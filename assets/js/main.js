document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll("section");
    const links = document.querySelectorAll("nav a");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            // Reset every menu item
            links.forEach(link => {
                link.classList.remove("active");
            });

            // Find the corresponding menu link
            const activeLink = document.querySelector(
                `nav a[href$="#${entry.target.id}"]`
            );

            if (!activeLink) return;

            activeLink.classList.add("active");

        });

    }, {
        threshold: 0.5
    });

    sections.forEach(section => observer.observe(section));

});