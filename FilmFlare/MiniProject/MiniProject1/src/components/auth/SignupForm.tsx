import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { account, client } from "../../../appwrite/appwrite";
import { ID } from 'appwrite';
import { useNavigate } from "react-router-dom";

const SignupForm = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // useEffect to refresh the page when signup is successful
  useEffect(() => {
    if (success) {
      // Optionally, you could navigate to a different page instead of refreshing
      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 1000); // Optional delay before refresh
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const user = await account.create(ID.unique(), email, password, username);
      setSuccess('Account created successfully!');
      console.log('User:', user);

      // Store user data in localStorage
      // localStorage.setItem('userDetails', JSON.stringify(user));

      // Close the dialog and navigate to the profile (optional before refresh)
      onClose();
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-netflixGray border-netflixDarkGray">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="bg-netflixDarkGray text-white border-netflixLightGray"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-netflixDarkGray text-white border-netflixLightGray"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-netflixDarkGray text-white border-netflixLightGray"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-netflixRed hover:bg-netflixRed/90" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
