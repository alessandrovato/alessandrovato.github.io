document.addEventListener("DOMContentLoaded",()=>{

    const sections=document.querySelectorAll("section");

    const observer=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(!entry.isIntersecting) return;

            const id=entry.target.id;

            const theme=entry.target.dataset.theme;

            const link=document.querySelector(`nav a[href="/#${id}"]`);

            if(!link) return;

            if(theme==="dark"){

                link.style.color="white";

            }else{

                link.style.color="#074173";

            }

        });

    },{
        threshold:.5
    });

    sections.forEach(section=>observer.observe(section));

});