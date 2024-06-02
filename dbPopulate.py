from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb+srv://wasiflh:AGhIrKgcQlJCeSFz@shared-table.payebkr.mongodb.net/?retryWrites=true&w=majority&appName=shared-table')
db = client['test']  # Replace 'your_database' with your actual database name

# Retrieve all restaurants
restaurants = db.restaurants.find()

# Iterate over each restaurant
for restaurant in restaurants:
    # Create a new donation entry
    donation = {
        'restaurantID': str(restaurant['_id']),  # Convert ObjectId to string
        'totalDonation': 0
    }

    # Insert the donation entry into the donations collection
    db.donations.insert_one(donation)

print('Initial donations created successfully.')