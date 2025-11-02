import { DashboardNavigation } from '@/widgets/dashboard-navigation';
import React, { PropsWithChildren } from 'react';

export default function Layout(props: PropsWithChildren) {
  return (
    <div vaul-drawer-wrapper="" className={'bg-white'}>
      <DashboardNavigation/>
      { props.children }
    </div>
  )
}