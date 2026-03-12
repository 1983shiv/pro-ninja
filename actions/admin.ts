'use server';

import { auth } from '@/auth';
import {
  getUsersCollection,
  getLicensesCollection,
  getTicketsCollection,
  getProductsCollection,
  getDownloadsCollection,
} from '@/drizzle/db';

// ─── Auth guard ──────────────────────────────────────────────────────────────

async function requireAdminGuard() {
  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized' as const };
  if (session.user.role !== 'ADMIN') return { error: 'Forbidden' as const };
  return { user: session.user };
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  activeLicenses: number;
  openTickets: number;
  totalProducts: number;
}

export interface AdminUserRow {
  _id: string;
  email: string;
  name: string | null;
  role: string;
  isTwoFactorEnabled: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdminLicenseRow {
  _id: string;
  licenseKey: string;
  status: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  productName: string;
  tierType: string;
  activations: number;
  maxActivations: number;
  reviewsUsed: number;
  reviewLimit: number;
  expiresAt: string | null;
  createdAt: string | null;
}

export interface AdminProductRow {
  _id: string;
  name: string;
  slug: string;
  tierType: string;
  price: number;
  currency: string;
  reviewLimit: number;
  siteLimit: number;
  isActive: boolean;
  isFeatured: boolean;
  version: string;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats | { error: string }> {
  const guard = await requireAdminGuard();
  if ('error' in guard) return { error: guard.error };

  try {
    const [usersCol, licensesCol, ticketsCol, productsCol] = await Promise.all([
      getUsersCollection(),
      getLicensesCollection(),
      getTicketsCollection(),
      getProductsCollection(),
    ]);

    const [totalUsers, activeLicenses, openTickets, totalProducts] = await Promise.all([
      usersCol.countDocuments({}),
      licensesCol.countDocuments({ status: 'active' }),
      ticketsCol.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      productsCol.countDocuments({}),
    ]);

    return { totalUsers, activeLicenses, openTickets, totalProducts };
  } catch (e) {
    console.error('getAdminStats:', e);
    return { error: 'Failed to load stats' };
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getAdminUsers(opts: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  const guard = await requireAdminGuard();
  if ('error' in guard) return { error: guard.error };

  const { search = '', role = '', page = 1, limit = 20 } = opts;
  const skip = (page - 1) * limit;

  try {
    const usersCol = await getUsersCollection();
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) filter.role = role;

    const [rawUsers, total] = await Promise.all([
      usersCol.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      usersCol.countDocuments(filter),
    ]);

    const users: AdminUserRow[] = rawUsers.map(({ password: _p, twoFactorSecret: _t, ...u }) => ({
      _id: u._id,
      email: u.email,
      name: u.name ?? null,
      role: u.role,
      isTwoFactorEnabled: u.isTwoFactorEnabled ?? false,
      createdAt: u.createdAt?.toISOString() ?? null,
      updatedAt: u.updatedAt?.toISOString() ?? null,
    }));

    return { users, total, page, limit };
  } catch (e) {
    console.error('getAdminUsers:', e);
    return { error: 'Failed to load users' };
  }
}

export async function getAdminUser(id: string) {
  const guard = await requireAdminGuard();
  if ('error' in guard) return { error: guard.error };

  try {
    const [usersCol, licensesCol, ticketsCol] = await Promise.all([
      getUsersCollection(),
      getLicensesCollection(),
      getTicketsCollection(),
    ]);

    const rawUser = await usersCol.findOne({ _id: id });
    if (!rawUser) return { error: 'User not found' };

    const { password: _p, twoFactorSecret: _t, ...userData } = rawUser;

    const [licenses, tickets] = await Promise.all([
      licensesCol.find({ userId: id }).sort({ createdAt: -1 }).toArray(),
      ticketsCol.find({ userId: id }).sort({ createdAt: -1 }).toArray(),
    ]);

    return {
      user: {
        _id: userData._id,
        email: userData.email,
        name: userData.name ?? null,
        role: userData.role,
        isTwoFactorEnabled: userData.isTwoFactorEnabled ?? false,
        createdAt: userData.createdAt?.toISOString() ?? null,
        updatedAt: userData.updatedAt?.toISOString() ?? null,
      },
      licenses: licenses.map((l) => ({
        ...l,
        createdAt: l.createdAt?.toISOString() ?? null,
        updatedAt: l.updatedAt?.toISOString() ?? null,
        expiresAt: l.expiresAt?.toISOString() ?? null,
      })),
      tickets: tickets.map((t) => ({
        ...t,
        createdAt: t.createdAt?.toISOString() ?? null,
        updatedAt: t.updatedAt?.toISOString() ?? null,
      })),
    };
  } catch (e) {
    console.error('getAdminUser:', e);
    return { error: 'Failed to load user' };
  }
}

export async function updateUserRole(userId: string, role: string) {
  const guard = await requireAdminGuard();
  if ('error' in guard) return { error: guard.error };

  const allowed = ['USER', 'CUSTOMER', 'ADMIN'];
  if (!allowed.includes(role)) return { error: 'Invalid role' };

  try {
    const usersCol = await getUsersCollection();
    const result = await usersCol.updateOne(
      { _id: userId },
      { $set: { role, updatedAt: new Date() } },
    );
    if (result.matchedCount === 0) return { error: 'User not found' };
    return { success: true };
  } catch (e) {
    console.error('updateUserRole:', e);
    return { error: 'Failed to update role' };
  }
}

// ─── Licenses ────────────────────────────────────────────────────────────────

export async function getAdminLicenses(opts: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const guard = await requireAdminGuard();
  if ('error' in guard) return { error: guard.error };

  const { search = '', status = '', page = 1, limit = 20 } = opts;
  const skip = (page - 1) * limit;

  try {
    const [licensesCol, usersCol, productsCol] = await Promise.all([
      getLicensesCollection(),
      getUsersCollection(),
      getProductsCollection(),
    ]);

    const filter: Record<string, unknown> = {};
    if (search) filter.licenseKey = { $regex: search, $options: 'i' };
    if (status) filter.status = status;

    const [rawLicenses, total] = await Promise.all([
      licensesCol.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      licensesCol.countDocuments(filter),
    ]);

    const licenses: AdminLicenseRow[] = await Promise.all(
      rawLicenses.map(async (lic) => {
        const [user, product] = await Promise.all([
          usersCol.findOne({ _id: lic.userId }, { projection: { email: 1, name: 1 } }),
          productsCol.findOne({ _id: lic.productId }, { projection: { name: 1, tierType: 1 } }),
        ]);
        return {
          _id: lic._id,
          licenseKey: lic.licenseKey,
          status: lic.status,
          userId: lic.userId,
          userEmail: user?.email ?? '—',
          userName: user?.name ?? null,
          productName: product?.name ?? '—',
          tierType: (product?.tierType as string) ?? '—',
          activations: lic.activations,
          maxActivations: lic.maxActivations,
          reviewsUsed: lic.reviewsUsed,
          reviewLimit: lic.reviewLimit,
          expiresAt: lic.expiresAt?.toISOString() ?? null,
          createdAt: lic.createdAt?.toISOString() ?? null,
        };
      }),
    );

    return { licenses, total, page, limit };
  } catch (e) {
    console.error('getAdminLicenses:', e);
    return { error: 'Failed to load licenses' };
  }
}

export async function updateLicense(
  id: string,
  action: 'revoke' | 'activate' | 'reset_usage' | 'extend',
  expiresAt?: string,
) {
  const guard = await requireAdminGuard();
  if ('error' in guard) return { error: guard.error };

  try {
    const licensesCol = await getLicensesCollection();
    const update: Record<string, unknown> = { updatedAt: new Date() };

    switch (action) {
      case 'revoke':      update.status = 'suspended'; break;
      case 'activate':    update.status = 'active'; break;
      case 'reset_usage': update.reviewsUsed = 0; break;
      case 'extend':
        if (!expiresAt) return { error: 'expiresAt required for extend' };
        update.expiresAt = new Date(expiresAt);
        update.status = 'active';
        break;
    }

    const result = await licensesCol.updateOne({ _id: id }, { $set: update });
    if (result.matchedCount === 0) return { error: 'License not found' };
    return { success: true };
  } catch (e) {
    console.error('updateLicense:', e);
    return { error: 'Failed to update license' };
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getAdminProducts() {
  const guard = await requireAdminGuard();
  if ('error' in guard) return { error: guard.error };

  try {
    const productsCol = await getProductsCollection();
    const rawProducts = await productsCol.find({}).sort({ price: 1 }).toArray();

    const products: AdminProductRow[] = rawProducts.map((p) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      tierType: p.tierType,
      price: p.price,
      currency: p.currency,
      reviewLimit: p.reviewLimit,
      siteLimit: p.siteLimit,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      version: p.version,
    }));

    return { products };
  } catch (e) {
    console.error('getAdminProducts:', e);
    return { error: 'Failed to load products' };
  }
}

export async function updateProduct(
  id: string,
  fields: {
    name?: string;
    description?: string;
    shortDesc?: string | null;
    price?: number;
    reviewLimit?: number;
    siteLimit?: number;
    isActive?: boolean;
    isFeatured?: boolean;
  },
) {
  const guard = await requireAdminGuard();
  if ('error' in guard) return { error: guard.error };

  try {
    const productsCol = await getProductsCollection();
    const update: Record<string, unknown> = { updatedAt: new Date() };

    if (fields.name !== undefined)        update.name = String(fields.name);
    if (fields.description !== undefined) update.description = String(fields.description);
    if (fields.shortDesc !== undefined)   update.shortDesc = fields.shortDesc ? String(fields.shortDesc) : null;
    if (fields.price !== undefined)       update.price = Number(fields.price);
    if (fields.reviewLimit !== undefined) update.reviewLimit = Number(fields.reviewLimit);
    if (fields.siteLimit !== undefined)   update.siteLimit = Number(fields.siteLimit);
    if (fields.isActive !== undefined)    update.isActive = Boolean(fields.isActive);
    if (fields.isFeatured !== undefined)  update.isFeatured = Boolean(fields.isFeatured);

    const result = await productsCol.updateOne({ _id: id }, { $set: update });
    if (result.matchedCount === 0) return { error: 'Product not found' };
    return { success: true };
  } catch (e) {
    console.error('updateProduct:', e);
    return { error: 'Failed to update product' };
  }
}

// ─── Downloads ───────────────────────────────────────────────────────────────

export async function getAdminDownloads() {
  const guard = await requireAdminGuard();
  if ('error' in guard) return { error: guard.error };

  try {
    const [downloadsCol, usersCol, productsCol] = await Promise.all([
      getDownloadsCollection(),
      getUsersCollection(),
      getProductsCollection(),
    ]);

    const rawDownloads = await downloadsCol
      .find({})
      .sort({ downloadedAt: -1 })
      .limit(200)
      .toArray();

    const downloads = await Promise.all(
      rawDownloads.map(async (d) => {
        const [user, product] = await Promise.all([
          usersCol.findOne({ _id: d.userId }, { projection: { email: 1 } }),
          productsCol.findOne({ _id: d.productId }, { projection: { name: 1 } }),
        ]);
        return {
          _id: d._id,
          userId: d.userId,
          productId: d.productId,
          licenseId: d.licenseId,
          version: d.version,
          ipAddress: d.ipAddress ?? null,
          userEmail: user?.email ?? null,
          productName: product?.name ?? null,
          downloadedAt: d.downloadedAt?.toISOString() ?? null,
        };
      }),
    );

    return { downloads };
  } catch (e) {
    console.error('getAdminDownloads:', e);
    return { error: 'Failed to load downloads' };
  }
}

