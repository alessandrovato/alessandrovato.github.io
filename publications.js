// Function to shorten author names
function shortenAuthors(authorString) {
  if (!authorString) return "";

  return authorString
    .split(" and ")
    .map(author => {
      author = author.trim();

      if (author.includes(",")) {
        const [last, first] = author.split(",");
        const initials = first
          .trim()
          .split(/\s+/)
          .map(n => n.charAt(0) + ".")
          .join(" ");

        return `${initials} ${last.trim()}`;
      }

      const parts = author.split(/\s+/);
      const last = parts.pop();
      const initials = parts
        .map(n => n.charAt(0) + ".")
        .join(" ");

      return `${initials} ${last}`;
    })
    .join(", ");
}

// Function to render a section of publications
function renderSection(title, list, container) {
  if (list.length === 0) return;

  const section = document.createElement("div");
  section.innerHTML = `<h2 style="margin-top:30px;">${title}</h2>`;

  list.forEach(entry => {
    const tags = entry.entryTags;
    const titleText = tags.title || "Untitled";
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
                ? `<a href="https://doi.org/${doi}" target="_blank">
                    <img src="${image}" alt="">
                  </a>`
                : `<img src="${image}" alt="">`
              }
            `
            : `<div class="pub-fallback">📄</div>`
          }
        </div>

        <div class="pub-content">
          <h3 class="pub-title">
            ${doi
              ? `<a href="https://doi.org/${doi}" target="_blank">${titleText}</a>`
              : titleText
            }
          </h3>
          <p class="pub-authors">${authors}</p>
          <p class="pub-meta">
            ${journal} ${year ? `(${year})` : ""}
          </p>
        </div>
      </div>
    `;
    
    section.appendChild(card);
  });

  container.appendChild(section);
}

// Main function to load and display publications
async function loadPublications() {
  try {
    const response = await fetch("./publications.bib");
    if (!response.ok) {
      throw new Error("Cannot load publications.bib");
    }

    const bibtexText = await response.text();
    const entries = bibtexParse.toJSON(bibtexText);

    // Sort entries by year (newest first)
    entries.sort((a, b) => (b.entryTags.year || 0) - (a.entryTags.year || 0));

    const pubList = document.getElementById("pub-list");
    pubList.innerHTML = "";

    // Check the current page (if we're on the main page or the all publications page)
    if (window.location.pathname === "/publications" || window.location.pathname === "/") {
      // Show only the first 5 journal articles on the main page
      const articles = entries.filter(entry => entry.entryType === "article");
      const latestArticles = articles.slice(0, 5);

      renderSection("Journal Articles", latestArticles, pubList);

      // Add a "See all publications" link
      const seeAll = document.createElement("div");
      seeAll.className = "pub-see-all";
      seeAll.innerHTML = `<a href="{{ site.baseurl }}/publications-all">→ See all publications</a>`;
      pubList.appendChild(seeAll);
    } else if (window.location.pathname === "/publications-all") {
      // If on the all publications page, show everything grouped by type
      const articles = [];
      const conferences = [];
      const books = [];

      // Group publications by type
      entries.forEach(entry => {
        const type = entry.entryType;
        if (type === "article") {
          articles.push(entry);
        } else if (type === "inproceedings") {
          conferences.push(entry);
        } else if (type === "book") {
          books.push(entry);
        }
      });

      renderSection("Journal Articles", articles, pubList);
      renderSection("Conference Papers", conferences, pubList);
      renderSection("Books", books, pubList);
    }
  } catch (error) {
    console.error(error);
    document.getElementById("pub-list").innerHTML = "<p style='color:red;'>Error loading publications.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadPublications);