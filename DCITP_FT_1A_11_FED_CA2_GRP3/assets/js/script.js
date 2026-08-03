// Search Bar & Filter
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cards = document.querySelectorAll(".image-card");

if (searchInput && categoryFilter) {

    function filterDestinations() {

        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        cards.forEach(card => {

            const destinationName = card.querySelector("h3").textContent.toLowerCase();
            const categories = card.dataset.category.split(",");

            const matchesSearch = destinationName.includes(searchText);
            const matchesCategory =
                selectedCategory === "all" ||
                categories.includes(selectedCategory);

            card.style.display =
                matchesSearch && matchesCategory ? "" : "none";

        });
    }

    searchInput.addEventListener("input", filterDestinations);
    categoryFilter.addEventListener("change", filterDestinations);
}

// Banner Effect
const banner = document.getElementById("banner1");

if (banner) {

    const imagePath = banner.dataset.imagePath;

    const images = [
        `${imagePath}/MBSImgs/marinaBaySandsNight.jpg`,
        `${imagePath}/GBTBImgs/gardensBayTheBayNight.jpg`,
        `${imagePath}/ORImgs/OrchardRoad.jpg`,
        `${imagePath}/NGSImgs/NationalGallerySingapore.jpg`,
        `${imagePath}/CG_IMG/ChineseGarden.jpg`,
        `${imagePath}/ST_IMG/Sentosa.jpg`,
        `${imagePath}/CTImgs/chinatown.jpg`,
        `${imagePath}/CJ_IMGS/ChangiJewel.jpg`,
        `${imagePath}/BG_Imgs/BotanicGardens.jpg`
    ];

    let currentImage = 0;

    function changeBanner() {

        banner.style.opacity = 0;

        setTimeout(() => {

            banner.style.backgroundImage = `url("${images[currentImage]}")`;
            banner.style.opacity = 1;

            currentImage = (currentImage + 1) % images.length;

        }, 400);
    }

    changeBanner();
    setInterval(changeBanner, 3000);
}