import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CareerCraft</h3>
            <p className="text-neutral-400 text-sm">
              Handcrafted products to help you excel in your professional journey. Quality products designed for job seekers.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="#" className="hover:text-white">Business Cards</Link></li>
              <li><Link href="#" className="hover:text-white">Stationery</Link></li>
              <li><Link href="#" className="hover:text-white">Portfolios</Link></li>
              <li><Link href="#" className="hover:text-white">Interview Kits</Link></li>
              <li><Link href="#" className="hover:text-white">All Products</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="#" className="hover:text-white">Resume Writing Tips</Link></li>
              <li><Link href="#" className="hover:text-white">Interview Preparation</Link></li>
              <li><Link href="#" className="hover:text-white">Networking Guide</Link></li>
              <li><Link href="#" className="hover:text-white">Career Blog</Link></li>
              <li><Link href="#" className="hover:text-white">Job Search Toolkit</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-neutral-500" />
                <span>support@careercraft.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-neutral-500" />
                <span>1-800-CAREER-1</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-neutral-500" />
                <span>123 Career Street<br />Professional City, PC 12345</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-400">&copy; {new Date().getFullYear()} CareerCraft. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="#" className="text-sm text-neutral-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-neutral-400 hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-neutral-400 hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
