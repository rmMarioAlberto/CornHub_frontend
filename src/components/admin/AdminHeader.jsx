// src/components/admin/AdminHeader.jsx
import React from 'react';
import Header from '../common/Header';
import { Link } from 'react-router-dom';

/**
 * Header exclusivo del área de administración.
 * - Fondo negro (`bg-negro-texto`)
 * - Logo de 48 px (h-12) → mismo que en la captura
 * - Tres botones con <Button variant="primary"/>
 */
const AdminHeader = () => {
  // Los “navItems” no se usan → se pasan vacíos
  const navItems = [];

  // Los botones se renderizan dentro del propio Header usando el slot
  // que ya tiene para un botón opcional.  Como necesitamos 3, los
  // envolvemos en un <div> que Header mostrará después de los navItems.
  const extraButtons = (
    <div className="flex space-x-4">
      <Link to="/admin/profile">
        <button className="px-4 py-2 bg-verde-profundo text-white rounded-md font-poppins font-semibold hover:bg-verde-medio transition">
          Mi Perfil
        </button>
      </Link>
      <Link to="/admin/create-crop">
        <button className="px-4 py-2 bg-verde-profundo text-white rounded-md font-poppins font-semibold hover:bg-verde-medio transition">
          Crear Cultivo
        </button>
      </Link>
      <Link to="/admin/users">
        <button className="px-4 py-2 bg-verde-profundo text-white rounded-md font-poppins font-semibold hover:bg-verde-medio transition">
          Usuarios
        </button>
      </Link>
    </div>
  );

  return (
    <Header
      navItems={navItems}
      logoSrc="/assets/images/lettucecirity-icono.png"
      bgColor="bg-negro-texto text-white"
      // Sobrescribimos el slot del botón único con nuestros 3 botones
      buttonText={null}
      buttonLink=""
      // **Truco**: Header ya acepta children (no lo tenía).  Lo añadimos
      // en el archivo common/Header.jsx (ver siguiente bloque).
    >
      {extraButtons}
    </Header>
  );
};

export default AdminHeader;