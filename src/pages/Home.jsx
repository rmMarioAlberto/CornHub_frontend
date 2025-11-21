// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Shield, Camera, CloudRain, Smartphone, ArrowRight, CheckCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Home = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const whatsappLink = "https://api.whatsapp.com/send?phone=+527121924905&text=¡Hola!%20Quiero%20saber%20más%20sobre%20Lettucecurity%20para%20proteger%20mis%20cultivos.";

  useEffect(() => {
    if (auth?.accessToken && auth?.user?.tipo_usuario) {
      const path = auth.user.tipo_usuario === 2 ? '/admin' : '/farmer';
      navigate(path, { replace: true });
    }
  }, [auth, navigate]);

  if (auth?.accessToken && auth?.user) return null;

  const navItems = [
    { label: 'Características', link: '#features' },
    { label: 'Cómo funciona', link: '#how-it-works' },
    { label: 'Contacto', link: whatsappLink },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        navItems={navItems}
        buttonText="Iniciar Sesión"
        buttonLink="/login"
        bgColor="bg-white shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200"
      />

      {/* HERO PRINCIPAL - CONTRASTE PERFECTO */}
      <section className="relative pt-28 pb-32 overflow-hidden bg-gradient-to-b from-green-900 via-green-800 to-green-900">
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0">
          <img
            src="/assets/images/cultivo.jpg"
            alt="Cultivo de lechuga monitoreado con IoT"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative container-main text-center text-white">
          <div className="max-w-5xl mx-auto p-6 px-6">
            <h1 className="text-5xl md:text-7xl font-bold text-[#A8CDBD] mb-6 leading-tight drop-shadow-2xl">
              Lettucecurity
            </h1>
            <p className="text-2xl md:text-4xl font-medium mb-8 opacity-100 drop-shadow-lg">
              Monitoreo inteligente con IoT + IA
            </p>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Detecta plagas a tiempo • Optimiza riego y pH • Protege tu cosecha con tecnología mexicana
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 bg-white text-green-900 hover:bg-green-50 font-bold text-xl px-10 py-6 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <img src="/assets/images/whatsapp_icon.webp" alt="WhatsApp" className="w-12 h-12" />
                Contratar por WhatsApp
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </a>

              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="border-3 border-white text-white hover:bg-white/20 font-bold text-xl px-10 py-6 rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                Ver más detalles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS - FONDO BLANCO, TEXTO OSCURO */}
      <section id="features" className="py-20 bg-white">
        <div className="container-main">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-green-900 mb-16">
            ¿Por qué Lettucecurity?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { icon: <Camera className="w-16 h-16" />, title: "Detección temprana de plagas", desc: "IA analiza fotos y detecta amenazas antes de que se propaguen." },
              { icon: <Shield className="w-16 h-16" />, title: "Monitoreo 24/7", desc: "Temperatura, humedad y pH en tiempo real, con energía solar." },
              { icon: <CloudRain className="w-16 h-16" />, title: "Riego optimizado", desc: "Alertas precisas cuando tu cultivo necesita agua." },
              { icon: <Leaf className="w-16 h-16" />, title: "Menos químicos", desc: "Actúa solo cuando es necesario. Más rentable y ecológico." },
              { icon: <Smartphone className="w-16 h-16" />, title: "Chatbot KORI", desc: "Usa nuestro Chatbot para consultar datos y el estado de tus cultivos de forma amigable." },
              { icon: <CheckCircle className="w-16 h-16" />, title: "Desarrollado en la UTEQ", desc: "Por estudiantes de Ingeniería en Desarrollo de Software." },
            ].map((feature, i) => (
              <div
                key={i}
                className="card p-10 text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-300"
              >
                <div className="mb-6 inline-flex items-center justify-center w-28 h-28 bg-green-100 rounded-full text-green-800">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-4">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA - FONDO BLANCO */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container-main">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-green-900 mb-16">
            ¿Cómo funciona?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: "1", title: "Instalamos módulos IoT", desc: "Con cámara, sensores y energía solar autónoma." },
              { step: "2", title: "Toman datos cada hora", desc: "Fotos + temperatura + humedad + pH." },
              { step: "3", title: "IA analiza todo", desc: "¿Hay plaga? ¿Falta agua? ¿pH incorrecto?" },
              { step: "4", title: "Consultas fácilmente", desc: "Con el Chatbot y gráficas." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-6 bg-green-900 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-xl">
                    {item.step}
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-1 bg-green-900/30" style={{ width: 'calc(100% + 2rem)' }} />
                  )}
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL - VERDE UTEQ OFICIAL */}
      <section className="py-24 bg-green-900 text-white">
        <div className="container-main text-center">
          <h2 className="text-4xl md:text-6xl text-[#A8CDBD] font-bold mb-8">
            Protege tu cosecha hoy
          </h2>
          <p className="text-2xl mb-12 max-w-3xl mx-auto opacity-90">
            No dejes que una plaga arruine meses de trabajo.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-white text-green-900 hover:bg-green-50 font-bold text-2xl px-14 py-7 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <img src="/assets/images/whatsapp_icon.webp" alt="WhatsApp" className="w-16 h-16" />
            ¡Hablar con un experto ahora!
            <ArrowRight className="w-9 h-9" />
          </a>

          <p className="mt-10 text-lg opacity-80">
            Respuesta inmediata • Proyecto UTEQ • Atención personalizada
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;