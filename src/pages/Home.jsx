import React from 'react';
import Button from '../components/common/Button';

const Home = () => {
  return (
    <div className="min-h-screen bg-verde-lima-claro">
      <header className="bg-verde-profundo text-white p-4 flex justify-between">
        <img src="/assets/images/lettucecirity-icono.jpg" alt="Lettucecurity" className="h-10" />
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#about">Acerca</a></li>
            <li><a href="#contact">Contacto</a></li>
          </ul>
        </nav>
        <Button onClick={() => window.location.href = '/login'}>Iniciar Sesión</Button>
      </header>
      <main className="text-center py-20">
        <img src="/assets/images/cultivos.jpg" alt="Cultivos" className="mx-auto mb-4" />
        <h1 className="text-4xl">Cultivos seguros y libres de plagas</h1>
        <p className="mt-4">Monitoreo inteligente para tu agricultura.</p>
        <Button variant="secondary" className="mt-6">Contactar vía WhatsApp</Button>
      </main>
    </div>
  );
};

export default Home;