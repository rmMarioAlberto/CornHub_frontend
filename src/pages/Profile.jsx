import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto"></div> {/* Ícono usuario */}
        <h1 className="text-2xl">Mi Perfil</h1>
      </div>
      <Input label="Nombre de Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="primary" className="w-full">Guardar</Button>
    </div>
  );
};

export default Profile;