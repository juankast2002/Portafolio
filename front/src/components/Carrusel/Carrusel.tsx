'use client'
import { useEffect, useState } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card from "../Cards/CardsCarrusel";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Producto {
  id: number;
  name: string;
  src: string;
  alt: string;
  href: string;
}

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const PrevArrow = (props: ArrowProps) => {
  const { onClick } = props;
  return (
    <button
      className="absolute left-[-15px] top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 backdrop-blur-md border border-gray-700 text-yellow-500 hover:bg-gray-800 hover:text-white hover:border-yellow-500 hover:scale-110 transition-all duration-300 shadow-md focus:outline-none"
      onClick={onClick}
    >
      <FaChevronLeft className="ml-[-2px]" />
    </button>
  );
};

const NextArrow = (props: ArrowProps) => {
  const { onClick } = props;
  return (
    <button
      className="absolute right-[-15px] top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 backdrop-blur-md border border-gray-700 text-yellow-500 hover:bg-gray-800 hover:text-white hover:border-yellow-500 hover:scale-110 transition-all duration-300 shadow-md focus:outline-none"
      onClick={onClick}
    >
      <FaChevronRight className="mr-[-2px]" />
    </button>
  );
};

export const Carrusel = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        name: "5tart Travel",
        src: "https://res.cloudinary.com/dfktz8zkt/image/upload/v1728428007/cbey16iyadftprvqda3k.png",
        alt: "Proyecto grupal: desarrollo de un marketplace especializado en la compra y venta de viajes. La plataforma permite a los usuarios explorar, publicar y adquirir experiencias de viaje, facilitando la conexión entre agencias y viajeros de manera eficiente e intuitiva.",
        href: "https://5tart-travel-front-w2ip.vercel.app/"
      },
      {
        id: 2,
        name: "Las Divas De Romi",
        src: "https://res.cloudinary.com/dfktz8zkt/image/upload/v1732223080/ynlk1fioljxs2krzlhq3.png",
        alt: "Es un eCommerce de productos y cursos online una plataforma que permite la compra de productos físicos y digitales, como productos, así como el acceso a cursos en línea en diversas áreas. Los usuarios pueden comprar de manera fácil y segura, con pagos electrónicos y acceso inmediato a los cursos. (EN PROCESO)",
        href: "https://personal-woad-phi.vercel.app/"
      }
    ];
    setProductos(data);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  if (productos.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 md:px-10 bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl relative mt-2 mb-2">
      <Slider {...settings}>
        {productos.map((producto) => (
          <div key={producto.id} className="outline-none">
            <Card
              src={producto.src}
              name={producto.name}
              alt={producto.alt}
              href={producto.href}
            />
          </div>
        ))}
      </Slider>

      <style>{`
        .slick-dots li button:before {
          color: #9ca3af !important;
          font-size: 10px !important;
          opacity: 0.5 !important;
          transition: all 0.3s ease;
        }
        .slick-dots li.slick-active button:before {
          color: #eab308 !important;
          opacity: 1 !important;
          transform: scale(1.3);
        }
        .slick-dots {
          bottom: -15px !important;
        }
      `}</style>
    </div>
  );
};
