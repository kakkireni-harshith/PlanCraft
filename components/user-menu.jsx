"use client";

import React from 'react'
import {UserButton} from "@clerk/nextjs";
import { ChartNoAxesGantt } from 'lucide-react';
const UserMenu = () => {
  return (
    <UserButton
    appearance={{
        elements:{
            avatarBox: "w-10 h-10"
        }
    }}>

    <UserButton.MenuItems>
        <UserButton.Link 
            label='Organization'
            labelIcon={<ChartNoAxesGantt size={18}/>}
            href='/onboarding'
        />
        <UserButton.Action label='manageAccount'/>
    </UserButton.MenuItems>
    </UserButton>
  )
}

export default UserMenu
