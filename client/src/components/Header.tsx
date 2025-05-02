import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

export default function Header() {
  const [_, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { isOpen: isCartOpen, openCart, closeCart, cartItems } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1.323l-3.954 1.582a1 1 0 00-.646.934v4.322a1 1 0 00.646.934l3.954 1.582V15a1 1 0 001 1h4a1 1 0 001-1v-1.323l3.954-1.582a1 1 0 00.646-.934V6.839a1 1 0 00-.646-.934L15 4.323V3a1 1 0 00-1-1h-4zm3 15h-2v-1.323l-3.954-1.582v-2.193L13 13.677V17z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-2 text-xl font-semibold text-neutral-800">CareerCraft</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-primary border-b-2 border-primary">
              Products
            </Link>
            <Link href="#" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-500 border-b-2 border-transparent hover:border-neutral-300 hover:text-neutral-700">
              Resources
            </Link>
            <Link href="#" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-500 border-b-2 border-transparent hover:border-neutral-300 hover:text-neutral-700">
              About
            </Link>
            <Link href="#" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-500 border-b-2 border-transparent hover:border-neutral-300 hover:text-neutral-700">
              Contact
            </Link>
          </nav>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="p-2 text-neutral-500 hover:text-neutral-700 focus:outline-none"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Cart button */}
            <button 
              onClick={openCart} 
              className="p-2 text-neutral-500 hover:text-neutral-700 focus:outline-none relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            
            {/* Account button */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm font-medium text-neutral-700">
                  {user.username}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => logoutMutation.mutate()}
                  className="text-neutral-700 hover:text-primary"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth" className="hidden sm:flex items-center text-sm font-medium text-neutral-700 hover:text-primary">
                <User className="h-5 w-5 mr-1" />
                <span>Account</span>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="block pl-3 pr-4 py-2 border-l-4 border-primary text-base font-medium text-primary bg-primary-50">
              Products
            </Link>
            <Link href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700">
              Resources
            </Link>
            <Link href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700">
              About
            </Link>
            <Link href="#" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700">
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-neutral-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
                  <User className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-3">
                {user ? (
                  <>
                    <div className="text-base font-medium text-neutral-800">{user.username}</div>
                    <Button 
                      variant="link" 
                      className="text-sm font-medium text-neutral-500 p-0" 
                      onClick={() => logoutMutation.mutate()}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth" className="text-base font-medium text-neutral-800">
                      Sign In
                    </Link>
                    <Link href="/auth" className="text-sm font-medium text-neutral-500">
                      or Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Search panel */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-neutral-900 bg-opacity-50" 
            onClick={() => setSearchOpen(false)}
          ></div>
          <div className="absolute inset-x-0 top-0 bg-white shadow-lg transform transition-all p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center">
                <div className="flex-grow">
                  <input 
                    type="text" 
                    placeholder="Search for products..." 
                    className="w-full border-0 focus:ring-0 text-lg" 
                    autoFocus
                  />
                </div>
                <button 
                  onClick={() => setSearchOpen(false)} 
                  className="p-2 text-neutral-500 hover:text-neutral-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 pb-2">
                <p className="text-sm text-neutral-500">Popular searches:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full">Business Cards</span>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full">Resume Templates</span>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full">Portfolio</span>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full">Interview Kit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cart drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </header>
  );
}
