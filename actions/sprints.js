"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createSprint(projectId, data){
    const {userId, orgId} = await auth();

    if(!userId || !orgId){
        throw new Error("Unauthorized");
    }

    const project = await db.project.findUnique({
            where: { id: projectId },
    });
    
    if(!project || project.organizationId !== orgId){
        throw new Error("Project not found");
    }

    const sprint = await db.sprint.create({
        data:{
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            status: "PLANNED",
            projectId,
        }
    });

    return sprint;

}

export async function updateSprintStatus(sprintId, newStatus){
    const { userId, orgId, orgRole} = await auth();

    if(!userId || !orgId){
        throw new Error("Unauthorized");
    }

        try{
            const sprint = await db.sprint.findUnique({
            where: { id: sprintId},
            include : { project: true}
            });

            if(!sprint){
                throw new Error("Sprint not found");
            }

            if(sprint.project.organizationId !== orgId){
                throw new Error("Unauthorized")
            }

            if(orgRole !== "org:admin"){
                throw new Error("Only admins can make changes")
            }

            const startDate = new Date(sprint.startDate);
            const endDate = new Date(sprint.endDate);
            const now = new Date();

            if(newStatus === "ACTIVE" && (now < startDate || now > endDate)){
                throw new Error("Cannot start the Sprint outside of its date range")
            }

            if(newStatus === "COMPLETED" && sprint.status !== "ACTIVE"){
                throw new Error("Can only complete an active sprint");
            }

            const updateSprint = await db.sprint.update({
                where: { id: sprintId },
                data : { status: newStatus },
            });

            return { success: true, sprint: updateSprint };
        }
        catch(error){
            throw new Error(error.message)
        }
}