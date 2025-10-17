import React, { useEffect, useState } from "react";
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useAuth } from "../contexts/authContext";
import StudentSidebar from '../Components/studentsidebar';
import TopBar from '../Components/Topbar';
import '../Styles/pointsTopup.css';

function EditProfile() {
  const { currentUser } = useAuth?.() || {};

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
      setPhotoURL(currentUser.photoURL || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  function showMessage(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!currentUser) return;
    setSavingProfile(true);
    try {
      await updateProfile(currentUser, {
        displayName: displayName || null,
        photoURL: photoURL || null,
      });
      showMessage("success", "Profile updated.");
    } catch (err) {
      showMessage("error", err?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function reauthIfNeeded() {
    // Reauthentication is required for sensitive changes (email/password)
    if (!currentUser?.email || !currentPassword) {
      throw new Error("Please enter your current password to proceed.");
    }
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
  }

  async function handleUpdateEmail(e) {
    e.preventDefault();
    if (!currentUser) return;
    setSavingEmail(true);
    try {
      await reauthIfNeeded();
      if (!email) throw new Error("Email cannot be empty.");
      await updateEmail(currentUser, email);
      try { await currentUser.reload(); } catch {}
      showMessage("success", "Email updated.");
    } catch (err) {
      const msg = err?.code === 'auth/requires-recent-login'
        ? 'Please re-enter your current password to update email.'
        : (err?.message || 'Failed to update email.');
      showMessage("error", msg);
    } finally {
      setSavingEmail(false);
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    if (!currentUser) return;
    if (!newPassword) {
      showMessage("error", "Enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      showMessage("error", "Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage("error", "Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      await reauthIfNeeded();
      await updatePassword(currentUser, newPassword);
      try { await currentUser.reload(); } catch {}
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowSuccessModal(true);
    } catch (err) {
      const msg = err?.code === 'auth/requires-recent-login'
        ? 'Please re-enter your current password to update password.'
        : (err?.message || 'Failed to update password.');
      showMessage("error", msg);
    } finally {
      setSavingPassword(false);
    }
  }

  if (!currentUser) {
    return (
      <div className="points-topup-wrapper">
        <TopBar />
        <StudentSidebar />
        <main className="points-topup-content">
          <section className="section">
            <p>Please log in to edit your profile.</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="points-topup-wrapper">
      <TopBar />
      <StudentSidebar />
      <main className="points-topup-content">
        {showSuccessModal && (
          <div 
            className="modal-overlay" 
            onClick={() => setShowSuccessModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-success-title"
          >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2 id="password-success-title">Password updated successfully</h2>
              <p>Your password has been changed.</p>
              <div className="modal-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowSuccessModal(false)}
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {message && (
          <section className="section" style={{ marginTop: 0 }}>
            <div className={`notification ${message.type === 'error' ? 'error' : 'success'}`}>
              <p className="notification-text">{message.text}</p>
            </div>
          </section>
        )}

        <section className="section">
          <h2>Edit Profile</h2>

          <label className="form-label" htmlFor="display-name">Display Name</label>
          <input
            id="display-name"
            className="form-input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
          />

          <label className="form-label" htmlFor="photo-url">Photo URL</label>
          <input
            id="photo-url"
            className="form-input"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            placeholder="https://..."
          />

          <button className="btn-primary" onClick={handleSaveProfile} disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </section>

        <section className="section">
          <h3>Account Email</h3>
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />

          <label className="form-label" htmlFor="current-password-email">Current Password (required)</label>
          <input
            id="current-password-email"
            type="password"
            className="form-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />

          <button className="btn-primary" onClick={handleUpdateEmail} disabled={savingEmail}>
            {savingEmail ? 'Updating...' : 'Update Email'}
          </button>
        </section>

        <section className="section">
          <h3>Change Password</h3>

          <label className="form-label" htmlFor="current-password">Current Password</label>
          <input
            id="current-password"
            type="password"
            className="form-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />

          <label className="form-label" htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            className="form-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />

          <label className="form-label" htmlFor="confirm-password">Confirm New Password</label>
          <input
            id="confirm-password"
            type="password"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />

          <button className="btn-primary" onClick={handleUpdatePassword} disabled={savingPassword}>
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </section>
      </main>
    </div>
  );
}

export default EditProfile;

