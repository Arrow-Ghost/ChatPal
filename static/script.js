// Initialize Socket.IO connection
const socket = io();

// DOM elements
const loginModal = document.getElementById('loginModal');
const chatContainer = document.getElementById('chatContainer');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('usernameInput');
const currentUserSpan = document.getElementById('currentUser');
const userCountSpan = document.getElementById('userCount');
const messagesContainer = document.getElementById('messages');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const typingIndicator = document.getElementById('typingIndicator');

// State variables
let currentUsername = '';
let typingTimer = null;
let isTyping = false;

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
messageForm.addEventListener('submit', handleSendMessage);
messageInput.addEventListener('input', handleTyping);

// Socket.IO event listeners
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('user_count_update', (data) => {
    updateUserCount(data.user_count);
});

socket.on('user_joined', (data) => {
    addSystemMessage(data.message);
    updateUserCount(data.user_count);
});

socket.on('user_left', (data) => {
    addSystemMessage(`${data.username} left the chat`);
    updateUserCount(data.user_count);
});

socket.on('receive_message', (data) => {
    addMessage(data, data.username === currentUsername);
    scrollToBottom();
});

socket.on('user_typing', (data) => {
    showTypingIndicator(data.username, data.is_typing);
});

// Functions
function handleLogin(e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    
    if (username) {
        currentUsername = username;
        currentUserSpan.textContent = username;
        
        // Join the chat
        socket.emit('join', { username: username });
        
        // Hide login modal and show chat
        loginModal.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        
        // Focus on message input
        messageInput.focus();
        
        // Clear username input
        usernameInput.value = '';
    }
}

function handleSendMessage(e) {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (message) {
        socket.emit('send_message', { message: message });
        messageInput.value = '';
        scrollToBottom();
    }
}

function handleTyping() {
    if (!isTyping) {
        isTyping = true;
        socket.emit('typing', { is_typing: true });
    }
    
    // Clear existing timer
    clearTimeout(typingTimer);
    
    // Set new timer to stop typing indicator
    typingTimer = setTimeout(() => {
        if (isTyping) {
            isTyping = false;
            socket.emit('typing', { is_typing: false });
        }
    }, 1000);
}

function addMessage(data, isOwn) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwn ? 'own' : 'other'}`;
    
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';
    messageHeader.innerHTML = `
        <span class="username">${data.username}</span>
        <span class="timestamp">${data.timestamp}</span>
    `;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = data.message;
    
    messageDiv.appendChild(messageHeader);
    messageDiv.appendChild(messageContent);
    
    messagesContainer.appendChild(messageDiv);
}

function addSystemMessage(message) {
    const systemDiv = document.createElement('div');
    systemDiv.className = 'system-message';
    systemDiv.textContent = message;
    
    messagesContainer.appendChild(systemDiv);
    scrollToBottom();
}

function showTypingIndicator(username, isTyping) {
    if (isTyping) {
        typingIndicator.textContent = `${username} is typing...`;
        typingIndicator.classList.remove('hidden');
    } else {
        typingIndicator.classList.add('hidden');
    }
}

function updateUserCount(count) {
    userCountSpan.textContent = `${count} user${count !== 1 ? 's' : ''} online`;
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus message input when typing (except when in input fields)
    if (e.key !== 'Enter' && e.key !== 'Tab' && e.key !== 'Escape') {
        const activeElement = document.activeElement;
        if (activeElement !== messageInput && activeElement !== usernameInput) {
            messageInput.focus();
        }
    }
    
    // Send message with Enter key (but allow Shift+Enter for new lines if needed)
    if (e.key === 'Enter' && !e.shiftKey && document.activeElement === messageInput) {
        e.preventDefault();
        handleSendMessage(e);
    }
});

// Auto-scroll when new messages arrive
const observer = new MutationObserver(() => {
    scrollToBottom();
});

observer.observe(messagesContainer, {
    childList: true,
    subtree: true
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        scrollToBottom();
    }
});

// Add some initial styling and functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add welcome message
    setTimeout(() => {
        if (messagesContainer.children.length === 0) {
            addSystemMessage('Welcome to ChatPal! Enter your username to start chatting.');
        }
    }, 500);
    
    // Focus username input on load
    usernameInput.focus();
});

// Handle window resize
window.addEventListener('resize', () => {
    scrollToBottom();
});
