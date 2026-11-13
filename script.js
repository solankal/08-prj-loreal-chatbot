/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestion = document.getElementById("latestQuestion");

// Store conversation messages
let conversationHistory = [];

// Track conversation context (user name, preferences, etc.)
let conversationContext = {
  userName: null,
  userPreferences: [],
  pastQuestions: [],
};

// Cloudflare Worker proxy URL (replace with your class-hosted URL)
const WORKER_URL = "https://loreal-chatbot.your-subdomain.workers.dev/";

// System prompt to keep AI focused on L'Oréal and beauty topics
const SYSTEM_PROMPT = {
  role: "system",
  content: `You are the L'Oréal Beauty Assistant. Your purpose is to help customers discover and understand L'Oréal's extensive range of products—makeup, skincare, haircare, and fragrances—as well as provide personalized routines and beauty recommendations.

L'Oréal's Mission: "Create the beauty that moves the world"

IMPORTANT GUIDELINES:
1. Only answer questions related to L'Oréal products, beauty routines, skincare, makeup, haircare, fragrances, and beauty recommendations.
2. If a user asks about something unrelated to beauty or L'Oréal, politely decline and redirect them back to beauty topics.
3. When declining off-topic questions, be friendly and helpful—suggest what you CAN help with instead.
4. You can discuss general beauty science and tips only if they relate to recommending L'Oréal products or routines.
5. Always maintain a professional, friendly, and encouraging tone.
6. Track context throughout the conversation: remember the user's name if shared, recall past questions, and maintain awareness of their beauty concerns for personalized recommendations.
7. Reference previous questions naturally to show you're remembering the conversation and building on their beauty journey.

EXAMPLE POLITE REFUSALS:
- User: "What's the capital of France?"
  You: "I appreciate the question, but I'm specifically here to help with beauty! 💄 I'd love to help you find the perfect L'Oréal skincare routine or recommend products for your hair type. What beauty concerns can I help you with today?"

- User: "Can you help me with my homework?"
  You: "I'm focused on beauty and L'Oréal products! ✨ But I'd be happy to help you with any skincare, makeup, or haircare questions. What brings you here today?"

- User: "Tell me a joke"
  You: "While I'd love to entertain you, I'm here as your L'Oréal Beauty Assistant! 😊 Let me help you with something more exciting—like finding your perfect beauty product or creating a personalized routine. What's your beauty goal?"

Remember: Always be warm, encouraging, and redirect to beauty topics while making users feel valued. Build relationships by remembering context from earlier in the conversation.`,
};

// Set initial message
chatWindow.innerHTML = '<div class="msg ai">👋 Hello! I\'m the L\'Oréal Beauty Assistant. Ask me about our products, skincare routines, or beauty recommendations!</div>';

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user input
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Display latest question (above chat responses)
  displayLatestQuestion(userMessage);

  // Display user message in chat
  displayMessage(userMessage, "user");

  // Track this question in conversation context
  conversationContext.pastQuestions.push(userMessage);

  // Clear input field
  userInput.value = "";
  userInput.focus();

  // Send message to OpenAI API via Cloudflare Worker
  await sendMessageToAPI(userMessage);
});

/**
 * Display the user's latest question above responses
 * @param {string} question - The user's question
 */
function displayLatestQuestion(question) {
  latestQuestion.innerHTML = `<strong>Q:</strong> ${escapeHtml(question)}`;
}

/**
 * Escape HTML special characters to prevent injection
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Display a message in the chat window
 * @param {string} message - The message text to display
 * @param {string} sender - Either "user" or "ai"
 */
function displayMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg", sender);
  msgDiv.textContent = message;
  chatWindow.appendChild(msgDiv);

  // Scroll to bottom of chat window
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/**
 * Send user message to OpenAI API via Cloudflare Worker
 * @param {string} userMessage - The user's message
 */
async function sendMessageToAPI(userMessage) {
  // Add user message to conversation history
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  // Show loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("msg", "ai");
  loadingDiv.textContent = "✨ Thinking...";
  chatWindow.appendChild(loadingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    // Build messages array with system prompt first (only once)
    const messagesWithSystem = [];

    // Add system prompt only if this is the first message
    if (conversationHistory.length === 1) {
      messagesWithSystem.push(SYSTEM_PROMPT);
    }

    // Add all conversation history
    messagesWithSystem.push(...conversationHistory);

    // Make request to Cloudflare Worker
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messagesWithSystem,
      }),
    });

    // Check if response is successful
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Parse response
    const data = await response.json();

    // Extract assistant message
    const assistantMessage = data.choices[0].message.content;

    // Remove loading indicator
    loadingDiv.remove();

    // Add assistant message to conversation history
    conversationHistory.push({
      role: "assistant",
      content: assistantMessage,
    });

    // Extract and track context (name, preferences) from conversation
    extractConversationContext(userMessage, assistantMessage);

    // Display assistant message
    displayMessage(assistantMessage, "ai");
  } catch (error) {
    // Remove loading indicator
    loadingDiv.remove();

    // Display error message
    console.error("Error:", error);
    displayMessage(
      "❌ Sorry, I couldn't process that. Please check your Cloudflare Worker URL and try again.",
      "ai"
    );
  }
}

/**
 * Extract and track conversation context (e.g., user's name, preferences)
 * @param {string} userMessage - The user's message
 * @param {string} assistantMessage - The assistant's response
 */
function extractConversationContext(userMessage, assistantMessage) {
  // Look for user's name in conversation
  // Pattern: "I'm [Name]", "My name is [Name]", "Call me [Name]"
  const namePatterns = [
    /(?:i'm|i am|my name is|call me)\s+([A-Z][a-z]+)/i,
  ];

  for (const pattern of namePatterns) {
    const match = userMessage.match(pattern);
    if (match && match[1]) {
      conversationContext.userName = match[1];
      break;
    }
  }

  // Extract beauty preferences/concerns mentioned in user message
  const beautyKeywords = [
    "oily",
    "dry",
    "sensitive",
    "acne",
    "wrinkles",
    "dark circles",
    "fine lines",
    "wavy",
    "curly",
    "straight",
    "thin",
    "thick",
    "frizzy",
    "combination skin",
  ];

  beautyKeywords.forEach((keyword) => {
    if (
      userMessage.toLowerCase().includes(keyword) &&
      !conversationContext.userPreferences.includes(keyword)
    ) {
      conversationContext.userPreferences.push(keyword);
    }
  });
}

/**
 * Get conversation context for display/reference
 * @returns {object} - Current conversation context
 */
function getConversationContext() {
  return conversationContext;
}
