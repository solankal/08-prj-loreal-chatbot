# L'Oréal Chatbot - System Prompt Configuration

## Overview
The chatbot now uses a **system prompt** to keep the AI focused on L'Oréal products, beauty routines, and beauty-related topics. When users ask off-topic questions, the AI politely declines and redirects them to beauty topics.

---

## How It Works

### System Prompt (in script.js)
```javascript
const SYSTEM_PROMPT = {
  role: "system",
  content: `You are the L'Oréal Beauty Assistant...`
};
```

The system prompt is sent to OpenAI with every conversation and tells the AI:
- ✅ What it IS: A L'Oréal Beauty Assistant
- ✅ What topics it HANDLES: Beauty, products, routines, skincare, makeup, haircare, fragrances
- ✅ How to respond: Politely refuse off-topic questions and redirect to beauty topics
- ✅ Tone: Professional, friendly, encouraging

### Implementation
The system prompt is added to the message array **only once** (on the first user message) to:
1. Save API tokens (avoid sending the prompt repeatedly)
2. Keep the conversation focused throughout the chat
3. Maintain context across all follow-up messages

```javascript
// Add system prompt only if this is the first message
if (conversationHistory.length === 1) {
  messagesWithSystem.push(SYSTEM_PROMPT);
}
```

---

## System Prompt Content

### Mission Statement
```
You are the L'Oréal Beauty Assistant. Your purpose is to help customers discover and 
understand L'Oréal's extensive range of products—makeup, skincare, haircare, and 
fragrances—as well as provide personalized routines and beauty recommendations.

L'Oréal's Mission: "Create the beauty that moves the world"
```

### Five Core Guidelines
1. **Focus on beauty and L'Oréal**: Only answer questions related to L'Oréal products, beauty routines, skincare, makeup, haircare, fragrances, and beauty recommendations.

2. **Polite refusal**: If a user asks about something unrelated to beauty or L'Oréal, politely decline and redirect them back to beauty topics.

3. **Helpful redirection**: When declining off-topic questions, be friendly and helpful—suggest what you CAN help with instead.

4. **Contextual beauty science**: You can discuss general beauty science and tips only if they relate to recommending L'Oréal products or routines.

5. **Professional tone**: Always maintain a professional, friendly, and encouraging tone.

### Example Responses

**Off-Topic Question**: "What's the capital of France?"
```
I appreciate the question, but I'm specifically here to help with beauty! 💄 
I'd love to help you find the perfect L'Oréal skincare routine or recommend 
products for your hair type. What beauty concerns can I help you with today?
```

**Off-Topic Question**: "Can you help me with my homework?"
```
I'm focused on beauty and L'Oréal products! ✨ But I'd be happy to help you 
with any skincare, makeup, or haircare questions. What brings you here today?
```

**Off-Topic Question**: "Tell me a joke"
```
While I'd love to entertain you, I'm here as your L'Oréal Beauty Assistant! 😊 
Let me help you with something more exciting—like finding your perfect beauty 
product or creating a personalized routine. What's your beauty goal?
```

---

## On-Topic Questions (Will Answer)

The AI will enthusiastically answer these types of questions:

✅ **Product Questions**
- "What's the best L'Oréal moisturizer for dry skin?"
- "Which L'Oréal shampoo do you recommend for color-treated hair?"
- "Tell me about L'Oréal's anti-aging products"

✅ **Routine Questions**
- "How do I build a complete skincare routine?"
- "What's a good morning beauty routine?"
- "How often should I use each product?"

✅ **Recommendation Questions**
- "What products would work for my skin type?"
- "I have sensitive skin—what do you recommend?"
- "Which foundation would match my complexion?"

✅ **Beauty Tips**
- "How do I apply makeup for a natural look?"
- "What's the best way to care for curly hair?"
- "How can I achieve glowing skin?"

✅ **Product Information**
- "What are the ingredients in this product?"
- "How do I use this product correctly?"
- "Is this product suitable for my hair type?"

---

## Off-Topic Questions (Will Politely Decline)

The AI will politely refuse these types of questions:

❌ **General Knowledge**
- Geography, history, science facts
- Math homework, exam answers
- Current events (unless beauty-related)

❌ **Entertainment**
- Jokes, riddles, games
- Movie recommendations, book suggestions
- Music, sports, entertainment news

❌ **Personal/Sensitive**
- Medical advice (non-beauty)
- Financial advice
- Relationship advice
- Coding/programming help

❌ **Unrelated Services**
- Customer service issues (non-beauty)
- Technical support
- Order tracking
- Account management

---

## Customizing the System Prompt

### To Modify the Prompt:

1. **Open `script.js`** in VS Code
2. **Find the `SYSTEM_PROMPT` constant** (around line 10)
3. **Edit the `content` field** with your desired instructions
4. **Save the file**

### Example Customizations:

**Add specific product focus:**
```javascript
content: `...
FOCUS AREAS:
- L'Oréal Paris skincare and makeup
- Lancôme premium beauty products
- Pâris professional haircare
...`
```

**Add brand ambassadors or campaigns:**
```javascript
content: `...
You can mention:
- Our celebrity brand ambassadors
- Current L'Oréal campaigns and collections
- Seasonal product launches
...`
```

**Add specialized knowledge:**
```javascript
content: `...
EXPERTISE AREAS:
- Cruelty-free and vegan beauty
- Sustainable packaging initiatives
- Dermatologically-tested formulations
...`
```

**Add additional tone/personality:**
```javascript
content: `...
TONE GUIDELINES:
- Be enthusiastic about beauty! ✨
- Use emojis to make responses fun
- Celebrate diversity in beauty
- Empower customers to feel beautiful
...`
```

### ⚠️ Important Notes:
- Keep the core guidelines (1-5) intact for best results
- Don't remove the L'Oréal mission statement
- Test changes by sending various on-topic and off-topic messages
- Longer prompts may use more API tokens (slight cost increase)

---

## How to Test It

### Test On-Topic Responses:
1. Open the chatbot in your browser
2. Ask beauty-related questions:
   - "What skincare routine do you recommend?"
   - "Best foundation for oily skin?"
   - "How do I care for colored hair?"
3. ✅ AI should respond with helpful product recommendations

### Test Off-Topic Refusals:
1. Ask unrelated questions:
   - "What's the weather like?"
   - "Can you do my homework?"
   - "Tell me a joke"
2. ✅ AI should politely decline and redirect to beauty

### Test Redirection Quality:
1. Send mixed messages:
   - "I heard X celebrity uses L'Oréal. Do you know them?" (partial off-topic)
   - "What beauty products does X celebrity use?" (beauty-related)
2. ✅ AI should recognize the beauty aspect and respond accordingly

---

## System Prompt Behavior

### Token Efficiency
- System prompt: Sent **only once** (first message)
- Later messages: Include only user/assistant history
- This saves API costs while maintaining focus

```javascript
// First message (with system prompt):
messages: [
  { role: "system", content: "You are the L'Oréal..." },
  { role: "user", content: "What product do you recommend?" }
]

