const API_CONFIG = {
    bitcoin: {
        provider: "BlockCypher",
        baseUrl: "https://api.blockcypher.com/v1/btc/main",
        apiKey: null,
        endpoint: "/addrs/{address}?limit=10",
        coingeckoId: "bitcoin"
    },
    ethereum: {
        provider: "Etherscan",
        baseUrl: "https://api.etherscan.io",
        apiKey: "2SG5RUASRREBKCRS7EJ51MI168J1FAP4FN",
        endpoint: "/api?module=account&action=txlist&address={address}&sort=desc&page=1&offset=10&apikey={apiKey}",
        coingeckoId: "ethereum"
    },
    bnb: {
        provider: "BscScan",
        baseUrl: "https://api.bscscan.com",
        apiKey: "EJ9TNNRKE8GA9H2TW27WIJPVIMPW7CMVNV",
        endpoint: "/api?module=account&action=txlist&address={address}&sort=desc&page=1&offset=10&apikey={apiKey}",
        coingeckoId: "binancecoin"
    },
    ton: {
        provider: "TONCenter",
        baseUrl: "https://toncenter.com/api/v2",
        apiKey: "03f9a831bd14bfd65f61a47ac5abb923adfef36ac3f2cd2e59f561b704f06f2d",
        endpoint: "/getTransactions?address={address}&limit=10&api_key={apiKey}",
        coingeckoId: "the-open-network"
    },
    marketData: {
        provider: "CoinGecko",
        baseUrl: "https://api.coingecko.com/api/v3",
        endpoints: { prices: "/simple/price", market: "/coins/markets", search: "/search" },
        rateLimit: 10
    },
    economicCalendar: {
        provider: "PlaceholderAPI",
        baseUrl: "https://api.example.com/economic-calendar",
        apiKey: null,
        endpoint: "/events?date={date}¤cy={currency}"
    }
};

// Mock Economic Calendar Data (Fallback)
const economicEventsFallback = [
    {
        date: "2025-05-26",
        time: "08:30",
        currency: "USD",
        impact: "High",
        event: "Non-Farm Payrolls"
    },
    {
        date: "2025-05-27",
        time: "14:00",
        currency: "EUR",
        impact: "Medium",
        event: "ECB Interest Rate Decision"
    },
    {
        date: "2025-05-28",
        time: "10:00",
        currency: "GBP",
        impact: "Low",
        event: "Retail Sales"
    },
    {
        date: "2025-05-29",
        time: "09:00",
        currency: "JPY",
        impact: "High",
        event: "Bank of Japan Policy Rate"
    },
    {
        date: "2025-05-30",
        time: "11:00",
        currency: "AUD",
        impact: "Medium",
        event: "GDP Growth Rate"
    }
];

// Mock transaction data for testing
const mockTransactions = {
    bitcoin: [
        {
            hash: "mock1234567890abcdef",
            total: 100000000, // 1 BTC
            received: new Date().toISOString(),
            confirmations: 6
        }
    ],
    ethereum: [
        {
            hash: "0xmock1234567890abcdef",
            value: 1000000000000000000, // 1 ETH
            timeStamp: Math.floor(Date.now() / 1000),
            isError: "0"
        }
    ],
    bnb: [
        {
            hash: "0xmock1234567890abcdef",
            value: 1000000000000000000, // 1 BNB
            timeStamp: Math.floor(Date.now() / 1000),
            isError: "0"
        }
    ],
    ton: [
        {
            transaction_id: { hash: "mock1234567890abcdef" },
            in_msg: { value: 1000000000 }, // 1 TON
            utime: Math.floor(Date.now() / 1000),
            in_progress: false
        }
    ]
};

async function fetchCryptoPrice(cryptoId, vsCurrency = 'usd') {
    try {
        const response = await fetch(
            `${API_CONFIG.marketData.baseUrl}${API_CONFIG.marketData.endpoints.prices}?ids=${cryptoId}&vs_currencies=${vsCurrency}`,
            { signal: AbortSignal.timeout(5000) }
        );
        if (!response.ok) throw new Error(`CoinGecko API error: ${response.status}`);
        const data = await response.json();
        if (!data[cryptoId] || !data[cryptoId][vsCurrency]) throw new Error('Price data not available');
        return data[cryptoId][vsCurrency];
    } catch (error) {
        console.error(`Error fetching price for ${cryptoId}:`, error);
        return 0;
    }
}

