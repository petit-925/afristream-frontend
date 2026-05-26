import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/50 border-green-700';
      case 'error':
        return 'bg-red-900/50 border-red-700';
      case 'warning':
        return 'bg-yellow-900/50 border-yellow-700';
      case 'info':
        return 'bg-blue-900/50 border-blue-700';
      default:
        return 'bg-blue-900/50 border-blue-700';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-300';
      case 'error':
        return 'text-red-300';
      case 'warning':
        return 'text-yellow-300';
      case 'info':
        return 'text-blue-300';
      default:
        return 'text-blue-300';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out ${getBackgroundColor()}`}
    >
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${getTextColor()}`}>{title}</h4>
          {message && (
            <p className={`text-sm mt-1 ${getTextColor()} opacity-90`}>
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className={`flex-shrink-0 ${getTextColor()} hover:opacity-75 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
