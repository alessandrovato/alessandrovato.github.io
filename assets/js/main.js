document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll("section");
    const links = document.querySelectorAll("nav a");

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(!entry.isIntersecting) return;

            links.forEach(link=>link.classList.remove("active"));

            const active =
                document.querySelector(
                    `nav a[href="/#${entry.target.id}"]`
                );

            if(active)
                active.classList.add("active");

        });

    },{
        threshold:0.45
    });

    sections.forEach(section=>observer.observe(section));

});