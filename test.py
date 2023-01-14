import json

# Open the JSON file
with open("data.json", "r") as file:
    data = json.load(file)

# Create an empty list to store the new JSON data
new_data = []

# Iterate through each record in the JSON data
for i, record in enumerate(data):
    # Retrieve the "parent_domain" key
    parent_domain = record["parent_domain"]
    # Create a new dictionary with the desired format
    new_record = {
        "id": i,
        "priority": 1,
        "action": {"type": "block"},
        "condition": {"urlFilter": parent_domain, "resourceTypes": ["main_frame"]},
    }
    # Append the new record to the list
    new_data.append(new_record)

# Write the new JSON data to a file
with open("new_data.json", "w") as file:
    json.dump(new_data, file, indent=2)
