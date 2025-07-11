"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend"

export async function createProject(data){
    const { userId , orgId } = await auth()
    const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
    });


    if(!userId){
        throw new Error("Unauthorized");
    }

    if(!orgId){
        throw new Error("No Organization Selected")
    }

    const { data:membership } = await clerkClient.organizations.getOrganizationMembershipList({
        organizationId : orgId,
    });

    const userMembership = membership.find(
        (member) => member.publicUserData.userId === userId
    );

    if(!userMembership || userMembership.role !== "org:admin"){
        throw new Error("Only organization admins can create Projects");
    }

    try{
        const project = await db.project.create({
            data : {
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId,
            }
        });
        return project;
    }
    catch(error){
        throw new Error("Error creating project: " + error.message);
    }
}


export async function getProjects(orgId){
    const { userId } = await auth()
    const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
    });


    if(!userId){
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId},
    })

    if(!user){
        throw new Error("User not found");
    }

    const projects = await db.project.findMany({
        where: { organizationId: orgId},
        orderBy: { createdAt: "desc"},
    });

    return projects;
}


export async function deleteProject(projectId){
    const { userId, orgId, orgRole} = await auth();

    if( !userId || !orgId){
        throw new Error("Unauthorized");
    }

    if(orgRole !== "org:admin"){
        throw new Error("Only Organization admin can delete project")
    }

    const project = await db.project.findUnique({
        where: { id: projectId },
    });

    if( !project || project.organizationId !== orgId){
        throw new Error("Project no found or you don't have permission to Delete it.")
    }

    await db.project.delete({
        where: {id : projectId},
    });

    return {success: true}
}

export async function getProject(projectId){
    const { userId, orgId } = await auth();

    if(!userId || !orgId ){
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if(!user){
        throw new Error("User not found")
    }

    const project = await db.project.findUnique({
        where: { id: projectId },
        include: {
            sprints:{
                orderBy: { createdAt: "desc"},
            },
        },
    });

    if(!project){
        return null;
    }

    if(project.organizationId !== orgId){
        return null;
    }

    return project;
}