import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import {
    getUsersCollection,
    getAccountsCollection,
    getLicensesCollection,
    getProductsCollection,
    getUserById,
    getAccountByUserId,
    getDb
} from '@/drizzle/db';

import { User, Account, License, NewAccount, newObjectId } from '@/drizzle/schema';
import bcrypt from 'bcrypt';
import { generateLicenseKey } from '@/lib/tokens';
import { sendWelcomeEmail } from '@/lib/mail';

const db = await getDb();

export const { handlers, signIn, signOut, auth } = NextAuth({
    basePath: '/api/auth',
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const usersCollection = await getUsersCollection();
                const user = await usersCollection.findOne({
                    email: credentials.email as string,
                });

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password,
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {            
            if (
                account?.provider === 'google' ||
                account?.provider === 'github'
            ) {
                try {                 
                    const usersCollection = await getUsersCollection();
                    const accountsCollection = await getAccountsCollection();

                    // Check if user exists
                    let existingUser = await usersCollection.findOne({
                        email: user.email!,
                    });

                    if (!existingUser) {
                        // Create new user
                        const newUser: User = {
                            _id: newObjectId(),
                            email: user.email!,
                            name: user.name || null,
                            image: user.image || null,
                            emailVerified: new Date(),
                            isTwoFactorEnabled: false,
                            password: null,
                            role: 'CUSTOMER',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        await usersCollection.insertOne(newUser);
                        existingUser = newUser;
                        user.id = newUser._id;

                        // Generate FREE license for new OAuth user
                        try {
                            const productsCollection = await getProductsCollection();
                            const freeProduct = await productsCollection.findOne({ tierType: 'FREE' });

                            if (freeProduct) {
                                const licensesCollection = await getLicensesCollection();
                                const licenseKey = generateLicenseKey();
                                const now = new Date();

                                const newLicense: License = {
                                    _id: newObjectId(),
                                    licenseKey,
                                    userId: newUser._id,
                                    productId: freeProduct._id,
                                    purchaseId: `free_registration_${newUser._id}`,
                                    status: 'active',
                                    activations: 0,
                                    maxActivations: 1,
                                    activatedDomains: [],
                                    activatedAt: null,
                                    expiresAt: null,
                                    lastValidatedAt: null,
                                    reviewsUsed: 0,
                                    reviewLimit: freeProduct.reviewLimit ?? 25,
                                    metadata: { source: 'oauth_registration', provider: account.provider },
                                    createdAt: now,
                                    updatedAt: now,
                                };

                                await licensesCollection.insertOne(newLicense);

                                await sendWelcomeEmail(
                                    newUser.email,
                                    newUser.name ?? 'there',
                                    licenseKey,
                                );
                            }
                        } catch (licenseError) {
                            // Don't block sign-in if license generation fails
                            console.error('License generation failed for OAuth user:', licenseError);
                        }
                    } else {
                        user.id = existingUser._id;
                    }

                    const existingAccount = await accountsCollection.findOne({
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                    });

                    if (!existingAccount) {
                        
                        // Create new account
                        const newAccount: Account = {
                            _id: newObjectId(),
                            userId: existingUser._id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            refresh_token: account.refresh_token || null,
                            access_token: account.access_token || null,
                            expires_at: account.expires_at || null,
                            token_type: account.token_type || null,
                            scope: account.scope || null,
                            id_token: account.id_token || null,
                            session_state:
                                (account.session_state as string) || null,
                        };
                        
                        const accountInsertResult = await accountsCollection.insertOne(newAccount);
                    } 
                } catch (error) {
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (session.user) {
                (session.user as any).id = token.id;
                // (session.user as any).role = token.role;
                // session.user.id = token.sub as string;
                session.user.role = token.role as string;
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
                session.user.isOAuth = token.isOAuth as boolean;  
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;
            const existingUser = await getUserById(token.sub);
            // console.log({ existingUser });
            if (!existingUser) return token;
            const existingAccount = await getAccountByUserId(existingUser._id);

            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.id = existingUser._id;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            return token;
        },
    },    
    pages: {
        signIn: '/login',
        signOut: '/signout',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    trustHost: true,
});

/**
 * 
 * existingUser: {
    _id: '69902b551730aa42e22cc6b5',
    email: 'shivi1190@gmail.com',
    name: 'Shivani Srivastava',
    image: 'https://lh3.googleusercontent.com/a/ACg8ocL3zvD46LG-bdIB8jfCflkvP80eKcVC1Y4YWQe4Ax5dd_NRwQ=s96-c',
    emailVerified: 2026-02-14T07:59:17.164Z,
    password: null,
    role: 'user',
    createdAt: 2026-02-14T07:59:17.164Z,
    updatedAt: 2026-02-14T07:59:17.164Z
  }
 */
