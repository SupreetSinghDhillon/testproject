import fetch from "node-fetch"; // ES Module import

async function categorizeSiteUsingOpenAI(url, categories) {
  // Construct the prompt
  let prompt = `Given the URL '${url}', categorize the site into one of the following categories based on its likely content: ${Object.keys(
    categories
  ).join(", ")}.`;

  // API call to OpenAI using the chat-specific endpoint
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer {openai_api_key}`, // Replace with your actual API key
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  // console.log("OpenAI API Response:", JSON.stringify(data, null, 2)); // Added logging

  if (data.error) {
    throw new Error(`API Error: ${data.error.message}`);
  }

  // Ensure response has a message array and grab the last reply's content
  if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
    throw new Error("No choices returned from OpenAI.");
  }

  return data.choices[0].message.content.trim();
}

// Example usage
const url = "https://www.youtube.com/watch?v=YmGFMLncftE";
const categories2 = {
  articles: ["wikipedia", "etc"],
  lectures_and_demos: ["your-lecture-url-here"],
  step_by_step_tutorials: ["your-tutorial-url-here"],
  discussion_forum_helpseeking: ["stackoverflow"],
  ai_help: ["chat.openai.com", "https://gemini.google.com/app"],
  my_work: ["https://docs.google.com/document"],
  uncategorized: [], // Default column for uncategorized data
};

categorizeSiteUsingOpenAI(url, categories2)
  .then((category) => console.log(`The category for the URL is: ${category}`))
  .catch((error) => console.error("Error categorizing site:", error));
