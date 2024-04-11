
const modelUrl = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';

async function formatPrompt(message, history) {
  let prompt = "<s>";
  for (const [userPrompt, botResponse] of history) {
	prompt += `[INST] ${userPrompt} [/INST] ${botResponse}</s> `;
  }
  prompt += `[INST] ${message} [/INST]`;
  return prompt;
}

async function getHelpDeskResponse(prompt, history, temperature = 0.9, maxNewTokens = 256, topP = 0.95, repetitionPenalty = 1.0) {
  temperature = parseFloat(temperature);
  if (temperature < 1e-2) {
	temperature = 1e-2;
  }
  topP = parseFloat(topP);

  const generateParams = {
	temperature,
	max_new_tokens: maxNewTokens,
	top_p: topP,
	repetition_penalty: repetitionPenalty,
	do_sample: true,
	seed: 42,
  };

  const formattedPrompt = await formatPrompt(prompt, history);

  let output = "";
  try {
	const response = await fetch(modelUrl, {
	  method: 'POST',
	  headers: {
		Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify({
		inputs: formattedPrompt,
		parameters: generateParams
	  })
	});

	if (!response.ok) {
		return {
			output: 'Sorry there was an error. Please try again after a few seconds',
			updatedHistory: history
		}
		//   throw new Error(`HTTP error! Status: ${response.status}`);
	}

	const responseData = await response.json();
	output = responseData[0].generated_text.split('[/INST] ').pop()

	

	return {output, updatedHistory: [...history, [prompt, output]]};
  } catch (error) {
	
	return {
		output: 'Sorry there was a network error. Please check you connection and try again after a few seconds',
		updatedHistory: history
	}
  }
}

// Example usage:
// const prompt = "Give me my rights";
// const history = [];
// generate(prompt, history).then(output => {
//   
// });

// const prompt2 = "Explain the first right from the previous response more thoroughly";
// generate(prompt2, history).then(output => {
// 	
// });


//ORIGINAL METHOD 
// async function getHelpDeskResponse(input) {
//     input = '[INST]' + input + '[/INST]'
//     const data = {
//         'inputs': input
//     }
// 	const response = await fetch(
// 		"https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
// 		{
// 			headers: { Authorization: `Bearer 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`, 'Content-Type': 'application/json' },
// 			method: "POST",
// 			body: JSON.stringify(data),
// 		}
// 	);
// 	const result = await response.json();
// 	return result;
// }

// query({"inputs": "Can you please let us know more details about your "}).then((response) => {
// 	
// });

export default getHelpDeskResponse