import React from "react";
import { Book, Users, Badge, Star } from "lucide-react";

interface BenefitsProps {
    sectTitle: string;
    sectSubTitle: string;
    benTitle1: string;
    benTitle2: string;
    benTitle3: string;
    benTitle4: string;
    benContent1: string;
    benContent2: string;
    benContent3: string;
    benContent4: string;
}

const Benefits: React.FC<BenefitsProps> = ({ sectTitle, sectSubTitle, benTitle1, benTitle2, benTitle3, benTitle4, benContent1, benContent2, benContent3, benContent4 }) => {
  return (
    <section 
        className="w-screen flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800 text-white text-center bg-cover bg-center bg-no-repeat"
    >
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-black dark:text-white">{sectTitle}</h1>
        <h3 className="text-lg md:text-2xl text-black dark:text-white mb-6">{sectSubTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mt-5 px-4">
            <div className="flex flex-col shadow-md bg-gray-50 dark:bg-gray-700 pb-3">
                <div className="w-full h-48 flex items-center justify-center">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-400 dark:bg-gray-700">
                        <Book className="w-10 h-10 text-white" />
                    </div>
                </div>
                <div className="text-black dark:text-white text-center px-4">
                    <h6 className="font-semibold">{benTitle1}</h6>
                    <p>{benContent1}</p>
                </div>
            </div>
            
            <div className="flex flex-col shadow-md bg-gray-50 dark:bg-gray-700 pb-3">
                <div className="w-full h-48 flex items-center justify-center">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-400 dark:bg-gray-700">
                        <Users className="w-10 h-10 text-white" />
                    </div>
                </div>
                <div className="text-black dark:text-white text-center px-4">
                    <h6 className="font-semibold">{benTitle2}</h6>
                    <p>{benContent2}</p>
                </div>
            </div>

            <div className="flex flex-col shadow-md bg-gray-50 dark:bg-gray-700 pb-3">
                <div className="w-full h-48 flex items-center justify-center">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-400 dark:bg-gray-700">
                        <Badge className="w-10 h-10 text-white" />
                    </div>
                </div>
                <div className="text-black dark:text-white text-center px-4">
                    <h6 className="font-semibold">{benTitle3}</h6>
                    <p>{benContent3}</p>
                </div>
            </div>

            <div className="flex flex-col shadow-md bg-gray-50 dark:bg-gray-700 pb-3">
                <div className="w-full h-48 flex items-center justify-center">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-400 dark:bg-gray-700">
                        <Star className="w-10 h-10 text-white" />
                    </div>
                </div>
                <div className="text-black dark:text-white text-center px-4">
                    <h6 className="font-semibold">{benTitle4}</h6>
                    <p>{benContent4}</p>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Benefits;
