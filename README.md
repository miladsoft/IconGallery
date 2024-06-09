
# Icon Gallery

A web-based icon gallery that allows users to browse, search, and download icons. Icons are dynamically loaded based on categories and can be filtered via a search box.

## Features

- **Browse Icons**: View icons by category.
- **Search Icons**: Filter icons by name using the search box.
- **Download Icons**: Download individual icons.
- **Copy Icons**: Copy SVG code to clipboard.

## Getting Started

### Prerequisites

- A web browser (Chrome, Firefox, Safari, etc.)
- A local server for running the HTML file (optional but recommended for better performance)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/miladsoft/icongallery.git
    cd icongallery
    ```

2. (Optional) Serve the directory using a local server. You can use tools like `http-server` or `live-server`.

    ```sh
    npm install -g live-server
    live-server
    ```

3. Open `index.html` in your web browser if not using a local server.

### Directory Structure

```plaintext
.
├── icons/
│   └── [categories]/
│       └── [icon-files.svg]
├── scripts/
│   └── script.js
├── styles/
│   └── styles.css
├── index.html
└── README.md
```

### Usage

1. **Browse Icons**: Use the category dropdown to select a category of icons to view.
2. **Search Icons**: Type in the search box to filter icons by name.
3. **Download Icons**: Click the download button under each icon to download it.
4. **Copy Icons**: Click the copy button to copy the SVG code of an icon.

### Adding New Icons

1. Place the new icons in the appropriate category folder within the `icons` directory.
2. Update the `icons.json` file to include references to the new icons. The structure should match the existing format.

    ```json
    {
      "category1": [
        "icon1.svg",
        "icon2.svg"
      ],
      "category2": [
        "icon3.svg",
        "icon4.svg"
      ]
    }
    ```

### Customization

- **Styles**: Modify `styles/styles.css` to change the appearance of the gallery.
- **Scripts**: Update `scripts/script.js` to add or modify functionality.

### Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Acknowledgments

- Thanks to the creators of the icons used in this project.
- Inspiration from various icon gallery designs available online.

---

© 2024 Milad Raeisi. All rights reserved.

Feel free to customize the content further according to your specific needs and details about the project.
