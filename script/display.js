function showItems() {
    itemsGrid.innerHTML = ''; 
    
    const searchTerm = searchInput.value.toLowerCase();
    const categoryTerm = categoryFilter.value;

    const filteredItems = itemsData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryTerm === 'All' || item.category === categoryTerm;
        const matchesStatus = currentStatusFilter === 'All' || item.status === currentStatusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (filteredItems.length === 0) {
        itemsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem; font-size: 1.5rem;">No items found.</p>`;
    }else{
        filteredItems.forEach(item => {
            const statusClass = item.status === 'Lost' ? 'status-lost' : 'status-found';
            
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="item-image" onclick="openImageModal('${item.image}')" title="Click to view full size">
                <div class="item-details">
                    <div class="item-header">
                        <span class="status-badge ${statusClass}">${item.status}</span>
                    </div>
                    <h3 class="item-title">${item.title}</h3>
                    <span class="category-tag">${item.category}</span>
                    <div class="item-meta">
                        <p>📍 ${item.location}</p>
                        <p>🗓️ ${item.date}</p>
                        <p>🕒 ${item.time}</p>
                    </div>
                    <button class="btn contact-btn" onclick="openContactModal('${item.title}')">Contact User</button>
                </div>
            `;
            itemsGrid.appendChild(card);
        });
    }
}