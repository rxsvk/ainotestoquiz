exports.handler = async (event) => {
  try {

    const body = JSON.parse(event.body || "{}");
    const topic = body.topic || "general knowledge";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                  text: `Generate 5 multiple choice quiz questions about ${topic}. Show question, 4 options, and correct answer.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    let text = "No quiz generated";

    if (data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]) {

        text = data.candidates[0].content.parts[0].text;
    }

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
