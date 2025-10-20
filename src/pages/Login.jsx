import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const navItems = [
    { label: 'Mi perfil', link: '/profile' },
    { label: 'Mis cultivos', link: '/cultivos' },
    { label: 'Contacto', link: '/contacto' },
  ];

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
                  <Input
                    type="text"
                    placeholder="Correo"
                    className="mb-4"
                  />
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    className="mb-6"
                  />
                  <Button variant="tertiary" className="w-full">
                    Ingresar →
                  </Button>
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