import { NextResponse } from 'next/server';
import prisma from '../../../util/prisma';
import { stringify } from 'querystring';

// Helper function to get category ID from slug
async function getCategoryIdFromSlug(slug) {
  try {
    const result = await prisma.$queryRaw`
      SELECT id
      FROM Blogcategories
      WHERE title = ${slug}
      LIMIT 1
    `;

    return result[0].id;
  } catch (error) {
    console.error('Error fetching category ID:', error);
    throw new Error('Error fetching category ID');
  }
}

// GET blogs based on category slug
export async function GET(request, { params }) {
  const slug = params.id;
  console.log("Category slug received: ", slug);

  try {
    const blogs = await prisma.blog.findMany({
      where: {
        OR: [
          { category: slug.toString() }, // Exact match
          { category: { startsWith: `${slug},` } }, // ID at the start
          { category: { endsWith: `,${slug}` } }, // ID at the end
          { category: { contains: `,${slug},` } }, // ID in the middle
        ],
      },
    }
    );

    console.log("Blogs for category: ", blogs);

    // Return the blogs
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
