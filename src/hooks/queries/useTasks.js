import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/task.service';
import { useSnackbar } from '../../contexts/SnackbarContext';

// Query key factory
export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (filters) => [...taskKeys.lists(), { filters }],
  details: () => [...taskKeys.all, 'detail'],
  detail: (id) => [...taskKeys.details(), id],
  taskLists: () => [...taskKeys.all, 'taskLists'],
};

/**
 * Fetch a paginated list of tasks with filters
 */
export const useTasks = (filters) => {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => taskService.getAllTasks(filters),
    keepPreviousData: true,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Fetch a single task by ID
 */
export const useTask = (taskId) => {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => taskService.getTaskById(taskId),
    enabled: !!taskId,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (taskData) => taskService.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      showSnackbar('Task created successfully', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.error?.message || 'Failed to create task', 'error');
    },
  });
};

/**
 * Update an existing task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ taskId, updates }) => taskService.updateTask(taskId, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      showSnackbar('Task updated successfully', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.error?.message || 'Failed to update task', 'error');
    },
  });
};

/**
 * Update task status
 */
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ taskId, status }) => taskService.updateTaskStatus(taskId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      showSnackbar('Task status updated', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.error?.message || 'Failed to update task status', 'error');
    },
  });
};

/**
 * Delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (taskId) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      showSnackbar('Task deleted successfully', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.error?.message || 'Failed to delete task', 'error');
    },
  });
};

/**
 * Add a comment to a task
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ taskId, text }) => taskService.addComment(taskId, text),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      // We might want to invalidate the list too, if the latest comment is displayed there
      showSnackbar('Comment added', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.error?.message || 'Failed to add comment', 'error');
    },
  });
};

/**
 * Fetch all task lists (for group assignment)
 */
export const useTaskLists = () => {
  return useQuery({
    queryKey: taskKeys.taskLists(),
    queryFn: () => taskService.getTaskLists(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
