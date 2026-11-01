import { Suspense } from 'react';
import { connection } from 'next/server';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

async function NotesContent({ params }: NotesPageProps) {
  await connection();

  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes(1, '', tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}

export default function NotesPage({ params }: NotesPageProps) {
  return (
    <Suspense fallback={<p>Loading, please wait...</p>}>
      <NotesContent params={params} />
    </Suspense>
  );
}
