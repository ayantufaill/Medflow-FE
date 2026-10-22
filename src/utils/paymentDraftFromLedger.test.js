// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { toLedgerPaymentInvoices } from './paymentDraftFromLedger';

// A ledger item whose grouped detail was reconciled by billingSlice so its
// per-procedure patient portion sums to the invoice's post-payment `ptBal`.
const paidLedgerItem = ({
  ptBal = '$44.00',
  insBal = '$0.00',
  groupedPt = 44,
  appliedPayment = 1,
} = {}) => ({
  id: 'INV1791464079',
  invoiceNumber: 'INV1791464079',
  method: 'Invoice',
  rawDate: '2026-10-10',
  amount: '$45.00',
  summary: { ptBal, insBal, insWo: '$0.00', appliedWo: '$0.00' },
  details: [
    {
      isPayment: true,
      isInsurancePayment: false,
      procedures: [{ id: '1791464079', appliedPayment, ptPortion: groupedPt }],
    },
    {
      isGrouped: true,
      procedures: [
        {
          id: '1791464079',
          description: 'Periodic oral evaluation',
          fee: 45,
          ptPortion: groupedPt,
          patientPortion: groupedPt,
          writeoff: 0,
        },
      ],
    },
  ],
});

describe('toLedgerPaymentInvoices', () => {
  it('does not subtract a ledger payment from the already-reconciled grouped balance', () => {
    const [invoice] = toLedgerPaymentInvoices([paidLedgerItem()]);

    // A $45 charge with a $1 patient payment still owes $44, not $43.
    expect(invoice.patientBalance).toBe(44);
    expect(invoice.lineItems).toHaveLength(1);
    expect(invoice.lineItems[0].patientBalance).toBe(44);
    expect(invoice.lineItems[0].payAmount).toBe('44.00');
  });

  it('hides an invoice whose reconciled patient balance is zero', () => {
    const invoices = toLedgerPaymentInvoices([
      paidLedgerItem({ ptBal: '$0.00', groupedPt: 0, appliedPayment: 45 }),
    ]);
    expect(invoices).toHaveLength(0);
  });

  it('still subtracts recorded payments from claim-sourced (unreconciled) rows', () => {
    const claimed = {
      id: 'INV2',
      invoiceNumber: 'INV2',
      method: 'Invoice',
      amount: '$200.00',
      summary: { ptBal: '$70.00', insBal: '$120.00' },
      details: [
        {
          isPayment: true,
          isInsurancePayment: false,
          procedures: [{ id: '7', appliedPayment: 10, ptPortion: 80 }],
        },
        {
          isClaim: true,
          status: 'Sent',
          insuranceType: 'primary',
          procedures: [
            {
              id: '7',
              fee: 200,
              ptPortion: 80,
              insPortion: 120,
              insuranceAmount: 120,
              writeoff: 0,
            },
          ],
        },
      ],
    };

    const [invoice] = toLedgerPaymentInvoices([claimed]);
    expect(invoice.lineItems[0].patientBalance).toBe(70);
  });
});
