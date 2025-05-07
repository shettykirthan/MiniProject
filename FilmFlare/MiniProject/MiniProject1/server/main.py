from flask import Flask, request, jsonify 
from flask_cors import CORS
import google.generativeai as genai
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID
from appwrite.query import Query
import json
import re
import time

app = Flask(__name__)
CORS(app)

# Appwrite Configuration
client = Client()
client.set_endpoint('https://fra.cloud.appwrite.io/v1')
client.set_project('681a51db003897131653')
client.set_key('standard_528ade62e360961e963f75e5d8ec1de1f7c59ccbc2b07d960e21ab1a126fe332b03878fb872d372f20211145f9546160316bcfa985af4e6014062232a7e1a769828cc6ddfbb53f7fc2ad667fb993142f3cb75176c2e5f3f7a4354e6395fb88b360d0e59b1b160362e5368ef97b6b44e953ab5cf63891dfb131e5abe211de219d')
databases = Databases(client)

# Gemini AI config
genai.configure(api_key="AIzaSyD8bn_xhL75EMan-0b8ypOVTk1xyBIaqms")
model = genai.GenerativeModel("gemini-2.0-flash-thinking-exp")

def save_gemini_response_to_json(response_text, filename="movies.json"):
    try:
        # Extract JSON from code block using regex
        match = re.search(r"```json\s*(.*?)\s*```", response_text, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON block found in the response.")

        json_str = match.group(1).strip()

        # Parse string into Python object
        data = json.loads(json_str)

        # Save to JSON file
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)

        print(f"Saved data to {filename}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response

@app.route("/Bot", methods=["GET"])
def bot():
    response = model.generate_content("Hello, how are you?")
    print(response.text)
    return jsonify({"response": response.text})

@app.route("/ClientId", methods=["POST"])
def client_id():
    data = request.get_json()
    user_id = data.get("userId")
    print(f"Received user ID: {user_id}")
    return jsonify({"status": "success", "userId": user_id}), 200

def fetchMovies():
    try:
        documents = databases.list_documents(
            database_id="681a5267003b0b30f961",
            collection_id="681a559e003a968de015",
        )
        # print("Movies:", documents)
        return documents
    except Exception as e:
        print("Error fetching movies:", str(e))
        return "Error fetching movies"

@app.route("/UserDocuments", methods=["POST"])
def list_user_documents():
    data = request.get_json()
    user_id = data.get("userId")
    print(f"Fetching documents for user ID: {user_id}")

    try:
        documents = databases.list_documents(
            database_id="681a5267003b0b30f961",  # your actual database ID
            collection_id="681a527a000c0de65f7a",  # your actual collection ID
            queries=[Query.equal("userId", user_id)]
        )
        Movies = fetchMovies()

        text = f"""
        Now based on the movie data {Movies} and the user preferences {documents},
        generate a personalized movie recommendation for the user.
        in the format of a JSON object with the following fields:
        - id (should start from 1 and increment for each movie)
        - title
        - poster
        - description
        - year
        - rating
        - genres
        """

        response = model.generate_content(text)
        print(response.text)
        save_gemini_response_to_json(response.text)
        time.sleep(10)
        # print("Movies:", Movies)
        # print("Documents:", documents)
        return jsonify(documents), 200
    except Exception as e:
        print("Error fetching documents:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
