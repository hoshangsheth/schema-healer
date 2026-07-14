# Import required libraries:
import json
from pathlib import Path

# Create Base Directory:
BASE_DIR = Path(__file__).resolve().parent.parent

# Create Schema Path:
SCHEMA_PATH = (
    BASE_DIR/"resources"/"schemas"/"schema.json"
)

# Define a function to load expected schema:
def load_expected_schema():
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as file:
        data = json.load(file)

    return data['expected_schema']