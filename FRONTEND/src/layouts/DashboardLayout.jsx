import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className='flex h-screen w-full bg-red-100'>
            <Outlet></Outlet>
        </div>
    );
}

export default DashboardLayout;
