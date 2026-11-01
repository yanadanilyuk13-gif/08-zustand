import axios from 'axios';
import type { Note } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

type CreateNoteData = Pick<Note, 'title' | 'content' | 'tag'>;

// GET notes
export async function fetchNotes(
  page: number,
  search: string,
  tag?: string
): Promise<NotesResponse> {
  const response = await api.get<NotesResponse>('/notes', {
    params: {
      page,
      search,
      perPage: 12,
      ...(tag && tag !== 'all' ? { tag } : {}),
    },
  });

  return response.data;
}

// CREATE note
export async function createNote(note: CreateNoteData): Promise<Note> {
  const response = await api.post<Note>('/notes', note);

  return response.data;
}

// DELETE note
export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);

  return response.data;
}
