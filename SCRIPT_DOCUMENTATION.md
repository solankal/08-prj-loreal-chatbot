# L'Oréal Chatbot - Script Documentation

## Overview
The `script.js` file implements a complete conversational chatbot that captures user input, sends it to OpenAI's Chat Completions API via a Cloudflare Worker proxy, and displays responses in the chat interface.

---

## How It Works

### 1. **Capture User Input**
```javascript
chatForm.addEventListener("submit", async (e) => {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;
  // ... rest of code
});
```
- Listens for form submission when the user clicks the send button or presses Enter
- Retrieves and trims the user's message
- Prevents empty messages from being sent

### 2. **Display Messages**
```javascript
function displayMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg", sender);
  msgDiv.textContent = message;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
```
- Creates a new message element with the appropriate styling (`.msg.user` or `.msg.ai`)
- Automatically scrolls to the bottom of the chat window to show the latest message
- Messages are displayed immediately for user input, creating a responsive feel

### 3. **Send to OpenAI API**
```javascript
async function sendMessageToAPI(userMessage) {
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: conversationHistory }),
  });

  const data = await response.json();
  const assistantMessage = data.choices[0].message.content;
  // ... display response
}
```
- Maintains a `conversationHistory` array to track the entire conversation
- Sends the full conversation history (not just the latest message) for context-aware responses
- Extracts the assistant's reply from `data.choices[0].message.content`

### 4. **Handle Loading & Errors**
- Shows "✨ Thinking..." indicator while waiting for a response
- Removes the loading indicator when the response arrives
- Displays user-friendly error messages if the API request fails
- Logs detailed errors to the browser console for debugging

---

## Key Functions

### `displayMessage(message, sender)`
**Displays a message in the chat interface**

| Parameter | Type | Description |
|-----------|------|-------------|
| `message` | String | The text to display |
| `sender` | String | Either `"user"` or `"ai"` |

**Example:**
```javascript
displayMessage("What products do you recommend?", "user");
displayMessage("Here are our top skincare products...", "ai");
```

### `sendMessageToAPI(userMessage)`
**Sends user message to OpenAI via Cloudflare Worker**

| Parameter | Type | Description |
|-----------|------|-------------|
| `userMessage` | String | The user's input message |

**Returns:** Promise (async function)

**Process:**
1. Adds message to `conversationHistory`
2. Shows loading indicator
3. Sends POST request to Cloudflare Worker
4. Parses response and extracts assistant message
5. Adds response to `conversationHistory`
6. Displays response in chat
7. Handles errors gracefully

---

## Configuration

### Cloudflare Worker URL
```javascript
const WORKER_URL = "https://loreal-chatbot.your-subdomain.workers.dev/";
```

**⚠️ IMPORTANT**: Replace `your-subdomain` with the actual URL provided by your instructor/class.

The Cloudflare Worker:
- Receives user messages via POST request
- Forwards requests to OpenAI's Chat Completions API
- Holds the OpenAI API key securely (never exposed to frontend)
- Returns the AI response in the format: `{ choices: [{ message: { content: "..." } }] }`

---

## Data Flow

```
User Types Message
        ↓
Form Submit Event
        ↓
displayMessage("user message", "user")  [immediately shows user input]
        ↓
sendMessageToAPI(userMessage)
        ↓
Add to conversationHistory
        ↓
Show "✨ Thinking..." indicator
        ↓
POST to Cloudflare Worker
        ↓
Worker calls OpenAI API
        ↓
Worker returns { choices: [{ message: { content: "..." } }] }
        ↓
displayMessage(assistantMessage, "ai")  [shows AI response]
        ↓
User can type next message
```

---

## Conversation History

The chatbot maintains full conversation context:

```javascript
let conversationHistory = [
  { role: "user", content: "What's your best moisturizer?" },
  { role: "assistant", content: "L'Oréal Paris Revitalift Moisturizer..." },
  { role: "user", content: "Is it good for sensitive skin?" },
  { role: "assistant", content: "Yes, it's dermatologist-tested..." }
];
```

This allows the AI to:
- Remember previous messages in the conversation
- Provide context-aware responses
- Maintain a natural conversation flow

---

## Error Handling

The script handles several error scenarios:

| Error | Handling |
|-------|----------|
| **Network error** | User sees: "❌ Sorry, I couldn't process that..." |
| **API error** | Logs error, shows user-friendly message |
| **Invalid response** | Catches and reports gracefully |
| **Empty input** | Validation prevents sending empty messages |

All errors are logged to the browser console for debugging.

---

## Browser Requirements

- **Modern browser** (Chrome, Firefox, Safari, Edge)
- **JavaScript enabled**
- **Fetch API support** (built into all modern browsers)
- **ES6+ support** (async/await, arrow functions, template literals)

---

## Security Notes

✅ **This implementation is secure because:**
- No API keys are stored in the frontend code
- All communication goes through the class-hosted Cloudflare Worker
- The Worker holds the OpenAI key as a secret environment variable
- User messages are sent only to the Worker, then to OpenAI

❌ **Never do this:**
```javascript
// ❌ WRONG - Exposes API key to users
const apiKey = "sk-...";
fetch("https://api.openai.com/v1/chat/completions", {
  headers: { "Authorization": `Bearer ${apiKey}` }
});
```

---

## Testing the Chatbot

1. **Open the chatbot** in your browser (via GitHub Codespaces live preview)
2. **Type a message**: "What skincare products do you recommend?"
3. **Expected behavior**:
   - Message appears immediately in red (user color)
   - "✨ Thinking..." appears in white
   - AI response appears in white with red left border
4. **Continue the conversation** – all messages maintain context

---

## Customization

### Change the greeting message:
```javascript
chatWindow.innerHTML = '<div class="msg ai">Your custom greeting here!</div>';
```

### Add system context (for instructor setup only):
```javascript
conversationHistory = [
  {
    role: "system",
    content: "You are a helpful L'Oréal beauty advisor. Focus on product recommendations."
  }
];
```

### Adjust loading text:
```javascript
loadingDiv.textContent = "⏳ Getting response...";
```

---

## Common Questions

**Q: Why does it take time to respond?**
A: The request travels: Browser → Cloudflare Worker → OpenAI API → Worker → Browser. API calls typically take 1-3 seconds.

**Q: Can I see the full conversation?**
A: Yes! Open the browser DevTools Console and type `console.log(conversationHistory)` to view all messages.

**Q: What if the Cloudflare Worker URL isn't working?**
A: Check the URL is correct. If it still fails, ask your instructor for the updated Worker URL.

**Q: How many messages can I send?**
A: Theoretically unlimited, but OpenAI has token limits (usually ~4000 tokens per request). Very long conversations may hit this limit.

---

## File Structure
```
08-prj-loreal-chatbot/
├── index.html              # Chat interface markup
├── style.css               # L'Oréal branding & styling
├── script.js               # THIS FILE - Chat logic
├── LOREAL_BRANDING.md      # Branding guidelines
└── SCRIPT_DOCUMENTATION.md # This documentation
```

