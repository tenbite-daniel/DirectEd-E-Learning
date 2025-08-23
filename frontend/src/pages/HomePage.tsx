import { Header } from "../components/layouts/Header";
import Hero from "../components/layouts/Hero";
import Benefits from "../components/layouts/Benefits";
import Footer from "../components/layouts/Footer";
import Testimonials from "./Testimonials";

export default function Home() {
    return (
        <>
            <Header />
            <Hero
                title="Learn without Limits"
                subtitle="Access world-class education designed for everyone. Our accessible platform empowers students and instructors to create, learn, and grow together."
                ctaLink1="Browse courses"
                ctaLink2="Get Started"
            />
            <Benefits
                sectTitle="Why Choose DirectEd"
                sectSubTitle="Our platform is built with accesibility and inclusivity at its core"
                benTitle1="Accessible Learning"
                benTitle2="Expert Instructors"
                benTitle3="Verified Certificates"
                benTitle4="AI-Powered Support"
                benContent1="WCAG 2.1 AA compliant platform ensuring everyone can learn effectively"
                benContent2="Learn from industry professionals and experienced educators"
                benContent3="Earn recognized certificates to advance your carrer"
                benContent4="Get personalized assistance with our intelligent tutoring system"
            />
            <Testimonials />
            <Footer
                fp1="Empowering learners worldwide with accesible, high-quality education."
                fTitle1="Platform"
                fLink1="Browse Courses"
                fLink2="Instructor's platform"
                fLink3="Students-platform"
                fTitle2="Support"
                fLink4="Help center"
                fLink5="Accesibility"
                fLink6="Contact Us"
                fTitle3="Legal"
                fLink7="Privacy Policy"
                fLink8="Terms of Service"
                fLink9="Cookie Policy"
                fp2="2025 DirectEd Learning Platform. All rights reserved."
            />
        </>
    );
}
