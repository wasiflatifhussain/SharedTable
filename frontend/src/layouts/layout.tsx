import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

type Props = {
    children: React.ReactNode;
    showHero?: boolean;
    bgImage?: string;
}

const Layout = ({children, showHero = false, bgImage}: Props) => {

    const containerStyles = {
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div style={containerStyles}>
                {showHero && <Hero />}
                <div className="container mx-auto flex-1 py-10">{children}</div>
            </div>
            <Footer />
        </div>
    )
}

export default Layout;