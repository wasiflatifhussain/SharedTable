import { useEffect, useMemo, useState } from 'react';
import { useCreateAdvertisement } from "@/api/MyAdvertisementApi"; // Adjust the path as necessary
import "./AddAdvertisements.css";
import { useAuth0 } from '@auth0/auth0-react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import ConfirmModal from '@/components/ConfirmModal';
import ConfirmCancelModal from '@/components/ConfirmCancelModal';

const AddAdvertisements = () => {
    const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
    const { createAdvertisement } = useCreateAdvertisement();
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [plan, setPlan] = useState(null);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        countryCode: '',
        phone: ''
    });

    const [activeTab, setActiveTab] = useState('add');
    const [advertisements, setAdvertisements] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAdId, setSelectedAdId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelAdId, setCancelAdId] = useState(null);

    const fetchAdvertisements = async () => {
        try {
            const accessToken = await getAccessTokenSilently();
            console.log("Making request with access token:", accessToken, "and email:", user.email);

            const response = await fetch(`${API_BASE_URL}/api/advertisements/user-advertisements`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.email })
            });

            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error('Failed to fetch advertisements');
            }

            const data = await response.json();
            console.log("Received data:", data);
            setAdvertisements(data.userAdvertisements.advertisements);
        } catch (error) {
            console.error('Error fetching advertisements:', error);
        }
    };

    useEffect(() => {
        console.log("User:", user); // Log the user object to verify its value
        if (!user || !isAuthenticated) {
            console.error("User is not authenticated or user object is not available.");
            return;
        }
        fetchAdvertisements();
    }, [user, isAuthenticated, getAccessTokenSilently]);

    const handleImageUpload = (e) => {
        setIsUploading(true);
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file));  // For previewing the image
        setImageFile(file);  // For uploading the image
        setIsUploading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handlePlanSelect = (selectedPlan: string) => {
        setPlan(selectedPlan);
    };

    const initiateCheckout = () => {
        console.log("plan = ", plan);
        console.log("userdetails = ", userDetails);
        if (plan === null) {
            const planheader = document.getElementById("planheader");
            const planerror = document.getElementById("planerror");
            planheader.style.color = "red";
            planerror.style.display = "inline-block";
            setTimeout(() => {
                planheader.style.color = "black";
                planerror.style.display = "none";
            }, 5000);
        }
        
        if (userDetails.name === "") {
            const nameerror = document.getElementById("nameerror");
            nameerror.style.display = "inline-block";
            setTimeout(() => {
                nameerror.style.display = "none";
            }, 5000);
        }
    
        if (userDetails.countryCode === "") {
            const phoneerror = document.getElementById("phoneerror");
            phoneerror.style.display = "inline-block";
            setTimeout(() => {
                phoneerror.style.display = "none";
            }, 5000);
        }
    
        if (userDetails.phone === "") {
            const phoneerror = document.getElementById("phoneerror");
            phoneerror.style.display = "inline-block";
            setTimeout(() => {
                phoneerror.style.display = "none";
            }, 5000);
        }
    
        if (userDetails.email === "") {
            const emailerror = document.getElementById("emailerror");
            emailerror.style.display = "inline-block";
            setTimeout(() => {
                emailerror.style.display = "none";
            }, 5000);
        }
    
        if (image === null) {
            const imageheader = document.getElementById("imageheader");
            const imageerror = document.getElementById("imageerror");
            imageheader.style.color = "red";
            imageerror.style.display = "inline-block";
            setTimeout(() => {
                imageheader.style.color = "black";
                imageerror.style.display = "none";
            }, 5000);
        }
    
        if (image !== null && userDetails.email !== "" && userDetails.phone !== "" && userDetails.countryCode !== "" && userDetails.name !== "" && plan !== null) {
            console.log("upload now");
    
            // Construct form data
            const formData = new FormData();
            formData.append("name", userDetails.name);
            formData.append("email", userDetails.email);
            formData.append("countryCode", userDetails.countryCode);
            formData.append("phone", userDetails.phone);
            formData.append("plan", plan);
            formData.append("imageFile", imageFile);  // Use the image file object
    
            try {
                createAdvertisement(formData);
            } catch (error) {
                console.log("Unable to create advertisement");
            }
        }
    }

    const renderAddAdvertisements = () => (
        <div>
            <h1 className="text-3xl font-bold mb-4">Add Advertisements</h1>
            <div className="bg-green-100 p-8 rounded-lg shadow-md mb-8 border-[#048a52] border">
                <div style={{display: "flex"}}>
                    <h2 className="text-2xl font-bold mb-4 text-black" id="imageheader">Upload Advertisement Image</h2>
                    <p style={{color: "red", fontSize: "14px", fontWeight: "bold", marginLeft: "6px", marginTop: "8px", display: "none"}} id="imageerror">Please select a plan in order to checkout</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4 file-input" style={{borderRadius: "10px", border: "1px solid #97e6c5", padding: "5px"}} />
                {isUploading && <p className='text-[#048a52]'>Uploading...</p>}
                {image && (
                    <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2 text-[#30443c]">Advertisement Preview</h3>
                        <img src={image} alt="Advertisement" className="w-full h-auto" />
                    </div>
                )}
            </div>
            <div className="bg-[#faffea] p-8 rounded-lg shadow-md mb-8 border-[#048a52] border">
                <h2 className="text-2xl font-bold mb-4 text-[#048a52]">Your Details</h2>
                <form>
                    <div className="mb-4">
                        <div style={{display: "flex"}}>
                            <label htmlFor="name" className="block text-sm font-medium text-[#048a52]">Name</label>
                            <p style={{color:'red', fontSize: "13px", marginTop: "2px", marginLeft: "5px", display: "none"}} id="nameerror">Name field must not empty</p>
                        </div>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={userDetails.name} 
                            onChange={handleInputChange} 
                            className="mt-1 p-2 border border-[#048a52] rounded-md w-full" 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <div style={{display: "flex"}}>
                            <label htmlFor="email" className="block text-sm font-medium text-[#048a52]">Email Address</label>
                            <p style={{color:'red', fontSize: "13px", marginTop: "2px", marginLeft: "5px", display: "none"}} id="emailerror">Email Address field must not empty</p>
                        </div>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={userDetails.email} 
                            onChange={handleInputChange} 
                            className="mt-1 p-2 border border-[#048a52] rounded-md w-full" 
                            required 
                        />
                    </div>

                    <div className="mb-4" style={{ display: 'flex', gap: '0.2rem' }}>
                        <div style={{ flex: '0 0 20%' }}>
                            <label htmlFor="countryCode" className="block text-sm font-medium text-[#048a52]">Country Code</label>
                            <input 
                                type="text" 
                                id="countryCode" 
                                name="countryCode" 
                                value={userDetails.countryCode} 
                                onChange={handleInputChange} 
                                className="mt-1 p-2 border border-[#048a52] rounded-md w-full" 
                                placeholder="e.g. +852" 
                                required 
                            />
                        </div>
                        <div style={{ flex: '1 0 80%' }}>
                            <div style={{display: "flex"}}>
                                <label htmlFor="phone" className="block text-sm font-medium text-[#048a52]">Phone Number</label>
                                <p style={{color:'red', fontSize: "13px", marginTop: "2px", marginLeft: "5px", display: "none"}} id="phoneerror">Phone Number/Country Code field must not empty</p>
                            </div>
                            <input 
                                type="text" 
                                id="phone" 
                                name="phone" 
                                value={userDetails.phone} 
                                onChange={handleInputChange} 
                                className="mt-1 p-2 border border-[#048a52] rounded-md w-full" 
                                placeholder="e.g. 9281 4827" 
                                required 
                            />
                        </div>
                    </div>

                </form>
            </div>
            <div className="bg-green-100 p-8 rounded-lg shadow-md mb-8 border-[#048a52] border">
                <div style={{display: "flex"}}>
                    <h2 className="text-2xl font-bold mb-4" id="planheader">Select a Plan</h2>
                    <p style={{color: "red", fontSize: "14px", fontWeight: "bold", marginLeft: "6px", marginTop: "8px", display: "none"}} id="planerror">Please select a plan in order to checkout</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                        className={`p-4 border rounded-lg cursor-pointer ${plan === '20ads' ? 'bg-[#faffea]' : 'bg-green-100'} ${plan === '20ads' ? 'border-[#048a52]' : 'border-gray-300'} ${plan === '20ads' ? 'text-[#048a52]' : 'text-gray-700'}`}
                        onClick={() => handlePlanSelect('20ads')}
                    >
                        <h3 className="text-xl font-bold mb-2">20 Ads per Day</h3>
                        <p style={{fontSize: "17px", fontWeight: "500", marginBottom: "5px"}}>Price: HKD 400/month</p>
                        <p style={{fontSize: "12px"}}>A total of 20 Ads will be displayed to different users throughout the day.</p>
                    </div>
                    <div 
                        className={`p-4 border rounded-lg cursor-pointer ${plan === '40ads' ? 'bg-[#faffea]' : 'bg-green-100'} ${plan === '40ads' ? 'border-[#048a52]' : 'border-gray-300'} ${plan === '40ads' ? 'text-[#048a52]' : 'text-gray-700'}`}
                        onClick={() => handlePlanSelect('40ads')}
                    >
                        <h3 className="text-xl font-bold mb-2">40 Ads per Day</h3>
                        <p style={{fontSize: "17px", fontWeight: "500", marginBottom: "5px"}}>Price: HKD 740/month</p>
                        <p style={{fontSize: "12px"}}>A total of 40 Ads will be displayed to different users throughout the day.</p>
                    </div>
                    <div 
                        className={`p-4 border rounded-lg cursor-pointer ${plan === '60ads' ? 'bg-[#faffea]' : 'bg-green-100'} ${plan === '60ads' ? 'border-[#048a52]' : 'border-gray-300'} ${plan === '60ads' ? 'text-[#048a52]' : 'text-gray-700'}`}
                        onClick={() => handlePlanSelect('60ads')}
                    >
                        <h3 className="text-xl font-bold mb-2">60 Ads per Day</h3>
                        <p style={{fontSize: "17px", fontWeight: "500", marginBottom: "5px"}}>Price: HKD 1020/month</p>
                        <p style={{fontSize: "12px"}}>A total of 60 Ads will be displayed to different users throughout the day.</p>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <button 
                    className="bg-[#048a52] hover:bg-[#eeffb8] hover:text-[#048a52] text-white font-bold py-2 px-4 rounded-md border border-green-700"
                    onClick={initiateCheckout}
                >
                    Checkout / Pay Now
                </button>
            </div>
        </div>
    );

    const handleConfirmClick = (advertisementId: string, newPlan: string) => {
        setSelectedAdId(advertisementId);
        setSelectedPlan(newPlan);
        setModalOpen(true);
    };

    const confirmPlanChange = async (advertisementId: string, newPlan: string) => {
    
        try {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/api/advertisements/change-plan`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.email, advertisementId, newPlan })
            });
    
            if (!response.ok) {
                throw new Error('Failed to change plan');
            }
    
            fetchAdvertisements(); // Refresh the advertisements after successful plan change
            setModalOpen(false);
        } catch (error) {
            console.error('Error changing plan:', error);
        }
    };

    const handleConfirmCancelClick = (advertisementId: string) => {
        setCancelAdId(advertisementId);
        setCancelModalOpen(true);
    };

    const handleCancelPlan = async (advertisementId: string) => {
        try {
            const accessToken = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/api/advertisements/delete-advertisement`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.email, advertisementId })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel advertisement');
            }

            fetchAdvertisements(); // Refresh the advertisements after successful deletion
            setCancelModalOpen(false);
        } catch (error) {
            console.error('Error cancelling advertisement:', error);
        }
    };

    const handleChangePlan = (advertisementId: string) => {
        const planChanger = document.getElementById(`${advertisementId}changeplan`);
        if (planChanger?.style.display === "none") {
            planChanger.style.display = "block";
        }
        else {
            planChanger.style.display = "none";
        }
        
    }
    
    const planSection = (planName: string, issuedDate: string, advertisementId: string) => {
        console.log("advertisement id = ", advertisementId)
        const issuedDateObj = new Date(issuedDate);
        const currentDate = new Date();
    
        const timeDifference = currentDate.getTime() - issuedDateObj.getTime();
        const daysPassed = Math.floor(timeDifference / (1000 * 3600 * 24));
        const hoursPassed = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600));
    
        return (
            <div>
                {planName === "20ads" && 
                    <div 
                        className='p-4 border rounded-lg bg-green-100 border-[#63c49c] text-gray-700'
                    >
                        <h3 className="text-xl font-bold mb-2">20 Ads per Day</h3>
                        <p style={{fontSize: "17px", fontWeight: "500", marginBottom: "5px"}}>Price: HKD 400/month</p>
                        <p style={{fontSize: "12px"}}>A total of 20 Ads will be displayed to different users throughout the day.</p>
                        <p style={{fontSize: "12px"}}><b>Date of plan issue:</b> {issuedDateObj.toLocaleDateString()}</p>
                        <p style={{fontSize: "12px"}}><b>Number of days passed:</b> {daysPassed} days, {hoursPassed} hours</p>
                        <div className="flex justify-between mt-4">
                            <button className="bg-[#048a52] border border-[#048a52] hover:bg-white hover:text-[#048a52] text-white font-bold py-2 px-4 rounded-md" onClick={()=>handleChangePlan(advertisementId)}>Change Plan</button>
                            <button onClick={() => handleConfirmCancelClick(advertisementId)} className="bg-red-500 border border-red-500 hover:bg-white hover:text-red-500 hover:border hover:border-red-500 text-white font-bold py-2 px-4 rounded-md">Cancel Plan</button>
                        </div>
                        <div style={{display: "none"}} className='mt-2 p-4 border rounded-lg bg-gray-100 border-[#63c49c] text-gray-700' id={`${advertisementId}changeplan`}>
                            <button onClick={() => handleConfirmClick(advertisementId, "40ads")} className="bg-[#048a52] border border-[#048a52] hover:bg-white hover:text-[#048a52] text-white font-bold py-2 px-4 rounded-md text-left">
                                <p>Change Plan to 40 Ads per day</p>
                                <p style={{fontSize: "12px"}}>Price: HKD 740/month</p>
                                <p style={{fontSize: "12px"}}>A total of 40 Ads will be displayed to different users throughout the day.</p>
                            </button>
                            <button onClick={() => handleConfirmClick(advertisementId, "60ads")} className='mt-2 bg-[#048a52] border border-[#048a52] hover:bg-white hover:text-[#048a52] text-white font-bold py-2 px-4 rounded-md text-left'>
                                <p>Change Plan to 60 Ads per day</p>
                                <p style={{fontSize: "12px"}}>Price: HKD 1020/month</p>
                                <p style={{fontSize: "12px"}}>A total of 60 Ads will be displayed to different users throughout the day.</p>
                            </button>
                        </div>
                    </div>
                }
                {planName === "40ads" && 
                    <div 
                        className='p-4 border rounded-lg bg-green-100 border-[#63c49c] text-gray-700'
                    >
                        <h3 className="text-xl font-bold mb-2">40 Ads per Day</h3>
                        <p style={{fontSize: "17px", fontWeight: "500", marginBottom: "5px"}}>Price: HKD 740/month</p>
                        <p style={{fontSize: "12px"}}>A total of 40 Ads will be displayed to different users throughout the day.</p>
                        <p style={{fontSize: "12px"}}><b>Date of plan issue:</b> {issuedDateObj.toLocaleDateString()}</p>
                        <p style={{fontSize: "12px"}}><b>Number of days passed:</b> {daysPassed} days, {hoursPassed} hours</p>
                        <div className="flex justify-between mt-4">
                            <button className="bg-[#048a52] border border-[#048a52] hover:bg-white hover:text-[#048a52] text-white font-bold py-2 px-4 rounded-md" onClick={()=>handleChangePlan(advertisementId)}>Change Plan</button>
                            <button onClick={() => handleConfirmCancelClick(advertisementId)} className="bg-red-500 border border-red-500 hover:bg-white hover:text-red-500 hover:border hover:border-red-500 text-white font-bold py-2 px-4 rounded-md">Cancel Plan</button>
                        </div>
                        <div style={{display: "none"}} className='mt-2 p-4 border rounded-lg bg-gray-100 border-[#63c49c] text-gray-700' id={`${advertisementId}changeplan`}>
                            <button onClick={() => handleConfirmClick(advertisementId, "20ads")} className="bg-[#048a52] border border-[#048a52] hover:bg-white hover:text-[#048a52] text-white font-bold py-2 px-4 rounded-md text-left">
                                <p>Change Plan to 20 Ads per day</p>
                                <p style={{fontSize: "12px"}}>Price: HKD 400/month</p>
                                <p style={{fontSize: "12px"}}>A total of 20 Ads will be displayed to different users throughout the day.</p>
                            </button>
                            <button onClick={() => handleConfirmClick(advertisementId, "60ads")} className='mt-2 bg-[#048a52] border border-[#048a52] hover:bg-white hover:text-[#048a52] text-white font-bold py-2 px-4 rounded-md text-left'>
                                <p>Change Plan to 60 Ads per day</p>
                                <p style={{fontSize: "12px"}}>Price: HKD 1020/month</p>
                                <p style={{fontSize: "12px"}}>A total of 60 Ads will be displayed to different users throughout the day.</p>
                            </button>
                        </div>
                    </div>
                }
                {planName === "60ads" && 
                    <div 
                        className='p-4 border rounded-lg bg-green-100 border-[#63c49c] text-gray-700'
                    >
                        <h3 className="text-xl font-bold mb-2">60 Ads per Day</h3>
                        <p style={{fontSize: "17px", fontWeight: "500", marginBottom: "5px"}}>Price: HKD 1020/month</p>
                        <p style={{fontSize: "12px"}}>A total of 60 Ads will be displayed to different users throughout the day.</p>
                        <p style={{fontSize: "12px"}}><b>Date of plan issue:</b> {issuedDateObj.toLocaleDateString()}</p>
                        <p style={{fontSize: "12px"}}><b>Number of days passed:</b> {daysPassed} days, {hoursPassed} hours</p>
                        <div className="flex justify-between mt-4">
                            <button className="bg-[#048a52] border border-[#048a52] hover:bg-white hover:text-[#048a52] text-white font-bold py-2 px-4 rounded-md" onClick={()=>handleChangePlan(advertisementId)}>Change Plan</button>
                            <button onClick={() => handleConfirmCancelClick(advertisementId)} className="bg-red-500 border border-red-500 hover:bg-white hover:text-red-500 hover:border hover:border-red-500 text-white font-bold py-2 px-4 rounded-md">Cancel Plan</button>
                        </div>
                        <div style={{display: "none"}} className='mt-2 p-4 border rounded-lg bg-gray-100 border-[#63c49c] text-gray-700' id={`${advertisementId}changeplan`}>
                            <button onClick={() => handleConfirmClick(advertisementId, "20ads")} className="bg-[#048a52] border border-[#048a52] hover:bg-white hover:text-[#048a52] text-white font-bold py-2 px-4 rounded-md text-left">
                                <p>Change Plan to 20 Ads per day</p>
                                <p style={{fontSize: "12px"}}>Price: HKD 400/month</p>
                                <p style={{fontSize: "12px"}}>A total of 20 Ads will be displayed to different users throughout the day.</p>
                            </button>
                            <button onClick={() => handleConfirmClick(advertisementId, "40ads")} className='mt-2 bg-[#048a52] border border-[#048a52] hover:bg-white hover:text-[#048a52] text-white font-bold py-2 px-4 rounded-md text-left'>
                                <p>Change Plan to 40 Ads per day</p>
                                <p style={{fontSize: "12px"}}>Price: HKD 740/month</p>
                                <p style={{fontSize: "12px"}}>A total of 40 Ads will be displayed to different users throughout the day.</p>
                            </button>
                        </div>
                    </div>
                }
            </div>
        );
    };

    const renderManageAdvertisements = () => (
        <div className='bg-green-100 p-10 rounded-lg border border-[#048a52]'>
            <h1 className="text-3xl font-bold mb-4">Manage Advertisements</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {advertisements.map(advertisement => (
                    <div>
                        <div key={advertisement._id.toString()} className="p-4 border rounded-lg shadow-md border border-[#63c49c] advertisement-card">
                            <img src={advertisement.imageUrl} alt="Advertisement" className="advertisement-image mb-4" />
                            <div className="mt-auto">
                                {planSection(advertisement.plan, advertisement.issuedDate, advertisement._id.toString())}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    

    return useMemo(
        () => (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <button 
                        className={`px-4 py-2 rounded-md mr-2 border border-green-700 ${activeTab === 'add' ? 'bg-[#048a52] text-white' : 'bg-gray-200 text-black'}`}
                        onClick={() => setActiveTab('add')}
                    >
                        Add New Advertisements
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-md border border-green-700 ${activeTab === 'manage' ? 'bg-[#048a52] text-white' : 'bg-gray-200 text-black'}`}
                        onClick={() => setActiveTab('manage')}
                    >
                        Manage Existing Advertisements
                    </button>
                </div>
                {activeTab === 'add' ? renderAddAdvertisements() : renderManageAdvertisements()}
                <ConfirmModal 
                    isOpen={modalOpen} 
                    onClose={() => setModalOpen(false)} 
                    onConfirm={confirmPlanChange} 
                    advertisementId={selectedAdId} 
                    newPlan={selectedPlan} 
                />
                <ConfirmCancelModal 
                    isOpen={cancelModalOpen} 
                    onClose={() => setCancelModalOpen(false)} 
                    onConfirm={handleCancelPlan} 
                    advertisementId={cancelAdId} 
                />
            </div>
        ), [plan, image, imageFile, userDetails, activeTab, advertisements, modalOpen,cancelModalOpen]
    );
};

export default AddAdvertisements;
