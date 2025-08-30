// Enhanced Portfolio AI Chatbot Assistant
// Floating, responsive, animated chatbot with navigation and project assistance

class PortfolioChatbot {
    constructor() {
        this.isOpen = false;
        this.isInitialized = false;
        this.messages = [];
        this.isTyping = false;
        this.currentContext = 'general';
        this.userPreferences = this.loadPreferences();
        
        // Enhanced knowledge base with more comprehensive responses
        this.knowledgeBase = {
            navigation: {
                keywords: ['navigate', 'go to', 'show me', 'take me', 'section', 'page', 'where'],
                responses: {
                    'projects': {
                        text: "I'll take you to the projects section where you can see all the amazing work!",
                        action: () => this.navigateToSection('projects')
                    },
                    'contact': {
                        text: "Let me show you how to get in touch!",
                        action: () => this.navigateToSection('contact')
                    },
                    'about': {
                        text: "Here's where you can learn more about the developer!",
                        action: () => this.navigateToSection('about')
                    },
                    'home': {
                        text: "Taking you back to the homepage!",
                        action: () => this.navigateToSection('home')
                    },
                    'skills': {
                        text: "Check out the technical skills and expertise!",
                        action: () => this.navigateToSection('skills')
                    }
                }
            },
            projects: {
                keywords: ['project', 'work', 'portfolio', 'development', 'website', 'app', 'application'],
                responses: {
                    'types': "I specialize in various types of projects including:\n\n🌐 **Web Applications** - Full-stack web development\n📱 **Mobile Apps** - iOS and Android applications\n🎨 **UI/UX Design** - User interface and experience design\n⚡ **Performance Optimization** - Speed and efficiency improvements\n🔧 **Custom Solutions** - Tailored development for specific needs",
                    'technologies': "The tech stack includes:\n\n**Frontend:** React, Vue.js, HTML5, CSS3, JavaScript (ES6+)\n**Backend:** Node.js, Python, PHP, Express.js\n**Database:** MongoDB, MySQL, PostgreSQL\n**Tools:** Git, Docker, AWS, Firebase\n**Design:** Figma, Adobe Creative Suite",
                    'examples': "Here are some featured projects:\n\n🚀 **E-commerce Platform** - Full-stack online store\n📊 **Analytics Dashboard** - Data visualization tool\n🎮 **Interactive Game** - Browser-based entertainment\n📱 **Mobile App** - Cross-platform application\n\nWould you like to see the projects section?"
                }
            },
            delivery: {
                keywords: ['delivery', 'timeline', 'time', 'how long', 'duration', 'deadline', 'when'],
                responses: {
                    'general': "Project delivery times vary based on complexity:\n\n⚡ **Simple Landing Page:** 3-5 days\n🌐 **Business Website:** 1-2 weeks\n📱 **Web Application:** 2-4 weeks\n🔧 **Custom Solution:** 4-8 weeks\n\nI always provide realistic timelines and keep you updated throughout the process!",
                    'factors': "Timeline depends on several factors:\n\n• Project complexity and scope\n• Number of features required\n• Design complexity\n• Content and assets availability\n• Revision rounds\n• Testing requirements\n\nI'll provide a detailed timeline after understanding your specific needs!"
                }
            },
            contact: {
                keywords: ['contact', 'reach', 'email', 'phone', 'message', 'get in touch', 'hire'],
                responses: {
                    'methods': "You can reach out through multiple channels:\n\n📧 **Email:** Direct and detailed communication\n💬 **Contact Form:** Quick and easy messaging\n🔗 **LinkedIn:** Professional networking\n📱 **Social Media:** Follow for updates\n\nI typically respond within 24 hours!",
                    'process': "Here's how we can get started:\n\n1️⃣ **Initial Contact** - Share your project idea\n2️⃣ **Discovery Call** - Discuss requirements\n3️⃣ **Proposal** - Detailed plan and timeline\n4️⃣ **Agreement** - Terms and project kickoff\n5️⃣ **Development** - Regular updates and collaboration"
                }
            },
            pricing: {
                keywords: ['price', 'cost', 'budget', 'rate', 'fee', 'payment', 'money'],
                responses: {
                    'general': "Pricing is tailored to each project's needs:\n\n💰 **Hourly Rate:** $50-100/hour\n📦 **Fixed Price:** Based on project scope\n🔄 **Retainer:** For ongoing work\n\nI offer competitive rates with transparent pricing and no hidden fees!",
                    'factors': "Pricing factors include:\n\n• Project complexity\n• Timeline requirements\n• Technology stack\n• Design requirements\n• Ongoing maintenance\n\nI'll provide a detailed quote after our initial discussion!"
                }
            },
            general: {
                keywords: ['hello', 'hi', 'help', 'what', 'how', 'can you', 'assistant'],
                responses: {
                    'greeting': "Hello! 👋 I'm your AI assistant here to help you navigate this portfolio and answer any questions about projects, services, or getting in touch!\n\nWhat would you like to know?",
                    'help': "I can help you with:\n\n🧭 **Navigation** - Find specific sections\n💼 **Projects** - Learn about work and capabilities\n⏰ **Timelines** - Understand delivery schedules\n💰 **Pricing** - Get cost information\n📞 **Contact** - Connect with the developer\n\nJust ask me anything!"
                }
            }
        };
        
        // Quick action buttons
        this.quickActions = [
            { text: '🏠 Home', action: () => this.handleQuickAction('navigate', 'home') },
            { text: '💼 Projects', action: () => this.handleQuickAction('navigate', 'projects') },
            { text: '📞 Contact', action: () => this.handleQuickAction('navigate', 'contact') },
            { text: '💰 Pricing', action: () => this.handleQuickAction('info', 'pricing') },
            { text: '⏰ Timeline', action: () => this.handleQuickAction('info', 'delivery') },
            { text: '🛠️ Tech Stack', action: () => this.handleQuickAction('info', 'technologies') }
        ];
        
        this.init();
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.waitForDOM();
            this.createChatbotHTML();
            this.attachEventListeners();
            this.setupKeyboardShortcuts();
            this.loadChatHistory();
            this.isInitialized = true;
            console.log('🤖 Portfolio Chatbot initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing chatbot:', error);
        }
    }

    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    createChatbotHTML() {
        // Remove existing chatbot if any
        const existing = document.getElementById('portfolio-chatbot');
        if (existing) existing.remove();

        const chatbotHTML = `
            <div id="portfolio-chatbot" class="chatbot-container">
                <!-- Floating Button -->
                <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Open AI Assistant">
                    <div class="chatbot-icon">
                        <svg class="icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                    <div class="chatbot-pulse"></div>
                    <div class="chatbot-notification" id="chatbot-notification">💬</div>
                </button>

                <!-- Chat Window -->
                <div id="chatbot-window" class="chatbot-window">
                    <!-- Header -->
                    <div class="chatbot-header">
                        <div class="chatbot-avatar">
                            <div class="avatar-gradient"></div>
                            <span class="avatar-text">AI</span>
                        </div>
                        <div class="chatbot-info">
                            <h3>Portfolio Assistant</h3>
                            <p class="status">Online • Ready to help</p>
                        </div>
                        <div class="chatbot-actions">
                            <button class="action-btn" id="clear-chat" aria-label="Clear chat">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3,6 5,6 21,6"></polyline>
                                    <path d="M19,6V20a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6M8,6V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2V6"></path>
                                </svg>
                            </button>
                            <button class="action-btn" id="minimize-chat" aria-label="Minimize chat">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Messages Area -->
                    <div class="chatbot-messages" id="chatbot-messages">
                        <div class="welcome-message">
                            <div class="message bot-message">
                                <div class="message-avatar">
                                    <div class="avatar-gradient"></div>
                                    <span>AI</span>
                                </div>
                                <div class="message-content">
                                    <p>👋 Hello! I'm your AI assistant. I can help you:</p>
                                    <ul>
                                        <li>🧭 Navigate to different sections</li>
                                        <li>💼 Learn about projects and services</li>
                                        <li>⏰ Get timeline and pricing info</li>
                                        <li>📞 Connect with the developer</li>
                                    </ul>
                                    <p>What would you like to know?</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="quick-actions" id="quick-actions">
                        <div class="quick-actions-label">Quick Actions:</div>
                        <div class="quick-actions-grid"></div>
                    </div>

                    <!-- Input Area -->
                    <div class="chatbot-input">
                        <div class="input-container">
                            <input type="text" id="chatbot-input" placeholder="Ask me anything..." autocomplete="off">
                            <button id="send-message" class="send-btn" aria-label="Send message">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                                </svg>
                            </button>
                        </div>
                        <div class="typing-indicator" id="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        this.addChatbotStyles();
        this.renderQuickActions();
    }

    addChatbotStyles() {
        if (document.getElementById('chatbot-styles')) return;

        const styles = `
            <style id="chatbot-styles">
                :root {
                    --chatbot-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    --chatbot-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    --chatbot-success: #2ecc71;
                    --chatbot-bg: rgba(10, 10, 10, 0.95);
                    --chatbot-card: rgba(255, 255, 255, 0.05);
                    --chatbot-border: rgba(255, 255, 255, 0.1);
                    --chatbot-text: #ffffff;
                    --chatbot-text-secondary: rgba(255, 255, 255, 0.7);
                    --chatbot-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    --chatbot-radius: 16px;
                    --chatbot-z-index: 10000;
                }

                .chatbot-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: var(--chatbot-z-index);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                /* Floating Toggle Button */
                .chatbot-toggle {
                    position: relative;
                    width: 60px;
                    height: 60px;
                    border: none;
                    border-radius: 50%;
                    background: var(--chatbot-primary);
                    color: white;
                    cursor: pointer;
                    box-shadow: var(--chatbot-shadow);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .chatbot-toggle:hover {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                }

                .chatbot-toggle:active {
                    transform: translateY(0) scale(0.95);
                }

                .chatbot-icon {
                    position: relative;
                    width: 24px;
                    height: 24px;
                }

                .chatbot-icon svg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    transition: all 0.3s ease;
                }

                .chatbot-icon .icon-close {
                    opacity: 0;
                    transform: rotate(90deg);
                }

                .chatbot-container.open .chatbot-icon .icon-chat {
                    opacity: 0;
                    transform: rotate(-90deg);
                }

                .chatbot-container.open .chatbot-icon .icon-close {
                    opacity: 1;
                    transform: rotate(0deg);
                }

                .chatbot-pulse {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: var(--chatbot-primary);
                    animation: pulse 2s infinite;
                    opacity: 0.7;
                }

                .chatbot-notification {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 20px;
                    height: 20px;
                    background: var(--chatbot-secondary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: bold;
                    color: white;
                    transform: scale(0);
                    transition: transform 0.3s ease;
                }

                .chatbot-notification.show {
                    transform: scale(1);
                    animation: bounce 0.6s ease;
                }

                /* Chat Window */
                .chatbot-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 380px;
                    height: 500px;
                    background: var(--chatbot-bg);
                    border: 1px solid var(--chatbot-border);
                    border-radius: var(--chatbot-radius);
                    box-shadow: var(--chatbot-shadow);
                    backdrop-filter: blur(20px);
                    transform: translateY(20px) scale(0.9);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .chatbot-container.open .chatbot-window {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                    visibility: visible;
                }

                /* Header */
                .chatbot-header {
                    padding: 20px;
                    background: var(--chatbot-card);
                    border-bottom: 1px solid var(--chatbot-border);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .chatbot-avatar {
                    position: relative;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .avatar-gradient {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--chatbot-primary);
                    animation: rotate 3s linear infinite;
                }

                .avatar-text {
                    position: relative;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                    z-index: 1;
                }

                .chatbot-info {
                    flex: 1;
                }

                .chatbot-info h3 {
                    margin: 0;
                    color: var(--chatbot-text);
                    font-size: 16px;
                    font-weight: 600;
                }

                .chatbot-info .status {
                    margin: 2px 0 0 0;
                    color: var(--chatbot-success);
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .chatbot-info .status::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background: var(--chatbot-success);
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                .chatbot-actions {
                    display: flex;
                    gap: 8px;
                }

                .action-btn {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: transparent;
                    color: var(--chatbot-text-secondary);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .action-btn:hover {
                    background: var(--chatbot-card);
                    color: var(--chatbot-text);
                }

                .action-btn svg {
                    width: 16px;
                    height: 16px;
                }

                /* Messages */
                .chatbot-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    scroll-behavior: smooth;
                }

                .chatbot-messages::-webkit-scrollbar {
                    width: 4px;
                }

                .chatbot-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .chatbot-messages::-webkit-scrollbar-thumb {
                    background: var(--chatbot-border);
                    border-radius: 2px;
                }

                .message {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 16px;
                    animation: slideInUp 0.3s ease;
                }

                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    color: white;
                    flex-shrink: 0;
                    position: relative;
                    overflow: hidden;
                }

                .bot-message .message-avatar {
                    background: var(--chatbot-primary);
                }

                .user-message {
                    flex-direction: row-reverse;
                }

                .user-message .message-avatar {
                    background: var(--chatbot-secondary);
                }

                .message-content {
                    flex: 1;
                    background: var(--chatbot-card);
                    padding: 12px 16px;
                    border-radius: 16px;
                    color: var(--chatbot-text);
                    line-height: 1.5;
                    border: 1px solid var(--chatbot-border);
                }

                .user-message .message-content {
                    background: var(--chatbot-primary);
                    border: none;
                }

                .message-content p {
                    margin: 0 0 8px 0;
                }

                .message-content p:last-child {
                    margin-bottom: 0;
                }

                .message-content ul {
                    margin: 8px 0;
                    padding-left: 20px;
                }

                .message-content li {
                    margin-bottom: 4px;
                }

                .message-actions {
                    margin-top: 12px;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .action-button {
                    padding: 6px 12px;
                    background: var(--chatbot-primary);
                    color: white;
                    border: none;
                    border-radius: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .action-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                /* Quick Actions */
                .quick-actions {
                    padding: 16px 20px;
                    border-top: 1px solid var(--chatbot-border);
                    background: var(--chatbot-card);
                }

                .quick-actions-label {
                    color: var(--chatbot-text-secondary);
                    font-size: 12px;
                    margin-bottom: 12px;
                    font-weight: 500;
                }

                .quick-actions-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }

                .quick-action-btn {
                    padding: 8px 12px;
                    background: transparent;
                    color: var(--chatbot-text-secondary);
                    border: 1px solid var(--chatbot-border);
                    border-radius: 8px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                }

                .quick-action-btn:hover {
                    background: var(--chatbot-primary);
                    color: white;
                    border-color: transparent;
                    transform: translateY(-1px);
                }

                /* Input */
                .chatbot-input {
                    padding: 20px;
                    border-top: 1px solid var(--chatbot-border);
                    background: var(--chatbot-card);
                }

                .input-container {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                #chatbot-input {
                    flex: 1;
                    padding: 12px 16px;
                    background: var(--chatbot-bg);
                    border: 1px solid var(--chatbot-border);
                    border-radius: 24px;
                    color: var(--chatbot-text);
                    font-size: 14px;
                    outline: none;
                    transition: all 0.2s ease;
                }

                #chatbot-input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                #chatbot-input::placeholder {
                    color: var(--chatbot-text-secondary);
                }

                .send-btn {
                    width: 40px;
                    height: 40px;
                    border: none;
                    background: var(--chatbot-primary);
                    color: white;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .send-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .send-btn svg {
                    width: 18px;
                    height: 18px;
                }

                /* Typing Indicator */
                .typing-indicator {
                    display: none;
                    align-items: center;
                    gap: 4px;
                    margin-top: 12px;
                    color: var(--chatbot-text-secondary);
                    font-size: 12px;
                }

                .typing-indicator.show {
                    display: flex;
                }

                .typing-indicator span {
                    width: 4px;
                    height: 4px;
                    background: var(--chatbot-text-secondary);
                    border-radius: 50%;
                    animation: typing 1.4s infinite;
                }

                .typing-indicator span:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-indicator span:nth-child(3) {
                    animation-delay: 0.4s;
                }

                /* Animations */
                @keyframes pulse {
                    0%, 100% { opacity: 0.7; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.1); }
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
                    40% { transform: translateY(-4px) scale(1.1); }
                    60% { transform: translateY(-2px) scale(1.05); }
                }

                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes typing {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-8px);
                        opacity: 1;
                    }
                }

                /* Responsive Design */
                @media (max-width: 480px) {
                    .chatbot-container {
                        bottom: 10px;
                        right: 10px;
                        left: 10px;
                    }

                    .chatbot-window {
                        width: 100%;
                        height: 70vh;
                        max-height: 500px;
                        bottom: 70px;
                        right: 0;
                        left: 0;
                    }

                    .chatbot-toggle {
                        position: fixed;
                        bottom: 10px;
                        right: 10px;
                    }

                    .quick-actions-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 320px) {
                    .chatbot-header {
                        padding: 16px;
                    }

                    .chatbot-messages {
                        padding: 16px;
                    }

                    .chatbot-input {
                        padding: 16px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    renderQuickActions() {
        const grid = document.querySelector('.quick-actions-grid');
        if (!grid) return;

        grid.innerHTML = this.quickActions.map(action => 
            `<button class="quick-action-btn" data-action="${action.text}">${action.text}</button>`
        ).join('');

        // Add event listeners
        grid.querySelectorAll('.quick-action-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.quickActions[index].action();
            });
        });
    }

    attachEventListeners() {
        const toggle = document.getElementById('chatbot-toggle');
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('send-message');
        const clearBtn = document.getElementById('clear-chat');
        const minimizeBtn = document.getElementById('minimize-chat');

        // Toggle chatbot
        toggle?.addEventListener('click', () => this.toggleChatbot());

        // Send message
        sendBtn?.addEventListener('click', () => this.sendMessage());
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Clear chat
        clearBtn?.addEventListener('click', () => this.clearChat());

        // Minimize chat
        minimizeBtn?.addEventListener('click', () => this.toggleChatbot());

        // Close on outside click
        document.addEventListener('click', (e) => {
            const chatbot = document.getElementById('portfolio-chatbot');
            if (this.isOpen && chatbot && !chatbot.contains(e.target)) {
                this.toggleChatbot();
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + C to toggle chatbot
            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                this.toggleChatbot();
            }

            // Escape to close chatbot
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleChatbot();
            }
        });
    }

    toggleChatbot() {
        const container = document.getElementById('portfolio-chatbot');
        const input = document.getElementById('chatbot-input');
        
        this.isOpen = !this.isOpen;
        container?.classList.toggle('open', this.isOpen);
        
        if (this.isOpen) {
            setTimeout(() => input?.focus(), 300);
            this.hideNotification();
        }
        
        this.savePreferences();
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input?.value.trim();
        
        if (!message) return;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        this.showTyping();
        
        // Simulate AI processing time
        setTimeout(() => {
            this.hideTyping();
            this.processMessage(message);
        }, 1000 + Math.random() * 1000);
    }

    addMessage(content, sender, actions = null) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = `
            <div class="avatar-gradient"></div>
            <span>${sender === 'user' ? 'U' : 'AI'}</span>
        `;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = this.formatMessage(content);
        
        if (actions) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';
            actions.forEach(action => {
                const btn = document.createElement('button');
                btn.className = 'action-button';
                btn.textContent = action.text;
                btn.addEventListener('click', action.action);
                actionsDiv.appendChild(btn);
            });
            contentDiv.appendChild(actionsDiv);
        }
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ content, sender, timestamp: Date.now() });
        this.saveChatHistory();
    }

    formatMessage(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/\*\s/g, '• ');
    }

    processMessage(message) {
        const response = this.generateResponse(message.toLowerCase());
        this.addMessage(response.text, 'bot', response.actions);
        
        if (response.callback) {
            setTimeout(response.callback, 500);
        }
    }

    generateResponse(message) {
        // Check for navigation requests
        for (const [category, data] of Object.entries(this.knowledgeBase)) {
            if (data.keywords.some(keyword => message.includes(keyword))) {
                if (category === 'navigation') {
                    for (const [section, response] of Object.entries(data.responses)) {
                        if (message.includes(section)) {
                            return {
                                text: response.text,
                                callback: response.action
                            };
                        }
                    }
                    return {
                        text: "I can help you navigate! Where would you like to go?",
                        actions: [
                            { text: "🏠 Home", action: () => this.navigateToSection('home') },
                            { text: "💼 Projects", action: () => this.navigateToSection('projects') },
                            { text: "📞 Contact", action: () => this.navigateToSection('contact') }
                        ]
                    };
                }
                
                // Handle other categories
                const responses = data.responses;
                const responseKeys = Object.keys(responses);
                const randomKey = responseKeys[Math.floor(Math.random() * responseKeys.length)];
                
                return {
                    text: responses[randomKey]
                };
            }
        }
        
        // Default responses for unmatched queries
        const defaultResponses = [
            "That's an interesting question! Let me help you find what you're looking for. You can ask me about projects, pricing, timelines, or navigation.",
            "I'd be happy to help! I can assist with information about services, projects, contact details, or guide you to different sections of the portfolio.",
            "Great question! I can help you with:\n\n🧭 **Navigation** - Find specific sections\n💼 **Projects** - Learn about work and capabilities\n⏰ **Timelines** - Understand delivery schedules\n💰 **Pricing** - Get cost information\n📞 **Contact** - Connect with the developer",
            "I'm here to help! Feel free to ask about any aspect of the portfolio, projects, services, or how to get in touch."
        ];
        
        return {
            text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
            actions: [
                { text: "💼 View Projects", action: () => this.navigateToSection('projects') },
                { text: "📞 Get in Touch", action: () => this.navigateToSection('contact') }
            ]
        };
    }

    handleQuickAction(type, action) {
        if (type === 'navigate') {
            this.navigateToSection(action);
            this.addMessage(`Taking you to the ${action} section!`, 'bot');
        } else if (type === 'info') {
            const response = this.generateInfoResponse(action);
            this.addMessage(response, 'bot');
        }
    }

    generateInfoResponse(topic) {
        const responses = {
            'pricing': this.knowledgeBase.pricing.responses.general,
            'delivery': this.knowledgeBase.delivery.responses.general,
            'technologies': this.knowledgeBase.projects.responses.technologies
        };
        
        return responses[topic] || "I'd be happy to help with that! Please ask me a specific question.";
    }

    navigateToSection(section) {
        const sectionMap = {
            'home': '#home',
            'projects': '#projects',
            'contact': '#contact',
            'about': '#about',
            'skills': '#skills'
        };
        
        const targetSection = sectionMap[section];
        if (targetSection) {
            const element = document.querySelector(targetSection);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Try alternative selectors
                const alternatives = [
                    `[id="${section}"]`,
                    `.${section}`,
                    `[data-section="${section}"]`
                ];
                
                for (const selector of alternatives) {
                    const alt = document.querySelector(selector);
                    if (alt) {
                        alt.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        return;
                    }
                }
                
                // If no section found, scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    showTyping() {
        const indicator = document.getElementById('typing-indicator');
        indicator?.classList.add('show');
        this.isTyping = true;
    }

    hideTyping() {
        const indicator = document.getElementById('typing-indicator');
        indicator?.classList.remove('show');
        this.isTyping = false;
    }

    showNotification() {
        const notification = document.getElementById('chatbot-notification');
        notification?.classList.add('show');
    }

    hideNotification() {
        const notification = document.getElementById('chatbot-notification');
        notification?.classList.remove('show');
    }

    clearChat() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <div class="message bot-message">
                        <div class="message-avatar">
                            <div class="avatar-gradient"></div>
                            <span>AI</span>
                        </div>
                        <div class="message-content">
                            <p>👋 Hello! I'm your AI assistant. I can help you:</p>
                            <ul>
                                <li>🧭 Navigate to different sections</li>
                                <li>💼 Learn about projects and services</li>
                                <li>⏰ Get timeline and pricing info</li>
                                <li>📞 Connect with the developer</li>
                            </ul>
                            <p>What would you like to know?</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        this.messages = [];
        this.saveChatHistory();
    }

    loadChatHistory() {
        try {
            const history = localStorage.getItem('portfolio-chatbot-history');
            if (history) {
                this.messages = JSON.parse(history);
                // Restore recent messages (last 10)
                const recentMessages = this.messages.slice(-10);
                recentMessages.forEach(msg => {
                    if (msg.sender !== 'bot' || !msg.content.includes('👋 Hello!')) {
                        this.addMessage(msg.content, msg.sender);
                    }
                });
            }
        } catch (error) {
            console.warn('Could not load chat history:', error);
        }
    }

    saveChatHistory() {
        try {
            localStorage.setItem('portfolio-chatbot-history', JSON.stringify(this.messages));
        } catch (error) {
            console.warn('Could not save chat history:', error);
        }
    }

    loadPreferences() {
        try {
            const prefs = localStorage.getItem('portfolio-chatbot-prefs');
            return prefs ? JSON.parse(prefs) : { hasVisited: false };
        } catch (error) {
            return { hasVisited: false };
        }
    }

    savePreferences() {
        try {
            this.userPreferences.hasVisited = true;
            localStorage.setItem('portfolio-chatbot-prefs', JSON.stringify(this.userPreferences));
        } catch (error) {
            console.warn('Could not save preferences:', error);
        }
    }

    // Public API
    open() {
        if (!this.isOpen) this.toggleChatbot();
    }

    close() {
        if (this.isOpen) this.toggleChatbot();
    }

    sendBotMessage(message) {
        this.addMessage(message, 'bot');
    }

    destroy() {
        const chatbot = document.getElementById('portfolio-chatbot');
        const styles = document.getElementById('chatbot-styles');
        
        chatbot?.remove();
        styles?.remove();
        
        this.isInitialized = false;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioChatbot = new PortfolioChatbot();
        
        // Show notification for first-time visitors
        setTimeout(() => {
            if (!window.portfolioChatbot.userPreferences.hasVisited) {
                window.portfolioChatbot.showNotification();
            }
        }, 3000);
    });
} else {
    window.portfolioChatbot = new PortfolioChatbot();
    
    // Show notification for first-time visitors
    setTimeout(() => {
        if (!window.portfolioChatbot.userPreferences.hasVisited) {
            window.portfolioChatbot.showNotification();
        }
    }, 3000);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioChatbot;
}