import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy: {
                id: 'desc',
            },
        });

        const formattedProducts = products.map((product) => {
            let status = 'In Stock';
            if (product.stock === 0) status = 'Out of Stock';
            else if (product.stock < 10) status = 'Low Stock';

            return {
                id: product.id,
                name: product.name,
                category: product.category.name,
                price: product.price,
                stock: product.stock,
                status: status,
            };
        });

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, category, price, stock } = body;

        // Find or create category
        let categoryRecord = await prisma.category.findUnique({
            where: { name: category },
        });

        if (!categoryRecord) {
            categoryRecord = await prisma.category.create({
                data: { name: category },
            });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
                categoryId: categoryRecord.id,
                description: "",
            },
            include: {
                category: true,
            },
        });

        // Format response
        let status = 'In Stock';
        if (newProduct.stock === 0) status = 'Out of Stock';
        else if (newProduct.stock < 10) status = 'Low Stock';

        return NextResponse.json({
            id: newProduct.id,
            name: newProduct.name,
            category: newProduct.category.name,
            price: newProduct.price,
            stock: newProduct.stock,
            status: status,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
