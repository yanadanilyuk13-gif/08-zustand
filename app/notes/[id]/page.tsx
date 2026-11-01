import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';

import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content,
    openGraph: {
      title: `${note.title} | NoteHub`,
      description: note.content,
      url: `https://notehub.com/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub application preview',
        },
      ],
    },
  };
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
