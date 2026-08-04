
const sections = document.querySelectorAll("section");
const nav = document.querySelector("nav");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            if (entry.target.classList.contains("section-dark")) {
                nav.classList.remove("light");
                nav.classList.add("dark");
            } else {
                nav.classList.remove("dark");
                nav.classList.add("light");
            }

        }
    });
}, {
    threshold: 0.5
});

sections.forEach(section => observer.observe(section));