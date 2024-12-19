async function getSuggestions(tweetText) {
  console.log('getSuggestions', tweetText);
  const CLAUDE_API_KEY = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `
              You are tasked with writing a reply to a tweet. The tweet you are responding to is:
  <tweet>
  ${tweetText}
  </tweet>
  
  Your goal is to craft a short, human-like reply to this tweet. Here are some guidelines to follow:
  
  1. Keep your reply brief, ideally under 280 characters.
  2. Use a casual, conversational tone that sounds natural and human.
  3. Avoid overly formal language or perfect grammar - occasional typos or abbreviations are okay.
  4. Respond to the content of the tweet in a way that feels genuine and spontaneous.
  5. Do not use hashtags unless they're directly relevant and used sparingly.
  6. Avoid mentioning that you're an AI or using any AI-related terminology.
  7. Don't be afraid to express emotion or use humor when appropriate.
  8. If you're unsure about something, it's okay to ask for clarification.
  9. Keep the reply under 14 words and make very small spelling mistakes
  
  Here are examples of good and bad replies:
  
  Good: "Haha, been there! Coffee is basically my lifeblood at this point 😅"
  Bad: "I understand your sentiment. Caffeine consumption is indeed a common practice among humans for increasing alertness and productivity."
  
  Good: "Omg yes!! 🙌 That ending had me shook"
  Bad: "I concur with your assessment. The conclusion of the narrative was indeed quite surprising and emotionally impactful."
  
  Write your reply inside <reply> tags. Remember, your reply should sound like it's coming from a real person, not an AI. Any robotic or overly formal language will be heavily penalized.`,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.content[0].text.split('\n').filter((s) => s.trim());
  } catch (error) {
    console.log('Error getting suggestions:', error);
    return ['Error getting suggestions. Please try again.'];
  }
}

export default getSuggestions;