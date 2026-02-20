import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/services';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: user?.name || '', bio: user?.bio || '' },
  });

  const {
    register: registerPw,
    handleSubmit: handlePwSubmit,
    reset: resetPw,
    formState: { errors: pwErrors },
    watch,
  } = useForm();

  const newPassword = watch('newPassword');

  const onProfileSave = async (data) => {
    setProfileLoading(true);
    try {
      const res = await userAPI.updateProfile(data);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordChange = async (data) => {
    setPwLoading(true);
    try {
      await userAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      resetPw();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed.');
    } finally {
      setPwLoading(false);
    }
  };

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  return (
    <div className="dashboard">
      <div className="dashboard-main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
            <div className="brand">TaskFlow</div>
          </div>
          <div className="topbar-right">
            <button className="btn-logout" onClick={() => { logout(); navigate('/login'); }}>
              Sign out
            </button>
          </div>
        </header>

        <main className="page-body">
          <div className="page-hero">
            <h1>Your Profile</h1>
            <p>Manage your account details and password.</p>
          </div>

          <div className="profile-layout">
            {/* Avatar card */}
            <div className="profile-avatar-card">
              <div className="big-avatar">{getInitials(user?.name)}</div>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
              <span className="member-since">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
              </span>
            </div>

            <div className="profile-forms">
              {/* Edit profile */}
              <div className="form-card">
                <h2>Personal Information</h2>
                <form onSubmit={handleSubmit(onProfileSave)} noValidate>
                  <div className="form-group">
                    <label>Full name</label>
                    <input
                      type="text"
                      className={errors.name ? 'input-error' : ''}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && <span className="error-msg">{errors.name.message}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={user?.email || ''} disabled className="input-disabled" />
                    <span className="hint">Email cannot be changed.</span>
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us a bit about yourself..."
                      className={errors.bio ? 'input-error' : ''}
                      {...register('bio', { maxLength: { value: 200, message: 'Max 200 characters' } })}
                    />
                    {errors.bio && <span className="error-msg">{errors.bio.message}</span>}
                  </div>
                  <button type="submit" className="btn-primary" disabled={profileLoading}>
                    {profileLoading ? <span className="btn-spinner" /> : 'Save changes'}
                  </button>
                </form>
              </div>

              {/* Change password */}
              <div className="form-card">
                <h2>Change Password</h2>
                <form onSubmit={handlePwSubmit(onPasswordChange)} noValidate>
                  <div className="form-group">
                    <label>Current password</label>
                    <input
                      type="password"
                      className={pwErrors.currentPassword ? 'input-error' : ''}
                      {...registerPw('currentPassword', { required: 'Current password is required' })}
                    />
                    {pwErrors.currentPassword && <span className="error-msg">{pwErrors.currentPassword.message}</span>}
                  </div>
                  <div className="form-group">
                    <label>New password</label>
                    <input
                      type="password"
                      className={pwErrors.newPassword ? 'input-error' : ''}
                      {...registerPw('newPassword', {
                        required: 'New password is required',
                        minLength: { value: 6, message: 'Min. 6 characters' },
                      })}
                    />
                    {pwErrors.newPassword && <span className="error-msg">{pwErrors.newPassword.message}</span>}
                  </div>
                  <div className="form-group">
                    <label>Confirm new password</label>
                    <input
                      type="password"
                      className={pwErrors.confirmNewPassword ? 'input-error' : ''}
                      {...registerPw('confirmNewPassword', {
                        required: 'Please confirm your new password',
                        validate: (v) => v === newPassword || 'Passwords do not match',
                      })}
                    />
                    {pwErrors.confirmNewPassword && <span className="error-msg">{pwErrors.confirmNewPassword.message}</span>}
                  </div>
                  <button type="submit" className="btn-primary" disabled={pwLoading}>
                    {pwLoading ? <span className="btn-spinner" /> : 'Update password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;