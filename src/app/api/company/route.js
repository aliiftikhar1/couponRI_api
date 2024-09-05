import { NextResponse } from "next/server";
import prisma from "../../util/prisma";

export async function POST(request) {
  try {
    const data = await request.json();
    const { 
      com_title, 
      comp_logo, 
      comp_category, 
      comp_description, 
      comp_phone, 
      comp_email, 
      comp_website, 
      meta_title,
      meta_description,
      comp_rating, 
      com_details, 
      company_details,  // New field
      other_details     // New field
    } = data;

    const newCompany = await prisma.company.create({
      data: {
        com_title,
        comp_logo,
        comp_category: parseInt(comp_category, 10),
        comp_description,
        comp_phone,
        comp_email,
        comp_website,
        comp_rating,
        com_details,
        meta_title,
      meta_description,
        comp_details:company_details,
        comp_other_details:other_details,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    console.log(newCompany);

    return NextResponse.json(newCompany);
  } catch (error) {
    console.error("Error Creating Company Record:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Retrieve all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany();
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error Fetching Companies:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}