import { Suspense } from 'react';
import { connection } from 'next/server';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

async function NoteDetailsContent({ params }: NoteDetailsProps) {
  await connection();

  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

export default function NoteDetails({ params }: NoteDetailsProps) {
  return (
    <Suspense fallback={<p>Loading, please wait...</p>}>
      <NoteDetailsContent params={params} />
    </Suspense>
  );
}
