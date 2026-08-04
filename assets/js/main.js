document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll("section");
    const links = document.querySelectorAll("nav a");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            links.forEach(link => {

                link.classList.remove("active");
                link.style.removeProperty("--menu-color");

            });

            const active =
                document.querySelector(`nav a[href="/#${entry.target.id}"]`);

            if (!active) return;

            active.classList.add("active");

            if (entry.target.dataset.theme === "dark") {
                active.style.setProperty("--menu-color", "#ffffff");
            } else {
                active.style.setProperty("--menu-color", "#074173");
            }

        });

    }, {
        threshold: 0.45
    });

    sections.forEach(section => observer.observe(section));

});
