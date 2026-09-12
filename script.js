// ─── DOM REFS ──────────────────────────────────────────────
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const fromCurrencyDisplay = document.getElementById('fromCurrencyDisplay');
const fromFlagImg = document.getElementById('fromFlag');
const swapButton = document.getElementById('swapButton');
const convertBtn = document.getElementById('convertBtn');
const resultText = document.getElementById('resultText');
const rateInfo = document.getElementById('rateInfo');

// ─── STATE ──────────────────────────────────────────────────
let exchangeRates = {};
let lastFetchDate = '';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours (since rates update daily)

// ─── API CONFIGURATION ────────────────────────────────────
const API_CONFIG = {
    // Currency Rate API (fawazahmed0 - Free & Open Source)
    rateApi: {
        baseUrl: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api',
        version: 'v1',
        // Format: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-01-15/v1/currencies/usd.json
        // Or latest: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json
        useLatest: true, // Set to false to use specific date
        timeout: 10000 // 10 seconds
    },
    // Flag API
    flagApi: {
        baseUrl: 'https://flagsapi.com',
        style: 'flat',
        size: 64
    }
};

// ─── COMPREHENSIVE CURRENCY TO COUNTRY MAPPING ────────────
const currencyToCountry = {
    'USD': 'US', 'EUR': 'EU', 'GBP': 'GB', 'JPY': 'JP', 'CHF': 'CH',
    'CAD': 'CA', 'AUD': 'AU', 'NZD': 'NZ', 'CNY': 'CN', 'INR': 'IN',
    'BRL': 'BR', 'ZAR': 'ZA', 'RUB': 'RU', 'KRW': 'KR', 'SGD': 'SG',
    'HKD': 'HK', 'MXN': 'MX', 'TRY': 'TR', 'SEK': 'SE', 'NOK': 'NO',
    'DKK': 'DK', 'PLN': 'PL', 'CZK': 'CZ', 'HUF': 'HU', 'ILS': 'IL',
    'AED': 'AE', 'SAR': 'SA', 'KWD': 'KW', 'QAR': 'QA', 'OMR': 'OM',
    'BHD': 'BH', 'EGP': 'EG', 'NGN': 'NG', 'KES': 'KE', 'TZS': 'TZ',
    'UGX': 'UG', 'ZMW': 'ZM', 'GHS': 'GH', 'MAD': 'MA', 'DZD': 'DZ',
    'TND': 'TN', 'PKR': 'PK', 'BDT': 'BD', 'LKR': 'LK', 'NPR': 'NP',
    'AFN': 'AF', 'IRR': 'IR', 'IQD': 'IQ', 'JOD': 'JO', 'LBP': 'LB',
    'THB': 'TH', 'MYR': 'MY', 'IDR': 'ID', 'PHP': 'PH', 'VND': 'VN',
    'TWD': 'TW', 'ARS': 'AR', 'CLP': 'CL', 'COP': 'CO', 'PEN': 'PE',
    'VEF': 'VE', 'UYU': 'UY', 'PYG': 'PY', 'BOB': 'BO', 'CRC': 'CR',
    'NIO': 'NI', 'GTQ': 'GT', 'HNL': 'HN', 'DOP': 'DO', 'JMD': 'JM',
    'TTD': 'TT', 'BBD': 'BB', 'BSD': 'BS', 'BMD': 'BM', 'KYD': 'KY',
    'ANG': 'AN', 'AWG': 'AW', 'XCD': 'AG', 'FKP': 'FK', 'GIP': 'GI',
    'SHP': 'SH', 'ALL': 'AL', 'MKD': 'MK', 'BAM': 'BA', 'RSD': 'RS',
    'HRK': 'HR', 'MDL': 'MD', 'RON': 'RO', 'BGN': 'BG', 'GEL': 'GE',
    'AMD': 'AM', 'AZN': 'AZ', 'KZT': 'KZ', 'UZS': 'UZ', 'TJS': 'TJ',
    'KGS': 'KG', 'TMT': 'TM', 'BYN': 'BY', 'UAH': 'UA', 'CUC': 'CU',
    'HTG': 'HT', 'SVC': 'SV', 'BZD': 'BZ', 'BND': 'BN', 'MMK': 'MM',
    'SCR': 'SC', 'MUR': 'MU', 'MGA': 'MG', 'CVE': 'CV', 'GNF': 'GN',
    'MRU': 'MR', 'SZL': 'SZ', 'LSL': 'LS'
};

