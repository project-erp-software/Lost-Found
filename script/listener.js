// Compress image before sending to the server
function compressImage(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const MAX_WIDTH = 1200;
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            callback(compressedDataUrl);
        }
    };
}

function setupEventListeners() {
    searchInput.addEventListener('input', showItems);
    categoryFilter.addEventListener('change', showItems);

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentStatusFilter = e.target.dataset.status;
            showItems();
        });
    });

    addItemBtn.addEventListener('click', () => postModal.style.display = 'flex');
    closePostModal.addEventListener('click', () => {postModal.style.display = 'none'; postForm.reset();});
    
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const imageFile = document.getElementById('itemImage').files[0];
        if (!imageFile) return;

        // Show loading message
        MessageToast("Uploading item, please wait...");

        // Compress and upload
        compressImage(imageFile, async function(compressedImageUrl) {
            const newItem = {
                id: Date.now(), 
                title: document.getElementById('itemName').value,
                status: document.getElementById('itemStatus').value,
                category: document.getElementById('itemCategory').value,
                location: document.getElementById('itemLocation').value,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true}),
                image: compressedImageUrl  
            };

            try {
                // Send to Cloudflare Function
                const response = await fetch('/api/items', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                });

                if (response.ok) {
                    const result = await response.json();
                    
                    // Add the saved item (which now has the live R2 image URL) to the grid
                    itemsData.unshift(result.item); 
                    showItems(); 
                    postModal.style.display = 'none'; 
                    postForm.reset(); 
                    MessageToast('Item posted successfully!');
                } else {
                    MessageToast("!Error: Could not save to server");
                }
            } catch (error) {
                console.error(error);
                MessageToast("!Error: Network disconnected");
            }
        });
    });

    closeContactModal.addEventListener('click', () => {contactModal.style.display = 'none'; contactForm.reset()});
    closeImageModal.addEventListener('click', () => imageModal.style.display = 'none');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        contactModal.style.display = 'none';
        contactForm.reset();
        MessageToast('Message sent successfully!');
    });

    window.addEventListener('click', (e) => {
        if (e.target === postModal) postModal.style.display = 'none';
        if (e.target === contactModal) contactModal.style.display = 'none';
        if (e.target === imageModal) imageModal.style.display = 'none';
    });
}