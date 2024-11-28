'use client'

import { usePathname } from 'next/navigation';
import React, { Fragment } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbList } from './ui/breadcrumb';
import { MobileSidebar } from './Sidebar';

function BreadcrumbHeader() {
    const pathname = usePathname();
    const paths = pathname === "/" ? [''] : pathname.split('/');

  return (
    <div className='flex items-center flex-start'>
        <MobileSidebar />
        <Breadcrumb>
            <BreadcrumbList>    
                {paths.map((path, index) => (
                    <Fragment key={index}>
                        <BreadcrumbItem >
                            <BreadcrumbLink href={`/${path}`} className='capitalize'>
                                {path === '' ? 'home' : path}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {index !== paths.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    </div>
  )
}

export default BreadcrumbHeader