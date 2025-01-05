import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserData } from "./storageHelper";

const ProfileUserPage = () => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const storedUser = getUserData();
        if (storedUser) {
            setUserProfile(storedUser);
        }
    }, []);

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="bg-gray-800 p-4 lg:px-80 flex-wrap lg:flex items-center justify-between">
                <div className="flex items-center ">
                    <div className="bg-gray-600 mt-4 relative w-32 h-32 rounded-full overflow-hidden flex items-center justify-center">
                        <img
                            src={userProfile?.img_profile || "/default-avatar.png"}
                            alt="User avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold">{userProfile?.username}</h1>
                        <p className="text-gray-400">{userProfile?.email}</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 mt-4 rounded">Edit profile</button>
                    </div>
                </div>
                <div className="grid mt-6 grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-2 gap-2 lg:gap-4">
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center w-auto h-auto bg-gray-700">
                        <h2 className="text-gray-400 text-lg font-bold">Movies</h2>
                        <p className="text-gray-400 text-lg font-bold">0</p>
                    </div>
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center w-auto h-auto bg-gray-700">
                        <h2 className="text-gray-400 text-lg font-bold">Rating</h2>
                        <p className="text-gray-400 text-lg font-bold">0</p>
                    </div>
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center w-auto h-auto bg-gray-700">
                        <h2 className="text-gray-400 text-lg font-bold">List</h2>
                        <p className="text-gray-400 text-lg font-bold">0</p>
                    </div>
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center w-auto h-auto bg-gray-700">
                        <h2 className="text-gray-400 text-lg font-bold">More</h2>
                        <p className="text-gray-400 text-lg font-bold">0</p>
                    </div>
                </div>

            </div>

            <div className="bg-gray-700 p-4 text-center mt-6 mx-4 rounded">
                <p className="text-gray-300 font-semibold">Welcome to your new profile</p>
                <p className="text-gray-400 text-sm mt-2">
                    We're still working on updating some profile features. To see badges, ratings breakdowns, and polls, please go to the previous version of your profile.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mx-4">
                <div className="border rounded p-4">
                    <h2 className="text-yellow-500 text-lg font-bold flex items-center">Ratings <span className="ml-2 text-gray-400">0</span></h2>
                    <p className="text-gray-400 mt-4">Your ratings are public. <a href="#" className="text-blue-400 underline">Edit</a></p>
                    <div className="text-center mt-6">
                        <p className="text-gray-500">No ratings yet</p>
                        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Browse popular movies</button>
                    </div>
                </div>

                <div className="border rounded p-4">
                    <h2 className="text-yellow-500 text-lg font-bold flex items-center">Check-ins <span className="ml-2 text-gray-400">0</span></h2>
                    <p className="text-gray-400 mt-4">Your check-ins are private. <a href="#" className="text-blue-400 underline">Edit</a></p>
                    <div className="text-center mt-6">
                        <p className="text-gray-500">No check-ins yet</p>
                    </div>
                </div>

                <div className="border rounded p-4">
                    <h2 className="text-yellow-500 text-lg font-bold flex items-center">Watchlist <span className="ml-2 text-gray-400">0</span></h2>
                    <p className="text-gray-400 mt-4">Your Watchlist is private. <a href="#" className="text-blue-400 underline">Edit</a></p>
                    <div className="text-center mt-6">
                        <p className="text-gray-500">No Watchlist yet</p>
                        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Browse popular movies</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUserPage;


// const ProfileUserPage = () => {
//     const [userProfile, setUserProfile] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [provinces, setProvinces] = useState(["Bangkok", "Chiang Mai", "Phuket"]);

//     useEffect(() => {
//         const storedUser = getUserData(); // Mock function to get user data
//         if (storedUser) {
//             setUserProfile(storedUser);
//         }
//     }, []);

//     const handleEditToggle = () => setIsEditing((prev) => !prev);

//     const handleSave = () => {
//         setIsEditing(false);
//         // Add save logic here
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setUserProfile((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();
//         reader.onloadend = () => setImagePreview(reader.result);
//         if (file) reader.readAsDataURL(file);
//     };

//     if (!userProfile) return <div>Loading...</div>;

//     return (
//         <>
//             <ToastContainer />
//             <div className="flex flex-col items-center bg-gray-100 py-10">
//                 <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg">
//                     <div className="flex flex-col md:flex-row p-6">
//                         {/* Profile Picture Section */}
//                         <div className="flex flex-col items-center md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300 p-4">
//                             <div className="relative w-32 h-32 rounded-full overflow-hidden">
//                                 <img
//                                     src={imagePreview || userProfile.img_profile || "/default-avatar.png"}
//                                     alt="User"
//                                     className="w-full h-full object-cover"
//                                 />
//                             </div>
//                             <p className="mt-4 text-lg font-semibold">{userProfile.username}</p>
//                             <p className="text-gray-500 text-sm">{userProfile.email}</p>
//                             <button
//                                 className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                                 onClick={handleEditToggle}
//                             >
//                                 {isEditing ? "Cancel Edit" : "Edit Profile"}
//                             </button>
//                         </div>

//                         {/* Profile Details Section */}
//                         <div className="flex-1 p-6">
//                             <h2 className="text-xl font-bold mb-4">Profile Details</h2>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {/* Name */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600">Full Name</label>
//                                     <input
//                                         type="text"
//                                         name="name_user"
//                                         value={userProfile.firstname + " " + userProfile.lastname}
//                                         className="w-full mt-1 p-2 border rounded bg-gray-100"
//                                         disabled={!isEditing}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                                 {/* Nickname */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600">Nickname</label>
//                                     <input
//                                         type="text"
//                                         name="nick_user"
//                                         value={userProfile.username}
//                                         className="w-full mt-1 p-2 border rounded bg-gray-100"
//                                         disabled={!isEditing}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                                 {/* Province */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600">Province</label>
//                                     <select
//                                         name="province"
//                                         value={userProfile.province}
//                                         className="w-full mt-1 p-2 border rounded bg-gray-100"
//                                         disabled={!isEditing}
//                                         onChange={handleInputChange}
//                                     >
//                                         <option value="">Select Province</option>
//                                         {provinces.map((province, index) => (
//                                             <option key={index} value={province}>
//                                                 {province}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 {/* Phone */}
//                                 <div>
//                                     <label className="block text-sm text-gray-600">Phone</label>
//                                     <input
//                                         type="text"
//                                         name="phone"
//                                         value={userProfile.phone}
//                                         className="w-full mt-1 p-2 border rounded bg-gray-100"
//                                         disabled={!isEditing}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                                 {/* Address */}
//                                 <div className="md:col-span-2">
//                                     <label className="block text-sm text-gray-600">Address</label>
//                                     <input
//                                         type="text"
//                                         name="address"
//                                         value={userProfile.address}
//                                         className="w-full mt-1 p-2 border rounded bg-gray-100"
//                                         disabled={!isEditing}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                                 {/* Upload Image */}
//                                 {isEditing && (
//                                     <div className="md:col-span-2">
//                                         <label className="block text-sm text-gray-600">Upload Profile Picture</label>
//                                         <input
//                                             type="file"
//                                             accept="image/*"
//                                             className="w-full mt-1 p-2 border rounded bg-gray-100"
//                                             onChange={handleImageChange}
//                                         />
//                                     </div>
//                                 )}
//                             </div>
//                             {isEditing && (
//                                 <button
//                                     className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                                     onClick={handleSave}
//                                 >
//                                     Save Changes
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ProfileUserPage;
