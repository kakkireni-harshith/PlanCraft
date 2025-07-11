"use client";

import React, { useEffect } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IssueSchema } from '@/app/lib/validators';
import useFetch from '@/hooks/use-fetch';
import { createIssue } from '@/actions/issues';
import { getOrganizationUsers } from '@/actions/organization';
import { BarLoader } from 'react-spinners';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MDEditor from '@uiw/react-md-editor';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

const IssueCreationDrawer = ({
    isOpen,
    onClose,
    sprintId,
    status,
    projectId,
    onIssueCreated,
    orgId
}) => {

    const {
        control,
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
        resolver: zodResolver(IssueSchema),
        defaultValues: {
            priority: "MEDIUM",
            description: "",
            assigneeId: "",
        }
    })

    const {
        loading: createIssueLoading,
        fn: createIssueFn,
        error,
        data: newIssue,
    } = useFetch(createIssue)

    useEffect(() =>{
        if(newIssue){
            reset(),
            onClose(),
            onIssueCreated(),
            toast.success("Issue added Successfully")
        }
    },[newIssue, createIssueLoading])
    
    const {
        loading: userLoading,
        fn: fetchUsers,
        data: users,
    } = useFetch(getOrganizationUsers);

    const onSubmit = async(data) =>{
        await createIssueFn(projectId, {
            ...data,
            status,
            sprintId
        })
    }

    useEffect(()=>{
        if(isOpen && orgId){
            fetchUsers(orgId);
        }
    },[isOpen, orgId])

  return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader>
                <DrawerTitle className='text-lg font-medium'>Create New Issue</DrawerTitle>
                </DrawerHeader>
                {userLoading && <BarLoader height={2} width={"100%"} color="#5293fd"/>}
                <ScrollArea className="h-95 w-full rounded-md border">
                    <form className='p-4 space-y-4' onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="title" className='block text-base font-medium mb-1'>Title</label>
                            <Input id="title" {...register("title")}/>
                            {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="assigneeId" className='block text-base font-medium mb-1'>Assignee</label>
                            <Controller name="assigneeId" control={control}
                                render={({field})=>(
                                    <Select 
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Assignee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(users ?? []).map((user)=>(
                                                <SelectItem key={user.id} value={user.id}>{user?.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}  />
                            {errors.assigneeId && <p className='text-red-500 text-sm mt-1'>{errors.assigneeId.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="description" className='block text-base font-medium mb-1'>Description</label>
                            <Controller name="description" control={control}
                                render={({field})=>(
                                    <MDEditor value={field.value} onChange={field.onChange}/>
                                )}  />
                        </div>
                        <div>
                            <label htmlFor="priority" className='block text-base font-medium mb-1'>Priority</label>
                            <Controller name="priority" control={control}
                                render={({field})=>(
                                    <Select 
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                            <SelectItem value="URGENT">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}  />
                        </div>

                        {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
                        <div className="flex justify-center mt-4">
                            <Button
                                type="submit"
                                disabled={createIssueLoading}
                                className="">
                                {createIssueLoading ? "Creating.." : "Create"}
                            </Button>
                        </div>
                    </form>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
  )
}

export default IssueCreationDrawer