async function fetchEconomicEvents(date, currency) {
    try {
        const config = API_CONFIG.economicCalendar;
        let url = `${config.baseUrl}${config.endpoint}`
            .replace('{date}', encodeURIComponent(date || ''))
            .replace('{currency}', encodeURIComponent(currency === 'all' ? '' : currency || ''));
        if (config.apiKey) {
            url += `&apiKey=${config.apiKey}`;
        }
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(5000)
        });
        if (!response.ok) throw new Error(`Economic Calendar API error: ${response.status}`);
        const data = await response.json();
        return data.events || [];
    } catch (error) {
        console.error('Error fetching economic events:', error);
        return economicEventsFallback.filter(event => {
            const dateMatch = !date || event.date === date;
            const currencyMatch = currency === 'all' || event.currency === currency;
            return dateMatch && currencyMatch;
        });
    }
}

function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
}

function updateLocalTime() {
    const greetingText = document.getElementById('greeting-text');
    const timeDateDisplay = document.getElementById('greeting-time-date');
    if (greetingText && timeDateDisplay) {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const timeString = now.toLocaleTimeString('en-US', timeOptions);
        const dateString = now.toLocaleDateString('en-US', dateOptions);
        
        greetingText.textContent = window.location.pathname.includes('technexus.html') ? 'Welcome to Tech Nexus' : `${getGreeting()}!, welcome to my portfolio!`;
        timeDateDisplay.textContent = `Current Time: ${timeString} | Date: ${dateString}`;
    }
}

function toggleMenu(isOpen) {
    document.body.classList.toggle('menu-open', isOpen);
}

function toggleDarkMode() {
    const body = document.body;
    const toggleIcons = document.querySelectorAll('#dark-mode-toggle');
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    toggleIcons.forEach(icon => {
        icon.className = isDarkMode ? 'bx bx-sun' : 'bx bx-moon';
    });
    localStorage.setItem('darkMode', isDarkMode);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function validateAddress(crypto, address) {
    if (!address) return false;
    try {
        if (crypto === 'bitcoin' && !/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address)) return false;
        if (crypto === 'ethereum' && !/^0x[a-fA-F0-9]{40}$/.test(address)) return false;
        if (crypto === 'bnb' && !/^0x[a-fA-F0-9]{40}$/.test(address)) return false;
        if (crypto === 'ton' && !/^[0-9A-Za-z\-_=]{48}$/.test(address)) return false;
        return true;
    } catch (e) {
        console.error(`Validation error for ${crypto} address:`, e);
        return false;
    }
}

async function fetchTransactions(walletAddress, crypto, retries = 3, delay = 1000) {
    if (!validateAddress(crypto, walletAddress)) {
        throw new Error('Invalid wallet address format');
    }
    if (!crypto || !API_CONFIG[crypto]) {
        throw new Error('Invalid cryptocurrency');
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const config = API_CONFIG[crypto];
            let url = `${config.baseUrl}${config.endpoint.replace('{address}', encodeURIComponent(walletAddress))}`;
            if (config.apiKey) {
                url = url.replace('{apiKey}', config.apiKey);
            }
            const options = { 
                method: 'GET', 
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    ...(config.apiKey && config.provider === 'TONCenter' ? { 'X-API-Key': config.apiKey } : {})
                }
            };

            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(5000)
            });

            if (response.status === 429) {
                console.warn(`Rate limit hit for ${crypto}, attempt ${attempt}/${retries}`);
                if (attempt === retries) throw new Error('Rate limit exceeded. Please try again later.');
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
                continue;
            }

            if (!response.ok) {
                const text = await response.text();
                console.error(`Explorer error for ${crypto}: Status ${response.status}, Response: ${text}`);
                throw new Error(`Failed to fetch transactions: ${response.status}`);
            }

            const data = await response.json();
            let transactions = [];

            if (crypto === 'bitcoin') {
                transactions = data.txs || [];
            } else if (crypto === 'ethereum' || crypto === 'bnb') {
                transactions = data.result || [];
            } else if (crypto === 'ton') {
                transactions = data.transactions || [];
            }

            if (!transactions || transactions.length === 0) {
                return { data: [], price: await fetchCryptoPrice(config.coingeckoId) };
            }

            return { data: transactions, price: await fetchCryptoPrice(config.coingeckoId) };
        } catch (error) {
            if (attempt === retries) {
                console.error(`Failed to fetch ${crypto} transactions after ${retries} attempts:`, error.message);
                return { data: mockTransactions[crypto] || [], price: await fetchCryptoPrice(API_CONFIG[crypto].coingeckoId) };
            }
        }
    }
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function formatAmount(amount, decimals = 6) {
    return parseFloat(amount).toFixed(decimals).replace(/\.?0+$/, '');
}

