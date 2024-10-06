# Ecowander.ai
CIC Hackathon Git Repo - Eco-Friendly Travel Planner

## Running the Program
### Frontend
In the Frontend folder, do the following commands in order:
```
npm install
cd src
npm run dev
```

### Backend
Go to Backend folder. Then get the AWS CLI credentials, and copy and paste them as a command.
More information on Backend:

We leveraged Amazon Bedrock with the Llama 3 foundational model and applied prompt engineering techniques to generate dynamic prompts based on user input. The API requests were processed using Flask, and we incorporated few-shot learning to customize the prompt responses. Both the frontend and backend were deployed on an AWS EC2 instance.
