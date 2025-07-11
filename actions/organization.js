"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

export async function getOrganization(orgid) {
  const { userId } = await auth();
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });


  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  } 

  // Get the organization details
  const organization = await clerkClient.organizations.getOrganization({ slug: orgid })
  
  if (!organization) {
    return null;
  }

  // Check if user belongs to this organization
  const { data: membership } =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  const userMembership = membership.find(
    (member) => member.publicUserData.userId === userId
  );

  // If user is not a member, return null
  if (!userMembership) {
    return null;
  }

  return organization;
}

export async function getOrganizationUsers(orgId){
  const { userId } = await auth();
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  if(!userId){
    throw new Error("User not found");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
  });

  if(!user){
    throw new Error("User not found");
  }

  const organizationMemberships =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userIds = organizationMemberships.data.map(
    (membership) => membership.publicUserData.userId
  );

  const users = await db.user.findMany({
    where: {
      clerkUserId:{
        in: userIds
      }
    }
  })

  return users;
}