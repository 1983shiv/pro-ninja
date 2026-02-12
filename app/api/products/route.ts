import { NextRequest, NextResponse } from 'next/server';
import { getProductsCollection, getLicensesCollection, getPurchasesCollection } from '@/drizzle/db';
import { Product, newObjectId } from '@/drizzle/schema';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching products...');
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const productsCollection = await getProductsCollection();
    const query = activeOnly ? { isActive: true } : {};
    const products = await productsCollection.find(query).toArray();

    console.log('Found products:', products.length);
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// POST /api/products - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      name,
      description,
      shortDesc,
      tierType,
      price,
      currency = 'USD',
      billingCycle = 'monthly',
      features,
      reviewLimit,
      siteLimit = 1,
      version = '1.0.0',
      isActive = true,
      isFeatured = false,
    } = body;

    // Validation
    if (!slug || !name || !description || !tierType || price === undefined || !reviewLimit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const productsCollection = await getProductsCollection();

    // Check if slug already exists
    const existingProduct = await productsCollection.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      );
    }

    const newProduct: Product = {
      _id: newObjectId(),
      slug,
      name,
      description,
      shortDesc: shortDesc || null,
      tierType,
      price,
      currency,
      billingCycle,
      features: features || {},
      reviewLimit,
      siteLimit,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      version,
      isActive,
      isFeatured,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await productsCollection.insertOne(newProduct);

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
