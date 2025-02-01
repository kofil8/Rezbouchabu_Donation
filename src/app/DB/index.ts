import * as bcrypt from "bcrypt";
import config from "../../config";
import { Role } from "@prisma/client";
import prisma from "../../shared/prisma";

const superAdminData = {
  firstName: "Super",
  lastName: "Admin",
  email: "admin@gmail.com",
  password: "",
  role: Role.SUPER_ADMIN,
};

const seedSuperAdmin = async () => {
  try {
    // Check if a super admin already exists
    const isSuperAdminExists = await prisma.user.findFirst({
      where: {
        role: Role.SUPER_ADMIN,
      },
    });

    // If not, create one
    if (!isSuperAdminExists) {
      superAdminData.password = await bcrypt.hash(
        config.super_admin_password as string,
        Number(config.salt) || 12
      );
      await prisma.user.create({
        data: superAdminData,
      });
      console.log("Super Admin created successfully.");
    } else {
      return;
    }
  } catch (error) {
    console.error("Error seeding Super Admin:", error);
  }
};

export default seedSuperAdmin;
