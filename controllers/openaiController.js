const moment = require('moment');
const { Configuration, OpenAIApi } = require('openai');
const OpenAI = require('openai');
// import OpenAI from "openai";

// OpenAI configuration

// const openai = new OpenAIApi(configuration);
const openai = new OpenAI({
    apiKey: "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" || process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
});


  
async function summarizeEvents(eventGroups) {
  let timeline;
  console.log(eventGroups);
//   for (const group of eventGroups) {
    // const descriptions = group.map((e) => e.description).join("\n");
    const prompt = `Create a timeline around these images and make the json response for creating a timeline be creative with thr story : output exmaple : [
    {"dateFrom": "2022-01-01",
    "dateTo": "2022-01-31",
    "story": "Story about the event",
    "images": ["url1", "url2", "url"],}
    ] here is your input data : ${JSON.stringify(eventGroups)} Ensure the response is valid JSON, and give me only the JSON output, no additional text.`;
     console.log(prompt);
    const message =[ {
        role: "user",
        content: prompt
      }];
    try {
    //   const completion = await openai.createCompletion({
    //     model: "text-davinci-003",
    //     prompt: prompt,
    //     max_tokens: 150,
    //   });

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a story teller chatbot who replies in json format" },
          ...message,
  
        ],
  
        model: "gpt-3.5-turbo",
        temperature: 1,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
        console.log("Completion:", completion);
   // Extract the content from the response
   let rawResponse = completion.choices[0].message.content.trim();

   // Attempt to parse the JSON
   try {
     timeline = JSON.parse(rawResponse);
   } catch (jsonError) {
     console.warn("Initial JSON parse failed, cleaning response...");
     // Clean the response by finding the JSON object
     const firstBraceIndex = rawResponse.indexOf("[");
     const lastBraceIndex = rawResponse.lastIndexOf("]");

     if (firstBraceIndex !== -1 && lastBraceIndex !== -1) {
       const potentialJson = rawResponse.slice(firstBraceIndex, lastBraceIndex + 1);

       // Try parsing again
       timeline = JSON.parse(potentialJson);
     } else {
       throw new Error("Could not extract valid JSON from the response.");
     }
   }
    } catch (error) {
      console.error("Error summarizing events:", error.message);
    // }
  }
  
  return (timeline);
}

// Main function
async function createTimeline(groupedEvents) {
  if (!groupedEvents) {
    console.error("Invalid response data");
    return;
  }

//   const events = extractEvents(response.data);
//   const groupedEvents = groupEvents(events);
  const timeline = await summarizeEvents(groupedEvents);

  console.log("Generated Timeline:", JSON.stringify(timeline, null, 2));
    return timeline;
}

module.exports = { createTimeline };