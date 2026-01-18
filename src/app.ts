import cors from 'cors';
import express from 'express';
import { areaRoutes } from './modules/area/area.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { dictRoutes } from './modules/dict/dict.routes';
import { materialRoutes } from './modules/material/material.routes';
import { orderRoutes } from './modules/order/order.routes';
import { areaPricingRoutes } from './modules/pricing-area/pricing-area.routes';
import { productPricingRoutes } from './modules/pricing-product/pricing-product.routes';
import { recipeRoutes } from './modules/recipe/recipe.routes';
import { roleRoutes } from './modules/role/role.routes';
import { userRoutes } from './modules/user/user.routes';

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use('/auth', authRoutes);
app.use('/roles', roleRoutes);
app.use('/users', userRoutes);
app.use('/areas', areaRoutes);
app.use('/dicts', dictRoutes);
app.use('/materials', materialRoutes);
app.use('/recipes', recipeRoutes);
app.use('/product-pricing', productPricingRoutes);
app.use('/area-pricing', areaPricingRoutes);
app.use('/orders', orderRoutes);
