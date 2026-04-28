import React from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel } from '@mui/material';

const InvoiceModal = ({ invoiceData, onSave, onCancel }) => {
  const containerStyle = {
    fontFamily: '"Segoe UI", Tahoma, sans-serif',
    width: '100%',
    minWidth: '1000px',
    backgroundColor: 'white',
    borderRadius: '2px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  };

  const headerStyle = {
    backgroundColor: '#7788bb',
    color: 'white',
    padding: '12px',
    textAlign: 'center',
    fontSize: '16px',
    margin: 0,
    fontWeight: 'normal'
  };

  const bodyStyle = {
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative'
  };

  const emptyMessageStyle = {
    color: '#333',
    fontSize: '14px',
    marginBottom: '30px'
  };

  const controlsRowStyle = {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const leftControls = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const rightControls = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };

  const addButtonStyle = {
    backgroundColor: '#d1bc8a',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px'
  };

  const linkButtonStyle = {
    color: '#5b7bb1',
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0
  };

  const saveButtonStyle = {
    backgroundColor: '#7788bb',
    color: 'white',
    border: 'none',
    padding: '6px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const cancelButtonStyle = {
    backgroundColor: '#a9a9a9',
    color: 'white',
    border: 'none',
    padding: '6px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Invoice #{invoiceData?.invoiceId || '24637'}</h2>
      
      <div style={bodyStyle}>
        {/* Central status message */}
        <div style={emptyMessageStyle}>
          there are no completed procedures ready to be billed
        </div>

        {/* Bottom controls row */}
        <div style={controlsRowStyle}>
          <div style={leftControls}>
            <button style={addButtonStyle}>+Add Procedure</button>
            <button style={linkButtonStyle}>+ Add description</button>
          </div>

          <div style={rightControls}>
            <label style={{...linkButtonStyle, display: 'flex', alignItems: 'center', gap: '5px'}}>
              <input type="checkbox" style={{ margin: 0 }} /> Add Claim
            </label>
            
            <button 
              style={saveButtonStyle}
              onClick={() => onSave && onSave({ invoiceId: invoiceData?.invoiceId })}
            >
              Save
            </button>
            <button 
              style={cancelButtonStyle}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
