// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Importamos los iconos
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
  
  // Estado para alternar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 shadow-2xl rounded-2xl overflow-hidden bg-white">
            {/* Imagen (Columna Izquierda) */}
            <div className="col-span-1 aspect-[3/4] md:aspect-auto bg-cover bg-center" style={{ backgroundImage: "url('/assets/images/login.webp')" }}></div>
            
            {/* Formulario (Columna Derecha) */}
            <div className="col-span-1 bg-gris-suave px-8 md:px-12 py-10 flex flex-col justify-center">
              <div className="w-full">
                <h2 className="text-3xl font-poppins font-bold text-verde-profundo mb-2 text-center">¡Hola de nuevo!</h2>
                <p className="text-gray-500 text-center mb-8">Inicia sesión para monitorear tus cultivos</p>
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm rounded" role="alert">
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-1">
                  {/* Input Email */}
                  <div className="h-[85px]">
                    <Input
                      type="text"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      className={touched.email && formErrors.email ? "border-red-500" : ""}
                    />
                    {touched.email && formErrors.email && <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.email}</p>}
                  </div>

                  {/* Input Password con Toggle */}
                  <div className="h-[85px] relative">
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"} // Cambia dinámicamente
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                        className={`pr-12 ${touched.password && formErrors.password ? "border-red-500" : ""}`} // Padding derecho extra para el icono
                      />
                      {/* Botón del ojo */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-verde-medio focus:outline-none transition-colors"
                        tabIndex="-1" // Para que no interfiera con el tabulado natural del form
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {touched.password && formErrors.password && <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.password}</p>}
                  </div>

                  {/* Botón Submit */}
                  <div className="pt-2 relative group w-full">
                    <Button
                      variant="tertiary"
                      className={`w-full py-3 text-lg shadow-lg transform transition-transform active:scale-95 ${loading || Object.keys(formErrors).length > 0 || !email.trim() || !password.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                      disabled={loading || Object.keys(formErrors).length > 0 || !email.trim() || !password.trim()}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Ingresando...</span>
                        </div>
                      ) : 'Ingresar →'}
                    </Button>
                    
                    {/* Tooltip de error si el botón está deshabilitado */}
                    {(Object.keys(formErrors).length > 0 || !email.trim() || !password.trim()) && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 z-10">
                        Completa los campos correctamente
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                      </div>
                    )}
                  </div>
                </form>
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