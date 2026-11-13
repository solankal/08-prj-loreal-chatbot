# Setup Instructions for L'Oréal Chatbot

## Prerequisites
- ✅ GitHub Codespaces (or VS Code locally)
- ✅ Modern web browser (Chrome, Firefox, Safari, Edge)
- ✅ Cloudflare Worker URL from your instructor

---

## Step 1: Prepare the Chatbot

### Option A: Using GitHub Codespaces
1. Go to the GitHub repo
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. Wait for Codespaces to load (usually 30 seconds)

### Option B: Using VS Code Locally
1. Clone the repository
2. Open the folder in VS Code

---

## Step 2: Configure the Cloudflare Worker URL

Your instructor provided a Cloudflare Worker URL. It looks like:
```
https://loreal-chatbot.YOUR-SUBDOMAIN.workers.dev/
```

### Find and Update the URL:
1. Open `script.js` in VS Code
2. Find line 8:
   ```javascript
   const WORKER_URL = "https://loreal-chatbot.your-subdomain.workers.dev/";
   ```
3. Replace `your-subdomain` with the actual subdomain from your instructor
4. **Save the file** (Ctrl+S or Cmd+S)

**Example:** If your instructor says the URL is `https://loreal-chatbot.class-2025.workers.dev/`, change line 8 to:
```javascript
const WORKER_URL = "https://loreal-chatbot.class-2025.workers.dev/";
```

---

## Step 3: Open the Chatbot

### Using GitHub Codespaces:
1. In the left sidebar, find `index.html`
2. Right-click → **Open with Live Preview**
3. A browser window opens with your chatbot! 🎉

### Using VS Code Locally:
1. Install the **Live Server** extension
2. Right-click `index.html` → **Open with Live Server**
3. Your default browser opens with the chatbot

---

## Step 4: Test It Out!

✅ **Test these features:**

| Test | How | Expected Result |
|------|-----|-----------------|
| **Load** | Refresh the page | Welcome message appears |
| **Type** | Type "Hello" in the input box | No crash, input stays |
| **Send** | Click the send button | Message appears in red |
| **Loading** | Wait 1-3 seconds | "✨ Thinking..." appears |
| **Response** | Wait for response | AI reply appears in white |
| **Context** | Ask "What was my first message?" | AI recalls your message |
| **Error** | Wrong Worker URL → try to send | Error message appears |

---

## Step 5: Troubleshooting

### **Chatbot doesn't respond**

**Problem:** "✨ Thinking..." appears but never goes away

**Solutions:**
1. **Check the Worker URL:**
   - Open your browser's DevTools (F12)
   - Click the **Network** tab
   - Send a message
   - You should see a POST request to your Worker
   - If you don't see it, the URL is wrong

2. **Verify the URL is correct:**
   - Ask your instructor to confirm the Worker URL
   - Make sure there are no typos
   - Make sure it ends with `/` (e.g., `.workers.dev/`)

3. **Check for CORS errors:**
   - In DevTools Console, you might see a "CORS" error
   - This usually means the Worker URL is incorrect
   - Ask your instructor to verify the URL

### **Nothing happens when I click Send**

**Check:**
- Is the input field empty? (You need to type something)
- Are you getting an error in the Console? (Press F12 to check)
- Is JavaScript enabled in your browser?

### **Messages don't display**

**Check:**
- Open DevTools Console (F12)
- Look for error messages in red
- Screenshot the error and ask your instructor

### **"Cannot find element" error**

**This means:**
- The HTML structure changed
- `script.js` is looking for elements that don't exist

**Fix:**
- Check that `index.html` hasn't been modified
- Make sure `<div id="chatWindow">` exists
- Make sure `<form id="chatForm">` exists
- Make sure `<input id="userInput">` exists

---

## Step 6: Understanding the Architecture

Here's how your chatbot communicates:

```
┌─────────────────────────────────────────────────────┐
│  Your Browser (This Project)                        │
│  ├─ index.html (UI)                                 │
│  ├─ style.css (L'Oréal Branding)                    │
│  └─ script.js (Chat Logic)                          │
└────────────┬────────────────────────────────────────┘
             │ HTTPS POST
             ↓
┌─────────────────────────────────────────────────────┐
│  Cloudflare Worker (Your Instructor's Server)       │
│  ├─ Receives your message                           │
│  ├─ Holds OpenAI API key securely                   │
│  └─ Forwards to OpenAI                              │
└────────────┬────────────────────────────────────────┘
             │ HTTPS POST
             ↓
┌─────────────────────────────────────────────────────┐
│  OpenAI API (San Francisco)                         │
│  ├─ Processes your message                          │
│  ├─ Generates AI response                           │
│  └─ Returns to Cloudflare Worker                    │
└────────────┬────────────────────────────────────────┘
             │ HTTPS Response
             ↓
Cloudflare Worker sends response back to your browser
             │ HTTPS Response
             ↓
Your browser displays the AI message
```

**Security Note:** Your browser never talks directly to OpenAI. The Worker acts as a secure proxy. This protects the API key.

---

## Step 7: Next Steps

### After it works:
1. ✅ Send a test message to confirm it's working
2. 🎨 Read `LOREAL_BRANDING.md` to understand the design
3. 📖 Read `SCRIPT_DOCUMENTATION.md` to understand the code
4. 🚀 Try customizing colors, fonts, or messages!

### Advanced:
- Add system context to make the AI behave differently
- Store conversations in browser storage
- Add message timestamps
- Add emoji reactions
- Style user avatars

---

## Need Help?

**If it doesn't work:**
1. Check the browser Console (F12 → Console tab)
2. Screenshot any error messages
3. Verify the Worker URL is correct
4. Ask your instructor

**Common Issues:**
- ❌ CORS error → Wrong Worker URL
- ❌ "Cannot find element" → Don't modify HTML
- ❌ No response → Network issue or Worker down
- ❌ Empty response → AI might have hit a limit

---

## Files You Need to Know

```
08-prj-loreal-chatbot/
├── index.html                    # ← Chat UI (don't modify)
├── script.js                     # ← Chat logic (update WORKER_URL here)
├── style.css                     # ← L'Oréal styling (you can customize)
├── README.md                     # ← Project overview
├── LOREAL_BRANDING.md            # ← Brand guidelines
├── SCRIPT_DOCUMENTATION.md       # ← How the JavaScript works
├── QUICK_START.md                # ← Quick reference guide
└── SETUP_INSTRUCTIONS.md         # ← THIS FILE
```

---

## Ready? Let's Go! 🚀

1. ✅ Update the Worker URL
2. ✅ Open the chatbot in your browser
3. ✅ Type a message
4. ✅ Enjoy your AI-powered beauty assistant!

**You've got this!** 💄✨
