import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;

  const tag = slug[0] === 'all' ? 'All' : slug[0];

  const title = `${tag} Notes | NoteHub`;
  const description = `Browse and manage your ${tag.toLowerCase()} notes in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${slug.join('/')}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${tag} notes in NoteHub`,
        },
      ],
    },
  };
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