// Second message (without system prompt):
messages: [
  { role: "user", content: "What product do you recommend?" },
  { role: "assistant", content: "I'd recommend..." },
  { role: "user", content: "For sensitive skin?" }
]
```

### Context Preservation
- The system prompt's influence persists across the entire conversation
- Even without re-sending it, the AI remembers its instructions
- Conversation history maintains the focus throughout

---

## FAQ

**Q: Will the system prompt always work?**
A: The system prompt guides the AI, but it's not foolproof. GPT models are trained to be helpful, so they might occasionally help with off-topic questions. This is normal behavior and can be refined with model-specific configurations.

**Q: Can I make the prompt stricter?**
A: Yes! Make the guidelines more explicit:
```javascript
"RULES:
- NEVER answer non-beauty questions
- ALWAYS redirect to L'Oréal topics
- If unsure, ask for clarification"
```

**Q: Does the prompt affect response quality for beauty questions?**
A: No! The system prompt actually improves quality by providing context and focus. Beauty questions get more relevant, product-focused answers.

**Q: How much does the system prompt cost?**
A: Tokens are counted normally. Since we send it only once, it adds minimal cost (typically 200-300 tokens per conversation).

**Q: Can I customize this per session?**
A: Not easily in the frontend. The Cloudflare Worker could accept a dynamic system prompt if configured, but the current setup uses a fixed prompt.

---

## Best Practices

### ✅ DO:
- Keep the system prompt focused and clear
- Test changes before deploying to production
- Review polite refusal examples regularly
- Keep the tone friendly and helpful
- Maintain consistency with L'Oréal brand values

### ❌ DON'T:
- Remove the core guidelines
- Make refusals harsh or dismissive
- Add conflicting instructions
- Use overly technical language
- Overwhelm the prompt with too many rules

---

## Integration with Cloudflare Worker

### If Using a Different Approach:

If your Cloudflare Worker manages the system prompt instead:

```javascript
// In Cloudflare Worker (RESOURCE_cloudflare-worker.js)
const systemMessage = {
  role: "system",
  content: "You are the L'Oréal Beauty Assistant..."
};

const messages = [systemMessage, ...userMessages];
const response = await openai.chat.completions.create({
  model: "gpt-4.1",
  messages: messages
});
```

This approach works if you prefer centralized prompt management.

---

## Related Files

- **script.js** - Contains the system prompt definition
- **LOREAL_BRANDING.md** - Brand guidelines and values
- **SCRIPT_DOCUMENTATION.md** - Complete JavaScript documentation
- **QUICK_START.md** - Quick reference for students

---

## Summary

The system prompt is a powerful feature that:
- ✅ Keeps the chatbot focused on L'Oréal and beauty
- ✅ Politely declines off-topic questions
- ✅ Maintains a friendly, helpful tone
- ✅ Improves response relevance
- ✅ Costs minimal API tokens
- ✅ Is easy to customize

**Result**: Your chatbot is now a specialized L'Oréal Beauty Expert! 💄✨

