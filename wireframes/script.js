// Main Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
    
    // Handle navigation clicks
    setupNavigation();
    
    // Handle action cards
    setupActionCards();
    
    // Handle input interactions
    setupInputInteractions();
    
    // Handle CTA buttons
    setupCTAButtons();
});

function initDashboard() {
    // Add animation to stars
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Set active page based on URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // If it's an external link (Academy, Community, Status), allow default behavior
            if (this.querySelector('.nav-arrow')) {
                return;
            }
            
            // For internal navigation, handle active state
            if (!this.classList.contains('active')) {
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

function setupActionCards() {
    const actionCards = document.querySelectorAll('.action-card');
    const actionInput = document.querySelector('.action-input');
    
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardText = this.textContent;
            
            if (cardText === 'More') {
                // Show more options
                showMoreOptions();
            } else {
                // Populate input with the selected action
                actionInput.value = getActionPrompt(cardText);
                actionInput.focus();
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    });
}

function getActionPrompt(action) {
    const prompts = {
        'Monitor Stock Mentions': 'Monitor social media mentions for ticker: ',
        'Track Sentiment Trends': 'Analyze sentiment trends for: ',
        'Analyze Market Chatter': 'Show market discussion analysis for: ',
        'Weekly Competitor Analysis': 'Generate weekly competitor report for: ',
        'Reddit & Forum Tracking': 'Track Reddit discussions about: ',
        'Find Key Influencers': 'Identify key influencers discussing: ',
        'Analyze Twitter/X Activity': 'Analyze Twitter activity for ticker: '
    };
    
    return prompts[action] || action;
}

function showMoreOptions() {
    const additionalOptions = [
        'News Sentiment Analysis',
        'Volume Spike Detection',
        'Insider Trading Alerts',
        'Earnings Call Analysis',
        'Technical Indicator Alerts',
        'Short Interest Tracking'
    ];
    
    // Create modal or expand section
    alert('Additional features:\n\n' + additionalOptions.join('\n'));
}

function setupInputInteractions() {
    const actionInput = document.querySelector('.action-input');
    const sendBtn = document.querySelector('.send-btn');
    const uploadBtn = document.querySelector('.upload-btn');
    const sparkleBtn = document.querySelector('.sparkle-btn');
    
    // Handle send button
    sendBtn.addEventListener('click', function() {
        const query = actionInput.value.trim();
        if (query) {
            processQuery(query);
        }
    });
    
    // Handle enter key
    actionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                processQuery(query);
            }
        }
    });
    
    // Handle upload button
    uploadBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.xlsx,.pdf';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                alert(`File "${file.name}" selected for analysis`);
            }
        };
        input.click();
    });
    
    // Handle AI suggestions
    sparkleBtn.addEventListener('click', function() {
        const suggestions = [
            'What\'s the sentiment on Shopify today?',
            'Show me trending Canadian tech stocks',
            'Alert me when BlackBerry mentions spike',
            'Analyze retail investor sentiment for TD Bank',
            'Compare sentiment: RBC vs TD Bank'
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        actionInput.value = randomSuggestion;
        actionInput.focus();
        
        // Add sparkle animation
        this.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            this.style.transform = '';
        }, 500);
    });
}

function processQuery(query) {
    // Simulate processing
    console.log('Processing query:', query);
    
    // Add loading state
    const sendBtn = document.querySelector('.send-btn');
    sendBtn.innerHTML = '<span style="animation: spin 1s linear infinite;">⟳</span>';
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        sendBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
        `;
        
        // Show result
        alert(`Analysis request received: "${query}"\n\nIn production, this would:\n1. Query MongoDB for relevant data\n2. Run sentiment analysis\n3. Display results in dashboard`);
        
        // Clear input
        document.querySelector('.action-input').value = '';
    }, 1500);
}

function setupCTAButtons() {
    const watchBtn = document.querySelector('.primary-btn');
    const startBtn = document.querySelector('.secondary-btn');
    
    watchBtn.addEventListener('click', function() {
        // In production, this would open a video modal
        alert('Demo Video: TSX.AI Platform Overview\n\n• Real-time sentiment tracking\n• Multi-platform monitoring\n• AI-powered insights\n• Custom alerts\n• Competitor analysis');
    });
    
    startBtn.addEventListener('click', function() {
        // In production, this would navigate to signup
        window.location.href = 'pages/signup.html';
    });
}

// Add loading animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Handle help button
document.querySelector('.help-btn').addEventListener('click', function() {
    alert('TSX.AI Help Center\n\nNeed assistance?\n• Email: support@tsx.ai\n• Documentation: docs.tsx.ai\n• Live Chat: Available 9-5 EST');
});