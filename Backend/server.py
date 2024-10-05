import boto3
import json
import os

from botocore.exceptions import ClientError

client = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-west-2"
)

# Set the model ID
model_id = "us.meta.llama3-2-90b-instruct-v1:0"

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

# Define the user-specific prompt.
user_prompt = """
As a family of four, we are planning a 2-day road trip from Seattle to Vancouver with a budget of $5000. 
We want to spend 5 hours travelling the first day and 7 hours the next day.
"""

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

# The request payload using the model's structure.
native_request = {
    "prompt": formatted_prompt,
    "max_gen_len": 512,
    "temperature": 0.4,
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


