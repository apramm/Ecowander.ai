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
        number_of_people = user_input.get('numberOfPeople', 1)
        schedule_granularity = user_input.get('scheduleGranularity', 4)
        must_see_attractions = user_input.get(
            'mustSeeAttractions', 'CNN Tower')
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
        I want to plan a 5-day trip from Vancouver, Canada to New York, United States for 1 person.
        Schedule granularity should be 6 hours for the itinerary. 
        I have a budget of $1999 and want to minimize my environmental impact.
        The must-see places for me are UBC and Statue of Liberty.
        What can you recommend for transportation, food, and activities?
        <|eot_id|>
        <|start_header_id|>Then the example output would be:<|end_header_id|>
        Here's a suggested sustainable trip plan for your 5-day trip from Vancouver to New York:

        Day 1 (2024-10-10)

        0:00 AM: Take the SkyTrain from downtown Vancouver to the Vancouver International Airport (YVR). Cost: approx. $3.
        6:00 AM: Fly from YVR to John F. Kennedy International Airport (JFK) on a fuel-efficient airline like Air Canada. Cost: approx. $500.
        12:00 PM: Take the AirTrain JFK from the airport to the Jamaica Station in Queens. Cost: approx. $7.
        6:00 PM: Check-in at the eco-friendly YOTEL New York, which has a strong commitment to sustainability. Cost: approx. $200 per night.
        12:00 AM: Explore the nearby Times Square, known for its bright lights and bustling energy.

        Day 2 (2024-10-11)

        6:00 AM: Start the day with a visit to the iconic Statue of Liberty, taking a ferry from Battery Park. Cost: approx. $23.
        12:00 PM: Grab lunch at a local, sustainable restaurant like The Butcher's Daughter, which serves vegetarian and vegan options. Cost: approx. $20.
        6:00 PM: Explore the nearby Central Park, a sprawling green oasis in the heart of Manhattan. Take a self-guided walking tour to learn more about its history and ecology.
        12:00 AM: Enjoy dinner at a local restaurant that prioritizes sustainability, such as The Farm on Adderley. Cost: approx. $30.

        Day 3 (2024-10-12)

        6:00 AM: Spend the morning exploring the American Museum of Natural History, which has a strong focus on environmental conservation. Cost: approx. $22.
        12:00 PM: Grab lunch at a nearby café or food truck that serves sustainable and locally sourced food.
        6:00 PM: Visit the nearby High Line, an elevated park built on an old rail line. Take a self-guided walking tour to learn more about its history and design.
        12:00 AM: Enjoy dinner at a local restaurant that prioritizes sustainability, such as The Little Owl. Cost: approx. $30.

        Day 4 (2024-10-13)

        6:00 AM: Take a day trip to the nearby Hudson River Valley, known for its natural beauty and sustainable wineries. Take the Metro-North Railroad from Grand Central Terminal to Cold Spring. Cost: approx. $20.
        12:00 PM: Visit the nearby Storm King Art Center, which features large-scale sculptures and a beautiful landscape. Cost: approx. $20.
        6:00 PM: Return to New York City and enjoy dinner at a local restaurant that prioritizes sustainability, such as The Finch. Cost: approx. $30.

        Day 5 (2024-10-14)

        6:00 AM: Spend the morning exploring the Brooklyn Botanic Garden, a 52-acre green oasis in the heart of Brooklyn. Cost: approx. $15.
        12:00 PM: Grab lunch at a nearby café or food truck that serves sustainable and locally sourced food.
        6:00 PM: Return to Vancouver on a fuel-efficient flight from JFK. Cost: approx. $500.
        12:00 AM: Reflect on a wonderful sustainable trip to New York City.

        Budget Breakdown:

        Transportation: $1000 (flights, trains, and ferries)
        Accommodation: $1000 (4 nights at YOTEL New York)
        Food and activities: $499 (approx. $100 per day for meals and attractions)

        Total: $1999
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
            "max_gen_len": 1000,
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
        # html_content = markdown.markdown(markdown_content)

        # # Convert HTML to PDF using pdfkit
        # pdf = pdfkit.from_string(html_content, False)

        # # Create a BytesIO stream to hold the PDF data
        # pdf_stream = BytesIO(pdf)

        # # Send the PDF file as the response
        # return send_file(pdf_stream, as_attachment=True, download_name='trip_plan.pdf', mimetype='application/pdf')
        
        return jsonify({"response": markdown_content})

    except ClientError as e:
        return jsonify({"error": f"ClientError: Unable to invoke model {model_id}. Reason: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
