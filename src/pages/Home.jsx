// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Home = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const contactLink = "https://api.whatsapp.com/send?phone=+527121924905&text=Hola,%20estoy%20interesado%20en%20contratar%20tus%20servicios%20para%20monitoreo%20de%20cultivos.";

  const navItems = [
    { label: 'Contacto', link: contactLink },
  ];

  const quotes = [
    { id: 1, title: 'Quote 1', description: 'Description 1', image: '/assets/images/quote1.png' },
    { id: 2, title: 'Quote 2', description: 'Description 2', image: '/assets/images/quote1.png' },
    { id: 3, title: 'Quote 3', description: 'Description 3', image: '/assets/images/quote1.png' },
  ];

  // === REDIRECCIÓN SI YA ESTÁ AUTENTICADO ===
  useEffect(() => {
    if (auth?.accessToken && auth?.user?.tipo_usuario) {
      const path = auth.user.tipo_usuario === 2 ? '/admin' : '/farmer';
      navigate(path, { replace: true });
    }
  }, [auth, navigate]);

  // Evitar render si ya está autenticado
  if (auth?.accessToken && auth?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        navItems={navItems}
        buttonText="Inicia Sesión"
        buttonLink="/login"
        bgColor="bg-verde-lima-claro"
      />
      <main className="container flex-grow">
        {/* Hero Section with Background Image */}
        <section
          className="relative bg-cover bg-center h-96 mb-8"
          style={{ backgroundImage: "url('/assets/images/home.jpg')" }}
        >
          <div className="absolute inset-0 bg-white opacity-30"></div>
          <div className="relative flex items-center justify-center h-full">
            <div className="text-center z-10">
              <h1 className="text-4xl font-poppins font-semibold text-verde-profundo mb-4">Lettucecurity</h1>
              <p className="text-lg font-poppins text-negro-texto">Cultivos seguros y libres de plagas</p>
            </div>
          </div>
        </section>

        {/* Quiénes Somos? Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-poppins font-semibold text-verde-profundo mb-6">¿Quiénes Somos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {quotes.map((quote) => (
              <div key={quote.id} className="card flex flex-col items-center text-center">
                <p className="font-poppins font-medium mb-2">{quote.title}</p>
                <p className="font-poppins text-sm mb-2">{quote.description}</p>
                <img src={quote.image} alt={`Quote ${quote.id}`} className="w-full h-32 object-cover rounded-md" />
              </div>
            ))}
            <div className="card flex items-center justify-center">
              <img src="/assets/images/test.jpg" alt="Contact Image" className="w-full h-32 object-cover rounded-md" />
            </div>
          </div>
        </section>

        {/* Contáctanos Section */}
        <section className="bg-gris-suave text-center py-12 mb-8">
          <h2 className="text-2xl font-poppins font-semibold text-verde-profundo mb-4">¡Contáctanos!</h2>
          <a
            href={contactLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center justify-center bg-[#25D366] text-white font-poppins font-semibold text-4xl px-8 py-4 rounded-lg hover:bg-[#1EB554] transition duration-200"
          >
            <img src="/assets/images/whatsapp_icon.webp" alt="WhatsApp Icon" className="w-20 mb-2" />
            Contratar nuestros servicios
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;