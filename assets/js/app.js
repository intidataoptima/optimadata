const input = document.getElementById("globalSearch");
const results = document.getElementById("results");

function renderResults(items) {
  results.innerHTML = "";
  results.style.display = "block";

  if (items.length === 0) {
    results.innerHTML =
      '<div class="result-item"><span>Modem belum tersedia. Hubungi CS WhatsApp.</span></div>';
    return;
  }

  items.forEach((modem) => {
    const label = `${modem.brand} ${modem.model}`;
    const content = modem.available
      ? `<a href="${modem.link}">${label}</a>`
      : `<span>${label} - segera hadir</span>`;

    results.insertAdjacentHTML("beforeend", `<div class="result-item">${content}</div>`);
  });
}

if (input && results) {
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();

    if (!q) {
      results.innerHTML = "";
      results.style.display = "none";
      return;
    }

    const found = modems.filter((modem) =>
      `${modem.brand} ${modem.model}`.toLowerCase().includes(q),
    );

    renderResults(found);
  });
}
