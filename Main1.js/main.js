document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "C83podDgM2HxGlxV4C5nfQHobQFcdx51";
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const gifContainer = document.getElementById("gif-container");
  const loadMoreBtn = document.getElementById("load-more");

  let query = "";
  let offset = 0;
  const LIMIT = 12;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    query = input.value.trim();
    if (!query) return;

    offset = 0;
    gifContainer.innerHTML = "<p>Loading...</p>";
    await fetchGifs(true);
  });

  loadMoreBtn.addEventListener("click", async () => {
    offset += LIMIT;
    await fetchGifs();
  });

  async function fetchGifs(reset = false) {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=${LIMIT}&offset=${offset}&rating=G&lang=en`
      );
      const data = await response.json();

      if (reset) gifContainer.innerHTML = "";

      if (data.data.length === 0 && offset === 0) {
        gifContainer.innerHTML = "<p>No GIFs found. Try another search!</p>";
        loadMoreBtn.style.display = "none";
        return;
      }

      data.data.forEach(gif => {
        const img = document.createElement("img");
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title;
        img.classList.add("fade-in");
        gifContainer.appendChild(img);
      });

      loadMoreBtn.style.display = data.data.length < LIMIT ? "none" : "block";
    } catch (err) {
      gifContainer.innerHTML = "<p>Something went wrong. Try again!</p>";
      console.error(err);
    }
  }
});
