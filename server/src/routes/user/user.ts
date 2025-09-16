import { Elysia } from 'elysia';

import { authRoutes } from './auth';
import { profileRoutes } from './profile';

export const userRoute = new Elysia({ prefix: '/user' }).use(authRoutes).use(profileRoutes);
