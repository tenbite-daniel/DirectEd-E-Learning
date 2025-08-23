import React from "react";
import DirectEdLogo from "../../assets/image.webp";

interface FooterProps {
    fp1: string;
    fTitle1: string;
    fLink1: string;
    fLink2: string;
    fLink3: string;
    fTitle2: string;
    fLink4: string;
    fLink5: string;
    fLink6: string;
    fTitle3: string;
    fLink7: string;
    fLink8: string;
    fLink9: string;
    fp2: string;
}

const Footer: React.FC<FooterProps> = ({ fp1, fTitle1, fLink1,fLink2, fTitle2, fLink3, fLink4, fLink5, fLink6, fTitle3, fLink7, fLink8, fLink9, fp2 }) => {
  return (
    <footer className=" w-screen bg-amber-300 dark:bg-gray-800 text-gray-900 dark:text-white py-12">
      {/* Top Section*/}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* First Colummn */}
        <div>
            <img 
                src={DirectEdLogo} 
                alt="DirectEd Logo" 
                className="w-32 mb-4" 
            />
            <p className="text-sm font-semibold mb-4">{fp1}</p>
        </div>

        {/* Second column */}
        <div>
          <h4 className="font-bold mb-3">{fTitle1}</h4>
          <ul className="space-y-5">
            <li>
              <a href="#" className="hover:opacity-35 transition">
                {fLink1}
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-35 transition">
                {fLink2}
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-35 transition">
                {fLink3}
              </a>
            </li>
          </ul>
        </div>

        {/* Third column */}
        <div>
          <h4 className="font-bold mb-3">{fTitle2}</h4>
          <ul className="space-y-5">
            <li>
              <a href="#" className="hover:opacity-35 transition">
                {fLink4}
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-35 transition">
                {fLink5}
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-35 transition">
                {fLink6}
              </a>
            </li>
          </ul>
        </div>

        {/* Fourth column */}
        <div>
          <h4 className="font-bold mb-3">{fTitle3}</h4>
          <ul className="space-y-5">
            <li>
              <a href="#" className="hover:opacity-35 transition">
                {fLink7}
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-35 transition">
                {fLink8}
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-35 transition">
                {fLink9}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm">
        {fp2}
      </div>
    </footer>
  );
};

export default Footer;
