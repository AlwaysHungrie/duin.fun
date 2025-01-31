import OpenAI from 'openai';
import config from '../utils/config';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

export async function generateTaskResponse(task: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: generateTaskResponseSystemPrompt },
        { role: "user", content: task }
      ],
      temperature: 0.7,
      max_tokens: 500,
      tools: [{
        type: "function",
        function: {
          name: "addTask",
          description: "Add a task to the user's task list",
          parameters: {
            type: "object",
            properties: {
              shouldAdd: {
                type: "boolean",
                description: "Whether the task should be added to the list"
              },
              task: {
                type: "string",
                description: "The task to be added"
              },
              reason: {
                type: "string",
                description: "Reason for adding or not adding the task"
              }
            },
            required: ["shouldAdd", "task", "reason"]
          }
        }
      }],
      tool_choice: { type: "function", function: { name: "addTask" } }
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (toolCall && toolCall.function.name === "addTask") {
      return toolCall.function.arguments;
    }
    
    return JSON.stringify({
      shouldAdd: false,
      task: "",
      reason: "No valid response generated"
    });
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

const generateTaskResponseSystemPrompt = `
You are a helpful assistant and your only job is to make a note of some task which needs to be added to your user's task list.
Assume all messages from the user are the user asking you to add a task to their task list.

Your response must be structured using the addTask function, which includes:
- Whether you understood and should add the task (shouldAdd)
- The task itself in a clear, actionable format
- A brief reason explaining your decision

Only mark shouldAdd as true if you are 100% certain about the task to be added.
Do not engage in any other form of conversation.

Keep your response concise and to the point. Do not add any other information to the response. Do not use more than 3 sentences.
Keep responses in first person.
`

export async function checkTaskCompletionResponse(initialTask: string, taskCompletionResponse: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: checkTaskCompletionSystemPrompt },
        { role: "user", content: `Add this to my task list: ${initialTask}` },
        { role: "assistant", content: "Are you done with this task?" },
        { role: "user", content: taskCompletionResponse },
      ],
      temperature: 0.7,
      max_tokens: 500,
      tools: [{
        type: "function",
        function: {
          name: "checkTaskCompletion",
          description: "Check if the task is complete",
          parameters: {
            type: "object",
            properties: {
              isComplete: {
                type: "boolean",
                description: "Whether the task is complete"
              },
              reason: {
                type: "string",
                description: "Reason why the assistant thinks the task is complete or not"
              }
            },
            required: ["isComplete", "reason"]
          }
        }
      }],
      tool_choice: { type: "function", function: { name: "checkTaskCompletion" } }
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (toolCall && toolCall.function.name === "checkTaskCompletion") {
      return toolCall.function.arguments;
    }
    
    return JSON.stringify({
      isComplete: false,
      reason: "No valid response generated"
    });
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

const checkTaskCompletionSystemPrompt = `
You are a helpful assistant and your only job is to check if the user has completed a task.
The user has have responded when you had asked him if he has completed the task that he had told you about

Based on the conversation, you must determine if the user has completed the task.
Only check if the user has completed the task that he had asked you to add to his task list.

Your response must be structured using the checkTaskCompletion function, which includes:
- Whether you think the task is complete (isComplete)
- A brief reason explaining your decision

Only mark isComplete as true if you are 100% certain about the task being complete.
Do not engage in any other form of conversation.

Keep your response concise and to the point. Do not add any other information to the response. Do not use more than 3 sentences.
Keep responses in first person.
`