# Ecowander.ai
CIC Hackathon Git Repo - Eco-Friendly Travel Planner

Travel smarter, stay within your budget, and contribute to a greener future with every adventure!

## Video Demo
https://github.com/user-attachments/assets/c932e977-6845-49cc-a6d7-6dc1ce168fcf

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
To run the python file server.py:

#### For Linux
```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python server.py
```

#### For Windows
```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python server.py
```

More information on Backend:

We leveraged Amazon Bedrock with the Llama 3 foundational model and applied prompt engineering techniques to generate dynamic prompts based on user input. The API requests were processed using Flask, and we incorporated few-shot learning to customize the prompt responses. Both the frontend and backend were deployed on an AWS EC2 instance.
