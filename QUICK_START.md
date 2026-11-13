# Quick Start Guide - L'Oréal Chatbot

## 🚀 Get Started in 3 Steps

### Step 1: Set Your Cloudflare Worker URL
In `script.js`, find this line and replace with your class URL:
```javascript
const WORKER_URL = "https://loreal-chatbot.your-subdomain.workers.dev/";
```

Ask your instructor for the actual Worker URL!

### Step 2: Open the Chatbot
Click the **Live Preview** button in VS Code to open `index.html` in your browser.

### Step 3: Start Chatting!
Type a message and press Enter (or click the send button). ✨

---

## ✨ What the Chatbot Does

| Action | What Happens |
|--------|--------------|
| **You type (beauty-related)** | Your message appears immediately in red |
| **You type (off-topic)** | Message appears, AI politely declines and redirects |
| **Send** | "✨ Thinking..." appears while waiting |
| **AI responds** | Response appears in white with a red accent bar |
| **Continue** | You can keep typing – the chatbot remembers everything! |

**Special Feature**: The chatbot only answers questions about L'Oréal products, beauty routines, and beauty recommendations. If you ask off-topic questions, it politely redirects you to beauty topics! 💄

---

## 🎯 Focus on Beauty

The L'Oréal Beauty Assistant is **specially trained to focus on beauty topics**.

✅ **Ask about these:**
- L'Oréal products and recommendations
- Skincare and makeup routines
- Hair care tips
- Beauty recommendations for your skin type
- Product information and ingredients

❌ **Off-topic questions get polite redirects:**
- "Tell me a joke" → "I'm here for beauty! What beauty goals can I help with?"
- "What's the capital of France?" → "That's outside my expertise! Let me help with your skincare instead."
- "Can you help with homework?" → "I focus on beauty! Ask me about L'Oréal products!"

The chatbot includes a **system prompt** that guides how the AI responds. Read `SYSTEM_PROMPT_GUIDE.md` to learn how to customize it!

---

```
You → Your Browser → Cloudflare Worker → OpenAI API
                                    ↓
                            Worker gets response
                                    ↓
Worker → Your Browser → Chatbot displays answer
```

The Cloudflare Worker holds the OpenAI API key safely on the server. Your browser never sees the key.

---

## 💡 Code Overview

### **File: `script.js`**

**Main Function 1: Handle User Input**
```javascript
chatForm.addEventListener("submit", async (e) => {
  const userMessage = userInput.value.trim();
  displayMessage(userMessage, "user");      // Show your message
  await sendMessageToAPI(userMessage);      // Send to API
});
```

**Main Function 2: Display Messages**
```javascript
function displayMessage(message, sender) {
  // Creates a chat bubble for your message or the AI's response
  // sender = "user" (red) or "ai" (white)
}
```

**Main Function 3: Send to OpenAI**
```javascript
async function sendMessageToAPI(userMessage) {
  // 1. Remember the message
  conversationHistory.push({ role: "user", content: userMessage });
  
  // 2. Send to Cloudflare Worker
  const response = await fetch(WORKER_URL, {
    method: "POST",
    body: JSON.stringify({ messages: conversationHistory })
  });
  
  // 3. Show the AI's response
  const aiResponse = data.choices[0].message.content;
  displayMessage(aiResponse, "ai");
}
```

---

## 🎯 Key Concepts

### **Async/Await**
```javascript
async function sendMessageToAPI(userMessage) {
  // "async" means this function waits for something (the API response)
  
  const response = await fetch(WORKER_URL, {...});
  // "await" means: pause here until we get a response
  
  const data = await response.json();
  // "await" means: pause here until the JSON is parsed
}
```

### **Conversation History**
```javascript
let conversationHistory = [];  // Empty at start

// Each time you or the AI say something:
conversationHistory.push({
  role: "user",      // or "assistant"
  content: "..."     // the message text
});

// The array grows with each message!
```

### **DOM Elements**
```javascript
const chatForm = document.getElementById("chatForm");      // The form
const userInput = document.getElementById("userInput");    // The text box
const chatWindow = document.getElementById("chatWindow");  // Where messages appear
```

---

## 🐛 Debugging Tips

### **Is something not working?**

**1. Check the Console**
- Press `F12` or right-click → "Inspect"
- Click the "Console" tab
- You'll see any error messages

**2. Verify the Worker URL**
- Make sure `WORKER_URL` is correct in `script.js`
- Test it in your browser's address bar

**3. Check Network Requests**
- Open DevTools → Network tab
- Send a message
- You should see a POST request to your Cloudflare Worker
- Check if it returns a successful response (200 status)

**4. Log Conversation History**
```javascript
// Type this in the Console to see all messages:
console.log(conversationHistory);
```

---

## 🎨 Customization Ideas

### **Change the Welcome Message**
In `script.js`, find this line:
```javascript
chatWindow.innerHTML = '<div class="msg ai">👋 Hello! I\'m the L\'Oréal Beauty Assistant...</div>';
```
Replace with your own greeting!

### **Change the Loading Message**
```javascript
loadingDiv.textContent = "⏳ Getting response...";
```

### **Adjust Chat Window Height**
In `style.css`:
```css
.chat-window {
  height: 360px;  /* Change to 500px for more space */
}
```

### **Change the Red Color**
In `style.css`:
```css
:root {
  --loreal-red: #E60012;  /* Change to any hex color */
}
```

---

## ❓ FAQ

**Q: Why is my message not sending?**
A: Check the console for errors. Make sure the Worker URL is correct!

**Q: Can the chatbot remember old conversations?**
A: No – refresh the page and `conversationHistory` resets. This is normal!

**Q: How do I stop a response?**
A: Unfortunately, you can't interrupt a fetch. Wait for it to finish, then type your next message.

**Q: Why does it say "Thinking..." for so long?**
A: OpenAI's API can take 1-3 seconds. Sometimes longer if they're busy!

**Q: Can I add more features?**
A: Absolutely! Try adding:
- Timestamp for messages
- User names/avatars
- Message delete buttons
- Emoji reactions
- Local storage to save conversations

---

## 📚 Learning Resources

- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **Async/Await**: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises
- **OpenAI Chat API**: https://platform.openai.com/docs/guides/gpt/chat-completions-api

---

## 🎓 What You're Learning

By building this chatbot, you're learning:
- ✅ How to capture user input with forms
- ✅ How to work with APIs and JSON
- ✅ How to use async/await for timing
- ✅ How to manipulate the DOM dynamically
- ✅ How to maintain state (conversation history)
- ✅ How to handle errors gracefully
- ✅ Security best practices (no hardcoded keys!)

Great job! You're becoming a real web developer! 🚀

