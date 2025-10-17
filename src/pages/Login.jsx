import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth'; // Asume hook para login JWT

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard'); // Redirige según rol
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-cover" style={{ backgroundImage: 'url(/assets/images/agricola.jpg)' }}></div> {/* Placeholder imagen */}
      <div className="w-1/2 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-3/4">
          <h1 className="text-2xl mb-6">Iniciar Sesión</h1>
          <Input label="Correo / Nombre de usuario" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="primary" className="w-full">Ingresar</Button>
          <Button onClick={() => navigate('/')} className="mt-2 text-verde-medio">Regresar</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;