// ─── COMPREHENSIVE CURRENCY LIST ──────────────────────────
const allCurrencies = [
    { code: 'USD', name: 'US Dollar', country: 'US' },
    { code: 'EUR', name: 'Euro', country: 'EU' },
    { code: 'GBP', name: 'British Pound', country: 'GB' },
    { code: 'JPY', name: 'Japanese Yen', country: 'JP' },
    { code: 'CHF', name: 'Swiss Franc', country: 'CH' },
    { code: 'CAD', name: 'Canadian Dollar', country: 'CA' },
    { code: 'AUD', name: 'Australian Dollar', country: 'AU' },
    { code: 'NZD', name: 'New Zealand Dollar', country: 'NZ' },
    { code: 'CNY', name: 'Chinese Yuan', country: 'CN' },
    { code: 'INR', name: 'Indian Rupee', country: 'IN' },
    { code: 'BRL', name: 'Brazilian Real', country: 'BR' },
    { code: 'ZAR', name: 'South African Rand', country: 'ZA' },
    { code: 'RUB', name: 'Russian Ruble', country: 'RU' },
    { code: 'KRW', name: 'South Korean Won', country: 'KR' },
    { code: 'SGD', name: 'Singapore Dollar', country: 'SG' },
    { code: 'HKD', name: 'Hong Kong Dollar', country: 'HK' },
    { code: 'MXN', name: 'Mexican Peso', country: 'MX' },
    { code: 'TRY', name: 'Turkish Lira', country: 'TR' },
    { code: 'SEK', name: 'Swedish Krona', country: 'SE' },
    { code: 'NOK', name: 'Norwegian Krone', country: 'NO' },
    { code: 'DKK', name: 'Danish Krone', country: 'DK' },
    { code: 'PLN', name: 'Polish Zloty', country: 'PL' },
    { code: 'CZK', name: 'Czech Koruna', country: 'CZ' },
    { code: 'HUF', name: 'Hungarian Forint', country: 'HU' },
    { code: 'ILS', name: 'Israeli Shekel', country: 'IL' },
    { code: 'AED', name: 'UAE Dirham', country: 'AE' },
    { code: 'SAR', name: 'Saudi Riyal', country: 'SA' },
    { code: 'KWD', name: 'Kuwaiti Dinar', country: 'KW' },
    { code: 'QAR', name: 'Qatari Riyal', country: 'QA' },
    { code: 'OMR', name: 'Omani Rial', country: 'OM' },
    { code: 'BHD', name: 'Bahraini Dinar', country: 'BH' },
    { code: 'EGP', name: 'Egyptian Pound', country: 'EG' },
    { code: 'NGN', name: 'Nigerian Naira', country: 'NG' },
    { code: 'KES', name: 'Kenyan Shilling', country: 'KE' },
    { code: 'TZS', name: 'Tanzanian Shilling', country: 'TZ' },
    { code: 'UGX', name: 'Ugandan Shilling', country: 'UG' },
    { code: 'ZMW', name: 'Zambian Kwacha', country: 'ZM' },
    { code: 'GHS', name: 'Ghanaian Cedi', country: 'GH' },
    { code: 'MAD', name: 'Moroccan Dirham', country: 'MA' },
    { code: 'DZD', name: 'Algerian Dinar', country: 'DZ' },
    { code: 'TND', name: 'Tunisian Dinar', country: 'TN' },
    { code: 'PKR', name: 'Pakistani Rupee', country: 'PK' },
    { code: 'BDT', name: 'Bangladeshi Taka', country: 'BD' },
    { code: 'LKR', name: 'Sri Lankan Rupee', country: 'LK' },
    { code: 'NPR', name: 'Nepalese Rupee', country: 'NP' },
    { code: 'AFN', name: 'Afghan Afghani', country: 'AF' },
    { code: 'IRR', name: 'Iranian Rial', country: 'IR' },
    { code: 'IQD', name: 'Iraqi Dinar', country: 'IQ' },
    { code: 'JOD', name: 'Jordanian Dinar', country: 'JO' },
    { code: 'LBP', name: 'Lebanese Pound', country: 'LB' },
    { code: 'THB', name: 'Thai Baht', country: 'TH' },
    { code: 'MYR', name: 'Malaysian Ringgit', country: 'MY' },
    { code: 'IDR', name: 'Indonesian Rupiah', country: 'ID' },
    { code: 'PHP', name: 'Philippine Peso', country: 'PH' },
    { code: 'VND', name: 'Vietnamese Dong', country: 'VN' },
    { code: 'TWD', name: 'Taiwan Dollar', country: 'TW' },
    { code: 'ARS', name: 'Argentine Peso', country: 'AR' },
    { code: 'CLP', name: 'Chilean Peso', country: 'CL' },
    { code: 'COP', name: 'Colombian Peso', country: 'CO' },
    { code: 'PEN', name: 'Peruvian Sol', country: 'PE' },
    { code: 'VEF', name: 'Venezuelan Bolívar', country: 'VE' },
    { code: 'UYU', name: 'Uruguayan Peso', country: 'UY' },
    { code: 'PYG', name: 'Paraguayan Guarani', country: 'PY' },
    { code: 'BOB', name: 'Bolivian Boliviano', country: 'BO' },
    { code: 'CRC', name: 'Costa Rican Colón', country: 'CR' },
    { code: 'NIO', name: 'Nicaraguan Córdoba', country: 'NI' },
    { code: 'GTQ', name: 'Guatemalan Quetzal', country: 'GT' },
    { code: 'HNL', name: 'Honduran Lempira', country: 'HN' },
    { code: 'DOP', name: 'Dominican Peso', country: 'DO' },
    { code: 'JMD', name: 'Jamaican Dollar', country: 'JM' },
    { code: 'TTD', name: 'Trinidad & Tobago Dollar', country: 'TT' },
    { code: 'BBD', name: 'Barbadian Dollar', country: 'BB' },
    { code: 'BSD', name: 'Bahamian Dollar', country: 'BS' },
    { code: 'BMD', name: 'Bermudian Dollar', country: 'BM' },
    { code: 'KYD', name: 'Cayman Islands Dollar', country: 'KY' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder', country: 'AN' },
    { code: 'AWG', name: 'Aruban Florin', country: 'AW' },
    { code: 'XCD', name: 'East Caribbean Dollar', country: 'AG' },
    { code: 'FKP', name: 'Falkland Islands Pound', country: 'FK' },
    { code: 'GIP', name: 'Gibraltar Pound', country: 'GI' },
    { code: 'SHP', name: 'Saint Helena Pound', country: 'SH' },
    { code: 'ALL', name: 'Albanian Lek', country: 'AL' },
    { code: 'MKD', name: 'Macedonian Denar', country: 'MK' },
    { code: 'BAM', name: 'Bosnian Convertible Mark', country: 'BA' },
    { code: 'RSD', name: 'Serbian Dinar', country: 'RS' },
    { code: 'HRK', name: 'Croatian Kuna', country: 'HR' },
    { code: 'MDL', name: 'Moldovan Leu', country: 'MD' },
    { code: 'RON', name: 'Romanian Leu', country: 'RO' },
    { code: 'BGN', name: 'Bulgarian Lev', country: 'BG' },
    { code: 'GEL', name: 'Georgian Lari', country: 'GE' },
    { code: 'AMD', name: 'Armenian Dram', country: 'AM' },
    { code: 'AZN', name: 'Azerbaijani Manat', country: 'AZ' },
    { code: 'KZT', name: 'Kazakhstani Tenge', country: 'KZ' },
    { code: 'UZS', name: 'Uzbekistani Som', country: 'UZ' },
    { code: 'TJS', name: 'Tajikistani Somoni', country: 'TJ' },
    { code: 'KGS', name: 'Kyrgyzstani Som', country: 'KG' },
    { code: 'TMT', name: 'Turkmenistani Manat', country: 'TM' },
    { code: 'BYN', name: 'Belarusian Ruble', country: 'BY' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', country: 'UA' },
    { code: 'CUC', name: 'Cuban Convertible Peso', country: 'CU' },
    { code: 'HTG', name: 'Haitian Gourde', country: 'HT' },
    { code: 'SVC', name: 'Salvadoran Colón', country: 'SV' },
    { code: 'BZD', name: 'Belize Dollar', country: 'BZ' },
    { code: 'BND', name: 'Brunei Dollar', country: 'BN' },
    { code: 'MMK', name: 'Myanmar Kyat', country: 'MM' },
    { code: 'SCR', name: 'Seychellois Rupee', country: 'SC' },
    { code: 'MUR', name: 'Mauritian Rupee', country: 'MU' },
    { code: 'MGA', name: 'Malagasy Ariary', country: 'MG' },
    { code: 'CVE', name: 'Cape Verdean Escudo', country: 'CV' },
    { code: 'GNF', name: 'Guinean Franc', country: 'GN' },
    { code: 'MRU', name: 'Mauritanian Ouguiya', country: 'MR' },
    { code: 'SZL', name: 'Swazi Lilangeni', country: 'SZ' },
    { code: 'LSL', name: 'Lesotho Loti', country: 'LS' }
];

// ─── FLAG API FUNCTION ─────────────────────────────────────
function getFlagUrl(countryCode, style = 'flat', size = 64) {
    return `https://flagsapi.com/${countryCode}/${style}/${size}.png`;
}

// ─── UPDATE FLAG DISPLAY ──────────────────────────────────
function updateFlag(currencyCode, imgElement) {
    const countryCode = currencyToCountry[currencyCode];
    if (countryCode) {
        const flagUrl = getFlagUrl(
            countryCode, 
            API_CONFIG.flagApi.style, 
            API_CONFIG.flagApi.size
        );
        imgElement.src = flagUrl;
        imgElement.alt = `${currencyCode} flag`;
        imgElement.style.display = 'inline-block';
        imgElement.onerror = function() {
            this.style.display = 'none';
        };
    } else {
        imgElement.style.display = 'none';
    }
}

// ─── UPDATE CURRENCY BADGE WITH FLAG ──────────────────────
function updateBadge() {
    const fromCurrency = fromCurrencySelect.value;
    updateFlag(fromCurrency, fromFlagImg);
    fromCurrencyDisplay.innerHTML = '';
    fromCurrencyDisplay.appendChild(fromFlagImg);
    fromCurrencyDisplay.appendChild(document.createTextNode(` ${fromCurrency}`));
}

// ─── POPULATE DROPDOWNS WITH ALL CURRENCIES ──────────────
function populateDropdowns() {
    const selects = [fromCurrencySelect, toCurrencySelect];
    
    selects.forEach(select => {
        select.innerHTML = '';
        const sortedCurrencies = [...allCurrencies].sort((a, b) => a.code.localeCompare(b.code));
        
        sortedCurrencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.code;
            option.textContent = `${currency.code} - ${currency.name}`;
            option.dataset.country = currency.country;
            select.appendChild(option);
        });
    });
}

