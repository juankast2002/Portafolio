'use client';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

interface CardProps {
  src: string;
  name: string;
  alt: string;
  href: string;
}

const Card: React.FC<CardProps> = ({ src, name, alt, href }) => {
  return (
    <div className="p-3">
      <Link 
        href={href} 
        className="block bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:bg-gray-700 transition duration-300 overflow-hidden" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <div style={{ position: 'relative', width: '100%', height: '240px' }}>
          <Image 
            src={src} 
            alt={alt || "Project Image"} 
            layout="fill"
            objectFit="cover"
            className="transform hover:scale-110 transition duration-500"
          />
        </div>
        <div className="p-5" style={{ minHeight: '160px' }}>
          <h5 className="mb-2 text-xl font-bold text-white hover:text-yellow-500 transition-colors">{name}</h5>
          <p className="text-sm text-gray-400 line-clamp-4 leading-relaxed">{alt}</p>
        </div>
      </Link>
    </div>
  );
};

export default Card;