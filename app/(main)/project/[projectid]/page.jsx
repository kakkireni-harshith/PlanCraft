import { getProject } from '@/actions/project';
import { notFound } from 'next/navigation';
import React from 'react'
import SprintCreationFrom from '../_components/create-sprint';
import SprintBoard from '../_components/sprint-board';

const ProjectPage = async ({params}) => {

  const { projectid } = await params;

  const project = await getProject(projectid);
  if(!project){
    notFound();
  }
  return (
    <div className='container mx-auto'>
      {/* Sprint Creation */}

      <SprintCreationFrom
        ProjectTitle={project.name}
        ProjectId={project.id}
        ProjectKey={project.key}
        SprintKey={project.sprints?.length+1} 
      />
      {/* Sprint Board */}
      {project.sprints.length>0 ? (
        <SprintBoard 
          sprints = {project.sprints}
          projectId = {projectid}
          orgId = {project.organizationId}/>) : (<div>Create a Sprint from button above</div>)}
    </div>
  )
}

export default ProjectPage
