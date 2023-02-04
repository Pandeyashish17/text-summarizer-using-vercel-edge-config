import { OpenAIStream } from "../../utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

const handler = async (req)=> {
  const { prompt } = (await req.json()) 

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 3000,
    stream: true,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;