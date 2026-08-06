const fs = require('fs');
const file = '/Users/ayantufail/Documents/Medflow/Medflow-FE/src/pages/claims/BatchActionsPage.jsx';

let content = fs.readFileSync(file, 'utf8');

// Replace the filter bar for Batch Payments
const oldFilterRegex = /<Box sx=\{\{ mb: 2, border: `1px solid \$\{COLORS\.BORDER\}`, borderRadius: radius\.md, overflow: 'hidden' \}\}>[\s\S]*?{/\* Collapsible filter drawer \*/}/;

const newFilterBar = `<Paper
          elevation={0}
          sx={{
            p: 1.5,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: 'none',
            border: '1px solid #e2e8f0',
            flexWrap: 'wrap',
          }}
        >
          {/* Top row: action buttons */}
          <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 15 }} />} onClick={() => setOpenAddPaymentModal(true)}
            sx={{ textTransform: 'none', bgcolor: '#3b82f6', borderRadius: '6px', px: 2, py: 0.7, boxShadow: 'none', fontWeight: 600, fontSize: '0.85rem', '&:hover': { bgcolor: '#2563eb', boxShadow: 'none' } }}
          >
            Add New Payment
          </Button>
          <Button variant="outlined" size="small" startIcon={<RefreshIcon sx={{ fontSize: 15 }} />} onClick={handleRefreshBatchPayments}
            sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b', bgcolor: '#f8fafc', borderRadius: '6px', px: 2, py: 0.7, fontWeight: 600, fontSize: '0.85rem', '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f1f5f9' } }}
          >
            Refresh
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button variant="outlined" size="small" startIcon={<FilterIcon sx={{ fontSize: 15 }} />} onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#3b82f6', bgcolor: '#f8fafc', borderRadius: '6px', px: 2, py: 0.7, fontWeight: 600, fontSize: '0.85rem', '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f1f5f9' } }}
            >
              Filter
            </Button>
            <TextField size="small" placeholder="Search payments…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: '250px', '& .MuiOutlinedInput-root': { bgcolor: '#ffffff', fontSize: '0.85rem', borderRadius: '6px', '& fieldset': { borderColor: '#e2e8f0' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 16 }} /></InputAdornment> }}
            />
          </Box>
        </Paper>
        {/* Collapsible filter drawer */}`;

content = content.replace(oldFilterRegex, newFilterBar);

fs.writeFileSync(file, content);
console.log('done');
