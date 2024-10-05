import boto3
import json
import markdown
import pdfkit
from io import BytesIO
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from botocore.exceptions import ClientError

# Create a Bedrock Runtime client.
client = boto3.client("bedrock-runtime", region_name="us-west-2")

# Set the model ID
model_id = "us.meta.llama3-2-90b-instruct-v1:0"

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the frontend

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
        must_see_attractions = user_input.get('mustSeeAttractions', ['CNN Tower', 'Cafe'])
        additional_info = user_input.get('additionalInfo', 'Additional information here')

        # Format the prompt for the LLM
        prompt = (
            f"Suggest a sustainable trip plan from {start_location} to {end_location} "
            f"from {start_date} to {end_date} on a budget of {budget} dollars. "
            f"There are {number_of_people} people traveling. Please provide the schedule in intervals of "
            f"{schedule_granularity} hour(s). Include the following attractions: {', '.join(must_see_attractions)}. "
            f"Additional information: {additional_info}."
        )

        # Format the prompt to fit the model's instruction format
        formatted_prompt = f"""
        <|begin_of_text|><|start_header_id|>user<|end_header_id|>
        {prompt}
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



# import boto3
# import json
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# from botocore.exceptions import ClientError

# # Create a Bedrock Runtime client.
# client = boto3.client("bedrock-runtime", region_name="us-west-2")

# # Set the model ID
# model_id = "us.meta.llama3-2-90b-instruct-v1:0"

# app = Flask(__name__)
# CORS(app)  # Enable CORS to allow requests from the frontend


# @app.route('/generate-trip', methods=['POST'])
# def generate_trip():
#     try:
#         # Get the user's input from the request body
#         user_input = request.json
#         start_location = user_input.get('startLocation', 'Seattle')
#         end_location = user_input.get('endLocation', 'Vancouver')
#         start_date = user_input.get('startDate', '2024-01-22')
#         end_date = user_input.get('endDate', '2024-02-01')
#         budget = user_input.get('budgetInDollars', 1500)
#         numberOfPeople = user_input.get('numberOfPeople', 4)
#         scheduleGranularity = user_input.get('scheduleGranularity', 4)
#         mustSeeAttractions = user_input.get('mustSeeAttractions', ['CNN Tower', 'Cafe'])
#         additionalInfo = user_input.get('additionalInfo', 'Additional information here')


#         # Format the prompt for the LLM
#         prompt = f"Suggest a sustainable trip plan from {start_location} to {end_location} from {start_date} to {end_date} on a budget of {budget} dollars. 
#         There are {numberOfPeople} travelling. Please give the schedule in interval of {scheduleGranularity} hour(s). 
#         In the itinerary please include these attractions: {mustSeeAttractions}.
#         Here is some additional information to consider for the itinerary: {additionalInfo}."
#         formatted_prompt = f"""
#         <|begin_of_text|><|start_header_id|>user<|end_header_id|>
#         {prompt}
#         <|eot_id|>
#         <|start_header_id|>assistant<|end_header_id|>
#         """

#         # Create the request payload using the model's structure.
#         native_request = {
#             "prompt": formatted_prompt,
#             "max_gen_len": 512,
#             "temperature": 0.5,
#         }

#         # Convert the request to JSON.
#         request_body = json.dumps(native_request)


# # # Define the prompt for the model.
# # prompt = f"Suggest a sustainable trip plan from {start_location} to {end_location} for {days} day(s) in a car, budget = ${budget}."
# # prompt = "Suggest a sustainable trip plan from Seattle to Vancouver for 1 day in a car, budget = $5000."

# # # Embed the prompt in Llama 3's instruction format.
# # formatted_prompt = f"""
# # <|begin_of_text|><|start_header_id|>user<|end_header_id|>
# # {prompt}
# # <|eot_id|>
# # <|start_header_id|>assistant<|end_header_id|>
# # """

# # # he request payload using the model's structure.
# # native_request = {
# #     "prompt": formatted_prompt,
# #     "max_gen_len": 512,
# #     "temperature": 0.5,
# # }

# # # Convert the request to JSON.
# # request = json.dumps(native_request)




# try:
#     streaming_response = client.invoke_model_with_response_stream(
#         modelId=model_id, body=request
#     )

#     for event in streaming_response["body"]:
#         chunk = json.loads(event["chunk"]["bytes"])
#         if "generation" in chunk:
#             print(chunk["generation"], end="")

# except (ClientError, Exception) as e:
#     print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
#     exit(1)


