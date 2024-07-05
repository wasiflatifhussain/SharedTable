# SharedTable 🍽️

Welcome to **SharedTable**, an innovative platform designed to streamline restaurant operations, enhance customer engagement, and promote food sustainability by minimizing food wastage. This project leverages cutting-edge technologies to provide a seamless experience for both restaurant owners and customers.

## 🌟 About SharedTable

**SharedTable** is built with a mission to encourage food sustainability and avoid wastage. Here's how it works:

- **Reduce Food Wastage**: Restaurants can post their leftover foods on the platform, allowing people to get the food for free or at very low prices, thereby minimizing food waste.
- **Support Restaurants and the Platform**: Users can support their favorite restaurants and the SharedTable platform through donations, helping both the restaurants and the platform to thrive.
- **Advertisement Opportunities**: SharedTable also provides a space for businesses to post advertisements, generating additional revenue to help keep the platform running. This includes creating, managing, and renewing advertisement plans.

## 🌟 Key Features

1. **Authentication**: Secure user authentication using [Auth0](https://auth0.com/).
2. **Database**: Robust data storage with [MongoDB](https://www.mongodb.com/).
3. **User Verification**: Secure access tokens for user verification and state management.
4. **Image Storage**: Efficient image storage for restaurant owners using [Cloudinary](https://cloudinary.com/).
5. **User Notifications**: Interactive user toasts for notifications.
6. **Modular Code**: Scalable architecture with well-defined components.
7. **Deployment**: Easy deployment on [Render.com](https://render.com/).
8. **UI Components**: Consistent and reusable UI components with [ShadCN Library](https://shadcn.dev/).
9. **Schema Validation**: Type-safe schema frameworks using [Zod](https://github.com/colinhacks/zod).
10. **Payments**: Seamless payment processing with [Stripe](https://stripe.com/).
11. **Real-time Updates**: Real-time delivery details using Stripe CLI webhooks.
12. **Donations Page**: Integrated donations system to support restaurants and the website.
13. **Advertisement System**: Comprehensive advertisement management from creation to renewal.
    - Add advertisements as per wish.
    - Pay for posts by Stripe payment using credit cards.
    - Manage advertisements: change plans, cancel, and renew.
    - Track advertisement reach and appearance frequency.
    - Randomly choose and display advertisements to users.
    - Display advertisements as pop-ups, allowing users to close them.
    - Plan renewal prompts when advertisements are low on display count.
14. **Automatic Food Recognition**: AI-powered image detection system for automatic food recognition, simplifying menu entry processes.
    - https://github.com/wasiflatifhussain/food-image-detection-model-139-classes
15. **AI Integration**: Directly capture food images to detect and update menu items under the manage restaurant section, improving efficiency.
16. **Inspiring Stories**: A section to share and read inspiring stories about sustainability to encourage and inspire more people to support the cause.
    - Uses Llama-3 via Groq to ensure stories are appropriate and well-written.
    - Removes vulgar or inappropriate stories without the need for human moderation.
    - Rates stories out of 10 and sorts by rating

## 🌟 Beta Tester

We have introduced a Beta Tester section where we display all new features that are under beta testing. 

### Current Beta Test

- **AI Image Detection Model for Food Detection**: Our latest AI-powered image detection model for food recognition using DenseNet-201. This feature helps simplify menu entry processes by automatically recognizing food items from images.
    - https://github.com/wasiflatifhussain/food-image-detection-model-139-classes
 <img width="75%" alt="Screenshot 2024-06-27 at 11 45 28 PM" src="https://github.com/wasiflatifhussain/SharedTable/assets/86021138/b278873e-efa3-489b-bc8d-2d8a01d92c5c">

      
## 🥗 Main Objective

Our web app is designed to encourage food sustainability and avoid wastage. Restaurants can post their leftover foods, allowing people to get the food for free or for very little money. Additionally, users can support restaurants and us by donating to either party. The platform also allows users to post advertisements, helping us keep the service running.

## 📸 Samples of the Interface

![Screenshot 1](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/c7d67291-d462-4a58-bcd3-54860be0b65e)
![Screenshot 2](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/58d77816-a65d-4175-9fb4-8483b6d33521)
![Screenshot 3](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/f8d1fbb6-23f7-4d69-a052-7975b9ac70c8)
![Screenshot 4](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/721c83c8-cd85-4f65-bc9d-f790c8930b67)
![Screenshot 5](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/5428e8f7-2eb9-4659-827a-24bda49799ea)
![Screenshot 6](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/4b99d14c-143f-4463-9e56-ae4f6260e694)
![Screenshot 7](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/62cdab53-4e18-413b-8d00-380d55a193a0)
![Screenshot 8](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/b5852b5e-0135-4c8b-b4db-43805516a428)
![Screenshot 9](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/fd1a3ee3-a900-4a46-9a7b-3a247ab2a903)
![Screenshot 10](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/5593d7b0-747a-4b9c-b656-2f81c71bbec8)
![Screenshot 11](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/cb750a33-599b-4090-8ba3-b35f36ebabb5)
![Screenshot 12](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/e8157886-1649-4cef-842f-77c63afa454f)
![Screenshot 13](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/1974eca3-f54f-413a-b7c1-2e301cfd4051)
![Screenshot 14](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/c116ea4b-9c9c-41cf-8f20-9b14c1301658)
![Screenshot 15](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/ed6e5592-a519-455c-9181-f452540516d7)
![Screenshot 16](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/e7a13c42-f6b1-4b02-a0ae-4e7fca9a7b4e)
![Screenshot 17](https://github.com/wasiflatifhussain/SharedTable/assets/86021138/1fad0b82-ca57-4270-b743-60622eaa7334)

<img width="1470" alt="Screenshot 2024-06-27 at 11 42 42 PM" src="https://github.com/wasiflatifhussain/SharedTable/assets/86021138/10927bf8-3294-4c83-a8ea-0e588a9e6e83">
<img width="1470" alt="Screenshot 2024-06-27 at 11 43 26 PM" src="https://github.com/wasiflatifhussain/SharedTable/assets/86021138/cb2b5fa9-21c2-40b1-855b-d0cced958d3b">
<img width="1470" alt="Screenshot 2024-06-27 at 11 43 49 PM" src="https://github.com/wasiflatifhussain/SharedTable/assets/86021138/386495c6-9594-4d6e-95a2-a1b6197785a2">
<img width="1470" alt="Screenshot 2024-06-27 at 11 44 14 PM" src="https://github.com/wasiflatifhussain/SharedTable/assets/86021138/680cc671-f70e-4d90-8d52-eb16949a9dd8">

---

Thank you for checking out **SharedTable**! We hope you find this project as exciting and useful as we do.
