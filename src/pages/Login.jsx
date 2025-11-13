// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const { auth, loginUser, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({ email: false, password: false });

  const contactLink = "https://api.whatsapp.com/send?phone=+527121924905&text=Hola,%20estoy%20interesado%20en%20contratar%20tus%20servicios%20para%20monitoreo%20de%20cultivos.";
  const navItems = [{ label: 'Contacto', link: contactLink }];

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

  const validateEmail = (value) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  };

  const handleFieldChange = (name, value) => {
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    setTouched((t) => ({ ...t, [name]: true }));

    setFormErrors((prev) => {
      const next = { ...prev };
      if (name === 'email') {
        if (!value.trim()) next.email = 'El correo es requerido.';
        else if (!validateEmail(value)) next.email = 'Formato de correo inválido.';
        else delete next.email;
      }
      if (name === 'password') {
        if (!value.trim()) next.password = 'La contraseña es requerida.';
        else delete next.password;
      }
      return next;
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!email.trim()) errors.email = 'El correo es requerido.';
    else if (!validateEmail(email)) errors.email = 'Formato de correo inválido.';
    if (!password.trim()) errors.password = 'La contraseña es requerida.';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    await loginUser(email.trim(), password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header navItems={navItems} buttonText="Regresar" buttonLink="/" bgColor="verde-lima-claro" />
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="col-span-1 aspect-[3/4] bg-cover bg-center" style={{ backgroundImage: "url('/assets/images/login.webp')" }}></div>
            <div className="col-span-1 bg-gris-suave px-6">
              <div className="h-full flex items-center min-h-[480px]">
                <div className="w-full py-8">
                  <h2 className="text-2xl font-poppins font-semibold text-negro-texto mb-7 text-center">¡Hola, inicia sesión!</h2>
                  {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                  <form onSubmit={handleLogin}>
                    <div className="h-[70px]">
                      <Input
                        type="text"
                        placeholder="Correo"
                        value={email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      />
                      {touched.email && formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                    </div>
                    <div className="h-[70px] mb-4">
                      <Input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      />
                      {touched.password && formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                    </div>
                    <div className="relative group w-full">
                      <Button
                        variant="tertiary"
                        className={`w-full ${loading || Object.keys(formErrors).length > 0 || !email.trim() || !password.trim() ? 'cursor-not-allowed opacity-70' : ''}`}
                        disabled={loading || Object.keys(formErrors).length > 0 || !email.trim() || !password.trim()}
                      >
                        {loading ? 'Iniciando...' : 'Ingresar →'}
                      </Button>
                      {(Object.keys(formErrors).length > 0 || !email.trim() || !password.trim()) && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-gray-800 text-white text-sm px-3 py-2 rounded-md whitespace-nowrap transition-all duration-200">
                          Por favor, completa todos los campos correctamente
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-gray-800"></div>
                        </div>
                      )}
                    </div>
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