import { Suspense } from 'react';
import { connection } from 'next/server';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api';
import NotePreviewClient from './NotePreview.client';

interface NotePreviewProps {
  params: Promise<{ id: string }>;
}

async function NotePreviewContent({ params }: NotePreviewProps) {
  await connection();

  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />
    </HydrationBoundary>
  );
}

export default function NotePreview({ params }: NotePreviewProps) {
  return (
    <Suspense fallback={<p>Loading note...</p>}>
      <NotePreviewContent params={params} />
    </Suspense>
  );
}
