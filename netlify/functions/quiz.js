exports.handler = async (event) => {

  try {

    const body = JSON.parse(event.body || "{}");
    const topic = body.topic || "general knowledge";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Create 5 MCQ quiz questions about ${topic}. Format as JSON array with question, options, and answer.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No quiz generated";

    return {
      statusCode: 200,
      body: JSON.stringify({ quiz: text })
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };

  }

};
