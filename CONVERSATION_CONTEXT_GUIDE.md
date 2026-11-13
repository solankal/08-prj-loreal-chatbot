# Conversation Context & Question Display Guide

## 🎯 New Features Overview

This guide explains two powerful new features added to the L'Oréal Beauty Chatbot:

1. **Conversation Context Tracking** - The chatbot remembers user details across multi-turn conversations
2. **Latest Question Display** - The user's current question appears above the AI response for clarity

---

## Feature 1: Conversation Context Tracking

### What It Does

The chatbot now tracks and remembers important information throughout the conversation:

- **User's Name** - Automatically extracted when the user shares it
- **Beauty Preferences** - Tracks mentioned skin types and hair types
- **Past Questions** - Maintains a list of all questions asked
- **Conversation History** - Full message history for context-aware responses

### How It Works

The system uses **pattern matching** to identify when a user shares their name:

```javascript
// Supported name patterns:
"I'm Sarah"
"My name is Maria"
"Call me Alex"
"I am James"
```

When detected, the name is stored in `conversationContext.userName`.

### Beauty Preferences Detected

The chatbot automatically tracks mentions of:

```
Skin Types:
- Oily, dry, sensitive, acne-prone
- Combination skin, fine lines, wrinkles, dark circles

Hair Types:
- Wavy, curly, straight, thin, thick, frizzy
```

These are stored in `conversationContext.userPreferences`.

### Using Context in Conversation

The **OpenAI system prompt** has been updated to include guideline #6:

> "Track context throughout the conversation: remember the user's name if shared, recall past questions, and maintain awareness of their beauty concerns for personalized recommendations."

This means the AI will:
- Greet the user by name once it knows it
- Reference previous questions naturally
- Make personalized product recommendations based on known preferences
- Build relationships by showing it remembers the conversation

### Example Context Tracking Conversation

```
User: "Hi, I'm Sarah. I have oily skin."
→ Context: userName = "Sarah", userPreferences = ["oily"]

User: "What about shampoo for my thin hair?"
→ Context: userPreferences = ["oily", "thin"]

AI: "Sarah, based on your oily skin and thin hair, I'd recommend..."
→ AI now personalizes recommendations based on context!
```

### Accessing Context in Code

Students can access the current conversation context using:

```javascript
// Get all tracked context
const context = getConversationContext();

// Access specific values
console.log(context.userName);        // "Sarah"
console.log(context.userPreferences); // ["oily", "thin"]
console.log(context.pastQuestions);   // [all questions asked]
```

### Context Object Structure

```javascript
conversationContext = {
  userName: null,           // User's name (if shared)
  userPreferences: [],      // Array of beauty concerns/types
  pastQuestions: [],        // Array of all questions asked
}
```

---

## Feature 2: Latest Question Display

### What It Does

The user's current question appears in a **red banner above the chat window**, clearly separated from the conversation history.

### Visual Design

```
┌─────────────────────────────────────┐
│ Q: What's best for dry skin?        │  ← Latest Question (Red L'Oréal Red)
├─────────────────────────────────────┤
│ [Previous messages in chat window]  │
│                                     │
│ User: What's best for dry skin?     │
│ AI: Great question! For dry skin... │
└─────────────────────────────────────┘
```

### How It Works

1. When the user submits a message, it's captured
2. `displayLatestQuestion()` is called with the message text
3. The question appears in the `#latestQuestion` div (red banner)
4. It resets with each new question
5. Empty when no question is active

### HTML Structure

In `index.html`, there's a dedicated container for the question:

```html
<!-- Display the latest question above responses -->
<div id="latestQuestion" class="latest-question"></div>
```

### Styling (CSS)

```css
.latest-question {
  background: var(--loreal-red);        /* Red background */
  color: var(--loreal-white);           /* White text */
  padding: 12px 16px;                   /* Comfortable spacing */
  border-radius: 4px;                   /* Rounded corners */
  margin-bottom: 12px;                  /* Space above chat */
  font-weight: 600;                     /* Bold text */
  font-size: 14px;                      /* Slightly smaller than chat */
  min-height: 20px;                     /* Minimum height */
  line-height: 1.4;                     /* Line spacing */
  word-wrap: break-word;                /* Wrap long questions */
}

.latest-question:empty {
  display: none;                        /* Hide when empty */
}
```

### JavaScript Implementation

In `script.js`:

