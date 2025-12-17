import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, category, price, stock } = body;
        const productId = parseInt(id);

        // Find or create category if changed
        let categoryRecord = await prisma.category.findUnique({
            where: { name: category },
        });

        if (!categoryRecord) {
            categoryRecord = await prisma.category.create({
                data: { name: category },
            });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
                categoryId: categoryRecord.id,
            },
            include: {
                category: true,
            },
        });

        let status = 'In Stock';
        if (updatedProduct.stock === 0) status = 'Out of Stock';
        else if (updatedProduct.stock < 10) status = 'Low Stock';

        return NextResponse.json({
            id: updatedProduct.id,
            name: updatedProduct.name,
            category: updatedProduct.category.name,
            price: updatedProduct.price,
            stock: updatedProduct.stock,
            status: status,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.product.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Product deleted' });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
