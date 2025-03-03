import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    userName: user?.userName || '',
    notifications: user?.preferences?.notifications || true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        displayName: formData.displayName,
        userName: formData.userName,
        preferences: {
          notifications: formData.notifications
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Profile Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name */}
          <div className="space-y-2">
            <label htmlFor="displayName" className="block font-medium">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-2 border rounded-md dark:bg-gray-800"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="userName" className="block font-medium">
              Username
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-2 border rounded-md dark:bg-gray-800"
            />
          </div>

          {isEditing ? (
            <div className="flex space-x-2">
              <Button type="submit">Save Changes</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </form>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-gray-500">
                Receive alerts and updates
              </p>
            </div>
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleInputChange}
              className="h-6 w-6"
            />
          </div>
        </div>
      </Card>

      {/* Accessibility Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Accessibility</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Accessibility Mode</h3>
              <p className="text-sm text-gray-500">
                Enable high contrast and larger text
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const root = document.documentElement;
                root.classList.toggle('accessibility-mode');
              }}
              className="min-w-[100px]"
            >
              Toggle
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}