import React from "react";
import { Calendar, Clock } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  imageSrc?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  imageSrc
}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-yellow-100 to-yellow-50 p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <button className="px-3 py-1 border border-gray-300 rounded-full text-sm">
              Crextio
            </button>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold mb-2">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 mb-6">{subtitle}</p>
          )}

          {/* Form content */}
          {children}

          {/* Terms & Conditions */}
          <div className="text-xs text-gray-500 mt-6">
            <a href="#" className="hover:underline">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>

      {/* Right side - Image with overlay */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img
          src={imageSrc || "/auth-side.jpg"}
          alt="Auth visual"
          className="w-full h-full object-cover"
        />

        {/* Overlay container */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top task card */}
          <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg w-max">
            <p className="text-xs font-medium">Task Review With Team</p>
            <p className="text-[11px] flex items-center gap-1">
              <Clock size={12} /> 09:30am - 10:00am
            </p>
          </div>

          {/* Middle calendar + avatars */}
          <div className="mt-auto">
            <div className="flex gap-2 text-white mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-xs"
                  >
                    <span className="opacity-80">{day}</span>
                    <span className={`mt-1 ${idx === 5 ? "text-yellow-400" : ""}`}>
                      {22 + idx}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Meeting Card */}
            <div className="bg-white/90 backdrop-blur-lg px-4 py-2 rounded-lg shadow-lg w-max">
              <p className="text-sm font-medium text-gray-800">Daily Meeting</p>
              <p className="text-[11px] text-gray-600">12:00pm - 01:00pm</p>
              <div className="flex mt-2">
                {[
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/men/46.jpg",
                  "https://randomuser.me/api/portraits/women/48.jpg",
                  "https://randomuser.me/api/portraits/men/49.jpg",
                ].map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="attendee"
                    className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
