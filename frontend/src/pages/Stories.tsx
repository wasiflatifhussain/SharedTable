import { useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Stories.css';  // Make sure to create this CSS file for the animations
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_2;
import { toast } from "sonner";

const Stories = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [activeTab, setActiveTab] = useState('view');
    const [stories, setStories] = useState([]);
    const [newStory, setNewStory] = useState({
        title: '',
        story: '',
        author: '',
        image: null
    });

    const fetchStories = async () => {
        try {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/api/stories/random`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stories');
            }

            const data = await response.json();
            setStories(data.stories);
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchStories();
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStory(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewStory(prevState => ({ ...prevState, image: reader.result.split(',')[1] }));  // Remove base64 prefix
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/api/stories/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newStory),
            });

            if (!response.ok) {
                throw new Error('Failed to add story');
            }

            fetchStories();  // Refresh the stories list
            setNewStory({ title: '', story: '', author: '', image: null });  // Reset form
            toast.success("Story created successfully.")
        } catch (error) {
            toast.error(`Error: Failed to add story. Try again or contact admin.`);
        }
    };

    const renderViewStories = () => (
        <div className='bg-white p-10 rounded-lg border border-[#048a52]'>
            <h1 className="text-3xl font-bold mb-4 text-[#048a52]">View Stories</h1>
            <div className="space-y-4">
                {stories.map((story, index) => (
                    <div key={story._id} className={`flex p-4 border rounded-lg shadow-md border-[#63c49c] story ${index % 2 === 0 ? 'from-left' : 'from-right'}`}>
                        {index % 2 === 0 ? (
                            <>
                                <div style={{ width: "60%" }}>
                                    <h2 className="text-xl font-bold mb-2 text-[#048a52]">{story.title}</h2>
                                    <p className="text-[#048a52]">{story.story}</p>
                                    <p className="mt-4 text-sm text-gray-600">Author: {story.author}</p>
                                </div>
                                <div style={{ width: "5%" }}></div>
                                <div style={{ width: "35%" }}>
                                    <img src={`data:image/jpeg;base64,${story.image}`} alt="Story" className="mt-4 w-full" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ width: "35%" }}>
                                    <img src={`data:image/jpeg;base64,${story.image}`} alt="Story" className="mt-4 w-full h-auto" />
                                </div>
                                <div style={{ width: "5%" }}></div>
                                <div style={{ width: "60%" }}>
                                    <h2 className="text-xl font-bold mb-2 text-[#048a52]">{story.title}</h2>
                                    <p className="text-[#048a52]">{story.story}</p>
                                    <p className="mt-4 text-sm text-gray-600">Author: {story.author}</p>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAddStories = () => (
        <div className='bg-white p-10 rounded-lg border border-[#048a52]'>
            <h1 className="text-3xl font-bold mb-4 text-[#048a52]">Add Story</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-[#048a52]">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={newStory.title}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border border-[#048a52] rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="story" className="block text-sm font-medium text-[#048a52]">Story</label>
                    <textarea
                        id="story"
                        name="story"
                        value={newStory.story}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border border-[#048a52] rounded-md w-full"
                        rows="5"
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="author" className="block text-sm font-medium text-[#048a52]">Author</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={newStory.author}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border border-[#048a52] rounded-md w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium text-[#048a52]">Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 p-2 border border-[#048a52] rounded-md w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-[#048a52] text-white font-bold py-2 px-4 rounded-md"
                >
                    Submit
                </button>
            </form>
        </div>
    );

    return useMemo(
        () => (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <button 
                        className={`px-4 py-2 rounded-md mr-2 border border-green-700 ${activeTab === 'view' ? 'bg-[#048a52] text-white' : 'bg-gray-200 text-black'}`}
                        onClick={() => setActiveTab('view')}
                    >
                        View Stories
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-md border border-green-700 ${activeTab === 'add' ? 'bg-[#048a52] text-white' : 'bg-gray-200 text-black'}`}
                        onClick={() => setActiveTab('add')}
                    >
                        Add Story
                    </button>
                </div>
                {activeTab === 'view' ? renderViewStories() : renderAddStories()}
            </div>
        ), [activeTab, stories, newStory]
    );
};

export default Stories;