```javascript
// When form is submitted:
function displayLatestQuestion(question) {
  latestQuestion.innerHTML = 
    `<strong>Q:</strong> ${escapeHtml(question)}`;
}

// The escapeHtml() function prevents HTML injection attacks
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

### Why This Is Useful

1. **Clarity** - Users can easily see what question they just asked
2. **Context** - The latest question appears above its response
3. **Professional** - Mimics modern chat interfaces (like ChatGPT)
4. **Visual Hierarchy** - Red L'Oréal branding stands out
5. **Learning** - Students see how to manipulate DOM dynamically

---

## How These Features Work Together

### Multi-Turn Conversation Flow

```
Turn 1: User asks "I'm Sarah, what for oily skin?"
  → Context tracked: userName = "Sarah", preferences = ["oily"]
  → Latest question displays in red banner
  → AI responds with system prompt awareness

Turn 2: User asks "What about shampoo?"
  → Context updated: preferences = ["oily", ...]
  → Latest question updates to show new question
  → AI now knows about "Sarah" and "oily" from context

Turn 3: User asks "Best foundation for me?"
  → Question displays in red
  → AI uses all context to make personalized recommendation
  → References Sarah's skin type naturally
```

### Enhanced System Prompt

The system prompt now includes context awareness:

```
6. Track context throughout the conversation: 
   remember the user's name if shared, recall 
   past questions, and maintain awareness of their 
   beauty concerns for personalized recommendations.

7. Reference previous questions naturally to show 
   you're remembering the conversation and building 
   on their beauty journey.
```

---

## Security & Best Practices

### HTML Injection Protection

The `escapeHtml()` function prevents malicious code:

```javascript
// Without escaping (DANGEROUS):
latestQuestion.innerHTML = userMessage;  // ❌ XSS risk!

// With escaping (SAFE):
latestQuestion.innerHTML = escapeHtml(userMessage);  // ✅ Secure
```

### Context Data Limitations

The context tracking is **client-side only**:
- Data resets if user refreshes the page
- Data is not sent to OpenAI
- Data is not stored on the server
- For persistence, you'd need a database (future enhancement)

### Privacy Considerations

Since the chatbot is in-browser only:
- ✅ User data stays local
- ✅ No personal info sent to server (except OpenAI API)
- ✅ Users control their data
- ⚠️ Data lost on page refresh (by design)

---

## Code Structure

### New DOM Elements

```javascript
// Line 5 in script.js
const latestQuestion = document.getElementById("latestQuestion");
```

### New Context Object

```javascript
// Lines 8-13 in script.js
let conversationContext = {
  userName: null,
  userPreferences: [],
  pastQuestions: [],
};
```

### New Functions

1. **`displayLatestQuestion(question)`** (Line 82)
   - Shows the user's question in the red banner
   - Called each time form is submitted

2. **`escapeHtml(text)`** (Line 87)
   - Sanitizes user input
   - Prevents HTML injection attacks

3. **`extractConversationContext(userMessage, assistantMessage)`** (Line 200)
   - Parses user message for name and preferences
   - Updates `conversationContext` object
   - Called after each API response

4. **`getConversationContext()`** (Line 240)
   - Allows students to access current context
   - Returns the `conversationContext` object

### Updated Functions

- **System Prompt** (Lines 20-55)
  - Added guidelines 6 & 7 about context tracking
  - Encourages natural references to conversation history

- **Form Submit Handler** (Lines 57-74)
  - Now calls `displayLatestQuestion()`
  - Adds question to `conversationContext.pastQuestions`

- **`sendMessageToAPI()`** (Lines 169-241)
  - Calls `extractConversationContext()` after response
  - Updated to work with new context system

---

## Customization Ideas

### 1. Extract Additional Context

Students can modify `extractConversationContext()` to track:

```javascript
// Example: Track skin tone
const skinToneKeywords = ["fair", "light", "medium", "olive", "deep"];
skinToneKeywords.forEach(tone => {
  if (userMessage.toLowerCase().includes(tone)) {
    conversationContext.userSkinTone = tone;
  }
});

// Example: Track age range mentioned
const ageMatch = userMessage.match(/(\d+)\s*years?/);
if (ageMatch) {
  conversationContext.userAge = parseInt(ageMatch[1]);
}
```

### 2. Display More Context

Students can show context in a sidebar or status bar:

```javascript
// Show in a dedicated context display
function displayContext() {
  const context = getConversationContext();
  if (context.userName) {
    console.log(`Chatting with: ${context.userName}`);
  }
  if (context.userPreferences.length > 0) {
    console.log(`Tracked concerns: ${context.userPreferences.join(", ")}`);
  }
}
```

### 3. Customize Question Display

Students can modify the styling or format:

```javascript
// Custom question format
function displayLatestQuestion(question) {
  latestQuestion.innerHTML = 
    `<strong>📝 You asked:</strong> ${escapeHtml(question)}`;
}

