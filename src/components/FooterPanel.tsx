import React from 'react';
import { MdEmail } from 'react-icons/md';

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
}

export default function FooterPanel(): React.JSX.Element {
  const currentYear = new Date().getFullYear();
  const socialLinks: SocialLink[] = [
    { 
      name: 'Email',
      icon: MdEmail,
      url: 'https://mail.google.com/mail/?view=cm&fs=1&to=priyanshuvijay262@gmail.com&su=Xela_Arcade%20Inquiry&body=Hey%20there%20%21%20I%27m%20here%20through%20your%20Game%20lobby%20%21' 
    },
  ];

  return (
    <footer className="mt-8 w-full flex flex-col items-center justify-center gap-3 px-4">
       {/* Social Interactive Layout Link Matrix */}
      <div className="flex justify-center items-center gap-4">
        <p className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase leading-relaxed">
          Contact
        </p>
        {socialLinks.map((social, index) => {
          const IconComponent = social.icon;
          return (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-blue-400/50 transition duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer group"
              title={social.name}
              aria-label={`Open ${social.name}`}
            >
              <IconComponent className="text-xl text-white group-hover:text-blue-400 group-hover:scale-110 transition duration-300" />
            </a>
          );
        })}
      </div>

      {/* Text Container Layout */}
      <div className="w-full max-w-4xl text-center">
        <p className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase leading-relaxed">
          © {currentYear} Xela_Arcade. A gaming matrix. All rights reserved.
        </p>
      </div>


    </footer>
  );
}