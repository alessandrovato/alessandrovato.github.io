
async function loadPublications() {

  try {

    const response = await fetch("./publications.bib");

    if (!response.ok) {
      throw new Error("Cannot load publications.bib");
    }

    const bibtexText = await response.text();

    const entries = bibtexParse.toJSON(bibtexText);

    entries.sort((a, b) => {
      return (b.entryTags.year || 0) - (a.entryTags.year || 0);
    });

    const pubList = document.getElementById("pub-list");

    pubList.innerHTML = "";

    entries.forEach(entry => {

      const tags = entry.entryTags;

      const title = tags.title || "Untitled";
      const authors = tags.author || "";
      const year = tags.year || "";
      const journal = tags.journal || tags.booktitle || "";
      const doi = tags.doi || "";
      const image = tags.image || "";

      const card = document.createElement("div");
      card.className = "publication-card";

      card.innerHTML = `
        <div class="publication-item">

          <div class="pub-thumb">
            ${image
              ? `<img src="${image}" alt="">`
              : `<div class="pub-fallback">📄</div>`
            }
          </div>

          <div class="pub-content">

            <h3>${title}</h3>

            <p class="pub-authors">${authors}</p>

            <p class="pub-journal">
              <em>${journal}</em> (${year})
            </p>

            <div class="pub-links">
              ${doi
                ? `<a href="https://doi.org/${doi}" target="_blank">DOI</a>`
                : ""
              }
            </div>

          </div>

        </div>
      `;

      pubList.appendChild(card);
    });

  } catch (error) {

    console.error(error);

    document.getElementById("pub-list").innerHTML =
      "<p style='color:red;'>Error loading publications.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadPublications);