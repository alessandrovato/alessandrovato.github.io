function shortenAuthors(authorString) {

  return authorString
    .split(" and ")
    .map(author => {

      author = author.trim();

      // Format: "Last, First"
      if (author.includes(",")) {

        const [last, first] = author.split(",");

        const initials = first
          .trim()
          .split(/\s+/)
          .map(name => name.charAt(0) + ".")
          .join(" ");

        return `${initials} ${last.trim()}`;
      }

      // Format: "First Last"
      const parts = author.split(/\s+/);

      const last = parts.pop();

      const initials = parts
        .map(name => name.charAt(0) + ".")
        .join(" ");

      return `${initials} ${last}`;
    })
    .join(", ");
}


async function loadPublications() {

  try {

    const response = await fetch("./publications.bib");

    if (!response.ok) {
      throw new Error("Cannot load publications.bib");
    }

    const bibtexText = await response.text();

    const entries = bibtexParse.toJSON(bibtexText);

    // Sort by year descending
    entries.sort((a, b) => {
      return (b.entryTags.year || 0) - (a.entryTags.year || 0);
    });

    const pubList = document.getElementById("pub-list");

    pubList.innerHTML = "";

    entries.forEach(entry => {

      const tags = entry.entryTags;

      const title = tags.title || "Untitled";

      // Shortened author names
      const authors = shortenAuthors(tags.author || "");

      const year = tags.year || "";

      const journal = tags.journal || tags.booktitle || "";

      const doi = tags.doi || "";

      const image = tags.image || "";

      const card = document.createElement("div");

      card.className = "publication-card";

      card.innerHTML = `
            <div class="publication-item">

              ${image ? `
                <div class="pub-thumb">
                  <img src="${image}" alt="">
                </div>
              ` : ""}

              <div class="pub-content">
              

                <h3 class="pub-title">
                  ${doi
                    ? `<a href="https://doi.org/${doi}" target="_blank">${title}</a>`
                    : title
                  }
                </h3>

                <p class="pub-authors">${authors}</p>

                <p class="pub-meta">${journal} ${year ? `(${year})` : ""}</p>

                <div class="pub-links">
                  ${doi ? `<a href="https://doi.org/${doi}" target="_blank">DOI</a>` : ""}
                  // <a href="#">Cited by</a>
                  // <a href="#">PDF</a>
                  // <a href="#">Versions</a>
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