
function shortenAuthors(authorString) {

  if (!authorString) return "";

  return authorString
    .split(" and ")
    .map(author => {

      author = author.trim();

      // "Last, First"
      if (author.includes(",")) {

        const [last, first] = author.split(",");

        const initials = first
          .trim()
          .split(/\s+/)
          .map(n => n.charAt(0) + ".")
          .join(" ");

        return `${initials} ${last.trim()}`;
      }

      // "First Last"
      const parts = author.split(/\s+/);

      const last = parts.pop();

      const initials = parts
        .map(n => n.charAt(0) + ".")
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

    // sort newest first
    entries.sort((a, b) => {
      return (b.entryTags.year || 0) - (a.entryTags.year || 0);
    });

    // ✅ detect page
    const isFullPage =
      window.location.pathname.includes("publications");

    // homepage = 5, publications page = all
    const finalEntries = isFullPage
      ? entries
      : entries.slice(0, 5);

    const pubList = document.getElementById("pub-list");

    pubList.innerHTML = "";

    finalEntries.forEach(entry => {

      const tags = entry.entryTags;

      const title = tags.title || "Untitled";
      const authors = shortenAuthors(tags.author || "");
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
              ? `
                ${doi
                  ? `
                    <a href="https://doi.org/${doi}" target="_blank">
                      <img src="${image}" alt="">
                    </a>
                  `
                  : `
                    <img src="${image}" alt="">
                  `
                }
              `
              : `
                <div class="pub-fallback">📄</div>
              `
            }

          </div>

          <div class="pub-content">

            <h3 class="pub-title">
              ${doi
                ? `<a href="https://doi.org/${doi}" target="_blank">${title}</a>`
                : title
              }
            </h3>

            <p class="pub-authors">${authors}</p>

            <p class="pub-meta">
              ${journal} ${year ? `(${year})` : ""}
            </p>

          </div>

        </div>
      `;

      pubList.appendChild(card);
    });

    // show "See all" ONLY on homepage
    if (!isFullPage) {

      const seeAll = document.createElement("div");

      seeAll.className = "pub-see-all";

      seeAll.innerHTML = `
        <a href="/publications/">→ See all publications</a>
      `;

      pubList.appendChild(seeAll);
    }

  } catch (error) {

    console.error(error);

    document.getElementById("pub-list").innerHTML =
      "<p style='color:red;'>Error loading publications.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadPublications);