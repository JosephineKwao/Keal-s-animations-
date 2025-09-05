document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "C83podDgM2HxGlxV4C5nfQHobQFcdx51";
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const gifContainer = document.getElementById("gif-container");

  let query = "";
  let offset = 0;
  const LIMIT = 12;
  let loadMoreBtn;

  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    query = input.value.trim();
    if (!query) return;

    offset = 0;
    gifContainer.innerHTML = "<p>Loading...</p>";
    await fetchGifs(true);
  });

  
  async function fetchGifs(reset = false) {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=${LIMIT}&offset=${offset}&rating=G&lang=en`
      );
      const data = await response.json();
      displayGifs(data.data, reset);
    } catch (error) {
      gifContainer.innerHTML = "<p>Something went wrong. Try again!</p>";
      console.error(error);
    }
  }

  
  function displayGifs(gifs, reset) {
    if (reset) gifContainer.innerHTML = "";

    if (gifs.length === 0 && offset === 0) {
      gifContainer.innerHTML = "<p>No GIFs found. Try another search!</p>";
      if (loadMoreBtn) loadMoreBtn.style.display = "none";
      return;
    }

    gifs.forEach((gif) => {
      const img = document.createElement("img");
      img.src = gif.images.fixed_height.url;
      img.alt = gif.title;
      img.classList.add("fade-in");
      gifContainer.appendChild(img);
    });

    
    if (!loadMoreBtn) {
      loadMoreBtn = document.createElement("button");
      loadMoreBtn.id = "load-more";
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.addEventListener("click", () => {
        offset += LIMIT;
        fetchGifs();
      });
      gifContainer.insertAdjacentElement("afterend", loadMoreBtn);
    }

    
    loadMoreBtn.style.display = gifs.length < LIMIT ? "none" : "block";
  }
});
