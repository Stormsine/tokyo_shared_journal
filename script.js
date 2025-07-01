const CLOUD_NAME = "dqvhf6sqf";
const UPLOAD_PRESET = "moomoo";

const itinerary = [
  { date: "2025-08-29", title: "Arrival + Akihabara", city: "Tokyo" },
  { date: "2025-08-30", title: "Avatar Café + Sunshine City", city: "Tokyo" },
  { date: "2025-08-31", title: "Shibuya + Shinjuku", city: "Tokyo" },
  { date: "2025-09-01", title: "Tokyo Tower + Mofusand", city: "Tokyo" },
  { date: "2025-09-02", title: "Kyoto Arrival + Yasaka Shrine", city: "Kyoto" },
  { date: "2025-09-03", title: "Fushimi Inari + Nara Park", city: "Kyoto" },
  { date: "2025-09-04", title: "Osaka Day Trip", city: "Osaka" },
  { date: "2025-09-05", title: "Back to Tokyo + Sensoji", city: "Tokyo" },
  { date: "2025-09-06", title: "RURU Shibuya + Nezu Museum", city: "Tokyo" },
  { date: "2025-09-07", title: "Return to USA", city: "Tokyo" }
];

function populateDays() {
  const select = document.getElementById("day-select");
  select.innerHTML = "";
  itinerary.forEach((day, idx) => {
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = `${day.date} - ${day.title}`;
    select.appendChild(option);
  });
  select.addEventListener("change", () => loadEntries(select.value));
  select.value = 0;
  loadEntries(0);
}

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Cloudinary upload failed");

  const data = await response.json();
  return data.secure_url;
}

async function saveEntry() {
  const idx = document.getElementById("day-select").value;
  const day = itinerary[idx];
  const note = document.getElementById("note").value.trim();
  const rating = parseInt(document.getElementById("rating").value);
  const emoji = document.getElementById("emoji").value;
  const photoInput = document.getElementById("photo");
  const file = photoInput.files[0];

  if (!file) {
    alert("Please upload a photo!");
    return;
  }

  try {
    const photoUrl = await uploadToCloudinary(file);

    const res = await fetch("/.netlify/functions/submit-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: day.date,
        title: day.title,
        city: day.city,
        note,
        rating,
        emoji,
        photo: photoUrl
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save entry");
    }

    document.getElementById("note").value = "";
    document.getElementById("rating").value = 3;
    document.getElementById("emoji").value = "😊";
    document.getElementById("photo").value = "";

    loadEntries(idx);
    updateSlideshowBackground();

  } catch (error) {
    console.error("Error saving entry:", error);
    alert("There was an error saving your entry. Please try again.");
  }
}

async function loadEntries(idx) {
  const day = itinerary[idx];
  const entriesDiv = document.getElementById("entries");
  const headerDiv = document.getElementById("day-header");

  headerDiv.innerHTML = `<h2>${day.date} - ${day.title} (${day.city})</h2>`;
  entriesDiv.innerHTML = "<p>Loading entries...</p>";

  try {
    const res = await fetch(`/.netlify/functions/get-entries?date=${encodeURIComponent(day.date)}`);
    if (!res.ok) throw new Error("Failed to fetch entries");
    const entries = await res.json();

    if (entries.length === 0) {
      entriesDiv.innerHTML = "<p>No entries for this day yet.</p>";
      return;
    }

    entriesDiv.innerHTML = "";
    entries.forEach(entry => {
      const div = document.createElement("div");
      div.className = "entry";
      div.innerHTML = `
        <img src="${entry.photo}" alt="Memory photo" />
        <p>${entry.note}</p>
        <p>⭐ ${entry.rating} &nbsp; ${entry.emoji}</p>
        <small>${new Date(entry.created_at).toLocaleString()}</small>
      `;
      entriesDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading entries:", error);
    entriesDiv.innerHTML = "<p>Error loading entries.</p>";
  }
}

async function updateSlideshowBackground() {
  const bgDiv = document.getElementById("bg-slideshow");

  try {
    const res = await fetch(`/.netlify/functions/get-entries`);
    if (!res.ok) throw new Error("Failed to fetch all entries");
    const allEntries = await res.json();

    if (!allEntries.length) {
      bgDiv.style.backgroundImage = "none";
      return;
    }

    const urls = allEntries.map(e => e.photo).filter(Boolean);
    if (!urls.length) {
      bgDiv.style.backgroundImage = "none";
      return;
    }

    let index = 0;
    bgDiv.style.backgroundImage = `url('${urls[0]}')`;

    if (window.bgInterval) clearInterval(window.bgInterval);

    window.bgInterval = setInterval(() => {
      index = (index + 1) % urls.length;
      bgDiv.style.backgroundImage = `url('${urls[index]}')`;
    }, 8000);

  } catch (error) {
    console.error("Error updating slideshow background:", error);
    bgDiv.style.backgroundImage = "none";
  }
}

window.onload = () => {
  populateDays();
  updateSlideshowBackground();
};

window.saveEntry = saveEntry;
