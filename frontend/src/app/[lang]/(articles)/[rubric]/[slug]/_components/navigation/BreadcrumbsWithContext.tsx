'use client';
import { useSearchParams } from 'next/navigation';
import SmartBreadcrumbs from '@/features/navigation/Breadcrumbs/SmartBreadcrumbs';

type Props = Omit<React.ComponentProps<typeof SmartBreadcrumbs>, 'fromParam'>;

export default function BreadcrumbsWithContext(props: Props) {
  const searchParams = useSearchParams();
  return <SmartBreadcrumbs {...props} fromParam={searchParams.get('from') ?? undefined} />;
}
