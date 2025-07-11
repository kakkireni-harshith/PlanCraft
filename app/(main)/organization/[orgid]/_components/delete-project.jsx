"use client";

import { deleteProject } from '@/actions/project';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { useOrganization } from '@clerk/nextjs'
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const DeleteProject = ({ projectId }) => {
    const { membership } = useOrganization();
    const Router = useRouter();

    const {
        data: deleted,
        loading: isDeleting,
        error,
        fn: deleteProjectFn,
    } = useFetch(deleteProject)

    const handleDelete = () => {
        if(window.confirm("Are you sure you want to delete this Project?")){
            deleteProjectFn(projectId)
        }
    }

    useEffect(() => {
        if(deleted?.success){
            toast.success("Project successfully deleted")
            Router.refresh();
        }
    },[deleted])

    const isAdmin = membership?.role === "org:admin";

    if(!isAdmin){
        return null
    }
  return (
    <>
      <Button variant="ghost" size = "sm" className={`${isDeleting? "animate-pulse":""}`} onClick= {handleDelete} disabled= {isDeleting}>
        <Trash2 className='h-4 w-4'/>
      </Button>
      {error && <p className='text-red-500 text-sm'>{error.message}</p>}
    </>
  )
}

export default DeleteProject
