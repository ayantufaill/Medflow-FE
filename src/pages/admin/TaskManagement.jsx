import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { useTasks, useDeleteTask, useUpdateTaskStatus } from '../../hooks/queries/useTasks';
import { useUsers } from '../../hooks/queries/useUsers';
import { useTaskLists } from '../../hooks/queries/useTasks';
import { useRoles } from '../../hooks/queries/useRoles';
import { roundedSelectMenuProps } from '../../constants/styles';
import CreateTaskModal from './CreateTaskModal';

import adduserIcon from '../../assets/usermanagement icons/adduser1.svg';
import viewIcon from '../../assets/usermanagement icons/view.svg';
import editIcon from '../../assets/usermanagement icons/edit.svg';

const STATUS_STYLES = {
  0: { label: 'NEW', color: '#1E40AF', bgcolor: '#DBEAFE' },
  1: { label: 'COMPLETED', color: '#166534', bgcolor: '#DCFCE7' },
  2: { label: 'IN PROGRESS', color: '#B45309', bgcolor: '#FEF3C7' },
  3: { label: 'DELETED', color: '#B91C1C', bgcolor: '#FEE2E2' },
};

const PRIORITY_LABELS = {
  0: 'None',
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Urgent',
};

const TaskManagement = () => {
  // Filters State
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState([]);
  const [groupFilter, setGroupFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  
  // Pagination & Sorting State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('DateTimeEntry');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Data fetching
  const { data: tasksData, isLoading: isLoadingTasks } = useTasks({
    status: statusFilter.join(','),
    taskListNum: groupFilter,
    assignedTo: userFilter,
    createdDateFrom: dateFrom ? dateFrom.format('YYYY-MM-DD') : '',
    createdDateTo: dateTo ? dateTo.format('YYYY-MM-DD') : '',
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const { data: usersData } = useUsers();
  const users = usersData?.users || [];
  const { data: taskLists } = useTaskLists();
  const { data: rolesData } = useRoles();
  const roles = rolesData || [];
  
  const deleteTaskMutation = useDeleteTask();
  const updateStatusMutation = useUpdateTaskStatus();

  // Handlers
  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(column);
  };

  const handleResetFilters = () => {
    setStatusFilter([]);
    setGroupFilter('');
    setUserFilter('');
    setDateFrom(null);
    setDateTo(null);
    setPage(1);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
      
      {/* Header and Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ fontFamily: 'Inter, sans-serif', color: '#111' }}>
          {activeTab === 0 ? 'Tasks' : 'Recurrent Task Templates'}
        </Typography>

        <Button
          variant="contained"
          onClick={() => setIsCreateModalOpen(true)}
          sx={{
            backgroundColor: '#2262EF',
            color: '#fff',
            textTransform: 'none',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            height: '36px',
            borderRadius: '6px',
            px: '20px',
            '&:hover': { backgroundColor: '#1d4ed8' },
            boxShadow: 'none',
          }}
        >
          Create Task
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={(e, val) => setActiveTab(val)}
        sx={{ 
          borderBottom: 1, borderColor: 'divider', mb: 3,
          '& .MuiTab-root': {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.875rem',
          }
        }}
      >
        <Tab label="Tasks" />
        <Tab label="Recurrent Task Templates" />
      </Tabs>

      {/* Filter Bar */}
      <Box sx={{ mb: 2, border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        {/* Top Row — Filters */}
        <Box sx={{ 
          display: 'flex', gap: 1.5, alignItems: 'flex-end', flexWrap: 'wrap',
          p: 2, pb: 1.5, backgroundColor: '#fff'
        }}>
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#475569', fontFamily: 'Inter, sans-serif' }}>
                By Status
              </Typography>
              <Select
                multiple
                displayEmpty
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                size="small"
                MenuProps={roundedSelectMenuProps}
                renderValue={(selected) => {
                  if (selected.length === 0) return <Typography sx={{ color: '#94A3B8', fontSize: '13px' }}>Select...</Typography>;
                  return <Typography sx={{ color: '#334155', fontSize: '13px', fontWeight: 500 }}>{selected.map(s => STATUS_STYLES[s]?.label).join(', ')}</Typography>;
                }}
                sx={{ 
                  minWidth: 160, bgcolor: 'white', borderRadius: '6px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' },
                  '& .MuiSelect-icon': { color: '#94A3B8' },
                  '& .MuiSelect-select': { display: 'flex', alignItems: 'center' }
                }}
              >
                <MenuItem value={0}>New</MenuItem>
                <MenuItem value={2}>In Progress</MenuItem>
                <MenuItem value={1}>Completed</MenuItem>
                <MenuItem value={3}>Deleted</MenuItem>
              </Select>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#475569', fontFamily: 'Inter, sans-serif' }}>
              By Group
            </Typography>
            <Select
              displayEmpty
              value={groupFilter}
              onChange={(e) => { setGroupFilter(e.target.value); setPage(1); }}
              size="small"
              MenuProps={roundedSelectMenuProps}
              renderValue={(selected) => {
                if (!selected) return <Typography sx={{ color: '#94A3B8', fontSize: '13px' }}>Select...</Typography>;
                const match = roles?.find(g => String(g._id || g.id) === String(selected));
                return <Typography sx={{ color: '#334155', fontSize: '13px', fontWeight: 500 }}>{match ? match.name : selected}</Typography>;
              }}
              sx={{ 
                minWidth: 160, bgcolor: 'white', borderRadius: '6px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' },
                '& .MuiSelect-icon': { color: '#94A3B8' },
                '& .MuiSelect-select': { display: 'flex', alignItems: 'center' }
              }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {(roles || []).map(role => (
                <MenuItem key={role._id || role.id} value={role._id || role.id}>{role.name}</MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#475569', fontFamily: 'Inter, sans-serif' }}>
              By Assigned User
            </Typography>
            <Select
              displayEmpty
              value={userFilter}
              onChange={(e) => { setUserFilter(e.target.value); setPage(1); }}
              size="small"
              MenuProps={roundedSelectMenuProps}
              renderValue={(selected) => {
                if (!selected) return <Typography sx={{ color: '#94A3B8', fontSize: '13px' }}>Select...</Typography>;
                const match = users.find(u => String(u._id || u.id || u.UserNum) === String(selected));
                return <Typography sx={{ color: '#334155', fontSize: '13px', fontWeight: 500 }}>{match ? (`${match.firstName || ''} ${match.lastName || ''}`.trim() || match.email) : selected}</Typography>;
              }}
              sx={{ 
                minWidth: 180, bgcolor: 'white', borderRadius: '6px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' },
                '& .MuiSelect-icon': { color: '#94A3B8' },
                '& .MuiSelect-select': { display: 'flex', alignItems: 'center' }
              }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {users.map(user => (
                <MenuItem key={user._id || user.id || user.UserNum} value={user._id || user.id || user.UserNum}>
                  {`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#475569', fontFamily: 'Inter, sans-serif' }}>
              Start Date
            </Typography>
            <DatePicker
              value={dateFrom}
              onChange={(val) => { setDateFrom(val); setPage(1); }}
              format="MM/DD/YYYY"
              slotProps={{ 
                textField: { 
                  size: 'small',
                  placeholder: 'MM/DD/YYYY',
                  InputLabelProps: { shrink: false },
                  sx: { 
                    bgcolor: 'white', width: 170, borderRadius: '6px', 
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' },
                    '& input': { color: dateFrom ? '#334155' : '#94A3B8', fontSize: '13px', fontWeight: 500 },
                    '& input::placeholder': { color: '#94A3B8', opacity: 1 },
                    '& .MuiIconButton-root': { color: '#64748B', p: '5px' }
                  } 
                } 
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#475569', fontFamily: 'Inter, sans-serif' }}>
              End Date
            </Typography>
            <DatePicker
              value={dateTo}
              onChange={(val) => { setDateTo(val); setPage(1); }}
              format="MM/DD/YYYY"
              slotProps={{ 
                textField: { 
                  size: 'small', 
                  placeholder: 'MM/DD/YYYY',
                  InputLabelProps: { shrink: false },
                  sx: { 
                    bgcolor: 'white', width: 170, borderRadius: '6px', 
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2262EF', borderWidth: '1px' },
                    '& input': { color: dateTo ? '#334155' : '#94A3B8', fontSize: '13px', fontWeight: 500 },
                    '& input::placeholder': { color: '#94A3B8', opacity: 1 },
                    '& .MuiIconButton-root': { color: '#64748B', p: '5px' }
                  } 
                } 
              }}
            />
          </Box>
        </Box>

        {/* Bottom Row — Apply Filters + Clear all */}
        <Box sx={{ 
          display: 'flex', alignItems: 'center', gap: 2, 
          p: 2, pt: 1.5, backgroundColor: '#f8fafc', 
          borderTop: '1px solid #e2e8f0', justifyContent: 'flex-end'
        }}>
          <Typography 
            onClick={handleResetFilters}
            sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Clear all
          </Typography>
          <Button 
            variant="contained" 
            size="small" 
            onClick={() => setPage(1)}
            sx={{ 
              textTransform: 'none', 
              bgcolor: '#2362EF', 
              borderRadius: '8px', 
              px: 2, 
              fontWeight: 600, 
              boxShadow: 'none', 
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#1D53CC', boxShadow: 'none' }
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>

      {/* Active Filter Chips */}
      {statusFilter.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {statusFilter.map(status => (
            <Chip
              key={status}
              label={STATUS_STYLES[status]?.label}
              onDelete={() => {
                setStatusFilter(prev => prev.filter(s => s !== status));
                setPage(1);
              }}
              sx={{ bgcolor: STATUS_STYLES[status]?.bgcolor, color: STATUS_STYLES[status]?.color, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '11px', height: '24px' }}
            />
          ))}
        </Box>
      )}

      {/* Total Results */}
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
          TOTAL RESULTS: {tasksData?.pagination?.total || 0}
        </Typography>
      </Box>

      {/* Data Table */}
      <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell 
                onClick={() => handleSort('Descript')}
                sx={{ cursor: 'pointer', fontWeight: 700, color: '#64748B', fontSize: '11px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.4px', borderBottom: '1px solid #E2E8F0' }}
              >
                TITLE {sortBy === 'Descript' && (sortOrder === 'asc' ? <ArrowUpwardIcon sx={{fontSize: 14}}/> : <ArrowDownwardIcon sx={{fontSize: 14}}/>)}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '11px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.4px', borderBottom: '1px solid #E2E8F0' }}>PATIENT</TableCell>
              <TableCell 
                onClick={() => handleSort('TaskStatus')}
                sx={{ cursor: 'pointer', fontWeight: 700, color: '#64748B', fontSize: '11px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.4px', borderBottom: '1px solid #E2E8F0' }}
              >
                STATUS {sortBy === 'TaskStatus' && (sortOrder === 'asc' ? <ArrowUpwardIcon sx={{fontSize: 14}}/> : <ArrowDownwardIcon sx={{fontSize: 14}}/>)}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '11px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.4px', borderBottom: '1px solid #E2E8F0' }}>ASSIGNED TO</TableCell>
              <TableCell 
                onClick={() => handleSort('DateTask')}
                sx={{ cursor: 'pointer', fontWeight: 700, color: '#64748B', fontSize: '11px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.4px', borderBottom: '1px solid #E2E8F0' }}
              >
                DUE DATE {sortBy === 'DateTask' && (sortOrder === 'asc' ? <ArrowUpwardIcon sx={{fontSize: 14}}/> : <ArrowDownwardIcon sx={{fontSize: 14}}/>)}
              </TableCell>
              <TableCell 
                onClick={() => handleSort('PriorityDefNum')}
                sx={{ cursor: 'pointer', fontWeight: 700, color: '#64748B', fontSize: '11px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.4px', borderBottom: '1px solid #E2E8F0' }}
              >
                PRIORITY {sortBy === 'PriorityDefNum' && (sortOrder === 'asc' ? <ArrowUpwardIcon sx={{fontSize: 14}}/> : <ArrowDownwardIcon sx={{fontSize: 14}}/>)}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '11px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.4px', borderBottom: '1px solid #E2E8F0' }}>CREATED BY</TableCell>
              <TableCell 
                onClick={() => handleSort('DateTimeEntry')}
                sx={{ cursor: 'pointer', fontWeight: 700, color: '#64748B', fontSize: '11px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.4px', borderBottom: '1px solid #E2E8F0' }}
              >
                CREATED DATE {sortBy === 'DateTimeEntry' && (sortOrder === 'asc' ? <ArrowUpwardIcon sx={{fontSize: 14}}/> : <ArrowDownwardIcon sx={{fontSize: 14}}/>)}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748B', fontSize: '11px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.4px', borderBottom: '1px solid #E2E8F0' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingTasks ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : tasksData?.tasks?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3, color: 'text.secondary', fontFamily: 'Inter, sans-serif' }}>
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              (tasksData?.tasks || []).map((task) => {
                const statusStyle = STATUS_STYLES[task.TaskStatus] || STATUS_STYLES[0];
                return (
                  <TableRow key={task.TaskNum} hover sx={{ '&:hover': { bgcolor: '#fafbfc' }, transition: 'background-color 0.2s ease' }}>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#0F172A', borderBottom: '1px solid #F1F5F9' }}>
                      {task.Descript ? task.Descript.split('\n')[0] : 'Untitled Task'}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                      {task.patient ? `${task.patient.LName}, ${task.patient.FName}` : '-'}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Chip 
                        label={statusStyle.label} 
                        size="small" 
                        sx={{ bgcolor: statusStyle.bgcolor, color: statusStyle.color, fontWeight: 700, fontSize: '10px', fontFamily: 'Inter, sans-serif', height: '22px' }} 
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                      {task.userod ? task.userod.UserName : '-'}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                      {task.DateTask ? dayjs(task.DateTask).format('MMM D, YYYY') : '-'}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                      {PRIORITY_LABELS[task.PriorityDefNum] || 'None'}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                      {task.creator?.UserName || '-'}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                      {task.DateTimeEntry ? dayjs(task.DateTimeEntry).format('MMM D, YYYY') : '-'}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Box sx={{ display: 'flex', gap: '8px' }}>
                        <Button
                          startIcon={<img src={viewIcon} alt="view" style={{ width: 14, height: 14 }} />}
                          sx={{
                            textTransform: 'none',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '12px',
                            height: '30px',
                            borderRadius: '6px',
                            px: '10px',
                            bgcolor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            color: '#1E293B',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                            '&:hover': {
                              bgcolor: '#F8FAFC',
                              borderColor: '#94A3B8',
                            },
                          }}
                        >
                          View
                        </Button>
                        <Button
                          startIcon={<img src={editIcon} alt="edit" style={{ width: 14, height: 14 }} />}
                          sx={{
                            textTransform: 'none',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '12px',
                            height: '30px',
                            borderRadius: '6px',
                            px: '10px',
                            bgcolor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            color: '#1E293B',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                            '&:hover': {
                              bgcolor: '#F8FAFC',
                              borderColor: '#94A3B8',
                            },
                          }}
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={tasksData?.pagination?.total || 0}
          page={page - 1}
          onPageChange={(e, newPage) => setPage(newPage + 1)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1); }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Rows per page:"
          SelectProps={{
            MenuProps: roundedSelectMenuProps,
          }}
          sx={{
            borderTop: '1px solid #E2E8F0',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#64748B',
            },
            '& .MuiTablePagination-select': { fontFamily: 'Inter, sans-serif', fontSize: '13px' },
          }}
        />
      </TableContainer>

      {/* Create Task Modal */}
      <CreateTaskModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        users={users}
        taskLists={taskLists || []}
        roles={roles}
      />
    </Paper>
  );
};

export default TaskManagement;
