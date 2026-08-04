
document.addEventListener("DOMContentLoaded", () => {

    const nav = document.querySelector("nav");
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            if (entry.target.classList.contains("section-dark")) {
                nav.style.setProperty("--nav-bg", "#0d355a");
                nav.querySelectorAll("a").forEach(a => a.style.color = "white");
            } else {
                nav.style.setProperty("--nav-bg", "white");
                nav.querySelectorAll("a").forEach(a => a.style.color = "#074173");
            }

        });
    }, {
        threshold: 0.5
    });

    sections.forEach(section => observer.observe(section));

});