// Or add emoji based on question type:
function displayLatestQuestion(question) {
  const emoji = question.includes("?") ? "❓" : "💬";
  latestQuestion.innerHTML = 
    `${emoji} ${escapeHtml(question)}`;
}
```

### 4. Persist Context with localStorage

For advanced students:

```javascript
// Save context when it updates
function saveContext() {
  localStorage.setItem(
    "chatbotContext", 
    JSON.stringify(conversationContext)
  );
}

// Load context on page load
function loadContext() {
  const saved = localStorage.getItem("chatbotContext");
  if (saved) {
    conversationContext = JSON.parse(saved);
  }
}

// Call loadContext() when page loads
loadContext();
```

---

## Testing the Features

### Test Context Tracking

```
1. Type: "Hi, I'm Alice"
   ✅ System should extract name "Alice"
   ✅ Check browser console: console.log(getConversationContext())

2. Type: "I have dry skin and curly hair"
   ✅ Should track: ["dry", "curly"]
   ✅ Console output shows updated preferences

3. Type: "Remember me?"
   ✅ AI might respond: "Of course, Alice! ..."
   ✅ Shows it's using tracked context
```

### Test Question Display

```
1. Type any question: "What's best for oily skin?"
   ✅ Red banner appears above chat
   ✅ Shows: "Q: What's best for oily skin?"

2. Get response from AI
   ✅ Question stays in red banner
   ✅ Response appears below in chat

3. Ask another question: "Tell me about shampoo"
   ✅ Red banner updates to new question
   ✅ Old question disappears
```

### Browser Console Testing

```javascript
// Open DevTools (F12) and type:
getConversationContext()

// Output should be:
{
  userName: "Alice",
  userPreferences: ["dry", "curly"],
  pastQuestions: ["Hi, I'm Alice", "I have dry skin...", "Tell me about shampoo"]
}
```

---

## Learning Outcomes

### JavaScript Concepts

- **DOM Manipulation** - Creating and updating elements dynamically
- **String Methods** - Using regex for pattern matching
- **Objects & Arrays** - Storing structured data
- **Function Parameters** - Passing data between functions
- **HTML Sanitization** - Preventing injection attacks
- **Event Handling** - Triggering functions on user actions

### Real-World Skills

- **Conversational UI** - Building chat interfaces
- **Context Awareness** - Building stateful applications
- **Data Extraction** - Parsing natural language
- **Security** - Protecting against XSS attacks
- **UX Design** - Improving user experience with visual feedback

### AI/ML Concepts

- **Prompt Engineering** - Writing better instructions for AI
- **Context in Conversations** - How AI maintains context
- **Natural Language Processing** - Extracting meaning from text
- **Personalization** - Tailoring responses to user data

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Question doesn't appear | `latestQuestion` DOM element missing | Check HTML has `<div id="latestQuestion">` |
| HTML characters show in question | `escapeHtml()` not called | Verify `escapeHtml()` is used in `displayLatestQuestion()` |
| Context not tracking | `extractConversationContext()` not called | Check `sendMessageToAPI()` calls the function |
| Name not recognized | Pattern doesn't match user's phrasing | Update regex patterns in `extractConversationContext()` |
| Question resets when refreshing | localStorage not implemented | This is by design; implement localStorage for persistence |

---

## Files Modified

1. **index.html** - Added `<div id="latestQuestion">`
2. **script.js** - Added context tracking and question display
3. **style.css** - Added `.latest-question` styling

---

## Summary

These two new features create a more **natural, personalized conversational experience**:

✅ **Context Tracking** → AI remembers user details for personalized responses  
✅ **Question Display** → Clear visual feedback of the current question  
✅ **Multi-Turn Awareness** → Full conversation history maintained  
✅ **Professional UI** → Modern chat interface design  
✅ **Secure** → HTML injection protection included  
✅ **Educational** → Great teaching examples for students  

---

*For more details, see:*
- **SCRIPT_DOCUMENTATION.md** - Code explanation
- **SYSTEM_PROMPT_GUIDE.md** - System prompt details
- **SYSTEM_PROMPT_EXAMPLES.md** - Example conversations
