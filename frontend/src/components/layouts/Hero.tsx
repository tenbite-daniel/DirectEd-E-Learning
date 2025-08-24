import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../../assets/hero-img.jpg";

interface HeroProps {
    title: string;
    subtitle: string;
    ctaLink1: string;
    ctaLink2: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, ctaLink1, ctaLink2 }) => {
    return (
        <section
            className="w-full min-h-screen bg-gray-900 bg-cover bg-center bg-no-repeat flex flex-col justify-center px-4 sm:px-8 lg:px-16"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-2xl md:text-4xl font-bold mb-8 text-gray-900">
                    {title}
                </h1>
                <p className="text-lg md:text-2xl text-white font-medium mb-6">
                    {subtitle}
                </p>

                <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-16">
                    <Link
                        to="/courses"
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-300 rounded-lg text-lg font-medium transition"
                    >
                        {ctaLink1}
                    </Link>

                    <Link
                        to="/onboarding"
                        className="px-6 py-3 border-2 border-white bg-transparent hover:bg-gray-800 rounded-lg text-lg font-medium transition text-white"
                    >
                        {ctaLink2}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
