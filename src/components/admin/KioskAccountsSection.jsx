import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Paper } from '@mui/material';
import { Add as AddIcon, InfoOutlined as InfoOutlinedIcon } from '@mui/icons-material';
import { standardFieldSx, radius, fontSize, fontWeight } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

const SECTION_HEADER_BG = '#F3F8FD';

const KioskAccountsSection = ({
  accounts,
  showAddRow,
  newAccount,
  onChangeNewAccount,
  onOpenAddRow,
  onCancelAddRow,
  onAddAccount,
}) => {
  const handleFieldChange = (field) => (event) => {
    onChangeNewAccount(field, event.target.value);
  };

  return (
    <Paper
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: '#fff', overflow: 'hidden' }}
    >
      {/* Header strip — icon, title, description only */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, backgroundColor: SECTION_HEADER_BG, flexWrap: 'wrap' }}>
        <InfoOutlinedIcon sx={{ color: '#1d4ed8', fontSize: '1rem' }} />
        <Typography fontWeight={700} fontSize="0.85rem">
          Accounts
        </Typography>
        <Typography component="span" variant="caption" color="text.secondary" sx={{ fontWeight: 400 }}>
          (The following accounts will recieve email notification for MyChart,online schedule and online Payment)
        </Typography>
      </Box>

      {/* Content area */}
      <Box sx={{ p: 2, backgroundColor: '#fff' }}>
        {/* Add Account button — sits above the table card, with space around it */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon sx={{ fontSize: '16px' }} />}
            onClick={onOpenAddRow}
            sx={{
              textTransform: 'none',
              borderRadius: radius.md,
              fontFamily: 'Inter',
              fontSize: fontSize.base,
              fontWeight: fontWeight.semibold,
              backgroundColor: COLORS.ACCENT,
              '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
            }}
          >
            Add Account
          </Button>
        </Box>

        {/* Inner box: the table, with its own border */}
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
          <Table size="small" sx={{ backgroundColor: '#fff' }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#F3F8FD',
                  '& th': {
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    color: 'text.secondary',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  },
                }}
              >
                <TableCell sx={{ py: 1.5 }}>Email</TableCell>
                <TableCell sx={{ py: 1.5 }}>First Name</TableCell>
                <TableCell sx={{ py: 1.5 }}>Last Name</TableCell>
                <TableCell sx={{ py: 1.5 }}>Telephone Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account, index) => (
                <TableRow key={account._id ?? account.email ?? index} sx={{ '& td': { fontSize: '0.85rem' } }}>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.firstName}</TableCell>
                  <TableCell>{account.lastName}</TableCell>
                  <TableCell>{account.telephoneNumber || ''}</TableCell>
                </TableRow>
              ))}

              {showAddRow && (
                <TableRow>
                  <TableCell>
                    <TextField
                      placeholder="Email"
                      value={newAccount.email}
                      onChange={handleFieldChange('email')}
                      sx={standardFieldSx}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      placeholder="First Name"
                      value={newAccount.firstName}
                      onChange={handleFieldChange('firstName')}
                      sx={standardFieldSx}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      placeholder="Last Name"
                      value={newAccount.lastName}
                      onChange={handleFieldChange('lastName')}
                      sx={standardFieldSx}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        placeholder="Telephone Number"
                        value={newAccount.telephoneNumber}
                        onChange={handleFieldChange('telephoneNumber')}
                        sx={{ ...standardFieldSx, flex: 1 }}
                      />
                      <Button
                        variant="contained"
                        disableElevation
                        onClick={onAddAccount}
                        sx={{
                          textTransform: 'none',
                          borderRadius: radius.md,
                          fontFamily: 'Inter',
                          fontSize: fontSize.base,
                          fontWeight: fontWeight.semibold,
                          backgroundColor: COLORS.ACCENT,
                          '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        variant="outlined"
                        disableElevation
                        onClick={onCancelAddRow}
                        sx={{
                          textTransform: 'none',
                          borderRadius: radius.md,
                          fontFamily: 'Inter',
                          fontSize: fontSize.base,
                          fontWeight: fontWeight.semibold,
                          borderColor: COLORS.BORDER,
                          color: COLORS.TEXT_PRIMARY,
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {accounts.length === 0 && !showAddRow && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary', fontSize: '0.85rem' }}>
                    No accounts added yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Paper>
  );
};

export default KioskAccountsSection;