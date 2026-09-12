# 💱 Currency Converter

A modern, responsive **Currency Converter Web Application** built using **HTML, CSS, and Vanilla JavaScript**.
The application fetches live exchange rates from an external API and allows users to convert amounts between multiple currencies.

## 🚀 Features

* 💰 Convert currencies using live exchange rates
* 🌍 Supports a large list of international currencies
* 🔄 Swap "From" and "To" currencies instantly
* 🚩 Displays country flags for selected currencies
* ⚡ Fetches exchange rates from an external API
* 🛡️ Multiple fallback mechanisms when the primary API fails
* 📱 Fully responsive design for desktop, tablet, and mobile
* 🎨 Modern glassmorphism-style UI
* ⏱️ Displays exchange-rate update information
* 🔢 Supports decimal and custom amount input
* ⚡ Auto conversion when currency selection or amount changes

## 🛠️ Technologies Used

* **HTML5** – Application structure
* **CSS3** – Styling, animations and responsive design
* **JavaScript (ES6+)** – Application logic and API integration
* **Currency API** – Live exchange rates
* **Flags API** – Currency/country flag images
* **Font Awesome** – Icons
* **Google Fonts (Inter)** – Typography

## 📁 Project Structure

```text
currancyCNV/
│
├── index.html       # Main application interface
├── style.css        # UI styling and responsive design
├── script.js        # Currency conversion logic and API handling
└── README.md        # Project documentation
```

## ⚙️ How It Works

1. User enters the amount to convert.
2. User selects the source currency.
3. User selects the target currency.
4. JavaScript requests the latest exchange rates from the currency API.
5. The application calculates the converted amount.
6. The result and current exchange rate are displayed on the screen.

### Conversion Formula

```text
Converted Amount = Amount × Exchange Rate
```

For example:

```text
100 USD × USD-to-INR rate = INR amount
```

## 🌐 API Integration

The application primarily uses the **Fawaz Ahmed Currency API** for exchange rates.

Primary API:

```text
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api
```

The application also uses a fallback API if the primary API request fails:

```text
https://api.exchangerate-api.com/
```

For currency flags, the application uses:

```text
https://flagsapi.com/
```

## 🛡️ Fallback Mechanism

The application has multiple levels of protection against API failure:

```text
Primary Currency API
        ↓
Fallback Exchange Rate API
        ↓
Previously fetched rates
        ↓
Hardcoded fallback rates
```

This allows the converter to remain functional even when an external API is temporarily unavailable.

## 💻 Running the Project

No backend or database is required.

### Option 1 — Open Directly

Simply open:

```text
index.html
```

in a modern web browser.

### Option 2 — Using VS Code Live Server

1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

## 📱 Responsive Design

The application is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

CSS media queries are used to adjust the layout and component sizes for smaller screens.

## 🎨 UI Highlights

The interface includes:

* Glassmorphism card design
* Dark gradient background
* Animated background elements
* Currency flag badges
* Animated swap button
* Interactive input fields
* Loading state while fetching rates
* Responsive mobile layout
* Hover and focus animations

## 🔄 Currency Swap

The swap button exchanges the selected currencies:

```text
USD → INR
```

becomes:

```text
INR → USD
```

The application then fetches the appropriate rates and updates the conversion.

## 📌 Project Type

**Frontend Web Application**

This project is useful for demonstrating:

* JavaScript DOM manipulation
* REST API integration
* Asynchronous JavaScript
* `fetch()` and JSON handling
* Error handling
* Responsive web design
* Dynamic UI updates

## 🔮 Future Improvements

Possible improvements include:

* Add conversion history
* Add currency search
* Add dark/light theme toggle
* Add historical exchange-rate charts
* Add favorite currencies
* Add offline support using local storage
* Add PWA support
* Add more detailed API error messages

## 👨‍💻 Author

**Razak**

---

⭐ If you find this project useful, consider giving the repository a star.
