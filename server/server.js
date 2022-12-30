// all setup and configuration to call OpenAI's API
// can access GPT-3, Codex, and DALL-E :D

import express from 'express';
import * as dotenv from 'dotenv'; // allows data to be read from the .env file (secure environment variable implementation)
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express(); // initialises an express application
app.use(cors()); // allows cross-origin requests, so app can be used from the front-end
app.use(express.json()); // allows json to bbe passed from frontend to backend
app.get('/', async (req, res) => { // dummy root route, HTTP GET request
    res.status(200).send({ // returns status 200 - OK
        message: 'Hello From Da Vinci!', // returns message, optional
    })
})

// GET requests can't receive a lot of data from the front-end
// POST request allows for a body, in which data can be placed
app.post('/', async (req,res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`, // The prompt to start completing from
            temperature: 0.5, // A measure of randomness; 0 = V low risk, 1 = risky (may be wrong)
            max_tokens: 500, // Max response length, max=4000
            // echo=True,  Whether to return the prompt in addition to the generated completion
            top_p: 1.0,
            frequency_penalty: 0.3, // higher = less likely to say simiiilar stuff to before
            presence_penalty: 0.2,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
})

app.listen(5000, () => console.log('Server is running on https://openai-api-app-00nk.onrender.com'));