// Search Bar & Filter
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cards = document.querySelectorAll(".image-card");

function filterDestinations() {

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    cards.forEach(card => {

        const destinationName = card.querySelector("h3").textContent.toLowerCase();
        const categories = card.dataset.category.split(",");
        const matchesSearch = destinationName.includes(searchText);
        const matchesCategory = selectedCategory === "all" || categories.includes(selectedCategory);

        if (matchesSearch && matchesCategory) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

searchInput.addEventListener("input", filterDestinations);
categoryFilter.addEventListener("change", filterDestinations);
