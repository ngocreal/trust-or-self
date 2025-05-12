import React from "react";

interface ProfilePopupProps {
  show: boolean;
  onClose: () => void;
  profileMode: 'view' | 'edit-username' | 'edit-password';
  setProfileMode: (mode: 'view' | 'edit-username' | 'edit-password') => void;
  profileUsername: string;
  setProfileUsername: (v: string) => void;
  newUsername: string;
  setNewUsername: (v: string) => void;
  profilePassword: string;
  setProfilePassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  profileError: string;
  setProfileError: (v: string) => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({
  show,
  onClose,
  profileMode,
  setProfileMode,
  profileUsername,
  setProfileUsername,
  newUsername,
  setNewUsername,
  profilePassword,
  setProfilePassword,
  newPassword,
  setNewPassword,
  currentPassword,
  setCurrentPassword,
  profileError,
  setProfileError,
}) => {
  if (!show) return null;

  return (
    <div className="absolute left-1/2 top-1/2 z-30 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
      <div className="bg-white rounded-2xl shadow-2xl p-6 relative border border-gray-200">
        <button
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
          title="Đóng"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-[#1B1B62] mb-6 text-center">Thông tin tài khoản</h2>

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
                  className="bg-[#F5C035] text-white px-4 py-2 rounded-lg hover:bg-[#1B1B62] transition-colors font-semibold"
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
                  className="bg-[#F5C035] text-white px-4 py-2 rounded-lg hover:bg-[#1B1B62] transition-colors font-semibold"
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
              const res = await fetch('/api/trust/users/username', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  oldUsername: profileUsername,
                  newUsername,
                  password: profilePassword,
                }),
              });
              const data = await res.json();
              if (data.success) {
                setProfileMode('view');
                setProfileUsername(newUsername);
                localStorage.setItem('username', newUsername);
                setProfilePassword('');
                setProfileError('');
              } else {
                setProfileError(data.message || 'Đổi username thất bại');
              }
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
            <div className="flex gap-2 justify-end">
              <button
                type="submit"
                className="bg-[#3F99E9] text-white px-4 py-2 rounded-lg hover:bg-[#1B1B62] transition-colors font-semibold"
              >
                Lưu
              </button>
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded-lg font-semibold"
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
                className="bg-[#3F99E9] text-white px-4 py-2 rounded-lg hover:bg-[#1B1B62] transition-colors font-semibold"
              >
                Lưu
              </button>
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded-lg font-semibold"
                onClick={() => setProfileMode('view')}
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePopup;