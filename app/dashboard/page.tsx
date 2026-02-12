'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface License {
  _id: string;
  licenseKey: string;
  status: string;
  reviewsUsed: number;
  reviewLimit: number;
  activations: number;
  maxActivations: number;
  expiresAt: string | null;
}

export default function DashboardPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [testLicenseKey, setTestLicenseKey] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    // Fetch user's licenses (placeholder - would need auth)
    setLoading(false);
  }, []);

  const testLicenseValidation = async () => {
    try {
      const response = await fetch('/api/licenses/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: testLicenseKey }),
      });

      const data = await response.json();
      setValidationResult(data);
    } catch (error) {
      console.error('Error validating license:', error);
      setValidationResult({ error: 'Failed to validate license' });
    }
  };

  return (
    <div className="container p-20 mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your licenses and track your usage
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Licenses</CardTitle>
            <CardDescription>Your current licenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{licenses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Reviews</CardTitle>
            <CardDescription>Reviews analyzed this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Limit</CardTitle>
            <CardDescription>Monthly quota</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* License Validation Tester */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test License Validation</CardTitle>
          <CardDescription>
            Enter a license key to test the validation API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="licenseKey">License Key</Label>
            <Input
              id="licenseKey"
              placeholder="Enter license key..."
              value={testLicenseKey}
              onChange={(e) => setTestLicenseKey(e.target.value)}
            />
          </div>
          <Button onClick={testLicenseValidation}>Validate License</Button>

          {validationResult && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Validation Result:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(validationResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Licenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Licenses</CardTitle>
          <CardDescription>Manage and view all your licenses</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading licenses...</p>
          ) : licenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You don't have any licenses yet.
              </p>
              <Button>Purchase a License</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {licenses.map((license) => (
                <div
                  key={license._id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-sm">{license.licenseKey}</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {license.status}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Active
                    </span>
                  </div>
                  <div className="text-sm">
                    <p>
                      Reviews: {license.reviewsUsed} / {license.reviewLimit}
                    </p>
                    <p>
                      Activations: {license.activations} / {license.maxActivations}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