// ─── UPDATE DROPDOWN OPTIONS WITH FLAGS ────────────────────
function updateDropdownFlags() {
    const selects = [fromCurrencySelect, toCurrencySelect];
    selects.forEach(select => {
        const options = select.options;
        for (let i = 0; i < options.length; i++) {
            const value = options[i].value;
            const countryCode = currencyToCountry[value];
            if (countryCode) {
                const flagUrl = getFlagUrl(countryCode, 'flat', 24);
                const text = options[i].textContent;
                options[i].innerHTML = `
                    <img src="${flagUrl}" alt="${value}" class="flag-icon" 
                         style="width:20px;height:14px;vertical-align:middle;border-radius:2px;border:1px solid rgba(255,255,255,0.1);margin-right:6px;" 
                         onerror="this.style.display='none'" /> 
                    ${text}
                `;
            }
        }
    });
}

// ─── CURRENCY RATE API FUNCTION (Using fawazahmed0 API) ──
async function fetchExchangeRates(baseCurrency = 'USD') {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Check cache - rates update daily, so we can cache for 24 hours
    if (exchangeRates.base === baseCurrency && exchangeRates.date === today) {
        return exchangeRates;
    }

    try {
        // Convert currency code to lowercase (API expects lowercase)
        const baseLower = baseCurrency.toLowerCase();
        
        // Build URL according to the new API format
        let url;
        if (API_CONFIG.rateApi.useLatest) {
            // Use latest rates
            url = `${API_CONFIG.rateApi.baseUrl}@latest/${API_CONFIG.rateApi.version}/currencies/${baseLower}.json`;
        } else {
            // Use specific date (you can modify this to use a specific date)
            const date = today; // or any specific date like '2024-01-15'
            url = `${API_CONFIG.rateApi.baseUrl}@${date}/${API_CONFIG.rateApi.version}/currencies/${baseLower}.json`;
        }
        
        console.log('Fetching rates from:', url);
        
        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.rateApi.timeout);
        
        const response = await fetch(url, { 
            signal: controller.signal,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // The new API format returns:
        // {
        //   "date": "2024-01-15",
        //   "usd": { "inr": 83.5, "eur": 0.85, ... }
        // }
        // OR for base currency:
        // {
        //   "date": "2024-01-15",
        //   "usd": { "inr": 83.5, "eur": 0.85, ... }
        // }
        
        // Extract rates from the response
        // The data[baseLower] contains all rates
        const rates = data[baseLower] || {};
        
        // Also add the base currency itself with rate 1
        rates[baseCurrency] = 1;
        
        // Convert keys back to uppercase for consistency
        const formattedRates = {};
        for (const [key, value] of Object.entries(rates)) {
            formattedRates[key.toUpperCase()] = value;
        }
        
        exchangeRates = {
            base: baseCurrency,
            rates: formattedRates,
            date: data.date || today,
            source: 'fawazahmed0-api'
        };
        
        return exchangeRates;
        
    } catch (error) {
        console.error('Error fetching rates from fawazahmed0 API:', error);
        
        // ─── FALLBACK MECHANISM ──────────────────────────
        // Try alternative API if primary fails
        try {
            console.log('Trying fallback API: exchangerate-api.com');
            const fallbackUrl = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
            const response = await fetch(fallbackUrl, {
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                exchangeRates = {
                    base: baseCurrency,
                    rates: data.rates,
                    date: today,
                    source: 'fallback-api'
                };
                return exchangeRates;
            }
        } catch (fallbackError) {
            console.error('Fallback API also failed:', fallbackError);
        }
        
        // Ultimate fallback: Use hardcoded rates
        if (exchangeRates.rates) {
            console.warn('Using stale exchange rates.');
            return exchangeRates;
        }
        
        console.warn('Using hardcoded fallback rates.');
        return getFallbackRates(baseCurrency);
    }
}

// ─── FALLBACK RATES (Hardcoded) ────────────────────────────
function getFallbackRates(base) {
    const fallback = {
        'USD': 1, 'EUR': 0.85, 'GBP': 0.75, 'JPY': 148.2, 'CHF': 0.88,
        'CAD': 1.36, 'AUD': 1.52, 'NZD': 1.65, 'CNY': 7.24, 'INR': 83.5,
        'BRL': 4.95, 'ZAR': 19.2, 'RUB': 92.5, 'KRW': 1320, 'SGD': 1.34,
        'HKD': 7.82, 'MXN': 17.2, 'TRY': 32.1, 'SEK': 10.5, 'NOK': 10.7,
        'DKK': 6.85, 'PLN': 4.02, 'CZK': 23.4, 'HUF': 361, 'ILS': 3.72,
        'AED': 3.67, 'SAR': 3.75, 'KWD': 0.307, 'QAR': 3.64, 'OMR': 0.385,
        'BHD': 0.377, 'EGP': 47.5, 'NGN': 1480, 'KES': 145, 'TZS': 2550,
        'UGX': 3800, 'ZMW': 25.8, 'GHS': 13.2, 'MAD': 9.95, 'DZD': 134,
        'TND': 3.12, 'PKR': 278, 'BDT': 109, 'LKR': 298, 'NPR': 133,
        'AFN': 71.5, 'IRR': 42000, 'IQD': 1310, 'JOD': 0.709, 'LBP': 89500,
        'THB': 36.2, 'MYR': 4.72, 'IDR': 15700, 'PHP': 56.8, 'VND': 25400,
        'TWD': 32.1, 'ARS': 865, 'CLP': 940, 'COP': 3920, 'PEN': 3.75,
        'VEF': 3615000, 'UYU': 38.5, 'PYG': 7480, 'BOB': 6.91, 'CRC': 521,
        'NIO': 36.8, 'GTQ': 7.78, 'HNL': 24.7, 'DOP': 58.5, 'JMD': 155,
        'TTD': 6.79, 'BBD': 2.0, 'BSD': 1.0, 'BMD': 1.0, 'KYD': 0.833,
        'ANG': 1.79, 'AWG': 1.80, 'XCD': 2.70, 'FKP': 0.75, 'GIP': 0.75,
        'SHP': 0.75, 'ALL': 95.5, 'MKD': 57.8, 'BAM': 1.84, 'RSD': 108,
        'HRK': 7.48, 'MDL': 17.7, 'RON': 4.97, 'BGN': 1.96, 'GEL': 2.68,
        'AMD': 386, 'AZN': 1.70, 'KZT': 448, 'UZS': 12600, 'TJS': 10.9,
        'KGS': 89.2, 'TMT': 3.50, 'BYN': 3.26, 'UAH': 38.8, 'CUC': 1.0,
        'HTG': 132, 'SVC': 8.75, 'BZD': 2.02, 'BND': 1.34, 'MMK': 2100,
        'SCR': 14.2, 'MUR': 45.8, 'MGA': 4480, 'CVE': 103, 'GNF': 8600,
        'MRU': 39.5, 'SZL': 19.2, 'LSL': 19.2
    };
    
    const baseRate = fallback[base] || 1;
    const rates = {};
    for (const [key, val] of Object.entries(fallback)) {
        rates[key] = val / baseRate;
    }
    return { base, rates, date: new Date().toISOString().split('T')[0], source: 'hardcoded-fallback' };
}

// ─── UPDATE UI WITH RATES ────────────────────────────────────
async function updateRatesAndConvert() {
    const from = fromCurrencySelect.value;
    const to = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value) || 0;

    // Show loading state
    resultText.textContent = 'Loading...';
    rateInfo.textContent = 'Fetching rates...';

    // Fetch rates
    const rateData = await fetchExchangeRates(from);
    const rates = rateData.rates;

    // Update badge with flag
    updateBadge();

    // Update rate info line
    const rate = rates[to] || 1;
    const sourceIndicator = rateData.source !== 'fawazahmed0-api' ? ` (${rateData.source})` : '';
    const dateInfo = rateData.date ? ` · ${rateData.date}` : '';
    rateInfo.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}${sourceIndicator}${dateInfo}`;

    // Perform conversion
    const converted = amount * rate;
    resultText.textContent = `${converted.toFixed(2)} ${to}`;

    window._lastConversion = { from, to, amount, converted };
}

// ─── CONVERT ────────────────────────────────────────────────
async function convertCurrency() {
    await updateRatesAndConvert();
}

// ─── SWAP CURRENCIES ─────────────────────────────────────────
function swapCurrencies() {
    const fromVal = fromCurrencySelect.value;
    const toVal = toCurrencySelect.value;

    fromCurrencySelect.value = toVal;
    toCurrencySelect.value = fromVal;

    updateBadge();
    updateRatesAndConvert();
}

// ─── AUTO-CONVERT ────────────────────────────────────────────
let debounceTimer = null;
function handleAutoConvert() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        updateRatesAndConvert();
    }, 350);
}

// ─── INIT ─────────────────────────────────────────────────────
async function init() {
    populateDropdowns();
    
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'INR';
    amountInput.value = 1;

    updateDropdownFlags();
    updateBadge();

    await updateRatesAndConvert();

    // ─── EVENT LISTENERS ──────────────────────────────────────
    convertBtn.addEventListener('click', convertCurrency);
    swapButton.addEventListener('click', swapCurrencies);

    fromCurrencySelect.addEventListener('change', () => {
        updateBadge();
        // Reset cache for new base currency
        exchangeRates = {};
        updateRatesAndConvert();
    });

    toCurrencySelect.addEventListener('change', () => {
        updateRatesAndConvert();
    });

    amountInput.addEventListener('input', handleAutoConvert);

    amountInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clearTimeout(debounceTimer);
            updateRatesAndConvert();
        }
    });

    resultText.parentElement.addEventListener('click', () => {
        updateRatesAndConvert();
    });
}

// ─── START ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);