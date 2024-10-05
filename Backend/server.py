import boto3
import json
import markdown
import pdfkit
from io import BytesIO
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from botocore.exceptions import ClientError

client = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-west-2"
)

# Set the model ID
model_id = "us.meta.llama3-2-90b-instruct-v1:0"

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the frontend

@app.route('/', methods=['GET'])
def hello():
    return "Hello!"

@app.route('/', methods=['POST'])
def receive_data():
    # Access the JSON data from the request
    request_data = request.json

    # Respond with a basic JSON response
    return jsonify({
        'message': 'Data received successfully!',
        'receivedData': request_data
    })

@app.route('/generate-trip', methods=['POST'])
def generate_trip():
    try:
        # Get the user's input from the request body
        user_input = request.json
        start_location = user_input.get('startLocation', 'Seattle')
        end_location = user_input.get('endLocation', 'Vancouver')
        start_date = user_input.get('startDate', '2024-01-22')
        end_date = user_input.get('endDate', '2024-02-01')
        budget = user_input.get('budgetInDollars', 1500)
        number_of_people = user_input.get('numberOfPeople', 4)
        schedule_granularity = user_input.get('scheduleGranularity', 4)
        must_see_attractions = user_input.get(
            'mustSeeAttractions', ['CNN Tower', 'Cafe'])
        additional_info = user_input.get(
            'additionalInfo', 'Additional information here')

        # Define the system prompt with instructions for the model.
        system_prompt = """
        You are an intelligent assistant that provides eco-friendly and sustainable travel recommendations. 
        In a concise format, offer travel plans that minimize environmental impact while staying within the user's budget, 
        using sustainable practices such as choosing eco-friendly transportation, accommodation, and activities.
        """

        # Using CoT few-shot prompting. This is the Chain-of-Thought Example (between system and user prompts).
        example_prompt = """
        <|start_example|>
        <|start_header_id|>For example, say that a user says:<|end_header_id|>
        I want to plan a 1-day trip from Los Angeles to Santa Barbara for two people. 
        I have a budget of $1000 and want to minimize my environmental impact. 
        What can you recommend for transportation, food, and activities?
        <|eot_id|>
        <|start_header_id|>Then the example output would be:<|end_header_id|>
        Hey, it's great that you're trying to be eco-friendly throughout your trip!
        For a 1-day eco-friendly trip from Los Angeles to Santa Barbara, consider the following:
        1. Transportation: Rent an electric vehicle or take a bus (e.g., FlixBus) to reduce emissions. The round trip will take around 2 hours. Cost: approx. $30.
        2. Food: Try farm-to-table restaurants such as The Lark, which prioritizes locally sourced ingredients. Average meal price for two: $100.
        3. Activities: Visit the Santa Barbara Botanical Garden (entry $15), or enjoy a guided kayaking tour for an eco-friendly experience. Total cost for activities: $50.
        Total budget spent: $195, leaving ample room for other expenses. Enjoy your trip!
        <|eot_id|>
        <|end_example|>
        """

        user_prompt = (
            f"Suggest a sustainable trip plan from {start_location} to {end_location} "
            f"from {start_date} to {end_date} on a budget of {budget} dollars. "
            f"There are {number_of_people} people traveling. Please provide the schedule in intervals of "
            f"{schedule_granularity} hour(s). Include the following attractions: {', '.join(must_see_attractions)}. "
            f"Additional information: {additional_info}."
        )

        # Combine system, example, and user prompts.
        formatted_prompt = f"""
        <|begin_of_text|><|start_header_id|>system<|end_header_id|>
        {system_prompt}
        <|eot_id|>
        {example_prompt}
        <|start_header_id|>user<|end_header_id|>
        {user_prompt}
        <|eot_id|>
        <|start_header_id|>assistant<|end_header_id|>
        """

        # Create the request payload using the model's structure
        native_request = {
            "prompt": formatted_prompt,
            "max_gen_len": 512,
            "temperature": 0.5,
        }

        # Convert the request to JSON
        request_body = json.dumps(native_request)

        # Call the model using AWS Bedrock
        streaming_response = client.invoke_model_with_response_stream(
            modelId=model_id, body=request_body
        )

        # Process the model's response
        generated_response = ""
        for event in streaming_response["body"]:
            chunk = json.loads(event["chunk"]["bytes"])
            if "generation" in chunk:
                generated_response += chunk["generation"]

        # Convert the response to a Markdown format
        markdown_content = f"# Trip Plan\n\n{generated_response}"

        # Convert Markdown to HTML
        html_content = markdown.markdown(markdown_content)

        # Convert HTML to PDF using pdfkit
        pdf = pdfkit.from_string(html_content, False)

        # Create a BytesIO stream to hold the PDF data
        pdf_stream = BytesIO(pdf)

        # Send the PDF file as the response
        return send_file(pdf_stream, as_attachment=True, download_name='trip_plan.pdf', mimetype='application/pdf')

    except ClientError as e:
        return jsonify({"error": f"ClientError: Unable to invoke model {model_id}. Reason: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
