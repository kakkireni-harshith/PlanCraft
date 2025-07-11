import React, { Suspense } from 'react';
import { ScaleLoader } from 'react-spinners';

const ProjectLayout = async({children}) => {
  return (
    <div className="flex justify-center mt-4 min-h-screen">
        <Suspense fallback={<ScaleLoader color="#97e2f8"
  size={60} />}>
            {children}
        </Suspense>
    </div>
  )
}

export default ProjectLayout;
