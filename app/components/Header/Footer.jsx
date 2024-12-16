import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="text-sm">
                        <p>&copy; {new Date().getFullYear()} Digio.co.th. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-indigo-400">About</a>
                        <a href="#" className="hover:text-indigo-400">Privacy Policy</a>
                        <a href="#" className="hover:text-indigo-400">Terms of Service</a>
                    </div>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                    <a href="#" className="text-white hover:text-indigo-400">
                        <FontAwesomeIcon icon={faFacebook} className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-white hover:text-indigo-400">
                        <FontAwesomeIcon icon={faTwitter} className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-white hover:text-indigo-400">
                        <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
