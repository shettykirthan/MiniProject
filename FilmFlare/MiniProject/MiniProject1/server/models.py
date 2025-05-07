import google.generativeai as genai

# Configure with your API key
genai.configure(api_key="AIzaSyD8bn_xhL75EMan-0b8ypOVTk1xyBIaqms")

# List available models
models = genai.list_models()

# Print model details
for model in models:
    print(model.name)
