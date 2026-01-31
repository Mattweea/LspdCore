import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const root = process.cwd();

const navSections = [
  {
    title: "FDO - MANUALE OPERATIVO",
    items: [
      { label: "0️⃣ Introduzione", path: "fdo-manuale-operativo/introduzione.html" },
      { label: "1️⃣ Gerarchia", path: "fdo-manuale-operativo/gerarchia.html" },
      { label: "2️⃣ Divisioni Dipartimentali", path: "fdo-manuale-operativo/divisioni-dipartimentali.html" },
      { label: "3️⃣ Equipaggiamenti e risorse", path: "fdo-manuale-operativo/equipaggiamenti-e-risorse.html" },
      { label: "4️⃣ Codici e Ten-Code", path: "fdo-manuale-operativo/codici-e-ten-code.html" },
      { label: "5️⃣ Uso corretto del Database e del Tablet", path: "fdo-manuale-operativo/uso-corretto-del-database-e-del-tablet.html" },
      { label: "6️⃣ Procedure Operative Base", path: "fdo-manuale-operativo/procedure-operative-base.html" },
      { label: "7️⃣ Corso di primo soccorso", path: "fdo-manuale-operativo/corso-di-primo-soccorso.html" },
      {
        label: "8️⃣ Reparti Operativi",
        path: "fdo-manuale-operativo/reparti-operativi/README.html",
        children: [
          { label: "🚁 Flight Unit", path: "fdo-manuale-operativo/reparti-operativi/flight-unit.html" },
          { label: "🏍️ Reparto Mary", path: "fdo-manuale-operativo/reparti-operativi/reparto-mary.html" },
          { label: "🚔 Reparto Swat", path: "fdo-manuale-operativo/reparti-operativi/reparto-swat.html" },
          {
            label: "👮 Manuale Operativo Coordinatore",
            path: "https://docs.google.com/document/d/10mKLSG9dSyHxj_ga_VQ-42GPcX34h2vMPgpyMrjCIeU/edit?usp=drivesdk",
            external: true,
          },
        ],
      },
      { label: "9️⃣ Reparto Investigativo", path: "fdo-manuale-operativo/reparto-investigativo.html" },
      {
        label: "🔟 Carriera, sanzioni e comportamento generale",
        path: "fdo-manuale-operativo/carriera-sanzioni-e-comportamento-generale.html",
      },
      { label: "📹 Utilizzo della bodycam", path: "fdo-manuale-operativo/utilizzo-della-bodycam.html" },
      { label: "❗️ REMINDER", path: "fdo-manuale-operativo/reminder.html" },
    ],
  },
  {
    title: "Federal Investigation Bureau",
    items: [
      { label: "❗Informativa", path: "federal-investigation-bureau/informativa.html" },
      { label: "2️⃣ Divisioni", path: "federal-investigation-bureau/divisioni.html" },
      { label: "📁 Certificazione", path: "federal-investigation-bureau/certificazione.html" },
    ],
  },
  {
    title: "Utilizzo MDT",
    items: [
      { label: "⏰ Entrata in servizio/uscita", path: "utilizzo-mdt/entrata-in-servizio-uscita.html" },
      { label: "📻 Utliizzo Radio e GPS", path: "utilizzo-mdt/utliizzo-radio-e-gps.html" },
      { label: "🚓 Incarcerare una persona", path: "utilizzo-mdt/incarcerare-una-persona.html" },
    ],
  },
];

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function stripFrontmatter(text) {
  if (!text.startsWith("---")) {
    return text;
  }
  const lines = text.split(/\r?\n/);
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") {
      endIndex = i;
      break;
    }
  }
  if (endIndex === -1) {
    return text;
  }
  return lines.slice(endIndex + 1).join("\n");
}

function markdownToHtml(markdown) {
  const result = spawnSync("npx", ["-y", "marked", "--gfm"], {
    input: markdown,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || "markdown-it-cli failed");
  }
  return result.stdout;
}

function htmlTitleFromMarkdown(markdown, fallback) {
  const match = markdown.match(/^#{1,6}\s+(.+)$/m);
  if (!match) {
    return fallback;
  }
  return match[1]
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function relBase(filePath) {
  const relativeDir = path.relative(root, path.dirname(filePath));
  if (!relativeDir || relativeDir === ".") {
    return "";
  }
  const depth = relativeDir.split(path.sep).length;
  return "../".repeat(depth);
}

function linkify(pathValue, base) {
  if (pathValue.startsWith("http")) {
    return pathValue;
  }
  return base + pathValue;
}

function renderNavItems(items, base) {
  let html = "<ul class=\"nav-list\">";
  for (const item of items) {
    const href = linkify(item.path, base);
    const attrs = item.external ? " target=\"_blank\" rel=\"noopener\"" : "";
    html += `<li><a href=\"${href}\"${attrs}>${item.label}</a>`;
    if (item.children) {
      html += renderNavItems(item.children, base);
    }
    html += "</li>";
  }
  html += "</ul>";
  return html;
}

function renderSidebar(base) {
  let html = `
    <aside class="sidebar">
      <a class="sidebar-brand" href="${base}index.html">
        <img src="${base}.gitbook/assets/1W8z7vo.png" alt="Logo" />
        <span>Manuali</span>
      </a>
  `;

  for (const section of navSections) {
    html += `<div class=\"nav-section\">${section.title}</div>`;
    html += renderNavItems(section.items, base);
  }

  html += "</aside>";
  return html;
}

function wrapPage({ title, content, base }) {
  return `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} | Manuali e Gerarchie</title>
    <link rel="stylesheet" href="${base}site.css" />
    <script defer src="${base}site.js"></script>
  </head>
  <body>
    <button class="toggle" aria-label="Apri navigazione">≡</button>
    <div class="layout">
      ${renderSidebar(base)}
      <main class="main">
        <div class="content">
${content}
        </div>
      </main>
    </div>
  </body>
</html>`;
}

function convertLinks(html) {
  return html
    .replace(/href="([^"]+?)\.md(#[^"]*)?"/g, "href=\"$1.html$2\"")
    .replace(/href='([^']+?)\.md(#[^']*)?'/g, "href='$1.html$2'");
}

const files = walk(root);
for (const file of files) {
  const markdown = fs.readFileSync(file, "utf8");
  const stripped = stripFrontmatter(markdown);
  const base = relBase(file);
  const title = htmlTitleFromMarkdown(stripped, path.basename(file, ".md"));

  const contentHtml = convertLinks(markdownToHtml(stripped));
  const pageHtml = wrapPage({ title, content: contentHtml.trim(), base });

  const outPath = file.replace(/\.md$/, ".html");
  fs.writeFileSync(outPath, pageHtml, "utf8");

  if (path.basename(file) === "README.md" && path.dirname(file) === root) {
    fs.writeFileSync(path.join(root, "index.html"), pageHtml, "utf8");
  }
}

console.log(`Converted ${files.length} Markdown files.`);
