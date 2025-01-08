import { useState } from 'react';
import logo from "@/assets/ilustration/logo.png";
import bg from "@/assets/ilustration/pusdatin.png";
import api from "@/utils/api";
import { Toaster } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HandleResponse } from '@/components/ui/HandleResponse';
import { storeUserDataInCookie } from '@/utils/cookie';
import { useUser } from '@/contexts/UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const {  updateUser } = useUser();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      const response = await api.post('/v1/login', {
        email,
        kata_sandi: password
      });
      const { token, ...userData } = response.data.data;
      if (token) {
        storeUserDataInCookie(userData, token)
        updateUser(userData)
        HandleResponse({
          response,
          successMessage: response.message
        });
        if (userData.role === 'SUPERADMIN' || userData.role === 'ADMIN') {
          navigate("/dashboard")
        } else {
          navigate("/")
        }
      }
    } catch (err) {
      HandleResponse({
        error: err,
        errorMessage: 'Gagal melakukan login'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Toaster />

      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className="w-16  mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
        </div>

        <form>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              startIcon={<Mail className="w-4 h-4" />}
              required
              fullWidth
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              startIcon={<Lock className="w-4 h-4" />}
              required
              fullWidth
            />

            <Button
              onClick={handleSubmit}
              type="submit"
              color="blue"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}