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

  const isFirst = container.children.length === 0;
  const section = document.createElement("div");
  section.innerHTML = `<h2 style="margin-top:${isFirst ? '0' : '30px'};">${title}</h2>`;

  list.forEach(entry => {
    const tags = entry.entryTags;
    const titleText = tags.title || "Untitled";
    const authors = shortenAuthors(tags.author || "");
    const year = tags.year || "";
    const journal = tags.journal || tags.booktitle || "";
    const doi = tags.doi || "";
    const image = tags.image || "";

    const typeIcon = entry.entryType === "inproceedings" ? "🖊️"
                   : entry.entryType === "book" ? "📖"
                   : "📄";

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
            : `<div class="pub-fallback">${typeIcon}</div>`
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

// Detect which page we're on robustly
function getPageType() {
  const path = window.location.pathname;
  // Matches /publications-all, /publications-all.html, /publications-all/
  if (/publications[-_]all/.test(path)) return "all";
  // Matches /publications, /publications.html, /publications/
  if (/publications/.test(path)) return "main";
  // Fallback: if the element exists on the home page
  return "main";
}

// Main function to load and display publications
async function loadPublications() {
  try {
    // Use an absolute path so the .bib file is always found regardless of page
    const bibPath = window.location.origin + "/publications.bib";
    const response = await fetch(bibPath);
    if (!response.ok) {
      throw new Error("Cannot load publications.bib (status " + response.status + ")");
    }

    const bibtexText = await response.text();
    const entries = bibtexParse.toJSON(bibtexText);

    // Sort entries by year (newest first)
    entries.sort((a, b) => (parseInt(b.entryTags.year) || 0) - (parseInt(a.entryTags.year) || 0));

    const pubList = document.getElementById("pub-list");
    if (!pubList) return; // Safety check
    pubList.innerHTML = "";

    const pageType = getPageType();

    if (pageType === "all") {
      // Show everything grouped by type
      const articles = entries.filter(e => e.entryType === "article");
      const conferences = entries.filter(e => e.entryType === "inproceedings");
      const books = entries.filter(e => e.entryType === "book");

      renderSection("Journal Articles", articles, pubList);
      renderSection("Conference Papers", conferences, pubList);
      renderSection("Books", books, pubList);

    } else {
      // Show only the first 5 journal articles on the main publications page
      const articles = entries.filter(e => e.entryType === "article");
      const latestArticles = articles.slice(0, 5);

      renderSection("Journal Articles", latestArticles, pubList);

      // "See all" link — plain HTML, no Liquid tags
      const seeAll = document.createElement("div");
      seeAll.className = "pub-see-all";
      seeAll.innerHTML = `<a href="/publications-all.html">→ See all publications</a>`;
      pubList.appendChild(seeAll);
    }
  } catch (error) {
    console.error(error);
    const pubList = document.getElementById("pub-list");
    if (pubList) pubList.innerHTML = "<p style='color:red;'>Error loading publications.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadPublications);