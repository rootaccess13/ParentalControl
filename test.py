# import json

# # Open the JSON file
# with open("data.json", "r") as file:
#     data = json.load(file)

# # Create an empty list to store the new JSON data
# new_data = []

# # Iterate through each record in the JSON data
# for i, record in enumerate(data):
#     # Retrieve the "parent_domain" key
#     parent_domain = record["parent_domain"]
#     # Create a new dictionary with the desired format
#     new_record = {
#         "id": i,
#         "priority": 1,
#         "action": {"type": "block"},
#         "condition": {"urlFilter": parent_domain, "resourceTypes": ["main_frame"]},
#     }
#     # Append the new record to the list
#     new_data.append(new_record)

# # Write the new JSON data to a file
# with open("new_data.json", "w") as file:
#     json.dump(new_data, file, indent=2)

# import json

# # Read the file line by line
# with open("file.txt", "r") as file:
#     lines = file.readlines()

# # Remove the "0.0.0.0" prefix from each line
# lines = [line.replace("0.0.0.0 ", "") for line in lines]
# # remove \n from each line
# lines = [line.replace("\n", "") for line in lines]


# # Save the remaining portion of the line as a JSON object
# with open("malicious.json", "w") as file:
#     json.dump(lines, file, indent=2)

# import json

# def read_lines(file, chunk_size=1024):
#     """
#     Generator function that reads a file and yields chunks of data of the specified size
#     """
#     while True:
#         data = file.read(chunk_size)
#         if not data:
#             break
#         yield data

# with open("malicious.json", "r") as file:
#     data = []
#     for i, chunk in enumerate(read_lines(file)):
#         for line in chunk.split("\n"):
#             line = line.rstrip()
#             data.append({"id": i,
#                 "priority": 1,
#                 "action": {
#                     "type": "block"
#                 },
#                 "condition": {
#                     "urlFilter": line,
#                     "resourceTypes": [
#                         "main_frame"
#                     ]
#                 }
#             })
#     with open("data_new_malicious.json", "w") as json_file:
#         json.dump(data, json_file, indent=4)

# import json

# with open("phish_5.json", "r") as file:
#     urls = json.load(file)

# json_list = []
# for i, url in enumerate(urls):
#     data = {
#         "id": i,
#         "priority": 1,
#         "action": {
#             "type": "block"
#         },
#         "condition": {
#             "urlFilter": url,
#             "resourceTypes": [
#                 "main_frame"
#             ]
#         }
#     }
#     json_list.append(data)

# with open("rules_7.json", "w") as outfile:
#     json.dump(json_list, outfile, indent=4)



# import json
# from urllib.parse import urlparse

# with open("phish_4.csv", "r") as file:
#     lines = file.readlines()

# domains = []
# for line in lines:
#     split_string = line.split(',')
#     url = split_string[1]
#     parsed_url = urlparse(url)
#     domain = parsed_url.netloc
#     domains.append(domain)

# with open("phish_5.json", "w") as outfile:
#     json.dump(domains, outfile, indent=4)
