import { useState } from 'react';
import logo from "@/assets/ilustration/logo.png";
import api from "@/utils/api";
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { HandleResponse } from '@/components/ui/HandleResponse';
import { storeUserDataInCookie } from '@/utils/cookie';
import { useUser } from '@/contexts/UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser, initializeUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/v1/login', {
        email,
        kata_sandi: password
      });
      HandleResponse({response})
      const { token, ...userData } = response.data.data;
      
      if (token) {
        localStorage.setItem("token", token);
        storeUserDataInCookie(userData, token);
        
        await initializeUser();
        
        updateUser(userData);
        
        HandleResponse({
          response,
          successMessage: response.message
        });

        if (userData.role === 'SUPERADMIN' || userData.role === 'ADMIN') {
          navigate("/dashboard");
        } else {
          navigate("/");
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
    <div className="min-h-screen grid lg:grid-cols-2">

      <div className="w-full px-4 lg:px-20 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Masuk</h2>
            <p className="mt-2 text-sm text-gray-600">
              Masukkan email dan kata sandi Anda untuk masuk!
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@pusdatin.id"
                className="w-full px-3 py-2 border border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password*
                </label>
                {/* <a href="#" className="text-sm text-primary hover:text-primary-dark">
                  Lupa password?
                </a> */}
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-3 py-2 border border-gray-300  shadow-sm"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full py-2.5"
              loading={loading}
            >
              Masuk
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Brand/Logo */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-[#89ffef] via-[#00A2E9]  to-[#2F318B] p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="relative z-10 text-center">
          <img
            src={logo}
            alt="Logo RuangIn"
            className="w-48  mx-auto mb-6  "
          />
          <h1 className="text-3xl font-bold text-white mb-2">RuangIn</h1>
          <p className="text-white/90 text-sm max-w-md">
            Sistem Peminjaman Ruangan Rapat
            Pusat Data dan Informasi Kementerian Kelautan dan Perikanan
          </p>
        </div>
      </div>
    </div>
  );
}