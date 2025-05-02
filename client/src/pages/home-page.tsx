import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ResourcesSection from "@/components/ResourcesSection";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Category = "all" | "business-cards" | "stationery" | "portfolios" | "interview";

export default function HomePage() {
  const [currentCategory, setCurrentCategory] = useState<Category>("all");
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter(
    (product) => currentCategory === "all" || product.category === currentCategory
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        
        {/* Product section */}
        <section id="products" className="py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
              <h2 className="text-2xl font-bold text-neutral-900">Professional Products</h2>
              <div className="mt-4 sm:mt-0">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={currentCategory === "all" ? "default" : "outline"}
                    onClick={() => setCurrentCategory("all")}
                    className="px-4 py-2 text-sm font-medium rounded-md"
                  >
                    All Products
                  </Button>
                  <Button 
                    variant={currentCategory === "business-cards" ? "default" : "outline"}
                    onClick={() => setCurrentCategory("business-cards")}
                    className="px-4 py-2 text-sm font-medium rounded-md"
                  >
                    Business Cards
                  </Button>
                  <Button 
                    variant={currentCategory === "stationery" ? "default" : "outline"}
                    onClick={() => setCurrentCategory("stationery")}
                    className="px-4 py-2 text-sm font-medium rounded-md"
                  >
                    Stationery
                  </Button>
                  <Button 
                    variant={currentCategory === "portfolios" ? "default" : "outline"}
                    onClick={() => setCurrentCategory("portfolios")}
                    className="px-4 py-2 text-sm font-medium rounded-md"
                  >
                    Portfolios
                  </Button>
                  <Button 
                    variant={currentCategory === "interview" ? "default" : "outline"}
                    onClick={() => setCurrentCategory("interview")}
                    className="px-4 py-2 text-sm font-medium rounded-md"
                  >
                    Interview Kits
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Product grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        <TestimonialsSection />
        <ResourcesSection />

        {/* Subscribe section */}
        <section className="bg-primary py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Get Career Tips & Product Updates</h2>
              <p className="mt-4 text-lg text-primary-light max-w-2xl mx-auto">
                Subscribe to our newsletter for exclusive career advice, product updates, and special offers.
              </p>
            </div>
            
            <div className="mt-8 max-w-xl mx-auto">
              <form className="sm:flex">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input 
                  id="email-address" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  className="w-full px-5 py-3 placeholder-neutral-400 focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white focus:border-white sm:max-w-xs rounded-md" 
                  placeholder="Enter your email"
                />
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <Button type="submit" variant="secondary" className="w-full flex items-center justify-center px-5 py-3 font-medium rounded-md">
                    Subscribe
                  </Button>
                </div>
              </form>
              <p className="mt-3 text-sm text-primary-light">
                We care about your data. Read our 
                <a href="#" className="font-medium text-white underline ml-1">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
