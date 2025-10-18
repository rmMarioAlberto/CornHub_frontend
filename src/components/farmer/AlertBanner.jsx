import React from 'react';
import PropTypes from 'prop-types';

const AlertBanner = ({ alerts }) => {
  // Si no hay alertas, no renderizar nada
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-verde-profundo text-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold text-verde-brillante mb-2 font-poppins">Alertas y Recomendaciones</h3>
      <ul className="list-disc pl-5 space-y-2">
        {alerts.map((alert, index) => (
          <li key={index} className="text-sm font-poppins">
            {alert.message}
            {alert.action && (
              <span className="ml-2 text-verde-aqua font-medium">
                - {alert.action}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

AlertBanner.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
      action: PropTypes.string,
    })
  ),
};

AlertBanner.defaultProps = {
  alerts: [],
};

export default AlertBanner;