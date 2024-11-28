import BreadcrumbHeader from '@/components/BreadcrumbHeader'
import { DesktopSidebar } from '@/components/Sidebar'
import { ModeToggle } from '@/components/ThemeModeToggle'
import { Separator } from '@/components/ui/separator'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen'>
        <DesktopSidebar />
        <div className='flex flex-col flex-1 min-h-screen'>
            <header className='flex items-center justify-between px-6 py-4 h-[50px] container'>
                <BreadcrumbHeader />
                <div className='flex items-center gap-1'>
                    <ModeToggle />
                    <UserButton />
                </div>
            </header>
            <Separator />
            <main className='overflow-auto'>
                <div className="flex-1 container py-4 text-accent-foreground">
                    {children}
                </div>
            </main>
        </div>
    </div>
  )
}

export default layout