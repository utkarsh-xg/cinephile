const apiKey = "fc127c8"; // Your OMDb API key
const searchInput = document.getElementById("searchInput");
const moviesDiv = document.getElementById("movies");

// Modal elements
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalOverview = document.getElementById("modalOverview");
const modalYear = document.getElementById("modalYear");
const modalLanguage = document.getElementById("modalLanguage");
const modalCountry = document.getElementById("modalCountry");
const modalRating = document.getElementById("modalRating");

// Live search
searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    } else {
        moviesDiv.innerHTML = "";
    }
});

// Fetch movies from OMDb API
async function fetchMovies(query) {
    moviesDiv.innerHTML = "<p>Loading...</p>";
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            moviesDiv.innerHTML = "<p>No movies or series found.</p>";
        }
    } catch (error) {
        moviesDiv.innerHTML = "<p>Something went wrong. Try again!</p>";
        console.error(error);
    }
}

// Display movies
function displayMovies(movies) {
    moviesDiv.innerHTML = movies.map(movie => {
        const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/180x270?text=No+Image";
        return `
            <div class="movie" data-id="${movie.imdbID}">
                <img src="${poster}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
            </div>
        `;
    }).join("");

    // Click event to open modal with full details
    document.querySelectorAll(".movie").forEach(movie => {
        movie.addEventListener("click", async () => {
            const id = movie.dataset.id;
            const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`);
            const data = await res.json();

            modalPoster.src = data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/300x450?text=No+Image";
            modalTitle.textContent = data.Title;
            modalOverview.textContent = data.Plot;
            modalYear.textContent = data.Year;
            modalLanguage.textContent = data.Language;
            modalCountry.textContent = data.Country;
            modalRating.textContent = data.imdbRating;
            modal.style.display = "block";
        });
    });
}

// Close modal
closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
});
