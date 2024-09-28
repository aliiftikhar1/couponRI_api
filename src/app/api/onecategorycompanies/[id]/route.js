import { NextResponse } from "next/server";
import prisma from "../../../util/prisma";

export async function GET(request, { params }) {
  const { id } = params;
  console.log("Filtering companies with category ID: ", id);

  try {
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { comp_category: id.toString() }, // Exact match
          { comp_category: { startsWith: `${id},` } }, // ID at the start
          { comp_category: { endsWith: `,${id}` } }, // ID at the end
          { comp_category: { contains: `,${id},` } }, // ID in the middle
        ],
      },
    });

    console.log("Filtered companies: ", companies);
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error Fetching Companies:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
