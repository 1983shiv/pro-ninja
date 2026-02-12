'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Product {
  _id: string;
  slug: string;
  name: string;
  description: string;
  shortDesc?: string;
  tierType: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: any;
  reviewLimit: number;
  siteLimit: number;
  isActive: boolean;
  isFeatured: boolean;
}

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?active=true');
      
      // Check if response is ok
      if (!response.ok) {
        console.error('API error:', response.status, response.statusText);
        const text = await response.text();
        console.error('Response text:', text);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const formatReviewLimit = (limit: number) => {
    return limit === -1 ? 'Unlimited' : limit.toLocaleString();
  };

  const formatSiteLimit = (limit: number) => {
    return limit === -1 ? 'Unlimited' : limit.toString();
  };

  return (
    <div className="container mx-auto p-20 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground">
          Select the perfect plan for your business needs
        </p>
      </div>

      {loading ? (
        <div className="text-center">
          <p>Loading pricing plans...</p>
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card
              key={product._id}
              className={`relative ${
                product.isFeatured ? 'border-primary shadow-lg' : ''
              }`}
            >
              {product.isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <CardDescription>{product.shortDesc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                  {product.price > 0 && (
                    <span className="text-muted-foreground ml-2">
                      /{product.billingCycle}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    {formatReviewLimit(product.reviewLimit)} reviews/month
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    {formatSiteLimit(product.siteLimit)}{' '}
                    {product.siteLimit === 1 ? 'site' : 'sites'}
                  </li>
                  {product.features.aiProviders && (
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      {Array.isArray(product.features.aiProviders)
                        ? product.features.aiProviders.length + ' AI providers'
                        : product.features.aiProviders}
                    </li>
                  )}
                  {product.features.autoAnalysis && (
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Auto-Analysis
                    </li>
                  )}
                  {product.features.autoReply && (
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Auto-Reply
                    </li>
                  )}
                  {product.features.bulkOperations && (
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Bulk Operations
                    </li>
                  )}
                  {product.features.advancedAnalytics && (
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      Advanced Analytics
                    </li>
                  )}
                  {product.features.whiteLabel && (
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      White Label
                    </li>
                  )}
                </ul>
                <Button
                  className="w-full"
                  variant={product.isFeatured ? 'default' : 'outline'}
                >
                  {product.price === 0 ? 'Get Started' : 'Subscribe Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">All Plans Include</h2>
        <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
          <div className="p-4">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold mb-1">AI-Powered Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Advanced sentiment analysis and insights
            </p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">Detailed Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Track trends and customer satisfaction
            </p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold mb-1">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted and protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
