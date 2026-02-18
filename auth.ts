import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import {
    getUsersCollection,
    getAccountsCollection,
    getUserById,
    getAccountByUserId,
} from '@/drizzle/db';
import { User, Account, NewAccount, newObjectId } from '@/drizzle/schema';
import bcrypt from 'bcrypt';
import { UserRole } from './next-auth';

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
                            password: null,
                            role: 'user',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        await usersCollection.insertOne(newUser);
                        existingUser = newUser;
                        user.id = newUser._id;
                    } else {
                        user.id = existingUser._id;
                    }

                    // Check if account exists
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
                        await accountsCollection.insertOne(newAccount);
                    }
                } catch (error) {
                    console.error('Error in signIn callback:', error);
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
                (session.user as any).role = token.role;
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;
            const existingUser = await getUserById(token.sub);
            console.log({ existingUser });
            if (!existingUser) return token;
            const existingAccount = await getAccountByUserId(existingUser._id);

            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.id = existingUser._id;
            // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            return token;
        },
    },
    pages: {
        signIn: '/signin',
        signOut: '/auth/signout',
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
