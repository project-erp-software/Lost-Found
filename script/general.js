// Start with an empty array. We will fill it from the cloud.
let itemsData = [];

const itemsGrid = document.getElementById('itemsGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const tabBtns = document.querySelectorAll('.tab-btn');

const postModal = document.getElementById('postModal');
const contactModal = document.getElementById('contactModal');
const imageModal = document.getElementById('imageModal');
const fullSizeImage = document.getElementById('fullSizeImage');
const addItemBtn = document.getElementById('addItemBtn');
const closePostModal = document.getElementById('closePostModal');
const closeContactModal = document.getElementById('closeContactModal');
const closeImageModal = document.getElementById('closeImageModal');

const postForm = document.getElementById('postForm');
const contactForm = document.getElementById('contactForm');
const contactItemName = document.getElementById('contactItemName');

let currentStatusFilter = 'All';

// Changed to async to fetch data from Cloudflare
async function start() {
    try {
        const response = await fetch('/api/items');
        if (response.ok) {
            itemsData = await response.json();
        } else {
            MessageToast("Server error: Cannot Load") // Fallback if API fails
        }
    } catch (error) {
        console.error("Failed to load items:", error);
        MessageToast("Check your internet connection")
    }

    showItems();
    setupEventListeners();
}

function openContactModal(itemName) {
    contactItemName.textContent = `Regarding: ${itemName}`;
    contactModal.style.display = 'flex';
}

function openImageModal(imageSrc) {
    fullSizeImage.src = imageSrc;
    imageModal.style.display = 'flex';
}

function MessageToast(message) {
    const toast = document.querySelector('.Toast');
    toast.textContent = message;
    toast.classList.add('MessageToast');
    setTimeout(function() {
        toast.classList.remove('MessageToast');
        toast.innerHTML = '';
    }
    ,2000)
}

start();