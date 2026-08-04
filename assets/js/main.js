document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM loaded");

    const sections = document.querySelectorAll("section");
    const links = document.querySelectorAll("nav a");

    console.log("Sections found:", sections.length);
    console.log("Links found:", links.length);

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            console.log("Visible section:", entry.target.id);

            links.forEach(link => {
                link.classList.remove("active");
            });

            const activeLink = [...links].find(
                link => link.hash === "#" + entry.target.id
            );

            console.log("Active link:", activeLink);

            if (activeLink) {
                activeLink.classList.add("active");
            }

        });

    }, {
        threshold: 0.5
    });

    sections.forEach(section => observer.observe(section));

});