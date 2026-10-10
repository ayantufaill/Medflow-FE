import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import AddPaymentInvoiceList from './AddPaymentInvoiceList';

describe('AddPaymentInvoiceList', () => {
  const defaultProps = {
    loading: false,
    selectedPatient: 'Test Patient',
    handleInvoiceToggle: vi.fn(),
    handleProcedureToggle: vi.fn(),
    handleLineItemAmountChange: vi.fn(),
  };

  it('shows invoices that still have patient balance', () => {
    const invoices = [
      {
        id: 'inv-1',
        invoiceNumber: 'INV1791464015',
        invoiceDate: '2026-10-10',
        patientBalance: 45,
        checked: false,
        lineItems: [
          {
            id: 'proc-1',
            description: 'Periodic oral evaluation',
            patientBalance: 45,
            totalAmount: 45,
            writeoffAmount: 0,
            insuranceAmount: 0,
            payAmount: '45.00',
            checked: false,
          },
        ],
      },
    ];

    const html = renderToStaticMarkup(
      <AddPaymentInvoiceList {...defaultProps} invoices={invoices} />,
    );

    expect(html).toContain('INV1791464015');
    expect(html).toContain('Patient Balance: $45.00');
  });

  it('hides invoices when the remaining patient balance is already paid, even if patientPortion is non-zero', () => {
    const invoices = [
      {
        id: 'inv-2',
        invoiceNumber: 'INV1791464011',
        invoiceDate: '2026-10-10',
        patientPortion: 145,
        paidAmount: 145,
        checked: false,
        lineItems: [
          {
            id: 'proc-2',
            description: 'Fully paid patient portion',
            patientPortion: 145,
            paidAmount: 145,
            totalAmount: 145,
            writeoffAmount: 0,
            insuranceAmount: 0,
            payAmount: '0.00',
            checked: false,
          },
        ],
      },
    ];

    const html = renderToStaticMarkup(
      <AddPaymentInvoiceList {...defaultProps} invoices={invoices} />,
    );

    expect(html).not.toContain('INV1791464011');
    expect(html).toContain('No pending invoices with patient balance found');
  });

  it('hides invoices when the remaining patient balance is zero', () => {
    const invoices = [
      {
        id: 'inv-3',
        invoiceNumber: 'INV0000000000',
        invoiceDate: '2026-10-10',
        patientBalance: 0,
        checked: false,
        lineItems: [
          {
            id: 'proc-3',
            description: 'No balance left',
            patientBalance: 0,
            totalAmount: 100,
            writeoffAmount: 100,
            insuranceAmount: 0,
            payAmount: '0.00',
            checked: false,
          },
        ],
      },
    ];

    const html = renderToStaticMarkup(
      <AddPaymentInvoiceList {...defaultProps} invoices={invoices} />,
    );

    expect(html).not.toContain('INV0000000000');
    expect(html).toContain('No pending invoices with patient balance found');
  });
});
