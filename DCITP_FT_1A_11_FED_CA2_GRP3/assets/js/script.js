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

// Banner Effect
const images = [
    "assets/img/MBSImgs/marinaBaySandsNight.jpg",
    "assets/img/GBTBImgs/gardensBayTheBayNight.jpg",
    "assets/img/ORImgs/OrchardRoad.jpg",
    "assets/img/NGSImgs/NationalGallerySingapore.jpg",
    "assets/img/CG_IMG/ChineseGarden.jpg",
    "assets/img/ST_IMG/Sentosa.jpg",
    "assets/img/CTImgs/chinatown.jpg",
    "assets/img/CJ_IMGS/ChangiJewel.jpg",
    "assets/img/BG_Imgs/BotanicGardens.jpg"
];

let currentImage = 0;
const banner = document.getElementById("banner1");

function changeBanner() {

    banner.style.opacity = 0;

    setTimeout(() => {

        banner.style.backgroundImage = `url(${images[currentImage]})`;

        banner.style.opacity = 1;

        currentImage++;

        if (currentImage >= images.length)
            currentImage = 0;

    }, 400);

}

changeBanner();
setInterval(changeBanner, 3000);