import React, { useState } from "react";

const Profile: React.FC = () => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileMode, setProfileMode] = useState<'view' | 'edit-username' | 'edit-password'>('view');
  const [profileUsername, setProfileUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [profileError, setProfileError] = useState('');

  const handleOpen = () => {
    setProfileUsername(localStorage.getItem('username') || '');
    setShowProfilePopup(true);
    setProfileMode('view');
    setProfileError('');
  };

  return (
    <>
      <button
        className="bg-[#3F99E9] text-white px-4 py-2 rounded-lg hover:bg-[#1B1B62] transition-colors font-semibold"
        onClick={handleOpen}
      >
        Hồ sơ
      </button>

      {showProfilePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-4 text-4xl text-gray-400 hover:text-gray-700"
              onClick={() => setShowProfilePopup(false)}
              title="Đóng"
            >
              ×
            </button>

            <h2 className="text-xl font-bold text-[#1B1B62] mb-6 text-center">Thông tin tài khoản</h2>

            {profileMode === 'view' && (
              <>
                <div className="mb-5">
                  <label className="block font-semibold mb-1 text-gray-700">Username</label>
                  <div className="flex gap-2">
                    <input
                      value={profileUsername}
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-base"
                    />
                    <button
                      className="bg-[#F5C035] text-white px-3 py-2 rounded-lg hover:bg-[#1B1B62] transition-colors font-semibold cursor-pointer"
                      onClick={() => {
                        setProfileMode('edit-username');
                        setNewUsername('');
                        setProfilePassword('');
                        setProfileError('');
                      }}
                    >
                      Đổi
                    </button>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block font-semibold mb-1 text-gray-700">Password</label>
                  <div className="flex gap-2">
                    <input
                      value="********"
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-base"
                    />
                    <button
                      className="bg-[#F5C035] text-white px-3 py-2 rounded-lg hover:bg-[#1B1B62] transition-colors font-semibold cursor-pointer"
                      onClick={() => {
                        setProfileMode('edit-password');
                        setNewPassword('');
                        setCurrentPassword('');
                        setProfileError('');
                      }}
                    >
                      Đổi
                    </button>
                  </div>
                </div>
              </>
            )}

            {profileMode === 'edit-username' && (
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  if (!newUsername || !profilePassword) {
                    setProfileError('Vui lòng nhập đủ thông tin');
                    return;
                  }
                  // Gọi API đổi username
                  setProfileMode('view');
                  setProfileUsername(newUsername);
                  localStorage.setItem('username', newUsername);
                }}
              >
                <div className="mb-4">
                  <label className="block mb-1 font-semibold text-gray-700">Username mới</label>
                  <input
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold text-gray-700">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={profilePassword}
                    onChange={e => setProfilePassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base"
                  />
                </div>
                {profileError && <div className="text-red-600 mb-2">{profileError}</div>}
                <div className="flex gap-2 justify-end cursor-pointer">
                  <button
                    type="submit"
                    className="bg-[#3F99E9] text-white px-4 py-2 rounded-lg hover:bg-[#1B1B62] transition-colors font-semibold"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-[#1B1B62]"
                    onClick={() => setProfileMode('view')}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}

            {profileMode === 'edit-password' && (
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  if (!newPassword || !currentPassword) {
                    setProfileError('Vui lòng nhập đủ thông tin');
                    return;
                  }
                  if (
                    newPassword.length < 8 ||
                    !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(newPassword)
                  ) {
                    setProfileError('Mật khẩu phải tối thiểu 8 ký tự và có ký tự đặc biệt');
                    return;
                  }
                  // Gọi API đổi password
                  const res = await fetch('/api/trust/users/password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      username: profileUsername,
                      currentPassword,
                      newPassword,
                    }),
                  });
                  const data = await res.json();
                  if (data.success) {
                    setProfileMode('view');
                    setNewPassword('');
                    setCurrentPassword('');
                    setProfileError('');
                  } else {
                    setProfileError(data.message || 'Đổi mật khẩu thất bại');
                  }
                  console.log('username:', profileUsername, 'currentPassword:', currentPassword);
                }}
              >
                <div className="mb-4">
                  <label className="block mb-1 font-semibold text-gray-700">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold text-gray-700">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base"
                  />
                </div>
                {profileError && <div className="text-red-600 mb-2">{profileError}</div>}
                <div className="flex gap-2 justify-end">
                  <button
                    type="submit"
                    className="bg-[#3F99E9] text-white px-4 py-2 rounded-lg hover:bg-[#1B1B62] transition-colors font-semibold cursor-pointer"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-[#1B1B62] cursor-pointer"
                    onClick={() => setProfileMode('view')}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;