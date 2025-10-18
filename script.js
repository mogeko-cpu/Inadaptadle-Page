const friends = [
  {
    apodo: "Mars",
    fecha: "2021",
    juegos: ["Roblox", "Valorant", "Juegos Ritmicos"],
    personalidad: ["Serio", "Mamon", "Sarcastico"],
    pareja: "No",
    avatar: "assets/mars_a.png",
  },
  {
    apodo: "Badd",
    fecha: "2021",
    juegos: ["Valorant", "Indies", "Pokemon", "Minecraft"],
    personalidad: ["Bromista", "Sarcastico"],
    pareja: "No",
    avatar: "assets/bad_a.png",
  },
  {
    apodo: "Shiny",
    fecha: "2023",
    juegos: ["Roblox", "Indies", "Valorant"],
    personalidad: ["Bromista", "Racista", "Pendejo"],
    pareja: "No",
    avatar: "assets/shiny_a.png",
  },
  {
    apodo: "Mogeko",
    fecha: "2022",
    juegos: [
      "Roblox",
      "Indies",
      "Valorant",
      "League of Legends",
      "Juegos Ritmicos",
    ],
    personalidad: ["Alegre", "Bromista", "Pendejo"],
    pareja: "Si",
    avatar: "assets/mogeko_a.png",
  },
  {
    apodo: "Doumen",
    fecha: "2021",
    juegos: ["Roblox", "Indies", "Valorant", "Juegos Ritmicos"],
    personalidad: ["Bromista", "Mamon", "Racista"],
    pareja: "No",
    avatar: "assets/doumen_a.png",
  },
  {
    apodo: "Kie",
    fecha: "2022",
    juegos: ["Roblox", "Indies", "Valorant", "Juegos Ritmicos"],
    personalidad: ["Bromista", "Mamon", "Pendejo"],
    pareja: "Si",
    avatar: "assets/kie_a.png",
  },
  {
    apodo: "Fex",
    fecha: "2023",
    juegos: ["Roblox", "Indies", "Valorant", "Minecraft", "Balatro"],
    personalidad: ["Bromista", "Sarcastico", "Pendejo"],
    pareja: "No",
    avatar: "assets/fex_a.gif",
  },
  {
    apodo: "Jonaw",
    fecha: "2021",
    juegos: ["Roblox", "Indies", "Juegos Ritmicos"],
    personalidad: ["Timido", "Serio"],
    pareja: "No",
    avatar: "assets/jonaw_a.png",
  },
  {
    apodo: "Iino",
    fecha: "2025",
    juegos: ["Valorant", "Indies", "Pokemon", "Balatro"],
    personalidad: ["Sarcastico", "Pendejo", "Mamon"],
    pareja: "Si",
    avatar: "assets/iino.png",
  },
  {
    apodo: "Pip",
    fecha: "2022",
    juegos: ["Valorant", "Indies", "Juegos Ritmicos", "Roblox"],
    personalidad: ["Sarcastico", "Pendejo", "Doble Cara"],
    pareja: "No",
    avatar: "assets/pip_a.png",
  },
  {
    apodo: "Alex",
    fecha: "2021",
    juegos: ["Roblox", "Juegos Ritmicos"],
    personalidad: ["Bromista", "Pendejo", "Sarcastico"],
    pareja: "No",
    avatar: "assets/alex_a.png",
  },
  {
    apodo: "Usak",
    fecha: "2023",
    juegos: ["Roblox", "Balatro", "Brawl Stars"],
    personalidad: ["Bromista", "Pendejo", "Sarcastico"],
    pareja: "Si",
    avatar: "assets/usak_a.png",
  },
  {
    apodo: "Roc ney",
    fecha: "2023",
    juegos: ["Roblox", "Minecraft"],
    personalidad: ["Bromista", "Pendejo", "Estafador"],
    pareja: "No",
    avatar: "assets/roc_a.png",
  },
];

const input = document.getElementById("guess");
const suggestions = document.getElementById("suggestions");
const results = document.getElementById("results");
const btn = document.getElementById("submit-btn");

let correcto = elegirAleatorio();

// === Funciones base ===
function elegirAleatorio() {
  return friends[Math.floor(Math.random() * friends.length)];
}

function normalizar(v) {
  return String(v ?? "")
    .toLowerCase()
    .trim();
}

// === Autocompletado ===
input.addEventListener("input", () => {
  const val = normalizar(input.value);
  suggestions.innerHTML = "";
  if (!val) return;

  friends
    .filter((f) => normalizar(f.apodo).startsWith(val))
    .forEach((f) => {
      const li = document.createElement("li");
      li.innerHTML = `<img src="${f.avatar}"><span>${f.apodo}</span>`;
      li.onclick = () => {
        input.value = f.apodo;
        suggestions.innerHTML = "";
      };
      suggestions.appendChild(li);
    });
});

// === Mostrar todas las opciones al hacer clic ===
input.addEventListener("focus", () => {
  suggestions.innerHTML = "";
  friends.forEach((f) => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="${f.avatar}"><span>${f.apodo}</span>`;
    li.onclick = () => {
      input.value = f.apodo;
      suggestions.innerHTML = "";
    };
    suggestions.appendChild(li);
  });
});

input.addEventListener("blur", () => {
  setTimeout(() => (suggestions.innerHTML = ""), 200);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    btn.click();
  }
});

// === Comparar y mostrar resultado ===
btn.addEventListener("click", () => {
  const val = normalizar(input.value);
  const amigo = friends.find((f) => normalizar(f.apodo) === val);

  if (!amigo) return alert("No encontrado. Intenta de nuevo.");

  mostrarResultado(amigo);
  input.value = "";
  suggestions.innerHTML = "";
});

function mostrarResultado(a) {
  const card = document.createElement("div");
  card.className = "result-card";

  // Avatar primero
  let html = `<img src="${a.avatar}" title="Avatar">`;

  // Mostrar los campos con tooltip
  for (const key in a) {
    if (key === "avatar") continue;
    const color = compararCampo(a[key], correcto[key]);
    const valor =
      Array.isArray(a[key]) && a[key].length
        ? a[key].join(", ")
        : a[key] || "-";

    // Capitaliza el nombre del campo para el tooltip
    const titulo = key.charAt(0).toUpperCase() + key.slice(1);

    html += `<div class="cell ${color}" title="${titulo}">${valor}</div>`;
  }

  card.innerHTML = html;
  results.prepend(card);

  if (normalizar(a.apodo) === normalizar(correcto.apodo)) mostrarGanaste();
}

// === Comparador universal ===
function compararCampo(va, vc) {
  if (Array.isArray(va) && Array.isArray(vc)) {
    const comunes = va.filter((v) =>
      vc.map((x) => normalizar(x)).includes(normalizar(v))
    );
    if (comunes.length === va.length && comunes.length === vc.length)
      return "green";
    if (comunes.length > 0) return "yellow";
    return "red";
  }

  if (normalizar(va) === normalizar(vc)) return "green";
  return "red";
}

// === Modal de victoria ===
function mostrarGanaste() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>🎉 ¡Ganaste!</h2>
      <button id="play-again">Jugar de nuevo</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("play-again").onclick = () => {
    results.innerHTML = "";
    modal.remove();
    correcto = elegirAleatorio();
    console.log("Nuevo correcto:", correcto.apodo);
  };
}

console.log("Amigo del día (debug):", correcto.apodo);
