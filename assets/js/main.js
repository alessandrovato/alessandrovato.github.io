document.addEventListener("DOMContentLoaded",()=>{

    const sections=document.querySelectorAll("section");

    const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        document.querySelectorAll("nav a")
            .forEach(link => link.classList.remove("active","dark-text","light-text"));

        const link = document.querySelector(
            `nav a[href="/#${entry.target.id}"]`
        );

        if (!link) return;

        link.classList.add("active");

        if (entry.target.dataset.theme === "dark")
            link.style.setProperty("--menu-color", "white");
        else
            link.style.setProperty("--menu-color", "#074173");
    });

},{
    threshold:0.45
});

    sections.forEach(section=>observer.observe(section));

});


