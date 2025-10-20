import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { loginUser, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const contactLink = "https://api.whatsapp.com/send?phone=+527121924905&text=Hola,%20estoy%20interesado%20en%20contratar%20tus%20servicios%20para%20monitoreo%20de%20cultivos.";

  const navItems = [
    { label: 'Contacto', link: contactLink },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginUser(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header
        navItems={navItems}
        buttonText="Regresar"
        buttonLink="/"
        bgColor="verde-lima-claro"
      />
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-96">
            {/* Columna izquierda: Imagen */}
            <div className="h-full bg-cover bg-center" style={{ backgroundImage: "url('/public/assets/images/login.webp')" }}></div>
            {/* Columna derecha: Formulario */}
            <div className="bg-gris-suave px-6">
              <div className="h-full flex items-center">
                <div className="w-full">
                  <h2 className="text-2xl font-poppins font-semibold text-negro-texto mb-7 text-center">¡Hola, inicia sesión!</h2>
                  {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                  <form onSubmit={handleLogin}>
                    <Input
                      type="text"
                      placeholder="Correo"
                      className="mb-4"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Contraseña"
                      className="mb-6"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="tertiary" className="w-full" disabled={loading}>
                      {loading ? 'Iniciando...' : 'Ingresar →'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;