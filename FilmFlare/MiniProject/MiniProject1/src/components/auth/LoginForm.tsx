import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { account } from "../../../appwrite/appwrite";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<{ email: string; username: string } | null>(null);

  // useEffect to refresh the page when login is successful
  useEffect(() => {
    if (success) {
      // Fetch the user data using userId after login
      const fetchUserData = async () => {
        try {
          const session = JSON.parse(localStorage.getItem('userData') || '{}');
          if (session && session.userId) {
            const user = await account.get(session.userId); // Fetch the user data
            setUserData({
              email: user.email || '',
              name: user.name || '', // Assuming 'name' is the username field
            });

            // Optionally, store user data in localStorage for persistent use
            localStorage.setItem('userDetails', JSON.stringify(user));
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err);
        }
      };

      fetchUserData();
      
      // Refresh the page after fetching user data
      setTimeout(() => {
        window.location.reload(); // Refresh the page after 1 second
      }, 1000);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const session = await account.createEmailPasswordSession(email, password);
      setSuccess('Signed in successfully!');
      console.log('User:', session);

      // Store session data in localStorage
      localStorage.setItem('userData', JSON.stringify(session));

      // Optionally, navigate or close a dialog, etc.
      // onClose();  // If you have a dialog you want to close
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-netflixGray border-netflixDarkGray">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>

        {userData && (
          <div className="mt-4">
            <p className="text-white">Welcome, {userData.username}!</p>
            <p className="text-white">Your email is: {userData.email}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginForm;