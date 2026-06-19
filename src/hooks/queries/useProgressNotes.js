import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressNoteService } from '../../services/progress-note.service';

export const progressNoteKeys = {
  all: ['progressNotes'],
  lists: () => [...progressNoteKeys.all, 'list'],
  list: (filters) => [...progressNoteKeys.lists(), filters],
};

/**
 * Hook to fetch progress notes with optional filters
 */
export const useProgressNotesQuery = (filters = {}) => {
  return useQuery({
    queryKey: progressNoteKeys.list(filters),
    queryFn: () => progressNoteService.getAll(filters),
    enabled: !!filters.patientId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to create a new progress note
 */
export const useCreateProgressNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => progressNoteService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressNoteKeys.all });
    },
  });
};

/**
 * Hook to update a progress note (description/category)
 */
export const useUpdateProgressNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => progressNoteService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressNoteKeys.all });
    },
  });
};

/**
 * Hook to add a procedure to a progress note
 */
export const useAddProcedureToNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId, procedureCode }) => progressNoteService.addProcedure(noteId, procedureCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressNoteKeys.all });
    },
  });
};

/**
 * Hook to archive a progress note
 */
export const useArchiveProgressNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => progressNoteService.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressNoteKeys.all });
    },
  });
};

/**
 * Hook to unarchive a progress note
 */
export const useUnarchiveProgressNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => progressNoteService.unarchive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressNoteKeys.all });
    },
  });
};

/**
 * Hook to sign a progress note
 */
export const useSignProgressNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, signedBy }) => progressNoteService.sign(id, { signedBy }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressNoteKeys.all });
    },
  });
};
