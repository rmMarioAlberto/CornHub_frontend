import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Login = () => {
  const navItems = [
    { label: 'Mi perfil', link: '/profile' },
    { label: 'Mis cultivos', link: '/cultivos' },
    { label: 'Contacto', link: '/contacto' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header navItems={navItems} buttonText="Inicia Sesión" buttonLink="/login" />
      <main className="container flex-grow flex items-center justify-center bg-gris-suave p-8">
        <div className="card w-full max-w-md">
          <h2 className="text-2xl font-poppins font-semibold text-verde-profundo mb-4">¡Hola, inicia sesión!</h2>
          <input type="text" placeholder="Correo / Nombre usuario" className="w-full p-2 mb-4 border rounded-md" />
          <input type="password" placeholder="Contraseña" className="w-full p-2 mb-4 border rounded-md" />
          <button className="bg-verde-profundo text-white px-4 py-2 rounded-md font-poppins font-semibold w-full">Ingresar →</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;