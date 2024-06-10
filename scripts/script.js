const iconsPerPage = 100;
let currentPage = 0;
let allIcons = [];
let currentFolder = '';
let iconData = {};

document.addEventListener('DOMContentLoaded', async () => {
    await fetchIconsData();
    const categories = Object.keys(iconData);
    populateCategorySelect(categories);
    let selectedCategory = getCategoryFromURL() || categories[Math.floor(Math.random() * categories.length)];
    showIcons(selectedCategory);

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            loadMoreIcons();
        }
    });
});

async function fetchIconsData() {
    const response = await fetch('icons/icons.json');
    iconData = await response.json();
}

function populateCategorySelect(categories) {
    const categorySelect = document.getElementById('category-select');
    categorySelect.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
}

function showIcons(folderName) {
    currentFolder = folderName;
    currentPage = 0;
    allIcons = iconData[folderName] || [];
    updateURLWithCategory(folderName);

    const iconGallery = document.getElementById('icon-gallery');
    const loader = document.getElementById('loader');
    const activeCategory = document.querySelector('.category.active');
    if (activeCategory) activeCategory.classList.remove('active');
    document.getElementById('category-select').value = folderName;

    loader.style.display = 'block';
    iconGallery.style.display = 'none';
    iconGallery.innerHTML = ''; // Clear previous icons

    if (allIcons.length > 0) {
        iconGallery.style.display = 'flex';
    }

    // Load all icons initially
    loadMoreIcons();

    loader.style.display = 'none';
}

function loadMoreIcons() {
    const iconGallery = document.getElementById('icon-gallery');
    const startIndex = currentPage * iconsPerPage;
    const endIndex = startIndex + iconsPerPage;
    const iconsToLoad = allIcons.slice(startIndex, endIndex);

    iconsToLoad.forEach(icon => {
        const iconName = icon.replace('.svg', '');
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('icon');

        const img = document.createElement('img');
        img.src = `icons/${currentFolder}/${icon}`;
        img.alt = iconName;
        img.addEventListener('click', () => openModal(img.src, iconName));
        iconDiv.appendChild(img);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('icon-buttons');

        const downloadButton = document.createElement('button');
        downloadButton.classList.add('icon-button', 'download');
        downloadButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M12 16L12 8" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13L11.913 15.913V15.913C11.961 15.961 12.039 15.961 12.087 15.913V15.913L15 13" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 15L3 16L3 19C3 20.1046 3.89543 21 5 21L19 21C20.1046 21 21 20.1046 21 19L21 16L21 15" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        downloadButton.onclick = () => downloadIcon(img.src);
        buttonsDiv.appendChild(downloadButton);

        const copyButton = document.createElement('button');
        copyButton.classList.add('icon-button', 'copy');
        copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke="#1C274C" stroke-width="1.5"/><path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="#1C274C" stroke-width="1.5"/></svg>';
        copyButton.onclick = () => copyIcon(img.src, copyButton);
        buttonsDiv.appendChild(copyButton);

        iconDiv.appendChild(buttonsDiv);
        iconGallery.appendChild(iconDiv);
    });

    currentPage++;
}

function downloadIcon(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    link.click();
}

async function copyIcon(url, button) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(text, 'image/svg+xml');
        const svgElement = svgDoc.getElementsByTagName('svg')[0];

        const scripts = svgElement.getElementsByTagName('script');
        for (let i = scripts.length - 1; i >= 0; i--) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }

        removeComments(svgElement);

        const serializer = new XMLSerializer();
        const cleanSVG = serializer.serializeToString(svgElement);

        await navigator.clipboard.writeText(cleanSVG);

        // Change button text to "Copied" and revert after 2 seconds
        const originalText = button.innerHTML;
        button.innerHTML = 'Copied';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    } catch (error) {
        console.error('Error copying icon:', error);
    }
}

function removeComments(node) {
    for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === 8) {
            node.removeChild(child);
            i--;
        } else if (child.nodeType === 1) {
            removeComments(child);
        }
    }
}

function searchIcons() {
    const query = document.getElementById('search-box').value.toLowerCase();
    const iconGallery = document.getElementById('icon-gallery');
    iconGallery.innerHTML = ''; // Clear previous icons

    const filteredIcons = allIcons.filter(icon => icon.toLowerCase().includes(query));

    filteredIcons.forEach(icon => {
        const iconName = icon.replace('.svg', '');
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('icon');

        const img = document.createElement('img');
        img.src = `icons/${currentFolder}/${icon}`;
        img.alt = iconName;
        img.addEventListener('click', () => openModal(img.src, iconName));
        iconDiv.appendChild(img);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('icon-buttons');

        const downloadButton = document.createElement('button');
        downloadButton.classList.add('icon-button', 'download');
        downloadButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M12 16L12 8" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13L11.913 15.913V15.913C11.961 15.961 12.039 15.961 12.087 15.913V15.913L15 13" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 15L3 16L3 19C3 20.1046 3.89543 21 5 21L19 21C20.1046 21 21 20.1046 21 19L21 16L21 15" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        downloadButton.onclick = () => downloadIcon(img.src);
        buttonsDiv.appendChild(downloadButton);

        const copyButton = document.createElement('button');
        copyButton.classList.add('icon-button', 'copy');
        copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke="#1C274C" stroke-width="1.5"/><path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="#1C274C" stroke-width="1.5"/></svg>';
        copyButton.onclick = () => copyIcon(img.src, copyButton);
        buttonsDiv.appendChild(copyButton);

        iconDiv.appendChild(buttonsDiv);
        iconGallery.appendChild(iconDiv);
    });
}

function updateURLWithCategory(category) {
    const url = new URL(window.location);
    url.searchParams.set('category', category);
    window.history.pushState({}, '', url);
}

function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('icon-modal');
    const closeButton = document.querySelector('.close-button');
    const copyButton = document.getElementById('modal-copy-button');
    const downloadButton = document.getElementById('modal-download-button');

    closeButton.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    copyButton.onclick = () => {
        const iconName = document.getElementById('modal-icon-name').textContent;
        navigator.clipboard.writeText(iconName).then(() => {
            console.log('Icon name copied to clipboard!');
        });
    };

    downloadButton.onclick = () => {
        const iconUrl = document.getElementById('modal-icon-container').querySelector('img').src;
        downloadIcon(iconUrl);
    };
});

function openModal(iconSrc, iconName) {
    const modal = document.getElementById('icon-modal');
    const modalIconContainer = document.getElementById('modal-icon-container');
    const modalIconName = document.getElementById('modal-icon-name');

    modalIconContainer.innerHTML = `<img src="${iconSrc}" alt="${iconName}" />`;
    modalIconName.textContent = iconName;
    modal.style.display = 'block';
}
