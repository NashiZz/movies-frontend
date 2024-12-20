import React, { useState } from "react";

const AuthPage = ({ showModal, setShowModal }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState("");
  const [loginError, setLoginError] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleModalClose = () => {
    setShowModal(false);
    setProfilePicture(null);  
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
  };

  const handleRegister = (e) => {
    e.preventDefault();
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
        <button
          onClick={handleModalClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-3xl"
        >
          &times;
        </button>
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setActiveTab("login")}
            className={`px-4 py-2 text-lg font-semibold ${activeTab === "login"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
              }`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`px-4 py-2 text-lg font-semibold ${activeTab === "register"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500"
              }`}
          >
            สมัครสมาชิก
          </button>
        </div>
        {activeTab === "login" ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">ชื่อผู้ใช้</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="กรุณาระบุชื่อผู้ใช้"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="กรุณาระบุรหัสผ่าน"
              />
            </div>
            {loginError && <p className="text-red-500">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              ลงชื่อเข้าใช้
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700">รูปโปรไฟล์</label>
              {profilePicture && (
                <div className="mb-4">
                  <img
                    src={profilePicture}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full mx-auto"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">ชื่อผู้ใช้</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="กรุณาระบุชื่อผู้ใช้"
              />
            </div>
            <div className="flex flex-row">
              <div className="mb-4 mr-2">
                <label className="block text-gray-700">ชื่อจริง</label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="กรุณาระบุชื่อจริง"
                />
              </div>
              <div className="mb-4 ml-2">
                <label className="block text-gray-700">นามสกุล</label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="กรุณาระบุนามสกุล"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">ที่อยู่</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="กรุณาระบุที่อยู่"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">อีเมล</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="กรุณาระบุอีเมล"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="กรุณาระบุรหัสผ่าน"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md"
            >
              สมัครสมาชิก
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
