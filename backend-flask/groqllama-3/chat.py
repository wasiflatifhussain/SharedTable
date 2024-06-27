import os

from groq import Groq

client = Groq(
    api_key="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",
)

with open("story.txt", "r") as file:
    inputstr = file.read()

print(inputstr)
chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Tell me if the story below is appropriate or relevant for a website promoting food sustainability and inspiring people. If not appropriate or not relevant, just reply 'NOT' and finish. But if it appropriate, reply with 'APPROPRIATE', and then, fix up the grammar without changing the story and give it to me."+inputstr,
        }
    ],
    model="llama3-8b-8192",
)
print(chat_completion.choices[0].message.content)

if "APPROPRIATE" in chat_completion.choices[0].message.content:
    chat_completion2 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Just give me the story itself and remove all extra stuff from here: "+chat_completion.choices[0].message.content,
            }
        ],
        model="llama3-8b-8192",
    )
    chat_completion3 = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Rate this story out of 10. No need explanation. Just a rating number as output: "+chat_completion2.choices[0].message.content,
            }
        ],
        model="llama3-8b-8192",
    )
    print(chat_completion2.choices[0].message.content)
    print(chat_completion3.choices[0].message.content)
elif "NOT" in chat_completion.choices[0].message.content:
    print("NOT")
    
    
    
    
# import os
# import base64
# from pymongo import MongoClient
# from groq import Groq

# # MongoDB client setup
# clientM = MongoClient('mongodb+srv://wasiflh:AGhIrKgcQlJCeSFz@shared-table.payebkr.mongodb.net/?retryWrites=true&w=majority&appName=shared-table')
# db = clientM['test']  # Replace 'your_database' with your actual database name

# # Groq API client setup
# client = Groq(
#     api_key="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",
# )

# # Read input story from file
# with open("story.txt", "r") as file:
#     inputstr = file.read()

# # Check if the story is appropriate
# chat_completion = client.chat.completions.create(
#     messages=[
#         {
#             "role": "user",
#             "content": "Tell me if the story below is appropriate for a website promoting sustainability and inspiring people. If not appropriate, just reply 'NOT' and finish. But if it appropriate, reply with 'APPROPRIATE', and then, fix up the grammar without changing the story and give it to me." + inputstr,
#         }
#     ],
#     model="llama3-8b-8192",
# )

# if "APPROPRIATE" in chat_completion.choices[0].message.content:
#     # Fix the story grammar
#     chat_completion2 = client.chat.completions.create(
#         messages=[
#             {
#                 "role": "user",
#                 "content": "Just give me the story itself and remove all extra stuff from here: " + chat_completion.choices[0].message.content,
#             }
#         ],
#         model="llama3-8b-8192",
#     )
    
#     # Rate the story
#     chat_completion3 = client.chat.completions.create(
#         messages=[
#             {
#                 "role": "user",
#                 "content": "Rate this story out of 10. No need explanation. Just a rating number as output: " + chat_completion2.choices[0].message.content,
#             }
#         ],
#         model="llama3-8b-8192",
#     )
    
#     # Prepare story data
#     title = "Aisha Khan: Restaurant Rescue Leader"
#     story = chat_completion2.choices[0].message.content
#     author = "SharedTable"
#     rating = chat_completion3.choices[0].message.content

#     # Convert image to base64 byte format
#     with open("../temp/5.jpg", "rb") as image_file:
#         image_data = base64.b64encode(image_file.read()).decode('utf-8')

#     storyEntry = {
#         "title": title,
#         "story": story,
#         "author": author,
#         "rating": rating,
#         "image": image_data,
#     }
    
#     # Insert the story entry into MongoDB
#     db.stories.insert_one(storyEntry)
    
# elif "NOT" in chat_completion.choices[0].message.content:
#     print("NOT")