function renderTransactions({ data, price }, crypto, container) {
    container.innerHTML = '';
    let transactions = [];
    const seenTxIds = new Set();

    try {
        if (crypto === 'bitcoin') {
            transactions = (data || [])
                .filter(tx => {
                    if (seenTxIds.has(tx.hash)) return false;
                    seenTxIds.add(tx.hash);
                    return true;
                })
                .map(tx => ({
                    txId: tx.hash,
                    amount: tx.total ? tx.total / 1e8 : 'N/A',
                    amountUsd: tx.total && price ? (tx.total / 1e8 * price).toFixed(2) : 'N/A',
                    time: tx.received ? formatTimestamp(new Date(tx.received).getTime() / 1000) : 'Pending',
                    confirmations: tx.confirmations || '0',
                    txLink: `https://live.blockcypher.com/btc/tx/${tx.hash}`,
                    unit: 'BTC'
                }));
        } else if (crypto === 'ethereum') {
            transactions = (data || [])
                .filter(tx => {
                    if (seenTxIds.has(tx.hash)) return false;
                    seenTxIds.add(tx.hash);
                    return true;
                })
                .map(tx => ({
                    txId: tx.hash,
                    amount: tx.value ? tx.value / 1e18 : 'N/A',
                    amountUsd: tx.value && price ? (tx.value / 1e18 * price).toFixed(2) : 'N/A',
                    time: tx.timeStamp ? formatTimestamp(tx.timeStamp) : 'Pending',
                    confirmations: tx.isError === '0' ? 'Confirmed' : 'Failed',
                    txLink: `https://etherscan.io/tx/${tx.hash}`,
                    unit: 'ETH'
                }));
        } else if (crypto === 'bnb') {
            transactions = (data || [])
                .filter(tx => {
                    if (seenTxIds.has(tx.hash)) return false;
                    seenTxIds.add(tx.hash);
                    return true;
                })
                .map(tx => ({
                    txId: tx.hash,
                    amount: tx.value ? tx.value / 1e18 : 'N/A',
                    amountUsd: tx.value && price ? (tx.value / 1e18 * price).toFixed(2) : 'N/A',
                    time: tx.timeStamp ? formatTimestamp(tx.timeStamp) : 'Pending',
                    confirmations: tx.isError === '0' ? 'Confirmed' : 'Failed',
                    txLink: `https://bscscan.com/tx/${tx.hash}`,
                    unit: 'BNB'
                }));
        } else if (crypto === 'ton') {
            transactions = (data || [])
                .filter(tx => {
                    if (seenTxIds.has(tx.transaction_id.hash)) return false;
                    seenTxIds.add(tx.transaction_id.hash);
                    return true;
                })
                .map(tx => ({
                    txId: tx.transaction_id.hash,
                    amount: tx.in_msg?.value ? tx.in_msg.value / 1e9 : 'N/A',
                    amountUsd: tx.in_msg?.value && price ? (tx.in_msg.value / 1e9 * price).toFixed(2) : 'N/A',
                    time: tx.utime ? formatTimestamp(tx.utime) : 'Pending',
                    confirmations: tx.in_progress ? 'Pending' : 'Confirmed',
                    txLink: `https://tonviewer.com/transaction/${tx.transaction_id.hash}`,
                    unit: 'TON'
                }));
        }

        if (!transactions || transactions.length === 0) {
            container.innerHTML = '<p>No transactions found.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'transaction-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>TxID</th>
                    <th>Amount</th>
                    <th>Amount (USD)</th>
                    <th>Time and Date</th>
                    <th>Confirmations</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(tx => `
                    <tr>
                        <td><a href="${tx.txLink}" target="_blank">${tx.txId.slice(0, 8)}...</a></td>
                        <td>${tx.amount !== 'N/A' ? formatAmount(tx.amount) + ' ' + tx.unit : 'N/A'}</td>
                        <td>${tx.amountUsd !== 'N/A' ? '$' + formatAmount(tx.amountUsd, 2) : 'N/A'}</td>
                        <td>${tx.time}</td>
                        <td>${tx.confirmations}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        container.appendChild(table);
    } catch (error) {
        console.error(`Error rendering ${crypto} transactions:`, error);
        container.innerHTML = '<p>Error processing transaction data. Please check your API keys or try again later.</p>';
    }
}

function renderEconomicCalendar(events, container) {
    container.innerHTML = '';
    if (!events.length) {
        container.innerHTML = '<p>No events found for the selected criteria.</p>';
        return;
    }

    const tableBody = container.querySelector('#calendar-table-body') || container;
    tableBody.innerHTML = events.map(event => `
        <tr>
            <td>${event.date}</td>
            <td>${event.time}</td>
            <td>${event.currency}</td>
            <td class="impact-${event.impact.toLowerCase()}">${event.impact}</td>
            <td>${event.event}</td>
        </tr>
    `).join('');
}

function calculatePips(pair, entryPrice, stopLoss, takeProfit, lotSize, accountBalance, riskPercent, accountCurrency) {
    const pipDecimals = pair.includes("JPY") ? 2 : 4;
    const pipMultiplier = pair.includes("JPY") ? 100 : 10000;
    
    const stopLossPips = Math.abs(entryPrice - stopLoss) * pipMultiplier;
    const takeProfitPips = Math.abs(takeProfit - entryPrice) * pipMultiplier;
    
    const riskReward = takeProfitPips / (stopLossPips || 1);
    
    const pipValue = pair.includes("USD") ? 10 : 10 / 1.2;
    const pipValueInCurrency = accountCurrency === "USD" ? pipValue : pipValue * 0.85;
    
    const riskAmount = accountBalance * (riskPercent / 100);
    const positionSize = riskAmount / (stopLossPips * pipValueInCurrency);
    
    const profit = takeProfitPips * pipValueInCurrency * lotSize;
    const loss = stopLossPips * pipValueInCurrency * lotSize;

    return {
        stopLossPips: stopLossPips.toFixed(2),
        takeProfitPips: takeProfitPips.toFixed(2),
        riskReward: riskReward.toFixed(2),
        pipValue: pipValueInCurrency.toFixed(2),
        positionSize: positionSize.toFixed(2),
        profit: profit.toFixed(2),
        loss: loss.toFixed(2)
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion Functionality
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question i').className = 'bx bx-plus';
            });
            if (!isActive) {
                faqItem.classList.add('active');
                question.querySelector('i').className = 'bx bx-minus';
            }
        });
    });

    const nav = document.querySelector('nav');
    if (nav) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', debounce(() => {
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            const links = nav.querySelector('.links');
            if (!links?.classList.contains('active')) {
                if (currentScroll <= 0) {
                    nav.classList.remove('hidden');
                    lastScrollTop = currentScroll;
                    return;
                }
                if (currentScroll > lastScrollTop && currentScroll > 50 && !nav.classList.contains('hidden')) {
                    nav.classList.add('hidden');
                } else if (currentScroll < lastScrollTop && nav.classList.contains('hidden')) {
                    nav.classList.remove('hidden');
                }
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }, 100));
    }

    document.querySelectorAll('input, textarea').forEach(element => {
        element.addEventListener('touchstart', () => {
            element.focus();
        }, { passive: true });
        element.addEventListener('click', () => {
            element.focus();
        });
        element.addEventListener('focus', () => {
            element.style.position = 'relative';
            element.style.zIndex = '1000';
        });
        element.addEventListener('blur', () => {
            element.style.zIndex = '';
        });
    });

    function setupScrollAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const elements = document.querySelectorAll('.mobile-scroll, .slide-left, .slide-right, .scroll-reveal, #home .profile-img, .box, .blog-link');
    
        if (prefersReducedMotion) {
            elements.forEach(el => el.classList.add('visible'));
            return;
        }
    
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.1, // Adjusted for earlier trigger
            rootMargin: '0px 0px -10% 0px' // Adjusted for smoother mobile experience
        });
    
        window.updateObservers = debounce(() => {
            observer.disconnect();
            elements.forEach(el => observer.observe(el));
        }, 100);
    
        window.updateObservers();
    }

    setupScrollAnimations();

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.querySelectorAll('#dark-mode-toggle').forEach(icon => {
            icon.className = 'bx bx-sun';
        });
    }

    const greetingPopup = document.querySelector('#greetingPopup');
    const closePopup = document.querySelector('#closePopup');
    if (greetingPopup && closePopup) {
        setTimeout(() => {
            greetingPopup.classList.add('visible');
        }, 2000);
        closePopup.addEventListener('click', () => {
            greetingPopup.classList.remove('visible');
        });
        updateLocalTime();
        setInterval(updateLocalTime, 1000);
    }

    document.querySelectorAll('.mode-toggle').forEach(toggle => {
        toggle.addEventListener('click', toggleDarkMode);
    });

    const menuOpen = document.querySelector('#menu-open');
    const menuClose = document.querySelector('#menu-close');
    const navLinks = document.querySelector('.links');

    if (menuOpen && menuClose && navLinks && nav) {
        menuOpen.addEventListener('click', () => {
            navLinks.classList.add('active');
            menuOpen.style.display = 'none';
            menuClose.style.display = 'block';
            toggleMenu(true);
            nav.classList.remove('hidden');
        });

        menuClose.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuClose.style.display = 'none';
            menuOpen.style.display = 'block';
            toggleMenu(false);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                navLinks.classList.remove('active');
                menuClose.style.display = 'none';
                menuOpen.style.display = 'block';
                toggleMenu(false);

                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        const navHeight = nav.offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                }
            });
        });

        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 968) {
                navLinks.classList.remove('active');
                menuClose.style.display = 'none';
                menuOpen.style.display = 'block';
                toggleMenu(false);
            }
            window.updateObservers();
        }, 100));
    }

    const cryptoNewsContainer = document.getElementById('crypto-news-container');
    const tradingViewChart = document.getElementById('tradingview_chart');
    const walletAddressInput = document.getElementById('wallet-address');
    const cryptoSelect = document.getElementById('crypto-select');
    const trackBtn = document.getElementById('track-btn');
    const trackerResult = document.getElementById('tracker-result');
    const pipsPair = document.getElementById('pips-pair');
    const pipsAccountBalance = document.getElementById('pips-account-balance');
    const pipsRiskPercent = document.getElementById('pips-risk-percent');
    const pipsEntryPrice = document.getElementById('pips-entry-price');
    const pipsStopLoss = document.getElementById('pips-stop-loss');
    const pipsTakeProfit = document.getElementById('pips-take-profit');
    const pipsLotSize = document.getElementById('pips-lot-size');
    const pipsAccountCurrency = document.getElementById('pips-account-currency');
    const pipsCalculateBtn = document.getElementById('pips-calculate-btn');
    const pipsResult = document.getElementById('pips-result');
    const cryptoSearch = document.getElementById('crypto-search');
    const suggestionsList = document.getElementById('crypto-suggestions');
    const cryptoAmount = document.getElementById('crypto-amount');
    const currencySelect = document.getElementById('currency-select');
    const calculateBtn = document.getElementById('calculate-btn');
    const calculatorResult = document.getElementById('calculator-result');
    const calendarDate = document.getElementById('calendar-date');
    const calendarCurrency = document.getElementById('calendar-currency');
    const calendarResult = document.getElementById('calendar-result');

    // Chatbot Functionality
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotSendBtn = document.querySelector('.chatbot-send');
    if (chatbotInput && chatbotMessages && chatbotSendBtn) {
        // Mock web search function (no API required)
        async function fetchAIResponse(query) {
            // Simulate a web search with predefined responses
            const mockResponses = {
                'bitcoin price': 'The current price of Bitcoin is approximately $60,000 USD, based on recent market data.',
                'crypto news': 'Recent crypto news includes Bitcoin reaching a new all-time high and Ethereum upgrades improving transaction speeds.',
                'what is ui/ux': 'UI/UX refers to User Interface and User Experience design, focusing on creating intuitive and visually appealing digital products.',
                'web development': 'Web development involves building websites using HTML, CSS, and JavaScript. Popular frameworks include React, Angular, and Node.js.',
                'crypto calculator': 'A crypto calculator converts cryptocurrency amounts to fiat currencies like USD or EUR, using based on current market prices.',
                default: 'Sorry, I don’t have specific information on that topic. Try asking about crypto, UI/UX, or web development!'
            };

            // Normalize query for lookup
            const queryLower = query.toLowerCase().trim();
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(mockResponses[queryLower] || mockResponses.default);
                }, 1000); // Simulate network delay
            });
        }

        // Function to add a message to the chat
        function addMessage(content, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
            messageDiv.textContent = content;
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll to latest message
        }

        // Handle sending a message
        async function handleChatbotInput() {
            const query = chatbotInput.value.trim();
            if (!query) return;

            // Add user message
            addMessage(query, true);
            chatbotInput.value = ''; // Clear input

            // Add loading message
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message bot-message';
            loadingDiv.textContent = 'Thinking...';
            chatbotMessages.appendChild(loadingDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            try {
                // Fetch AI response
                const response = await fetchAIResponse(query);
                // Remove loading message
                loadingDiv.remove();
                // Add AI response
                addMessage(response);
            } catch (error) {
                console.error('Error fetching AI response:', error);
                loadingDiv.remove();
                addMessage('Sorry, something went wrong. Please try again later.');
            }
        }

        // Event listeners for send button and Enter key
        chatbotSendBtn.addEventListener('click', handleChatbotInput);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatbotInput();
        });
    }

    if (cryptoNewsContainer) {
        const fallbackData = [
            { title: "Bitcoin Hits Record High", url: "https://example.com/bitcoin-news", image: "https://via.placeholder.com/300x200?text=Bitcoin+News" },
            { title: "Global Markets Rally", url: "https://example.com/market-news", image: "https://via.placeholder.com/300x200?text=Market+News" },
            { title: "Tech Stocks Surge", url: "https://example.com/tech-news", image: "https://via.placeholder.com/300x200?text=Tech+News" }
        ];

        function renderItems(items, container) {
            container.innerHTML = '';
            items.slice(0, 6).forEach(item => {
                const imageUrl = item.image || 'https://via.placeholder.com/300x200?text=News';
                const newsItem = document.createElement('a');
                newsItem.href = item.url;
                newsItem.className = 'blog-link';
                newsItem.target = '_blank';
                newsItem.rel = 'noopener noreferrer';
                newsItem.innerHTML = `
                    <div class="box">
                        <h1><span>${item.title || 'No Title'}</span></h1>
                        <img src="${imageUrl}" alt="${item.title || 'News Item'}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=News';">
                        <span class="view-site">Read More <i class='bx bx-right-arrow-alt'></i></span>
                    </div>
                `;
                container.appendChild(newsItem);
            });
            container.classList.add('loaded');
            setTimeout(() => container.classList.remove('loaded'), 0);
            window.updateObservers();
        }

        async function fetchNewsData() {
            let newsItems = [];
            const seenTitles = new Set();
            const apiKey = '301671e3c0fd431bbaf3749bab72edf2';
            const categories = ['business', 'technology'];
            const maxPerCategory = 5;

            for (const category of categories) {
                try {
                    const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&language=en&apiKey=${apiKey}`, {
                        headers: { 'Accept': 'application/json' },
                        signal: AbortSignal.timeout(5000)
                    });
                    if (!response.ok) throw new Error(`NewsAPI error: ${response.status}`);
                    const data = await response.json();
                    const articles = (data.articles || [])
                        .filter(article => !seenTitles.has(article.title) && article.url && article.title)
                        .slice(0, maxPerCategory)
                        .map(article => {
                            seenTitles.add(article.title);
                            return {
                                title: article.title,
                                url: article.url,
                                image: article.urlToImage || `https://via.placeholder.com/300x200?text=${category.charAt(0).toUpperCase() + category.slice(1)}`
                            };
                        });
                    newsItems = [...newsItems, ...articles];
                } catch (error) {
                    console.error(`Error fetching ${category} news:`, error);
                }
            }

            if (newsItems.length < 6) {
                const fallback = fallbackData
                    .filter(item => !seenTitles.has(item.title))
                    .slice(0, 6 - newsItems.length);
                newsItems = [...newsItems, ...fallback];
            }

            renderItems(newsItems.slice(0, 6), cryptoNewsContainer);
        }

        fetchNewsData().catch(() => renderItems(fallbackData.slice(0, 6), cryptoNewsContainer));

        const refreshLink = document.getElementById('news-refresh');
        if (refreshLink) {
            refreshLink.addEventListener('click', (e) => {
                e.preventDefault();
                fetchNewsData();
            });
        }
    }

    if (tradingViewChart) {
        function initTradingViewChart() {
            const isMobile = window.innerWidth <= 768;
            new TradingView.widget({
                "width": "100%",
                "height": isMobile ? 450 : 650,
                "symbol": "BINANCE:BTCUSDT",
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "hotlist": true,
                "calendar": true,
                "container_id": "tradingview_chart"
            });
        }

        if (!window.TradingView) {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;
            script.onload = () => setTimeout(initTradingViewChart, 0);
            script.onerror = () => console.error('Failed to load TradingView script');
            document.head.appendChild(script);
        } else {
            setTimeout(initTradingViewChart, 100);
        }
    }

    // Crypto Calculator Functionality
    if (cryptoSearch && suggestionsList && cryptoAmount && currencySelect && calculateBtn && calculatorResult) {
        let cryptoList = [];
        let selectedCrypto = null;
        const popularCryptos = ['bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin', 'ripple', 'dogecoin', 'polkadot', 'avalanche-2', 'chainlink'];

        async function fetchCryptoList() {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/list', { signal: AbortSignal.timeout(5000) });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                cryptoList = await response.json();
            } catch (error) {
                console.error('Error fetching crypto list:', error);
                calculatorResult.innerHTML = '<span>Error loading cryptocurrency list. Please try again later.</span>';
                calculatorResult.classList.add('error');
            }
        }

        function formatNumber(number, decimals = 2) {
            return number.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        const showSuggestions = debounce((query) => {
            suggestionsList.innerHTML = '';
            suggestionsList.style.display = 'none';
            if (!query) return;

            const queryLower = query.toLowerCase().trim();
            const scoredCryptos = cryptoList
                .map(coin => {
                    const nameLower = coin.name.toLowerCase();
                    const symbolLower = coin.symbol.toLowerCase();
                    let score = 0;
                    if (nameLower === queryLower || symbolLower === queryLower) score += 100;
                    if (nameLower.startsWith(queryLower) || symbolLower.startsWith(queryLower) || popularCryptos.includes(coin.id)) score += 50;
                    if (nameLower.includes(queryLower) || symbolLower.includes(queryLower)) score += 20;
                    return { coin, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score || a.coin.name.localeCompare(b.coin.name))
                .slice(0, 5);

            if (scoredCryptos.length === 0) {
                suggestionsList.innerHTML = '<li>No matching cryptocurrencies found.</li>';
                suggestionsList.style.display = 'block';
                return;
            }

            scoredCryptos.forEach(({ coin }) => {
                const li = document.createElement('li');
                li.textContent = `${coin.name} (${coin.symbol.toUpperCase()})`;
                li.dataset.id = coin.id;
                li.dataset.symbol = coin.symbol.toUpperCase();
                li.addEventListener('click', () => {
                    cryptoSearch.value = `${coin.name} (${coin.symbol.toUpperCase()})`;
                    selectedCrypto = { id: coin.id, symbol: coin.symbol.toUpperCase(), name: coin.name };
                    suggestionsList.innerHTML = '';
                    suggestionsList.style.display = 'none';
                });
                suggestionsList.appendChild(li);
            });

            suggestionsList.style.display = 'block';
        }, 500);

        async function calculateConversion() {
            const amount = parseFloat(cryptoAmount.value);
            const currency = currencySelect.value.toLowerCase();
            calculatorResult.innerHTML = '';
            calculatorResult.classList.remove('error');

            if (!selectedCrypto) {
                calculatorResult.innerHTML = '<span>Please select a valid cryptocurrency.</span>';
                calculatorResult.classList.add('error');
                return;
            }
            if (isNaN(amount) || amount <= 0) {
                calculatorResult.innerHTML = '<span>Please enter a valid amount.</span>';
                calculatorResult.classList.add('error');
                return;
            }

            try {
                calculatorResult.innerHTML = '<p>Loading...</p>';
                const price = await fetchCryptoPrice(selectedCrypto.id, currency);
                const convertedValue = amount * price;
                calculatorResult.innerHTML = `<span>${formatNumber(amount, 8)} ${selectedCrypto.symbol} = ${formatNumber(convertedValue, 2)} ${currency.toUpperCase()}</span>`;
            } catch (error) {
                console.error('Error fetching crypto price:', error);
                calculatorResult.innerHTML = '<p>Error fetching price data. Please try again later.</p>';
                calculatorResult.classList.add('error');
            }
        }

        fetchCryptoList();

        cryptoSearch.addEventListener('input', (e) => {
            selectedCrypto = null;
            showSuggestions(e.target.value);
        });

        cryptoSearch.addEventListener('blur', () => {
            setTimeout(() => { suggestionsList.style.display = 'none'; }, 200);
        });

        cryptoSearch.addEventListener('focus', () => {
            if (cryptoSearch.value) showSuggestions(cryptoSearch.value);
        });

        cryptoSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && selectedCrypto) calculateConversion();
        });

        calculateBtn.addEventListener('click', calculateConversion);
        cryptoAmount.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && selectedCrypto) calculateConversion();
        });
    }

    if (walletAddressInput && cryptoSelect && trackBtn && trackerResult) {
        async function trackTransactions() {
            const walletAddress = walletAddressInput.value.trim();
            const crypto = cryptoSelect.value;
            trackerResult.innerHTML = '<p>Loading transactions...</p>';

            try {
                const transactions = await fetchTransactions(walletAddress, crypto);
                renderTransactions(transactions, crypto, trackerResult);
            } catch (error) {
                console.error('Error tracking transactions:', error);
                trackerResult.innerHTML = `<p>Error: ${error.message}. Please ensure your wallet address is valid.</p>`;
            }
        }

        trackBtn.addEventListener('click', trackTransactions);
        walletAddressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') trackTransactions();
        });
    }

    if (pipsCalculateBtn && pipsResult) {
        pipsCalculateBtn.addEventListener('click', () => {
            const pair = pipsPair.value;
            const accountBalance = parseFloat(pipsAccountBalance.value);
            const riskPercent = parseFloat(pipsRiskPercent.value);
            const entryPrice = parseFloat(pipsEntryPrice.value);
            const stopLoss = parseFloat(pipsStopLoss.value);
            const takeProfit = parseFloat(pipsTakeProfit.value);
            const lotSize = parseFloat(pipsLotSize.value);
            const accountCurrency = pipsAccountCurrency.value;

            if (!pair || isNaN(accountBalance) || isNaN(riskPercent) || isNaN(entryPrice) || isNaN(stopLoss) || isNaN(takeProfit) || isNaN(lotSize) || !accountCurrency) {
                pipsResult.classList.add('error');
                pipsResult.innerHTML = '<span>Please fill in all fields with valid numbers.</span>';
                return;
            }

            try {
                const results = calculatePips(pair, entryPrice, stopLoss, takeProfit, lotSize, accountBalance, riskPercent, accountCurrency);
                pipsResult.classList.remove('error');
                pipsResult.innerHTML = `
                    <p><span>Stop-Loss Pips: ${results.stopLossPips}</span></p>
                    <p><span>Take-Profit Pips: ${results.takeProfitPips}</span></p>
                    <p><span>Risk-Reward Ratio: ${results.riskReward}</span></p>
                    <p><span>Pip Value (${accountCurrency}): ${results.pipValue}</span></p>
                    <p><span>Position Size (Lots): ${results.positionSize}</span></p>
                    <p><span>Potential Profit (${accountCurrency}): ${results.profit}</span></p>
                    <p><span>Potential Loss (${accountCurrency}): ${results.loss}</span></p>
                `;
            } catch (error) {
                pipsResult.classList.add('error');
                pipsResult.innerHTML = `<span>Error: ${error.message}</span>`;
            }
        });
    }

    if (calendarDate && calendarCurrency && calendarResult) {
        async function filterEvents() {
            const selectedDate = calendarDate.value;
            const selectedCurrency = calendarCurrency.value;

            calendarResult.innerHTML = '<p>Loading economic events...</p>';
            const events = await fetchEconomicEvents(selectedDate, selectedCurrency);
            renderEconomicCalendar(events, calendarResult);
        }

        calendarDate.addEventListener('change', filterEvents);
        calendarCurrency.addEventListener('change', filterEvents);

        // Initial load
        filterEvents();
    }

    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const textarea = contactForm.querySelector('textarea');
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            try {
                const response = await fetch('https://formspree.io/f/movdqpoe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(formObject),
                    signal: AbortSignal.timeout(5000)
                });

                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error || 'Failed to send message. Please try again.'}`);
                }
            } catch (error) {
                alert('An error occurred while sending the message. Please try again later.');
                console.error('Form submission error:', error);
            }
            if (textarea) textarea.focus();
        });
    }

    window.addEventListener('load', () => {
        window.dispatchEvent(new Event('resize'));
    });
});