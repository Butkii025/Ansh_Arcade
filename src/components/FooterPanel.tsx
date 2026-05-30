import React from 'react';
import { MdEmail } from 'react-icons/md';

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
}

export default function FooterPanel(): JSX.Element {
  const currentYear = new Date().getFullYear();
  const socialLinks: SocialLink[] = [
    { 
      name: 'Email',
      icon: MdEmail,
      url: 'https://mail.google.com/mail/?view=cm&fs=1&to=pixcelansh@gmail.com' 
    },
  ];

  return (
    <footer className="mt-8 mb-6 w-full flex flex-col items-center justify-center gap-6 px-4">
      {/* Text Container Layout */}
      <div className="w-full max-w-4xl text-center">
        <p className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase leading-relaxed">
          © {currentYear} Anshu Arcade. A gaming matrix deployed by pixcelansh group Pvt.Ltd. All rights reserved.
        </p>
      </div>

      {/* Social Interactive Layout Link Matrix */}
      <div className="flex justify-center items-center gap-4">
        {socialLinks.map((social, index) => {
          const IconComponent = social.icon;
          return (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-blue-400/50 transition duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer group"
              title={social.name}
              aria-label={`Open ${social.name}`}
            >
              <IconComponent className="text-xl text-white group-hover:text-blue-400 group-hover:scale-110 transition duration-300" />
            </a>
          );
        })}
      </div>
    </footer>
  );
}