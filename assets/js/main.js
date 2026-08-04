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

            // Find the corresponding menu item
            const active = document.querySelector(
                `nav a[href="/#${entry.target.id}"]`
            );

            if (!active) return;

            active.classList.add("active");

            // If the section has class "dark", make text white
            if (entry.target.classList.contains("dark")) {
                active.style.color = "white";
            } else {
                active.style.color = "#074173";
            }

        });

    }, {
        threshold: 0.5
    });

    sections.forEach(section => observer.observe(section));

});