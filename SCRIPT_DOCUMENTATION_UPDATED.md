# L'Oréal Chatbot - Complete Script Documentation (Updated)

## Overview
The `script.js` file (249 lines) implements a complete conversational chatbot with:
- User input capture and validation
- Context tracking (remembering user details)
- Question display in a professional red banner
- OpenAI API integration via Cloudflare Worker proxy
- Full conversation history management
- Security features (HTML escaping)

---

## Table of Contents
1. [Global Variables & Setup](#global-variables--setup)
2. [System Prompt](#system-prompt)
3. [Core Functions](#core-functions)
4. [Context Tracking Functions](#context-tracking-functions)
5. [API Communication](#api-communication)
6. [Complete Code Flow](#complete-code-flow)

---

## Global Variables & Setup

### DOM Elements (Lines 1-5)
```javascript
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestion = document.getElementById("latestQuestion");
```
**Purpose:** Reference HTML elements for manipulation
- `chatForm` - The form users submit messages through
- `userInput` - Input field for typing messages
- `chatWindow` - Container for displaying messages
- `latestQuestion` - NEW: Container for displaying current question in red banner

### Conversation History (Lines 7-13)
```javascript
let conversationHistory = [];

let conversationContext = {
  userName: null,
  userPreferences: [],
  pastQuestions: [],
};
```
**Purpose:** Store conversation data across multiple turns
- `conversationHistory` - Array of all messages (user and AI)
- `conversationContext` - NEW: Object tracking user details
  - `userName` - User's name (extracted from conversation)
  - `userPreferences` - Array of beauty concerns mentioned
  - `pastQuestions` - Array of all questions asked

### API Configuration (Line 16)
```javascript
const WORKER_URL = "https://loreal-chatbot.your-subdomain.workers.dev/";
```
**Purpose:** URL of the Cloudflare Worker proxy
**Student Task:** Replace `your-subdomain` with actual Worker URL provided by instructor

---

## System Prompt

### SYSTEM_PROMPT Constant (Lines 18-55)

The system prompt is a detailed instruction set that guides OpenAI's behavior. It includes:

#### 1. Role Definition
```javascript
content: `You are the L'Oréal Beauty Assistant...`
```
Sets clear identity and purpose.

#### 2. L'Oréal Mission Statement
```javascript
L'Oréal's Mission: "Create the beauty that moves the world"
```
Reinforces brand values.

#### 3. Five Core Guidelines
```
1. Only answer beauty/L'Oréal questions
2. Politely decline off-topic questions
3. Be friendly when declining
4. Relate general beauty tips to products
5. Maintain professional, friendly tone
```

#### 4. NEW: Context Awareness (Lines 50-51)
```javascript
6. Track context throughout the conversation: 
   remember user's name, recall past questions, 
   and maintain awareness of beauty concerns.
7. Reference previous questions naturally to show 
   you're remembering the conversation.
```
Instructs AI to use tracked context for personalization.

#### 5. Example Polite Refusals
Three detailed examples of how to decline off-topic questions:
- "What's the capital of France?" → Beauty redirect
- "Can you help with homework?" → L'Oréal focus
- "Tell me a joke" → Professional redirect

**Why This Matters:**
- Every conversation starts with these instructions
- Guides OpenAI throughout entire conversation
- Makes AI predictable and brand-aligned

---

## Core Functions

### 1. Form Submission Handler (Lines 57-74)

```javascript
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const userMessage = userInput.value.trim();
  if (!userMessage) return;
  
  displayLatestQuestion(userMessage);     // NEW
  displayMessage(userMessage, "user");
  conversationContext.pastQuestions.push(userMessage);  // NEW
  
  userInput.value = "";
  userInput.focus();
  
  await sendMessageToAPI(userMessage);
});
```

**Line-by-Line Explanation:**
- `e.preventDefault()` - Stop form from submitting to server
- `.trim()` - Remove leading/trailing spaces
- `if (!userMessage) return` - Exit early if message is empty
- `displayLatestQuestion()` - NEW: Show question in red banner
- `displayMessage()` - Show message in chat window
- `conversationContext.pastQuestions.push()` - NEW: Track this question
- `userInput.value = ""` - Clear input field
- `userInput.focus()` - Return cursor to input field
- `await sendMessageToAPI()` - Send to API (wait for response)

**Student Learning:**
- Event handling and preventing default behavior
- Input validation (checking if message is empty)
- Async/await pattern
- DOM manipulation

---

### 2. displayMessage() (Lines 77-87)

```javascript
function displayMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg", sender);
  msgDiv.textContent = message;
  chatWindow.appendChild(msgDiv);
  
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
```

**Purpose:** Create and display a message in the chat window

**Parameters:**
- `message` (string) - The text to display
- `sender` (string) - Either "user" or "ai" (determines styling)

**Step-by-Step:**
1. Create new div element
2. Add CSS classes `.msg` (base) and `.user`/`.ai` (sender type)
3. Set text content (note: uses `.textContent`, not `.innerHTML`, for security)
4. Append to chat window
5. Scroll to bottom to show latest message

**CSS Classes Applied:**
- `.msg.user` - Red background, right-aligned, white text
- `.msg.ai` - White background, red left border, left-aligned

**Example:**
```javascript
displayMessage("What's best for dry skin?", "user");
// Creates: <div class="msg user">What's best for dry skin?</div>
```

---

### 3. displayLatestQuestion() - NEW (Lines 82-84)

```javascript
function displayLatestQuestion(question) {
  latestQuestion.innerHTML = `<strong>Q:</strong> ${escapeHtml(question)}`;
}
```

**Purpose:** Display the current question in a red L'Oréal banner above the chat

**Parameters:**
- `question` (string) - The user's question

**Step-by-Step:**
1. Takes user's question
2. Escapes HTML characters (prevents injection)
3. Inserts with "Q:" prefix for clarity
4. Updates the `#latestQuestion` div in HTML

**Example Flow:**
```
User types: "What's best for oily skin?"
  ↓
displayLatestQuestion() called
  ↓
HTML updates: <div id="latestQuestion"><strong>Q:</strong> What's best for oily skin?</div>
  ↓
Red banner appears above chat with formatted question
```

**CSS Styling Applied:**
- Background color: L'Oréal red (#E60012)
- Text color: White
- Padding: 12px 16px
- Font weight: 600 (bold)
- Updates on each new question
- Hidden when empty

---

### 4. escapeHtml() - NEW (Lines 87-95)

```javascript
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
```

**Purpose:** Prevent HTML injection attacks (XSS vulnerability)

**What It Does:**
- Converts special HTML characters to safe entities
- `<` becomes `&lt;` (can't be interpreted as tag)
- `>` becomes `&gt;` (can't close tags)
- `&` becomes `&amp;` (safely starts entity)
- Quotes escaped to prevent attribute injection

**Example:**
```javascript
// Without escaping (DANGEROUS):
escapeHtml("<script>alert('hacked')</script>");
// Returns: "&lt;script&gt;alert('hacked')&lt;/script&gt;"
// Now displays as text, not executed as code!
```

**Why Important:**
- User input displayed in chat (could be malicious)
- Without escaping, could run JavaScript
- This is a critical security practice

---

## Context Tracking Functions

### 5. extractConversationContext() - NEW (Lines 200-237)

```javascript
function extractConversationContext(userMessage, assistantMessage) {
  // Look for user's name
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
  
  // Extract beauty preferences
  const beautyKeywords = [
    "oily", "dry", "sensitive", "acne", "wrinkles",
    "dark circles", "fine lines", "wavy", "curly",
    "straight", "thin", "thick", "frizzy", "combination skin"
  ];
  
  beautyKeywords.forEach((keyword) => {
    if (userMessage.toLowerCase().includes(keyword) &&
        !conversationContext.userPreferences.includes(keyword)) {
      conversationContext.userPreferences.push(keyword);
    }
  });
}
```

**Purpose:** Extract and remember user details from the conversation

**Part 1: Name Extraction (Lines 202-210)**
- Uses regex pattern matching
- Looks for phrases: "I'm", "I am", "My name is", "Call me"
- Captures capitalized word following the phrase
- Stores first name in `conversationContext.userName`

**Regex Explanation:**
```
(?:i'm|i am|my name is|call me)  ← Look for one of these phrases
\s+                               ← Followed by whitespace
([A-Z][a-z]+)                    ← Capture capitalized word
```

**Part 2: Preference Extraction (Lines 212-226)**
- Defines array of beauty-related keywords
- Checks if keyword appears in user message
- Adds to `userPreferences` if not already present
- Avoids duplicates with `!includes()` check

**Example:**
```javascript
userMessage = "Hi, I'm Sarah. I have oily skin and curly hair."

// After extractConversationContext():
conversationContext = {
  userName: "Sarah",
  userPreferences: ["oily", "curly"],
  pastQuestions: ["Hi, I'm Sarah..."]
}
```

**Student Learning:**
- Regular expressions (pattern matching)
- Array methods (forEach, push, includes)
- String methods (toLowerCase, match)
- Control flow (for loops, conditionals)

---

### 6. getConversationContext() - NEW (Lines 240-242)

```javascript
function getConversationContext() {
  return conversationContext;
}
```

**Purpose:** Allow students to access tracked conversation data

**Usage in Browser Console:**
```javascript
// Type in DevTools Console (F12):
console.log(getConversationContext());

// Output:
{
  userName: "Sarah",
  userPreferences: ["oily", "curly"],
  pastQuestions: [
    "Hi, I'm Sarah. I have oily skin and curly hair.",
    "What about shampoo for my hair?"
  ]
}
```

**Why Useful:**
- Debugging context tracking
- Understanding what data is captured
- Learning how to work with objects
- Extending the chatbot with new features

---

## API Communication

### 7. sendMessageToAPI() (Lines 169-241)

This is the most complex function. It handles:
1. Adding message to history
2. Showing loading indicator
3. Building request with system prompt
4. Sending to Cloudflare Worker
5. Extracting response
6. Tracking context
7. Displaying response
8. Error handling

**Part 1: Add to History (Lines 172-176)**
```javascript
conversationHistory.push({
  role: "user",
  content: userMessage,
});
```
Stores message in format OpenAI expects.

**Part 2: Loading Indicator (Lines 178-182)**
```javascript
const loadingDiv = document.createElement("div");
loadingDiv.classList.add("msg", "ai");
loadingDiv.textContent = "✨ Thinking...";
chatWindow.appendChild(loadingDiv);
chatWindow.scrollTop = chatWindow.scrollHeight;
```
Shows "✨ Thinking..." while waiting for response.

**Part 3: Build Messages Array (Lines 186-195)**
```javascript
const messagesWithSystem = [];

if (conversationHistory.length === 1) {
  messagesWithSystem.push(SYSTEM_PROMPT);
}

messagesWithSystem.push(...conversationHistory);
```

**Key Concept:** System prompt sent only once (first message), not repeated.

**Why?**
- Saves API tokens (costs money)
- OpenAI remembers system instructions throughout conversation
- More efficient communication

**Spread Operator `...`:**
```javascript
// Without spread:
messagesWithSystem.push(conversationHistory);
// Result: [[msg, msg, msg]] ← nested array (wrong)

// With spread:
messagesWithSystem.push(...conversationHistory);
// Result: [msg, msg, msg] ← flat array (correct)
```

**Part 4: Fetch Request (Lines 197-209)**
```javascript
const response = await fetch(WORKER_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: messagesWithSystem }),
});

if (!response.ok) {
  throw new Error(`API error: ${response.status}`);
}
```

**What's Happening:**
- `fetch()` sends HTTP POST request
- Headers tell server format is JSON
- Body contains messages array
- `await` waits for response
- `if (!response.ok)` checks for errors (status 4xx or 5xx)

**Part 5: Parse Response (Lines 211-216)**
```javascript
const data = await response.json();
const assistantMessage = data.choices[0].message.content;
loadingDiv.remove();
conversationHistory.push({
  role: "assistant",
  content: assistantMessage,
});
```

**OpenAI Response Structure:**
```javascript
{
  choices: [{
    message: {
      content: "Great question! For dry skin, I recommend..."
    }
  }]
}
```

Extracts the text response and stores it.

**Part 6: Extract Context - NEW (Line 224)**
```javascript
extractConversationContext(userMessage, assistantMessage);
```
Calls context extraction after getting response.

**Part 7: Display Response (Line 227)**
```javascript
displayMessage(assistantMessage, "ai");
```
Shows AI's response in the chat.

**Part 8: Error Handling (Lines 230-239)**
```javascript
catch (error) {
  loadingDiv.remove();
  console.error("Error:", error);
  displayMessage(
    "❌ Sorry, I couldn't process that. Please check your Cloudflare Worker URL and try again.",
    "ai"
  );
}
```

**What Errors Might Occur:**
- Network error (no internet)
- Wrong Cloudflare Worker URL
- API key expired
- OpenAI API down
- Malformed request

**Error Message:**
- User-friendly (doesn't expose technical details)
- Logged to console for debugging
- Loading indicator removed

---

## Complete Code Flow

### User Sends "Hi, I'm Sarah. I have oily skin."

```
1. User types message
   ↓
2. User presses Enter or clicks Send
   ↓
3. Form submission event fires
   ├→ displayLatestQuestion("Hi, I'm Sarah...")
   │  └→ Red banner shows: "Q: Hi, I'm Sarah..."
   ├→ displayMessage("Hi, I'm Sarah...", "user")
   │  └→ Red message bubble appears in chat
   ├→ conversationContext.pastQuestions.push(message)
   │  └→ Stores in context object
   └→ sendMessageToAPI(message)
      ↓
4. Add to conversation history
   ├→ conversationHistory.push({role: "user", content: message})
   └→ Now: [{role: "user", content: "Hi, I'm Sarah..."}]
      ↓
5. Show loading indicator
   └→ "✨ Thinking..." appears in chat
      ↓
6. Build messages array
   ├→ Check if first message: YES
   ├→ Add SYSTEM_PROMPT
   ├→ Add conversationHistory
   └→ messagesWithSystem = [SYSTEM_PROMPT, {role: "user", content: message}]
      ↓
7. Send to Cloudflare Worker
   ├→ POST to WORKER_URL
   ├→ Send messagesWithSystem as JSON
   └→ Worker: Gets OpenAI API key from environment
      ↓
8. Worker sends to OpenAI
   ├→ OpenAI reads system prompt
   ├→ OpenAI generates response
   └→ "Nice to meet you, Sarah! I see you have oily skin..."
      ↓
9. Get response back
   ├→ Parse JSON
   ├→ Extract assistantMessage
   └→ Remove "✨ Thinking..." loading indicator
      ↓
10. Add to conversation history
    ├→ conversationHistory.push({role: "assistant", content: response})
    └→ Now: [{user}, {assistant}]
       ↓
11. Extract conversation context
    ├→ extractConversationContext()
    ├→ Regex matches: "I'm Sarah"
    ├→ conversationContext.userName = "Sarah"
    ├→ Finds "oily"
    └→ conversationContext.userPreferences = ["oily"]
       ↓
12. Display response
    ├→ displayMessage(response, "ai")
    └→ White message bubble with red left border appears
       ↓
13. User sees complete conversation
    ├→ Red banner: "Q: Hi, I'm Sarah..."
    ├→ Red bubble: "Hi, I'm Sarah..."
    ├→ White bubble: "Nice to meet you, Sarah!..."
    └→ Context is now: {userName: "Sarah", userPreferences: ["oily"]}
```

---

## Key Concepts for Students

### 1. Async/Await
```javascript
async function sendMessageToAPI() {
  // ... code ...
  const response = await fetch(...);  // Pause here until response arrives
  // ... continue ...
}
```
Makes code wait for network requests without freezing the UI.

### 2. Event Listeners
```javascript
chatForm.addEventListener("submit", async (e) => { ... });
```
Listens for form submit events and triggers code.

### 3. DOM Manipulation
```javascript
document.createElement("div");
element.appendChild(...);
element.classList.add(...);
```
Creating and modifying HTML from JavaScript.

### 4. Regular Expressions
```javascript
const match = userMessage.match(/(?:i'm|i am)\s+([A-Z][a-z]+)/i);
```
Pattern matching in text to extract data.

### 5. Array Methods
```javascript
conversationHistory.push(...);      // Add item
conversationHistory.filter(...);    // Filter items
conversationHistory.map(...);       // Transform items
```

### 6. Object Access
```javascript
const data = response.json();
const message = data.choices[0].message.content;  // Nested access
```

### 7. Error Handling
```javascript
try {
  // Code that might error
} catch (error) {
  // Handle error gracefully
}
```

---

## Common Student Questions

**Q: Why do we use `escapeHtml()`?**
A: Prevents malicious code injection. If someone types `<script>alert('hacked')</script>`, we want to display it as text, not execute it.

**Q: Why send system prompt only once?**
A: Saves API tokens and costs. OpenAI "remembers" the system prompt throughout the conversation.

**Q: How does context tracking work?**
A: Uses regex to find patterns in user messages (like "I'm Sarah"), extracts the data, and stores it in an object for later use.

**Q: Can I customize the beauty keywords?**
A: YES! Edit the `beautyKeywords` array in `extractConversationContext()` function.

**Q: Where does the response come from?**
A: Cloudflare Worker (proxy) → OpenAI API → Cloudflare Worker → Your browser

---

## Testing Code

### Test in Browser Console (F12)

```javascript
// Check conversation history
console.log(conversationHistory);

// Check context
console.log(getConversationContext());

// Test regex pattern
const pattern = /(?:i'm|i am|my name is)\s+([A-Z][a-z]+)/i;
console.log("Hi, I'm Alice".match(pattern));  // ["I'm Alice", "Alice"]

// Simulate escapeHtml
function escapeHtml(text) { ... }
console.log(escapeHtml("<script>"));  // "&lt;script&gt;"
```

---

## Summary

The `script.js` file is the chatbot's "brain" with these key components:

✅ **Input Handling** - Form submission and validation  
✅ **Message Display** - Creating styled message bubbles  
✅ **Question Display** - Red banner for current question  
✅ **Context Tracking** - Remembering user details  
✅ **API Communication** - Talking to OpenAI via Cloudflare Worker  
✅ **Security** - HTML escaping to prevent attacks  
✅ **Error Handling** - Graceful failure recovery  

**All fully commented and beginner-friendly!** 🚀

---

*For more information, see:*
- CONVERSATION_CONTEXT_GUIDE.md - Context tracking deep dive
- SYSTEM_PROMPT_GUIDE.md - How system prompt works
- IMPLEMENTATION_UPDATE.md - What changed in version 2.0
