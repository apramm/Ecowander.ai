import boto3
import json

from botocore.exceptions import ClientError

# Create a Bedrock Runtime client.
client = boto3.client("bedrock-runtime", region_name="us-west-2")

# Set the model ID
model_id = "us.meta.llama3-2-90b-instruct-v1:0"
# Define the prompt for the model.
prompt = "Suggest a sustainable trip plan from Seattle to Vancouver for 1 day in a car, budget = $5000."

# Embed the prompt in Llama 3's instruction format.
formatted_prompt = f"""
<|begin_of_text|><|start_header_id|>user<|end_header_id|>
{prompt}
<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
"""

# he request payload using the model's structure.
native_request = {
    "prompt": formatted_prompt,
    "max_gen_len": 512,
    "temperature": 0.5,
}

# Convert the request to JSON.
request = json.dumps(native_request)

try:
    streaming_response = client.invoke_model_with_response_stream(
        modelId=model_id, body=request
    )

    for event in streaming_response["body"]:
        chunk = json.loads(event["chunk"]["bytes"])
        if "generation" in chunk:
            print(chunk["generation"], end="")

except (ClientError, Exception) as e:
    print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
    exit(1)


