const iconsPerPage = 20;
let currentPage = 0;
let allIcons = [];
let currentFolder = '';
let iconData = {};

document.addEventListener('DOMContentLoaded', async () => {
    await fetchIconsData();
    const categories = Object.keys(iconData);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    showIcons(randomCategory);

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

function showIcons(folderName) {
    currentFolder = folderName;
    currentPage = 0;
    allIcons = iconData[folderName] || [];

    const iconGallery = document.getElementById('icon-gallery');
    const loader = document.getElementById('loader');
    const activeCategory = document.querySelector('.category.active');
    if (activeCategory) activeCategory.classList.remove('active');
    document.getElementById(folderName).classList.add('active');

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
        iconDiv.appendChild(img);
        
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('icon-name');
        nameDiv.textContent = iconName;
        iconDiv.appendChild(nameDiv);
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('icon-buttons');
        
        const downloadButton = document.createElement('button');
        downloadButton.classList.add('icon-button', 'download');
        downloadButton.textContent = 'Download';
        downloadButton.onclick = () => downloadIcon(img.src);
        buttonsDiv.appendChild(downloadButton);
        
        const copyButton = document.createElement('button');
        copyButton.classList.add('icon-button', 'copy');
        copyButton.textContent = 'Copy';
        copyButton.onclick = () => copyIcon(img.src);
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

async function copyIcon(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        await navigator.clipboard.writeText(text);
        alert('SVG content copied to clipboard');
    } catch (error) {
        console.error('Error copying icon:', error);
        alert('Failed to copy SVG content');
    }
}

function searchIcons() {
    const query = document.getElementById('search-box').value.toLowerCase();
    const icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
        const iconName = icon.querySelector('.icon-name').textContent.toLowerCase();
        if (iconName.includes(query)) {
            icon.style.display = 'block';
        } else {
            icon.style.display = 'none';
        }
    });
}
