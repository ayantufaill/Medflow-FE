import { Box, Typography, Paper } from '@mui/material';
import KioskAccessSection from './KioskAccessSection';
import KioskAccountsSection from './KioskAccountsSection';
import KioskMoveDataPanel from './KioskMoveDataPanel';

const KioskAccountsCard = (props) => {
  const {
    kioskLink, password, confirmPassword, showPassword, showConfirm,
    onPasswordChange, onConfirmChange, onToggleShowPassword, onToggleShowConfirm,
    onSavePassword, canSavePassword, showMoveData, onToggleMoveData,
    accounts, showAddRow, newAccount, onChangeNewAccount, onOpenAddRow, onCancelAddRow, onAddAccount,
  } = props;

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2.5,
        backgroundColor: '#fff',
        boxShadow: '0px 1px 2px rgba(15,23,42,0.06), 0px 1px 3px rgba(15,23,42,0.08)',
      }}
    >
      <Typography fontWeight={700} fontSize="1.05rem" sx={{ mb: 2 }}>
        Kiosk Accounts
      </Typography>

      <KioskAccessSection
        kioskLink={kioskLink}
        password={password}
        confirmPassword={confirmPassword}
        showPassword={showPassword}
        showConfirm={showConfirm}
        onPasswordChange={onPasswordChange}
        onConfirmChange={onConfirmChange}
        onToggleShowPassword={onToggleShowPassword}
        onToggleShowConfirm={onToggleShowConfirm}
        onSavePassword={onSavePassword}
        canSavePassword={canSavePassword}
        showMoveData={showMoveData}
        onToggleMoveData={onToggleMoveData}
      />

      {showMoveData && (
        <Box sx={{ mb: 3 }}>
          <KioskMoveDataPanel />
        </Box>
      )}

      <KioskAccountsSection
        accounts={accounts}
        showAddRow={showAddRow}
        newAccount={newAccount}
        onChangeNewAccount={onChangeNewAccount}
        onOpenAddRow={onOpenAddRow}
        onCancelAddRow={onCancelAddRow}
        onAddAccount={onAddAccount}
      />
    </Paper>
  );
};

export default KioskAccountsCard;