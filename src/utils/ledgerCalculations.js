/**
 * Shared ledger arithmetic.
 *
 * The patient ledger (fetchLedgerItems) and the Add Payment dialog
 * (fetchPaymentDraftInvoices) must agree on what a procedure still owes the
 * patient. Both now build their per-procedure numbers from the same context
 * created here, so a line can read $25 patient / $0 insurance in the ledger and
 * anything else in the payment dialog.
 */

const moneyNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const round2 = (value) => Math.round(moneyNumber(value) * 100) / 100;

// Procedure numbers named in an adjustment note. The API now also returns the
// stored link (`procedureId`); the note is only a fallback for rows written
// before that link was being saved.
const parseProcedureRefs = (note) => {
  const refs = new Set();
  const regex = /procedure\s*#?\s*(\d+)/gi;
  let match;
  while ((match = regex.exec(String(note || ""))) !== null) {
    refs.add(String(match[1]));
  }
  return [...refs];
};

// Procedures an adjustment was posted against: the stored link first, then any
// procedure the note names. Adjustments written before the link was stored only
// carry the note, and both point at the same ProcNum for current rows.
const procedureTargetsOf = (adjustment) => {
  const targets = new Set();
  if (adjustment?.procedureId) targets.add(String(adjustment.procedureId));
  parseProcedureRefs(adjustment?.notes).forEach((procNum) => {
    targets.add(procNum);
  });
  return [...targets];
};

// Adjustment notes that spend the patient's portion rather than the
// insurance's — courtesy, un-collected, small balance, wellness, … — matching
// the ledger's own definition.
const PATIENT_CREDIT_MARKERS = [
  "un-collected",
  "uncollected",
  "pre payment",
  "prepayment",
  "wellness",
  "small balance",
  "courtesy",
  "curtsey",
  "non payment",
];

const adjustmentIsPatientCredit = (adj) => {
  const text = `${adj?.type || ""} ${adj?.notes || ""}`.toLowerCase();
  return PATIENT_CREDIT_MARKERS.some((marker) => text.includes(marker));
};

const adjustmentIsInsuranceWriteOff = (adj) => {
  const text = `${adj?.type || ""} ${adj?.notes || ""}`.toLowerCase();
  return (
    text.includes("insurance w/o") ||
    text.includes("insurance writeoff") ||
    text.includes("insurance write-off")
  );
};

const adjustmentIsDebitAddition = (adj) => {
  const text = `${adj?.type || ""} ${adj?.notes || ""}`.toLowerCase();
  return moneyNumber(adj?.amount) > 0 || text.includes("debit adjustment");
};

const isLiveClaim = (claim) => {
  if (!claim) return false;
  if (claim.isVoided || claim.isVoid) return false;
  const status = String(claim.status || "").toLowerCase();
  return status !== "void" && status !== "voided";
};

/**
 * Build the per-procedure ledger context shared by the ledger and the payment
 * dialog.
 *
 * @param {Object} params
 * @param {Array}  params.invoices    Invoices with their line items
 * @param {Array}  params.claims      Claims (to know which lines were billed)
 * @param {Array}  params.adjustments Adjustments (write-offs, courtesy credits)
 */
export const buildLedgerProcedureContext = ({
  invoices = [],
  claims = [],
  adjustments = [],
  keepUnclaimedInsuranceEstimates = false,
} = {}) => {
  // Every procedure of every invoice, indexed by ProcNum, plus the total
  // procedure-level write-off each one is carrying. An adjustment stores the
  // line it was posted against (procedureId), so it can expand into that
  // procedure with the patient portion restated after the write-off.
  const proceduresByProcNum = new Map();
  invoices.forEach((inv) => {
    (inv.lineItems || []).forEach((proc) => {
      const key = String(proc._id || proc.id);
      if (key && !proceduresByProcNum.has(key)) {
        proceduresByProcNum.set(key, proc);
      }
    });
  });

  const claimProcedureKeys = new Set(
    (claims || [])
      .filter(isLiveClaim)
      .flatMap((claim) => claim.procedures || claim.items || [])
      .flatMap((proc) => [
        proc.id,
        proc._id,
        proc.ProcNum,
        proc.procedureId,
        proc.procId,
        proc.itemId,
        proc.code ? `code:${proc.code}` : null,
        proc.cptCode ? `code:${proc.cptCode}` : null,
        proc.ProcCode ? `code:${proc.ProcCode}` : null,
      ])
      .filter(Boolean)
      .map(String),
  );

  const procedureIsClaimed = (proc) =>
    claimProcedureKeys.has(String(proc._id || proc.id || "")) ||
    claimProcedureKeys.has(String(proc.ProcNum || "")) ||
    claimProcedureKeys.has(String(proc.procedureId || "")) ||
    claimProcedureKeys.has(String(proc.procId || "")) ||
    claimProcedureKeys.has(String(proc.itemId || ""));

  const appliedWriteOffByProc = new Map();
  const debitAdjustmentByProc = new Map();
  // Insurance write-off adjustments are the *posted* counterpart of the same
  // dollars the payment flow records on the line's write-off field. They are
  // tracked separately so a legacy row that never reached the line can still
  // seed it, but they are never added on top of it (that would double count).
  const insuranceWriteOffByProc = new Map();
  (adjustments || []).forEach((adj) => {
    // Income transfers move liability between insurance and patient, they
    // are not a write-off of the charge. Voided rows no longer affect it.
    if (adj.isVoided) return;
    if (
      String(adj.notes || "")
        .toLowerCase()
        .includes("income transfer")
    ) {
      return;
    }
    const amount = Math.abs(moneyNumber(adj.amount));
    if (!(amount > 0)) return;
    if (adjustmentIsDebitAddition(adj)) {
      procedureTargetsOf(adj).forEach((procNum) => {
        debitAdjustmentByProc.set(
          procNum,
          (debitAdjustmentByProc.get(procNum) || 0) + amount,
        );
      });
      return;
    }
    if (adjustmentIsInsuranceWriteOff(adj)) {
      procedureTargetsOf(adj).forEach((procNum) => {
        insuranceWriteOffByProc.set(
          procNum,
          (insuranceWriteOffByProc.get(procNum) || 0) + amount,
        );
      });
      return;
    }
    procedureTargetsOf(adj).forEach((procNum) => {
      appliedWriteOffByProc.set(
        procNum,
        (appliedWriteOffByProc.get(procNum) || 0) + amount,
      );
    });
  });

  const procedureBaseAmounts = (proc) => {
    const key = String(proc._id || proc.id);
    const baseFee = moneyNumber(
      proc.totalPrice || proc.total || proc.ProcFee || proc.charge || proc.amount,
    );
    let ptPortion = moneyNumber(
      proc.ptPortion || proc.patientPortion || proc.ptAmt || proc.patientAmount,
    );
    let insPortion = moneyNumber(
      proc.totalInsPortion ||
        proc.insPortion ||
        proc.insurancePortion ||
        proc.insAmt ||
        proc.insuranceAmount,
    );
    const recordedWriteOff = moneyNumber(
      proc.writeoff || proc.writeoffAmount || proc.estimatedWriteOff,
    );
    const allowedFee = moneyNumber(proc.allowedFee);
    const isClaimed = procedureIsClaimed(proc);

    const debitAdjustment = debitAdjustmentByProc.get(key) || 0;
    const fee = baseFee + debitAdjustment;

    // The write-off is the part of the charge the payer will not cover: the
    // recorded estimate, and — once a claim exists — anything billed above the
    // fee-guide allowed fee. A debit that pushes the charge past the allowed
    // fee lands here instead of being split between patient and insurance.
    let pricingWriteOff =
      recordedWriteOff > 0
        ? recordedWriteOff
        : insuranceWriteOffByProc.get(key) || 0;
    if (isClaimed && allowedFee > 0 && fee > allowedFee) {
      pricingWriteOff = Math.max(pricingWriteOff, fee - allowedFee);
    }
    pricingWriteOff = Math.max(0, pricingWriteOff);

    // Fold the charge out into patient / insurance / write-off.
    //
    // Two distinct cases, and they are NOT the same rule:
    //
    //   over-committed (committed > residual): the stored split sums to more
    //   than the charge left after the write-off, i.e. the stored numbers are
    //   internally inconsistent (typically a split recorded before a write-off
    //   was entered). Something has to give, and the patient absorbs it first
    //   so the insurance estimate the payer still owes is preserved. This is
    //   data reconciliation, NOT a write-off being applied to the patient —
    //   it only fires on contradictory input.
    //
    //   residual surplus: a debit that stayed inside the allowed fee is new
    //   chargeable money, so it extends both sides proportionally.
    const residual = Math.max(0, fee - pricingWriteOff);
    const committed = insPortion + ptPortion;
    if (committed > residual + 0.005) {
      const excess = committed - residual;
      const ptCut = Math.min(ptPortion, excess);
      ptPortion = Math.max(0, ptPortion - ptCut);
      insPortion = Math.max(0, insPortion - (excess - ptCut));
    } else if (residual - committed > 0.005) {
      // A debit that stays within the allowed fee extends the existing split
      // proportionally, so the two portions keep matching the charge.
      const gap = residual - committed;
      const coverage = committed > 0 ? insPortion / committed : 0;
      const addIns = round2(gap * coverage);
      insPortion += addIns;
      ptPortion += round2(gap - addIns);
    }

    // Guard the insurance estimate so it can never exceed the restated fee:
    // a stored BillingNote whose insurancePortion already baked in a debit
    // adjustment would otherwise be inflated a second time by the split above.
    if (insPortion > fee) insPortion = fee;
    if (!keepUnclaimedInsuranceEstimates && !isClaimed) {
      ptPortion += insPortion;
      insPortion = 0;
    }

    return { key, fee, ptPortion, insPortion, pricingWriteOff };
  };

  // Restate a line item the way it reads after every live procedure-level
  // write-off has been applied. The pricing write-off (which already accounts
  // for any charge above the allowed fee) is left where it is: insurance
  // write-off adjustments describe those same dollars, so they are excluded
  // from `appliedWriteOffByProc` and cannot be charged twice. Only genuine
  // patient credits — courtesy, un-collected, small balance, … — come off the
  // patient's portion here, so the ledger keeps fee = patient + insurance +
  // write-off.
  const procedureAfterAdjustments = (proc) => {
    const { key, fee, ptPortion, insPortion, pricingWriteOff } =
      procedureBaseAmounts(proc);
    const appliedWriteOff = appliedWriteOffByProc.get(key) || 0;

    let remaining = appliedWriteOff;
    const ptAfter = Math.max(0, ptPortion - remaining);
    remaining -= Math.max(0, ptPortion - ptAfter);
    const insAfter = Math.max(0, insPortion - remaining);

    return {
      ...proc,
      fee,
      ptPortion: ptAfter,
      insPortion: insAfter,
      // Charge the payer will never cover (fee above the allowed fee, plus any
      // recorded estimate). This is the only figure that belongs under an
      // "Ins Write-off" heading — `appliedWriteOff` is patient credit money
      // and would be mislabelled there.
      writeoff: pricingWriteOff,
      estimatedWriteOff: pricingWriteOff,
      // Total relief granted against this line, kept separate so the ledger
      // can report it in its own "Adjustment" column. fee still equals
      // patient + insurance + writeoff + appliedAdjustment.
      appliedAdjustment: appliedWriteOff,
      insuranceWriteOff: pricingWriteOff,
    };
  };

  // The line items an adjustment was posted against. Keep the original
  // procedure estimate columns intact and report only this adjustment's
  // amount in the dedicated Adjustment column; otherwise the same write-off
  // appears twice and reduces the insurance column twice.
  const proceduresForAdjustment = (adj) => {
    const adjustmentAmount = Math.abs(moneyNumber(adj.amount));
    const isPatientCreditAdjustment = adjustmentIsPatientCredit(adj);
    const isDebitAdjustment = adjustmentIsDebitAddition(adj);
    const targets = procedureTargetsOf(adj)
      .map((procNum) => proceduresByProcNum.get(procNum))
      .filter(Boolean);
    // De-duplicate by ProcNum so a note that names the same line twice (or
    // a link plus a note about it) never renders it twice.
    const seen = new Set();
    return targets
      .filter((proc) => {
        const key = String(proc._id || proc.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((proc) => {
        if (isDebitAdjustment) {
          // For debit adjustments, use the restated amounts (after all prior
          // adjustments folded in) and distribute the new debit proportionally
          // to the current patient/insurance split.
          const restated = procedureAfterAdjustments(proc);
          const { fee, ptPortion, insPortion, pricingWriteOff } = restated;
          const totalPortion = ptPortion + insPortion;
          const ptShare = totalPortion > 0 ? ptPortion / totalPortion : 0;
          const insShare = totalPortion > 0 ? insPortion / totalPortion : 0;
          return {
            ...proc,
            fee: restated.fee,
            ptPortion: ptPortion + round2(adjustmentAmount * ptShare),
            insPortion: insPortion + round2(adjustmentAmount * insShare),
            writeoff: pricingWriteOff,
            estimatedWriteOff: pricingWriteOff,
            appliedAdjustment: adjustmentAmount,
          };
        }
        // Patient credit adjustments (courtesy, un-collected, etc.) reduce
        // the patient portion only; insurance estimate is zeroed for display
        // since the credit applies to patient liability.
        const { fee: baseFee, ptPortion: basePt, insPortion: baseIns, pricingWriteOff: baseWo } =
          procedureBaseAmounts(proc);
        const patientCreditBase = Math.max(0, baseFee - baseWo);
        return {
          ...proc,
          fee: baseFee,
          ptPortion: isPatientCreditAdjustment
            ? Math.max(0, patientCreditBase - adjustmentAmount)
            : basePt,
          insPortion: isPatientCreditAdjustment ? 0 : baseIns,
          writeoff: baseWo,
          estimatedWriteOff: baseWo,
          appliedAdjustment: adjustmentAmount,
        };
      });
  };

  const patientCreditAdjustmentForProcedure = (proc) => {
    const procKey = String(proc._id || proc.id || proc.ProcNum || "");
    const codeKey = proc.code || proc.cptCode || proc.ProcCode;
    return (adjustments || [])
      .filter((adj) => {
        if (adj.isVoided) return false;
        if (!adjustmentIsPatientCredit(adj)) return false;
        const targets = procedureTargetsOf(adj);
        return (
          targets.includes(procKey) ||
          (codeKey && String(adj.notes || "").includes(`(${codeKey})`))
        );
      })
      .reduce((sum, adj) => sum + Math.abs(moneyNumber(adj.amount)), 0);
  };

  const proceduresForPayment = (payment) => {
    const splits = payment.splits || payment.paysplits || [];
    const targets = splits
      .map((split) => {
        const procedureId =
          split.procedureId || split.procNum || split.ProcNum;
        const proc = proceduresByProcNum.get(String(procedureId));
        if (!proc) return null;
        const { fee, ptPortion, insPortion, pricingWriteOff } =
          procedureBaseAmounts(proc);
        const patientCreditAmount = patientCreditAdjustmentForProcedure(proc);
        const patientCreditBase = Math.max(0, fee - pricingWriteOff);
        const adjustedPtPortion =
          patientCreditAmount > 0
            ? Math.max(0, patientCreditBase - patientCreditAmount)
            : ptPortion;
        return {
          ...proc,
          fee,
          ptPortion: Math.max(
            0,
            adjustedPtPortion -
              Math.abs(moneyNumber(split.amount || split.SplitAmt)),
          ),
          insPortion: patientCreditAmount > 0 ? 0 : insPortion,
          writeoff: pricingWriteOff,
          estimatedWriteOff: pricingWriteOff,
          appliedPayment: Math.abs(moneyNumber(split.amount || split.SplitAmt)),
        };
      })
      .filter(Boolean);

    if (targets.length > 0) return targets;

    const amount = Math.abs(moneyNumber(payment.amount));
    const invoiceLines = (payment.invoiceId
      ? invoices.find(
          (inv) => String(inv._id || inv.id) === String(payment.invoiceId),
        )?.lineItems
      : []) || [];
    return invoiceLines.map((proc, idx) => {
      const { fee, ptPortion, insPortion, pricingWriteOff } =
        procedureBaseAmounts(proc);
      const patientCreditAmount = patientCreditAdjustmentForProcedure(proc);
      const patientCreditBase = Math.max(0, fee - pricingWriteOff);
      const adjustedPtPortion =
        patientCreditAmount > 0
          ? Math.max(0, patientCreditBase - patientCreditAmount)
          : ptPortion;
      return {
        ...proc,
        fee,
        ptPortion: Math.max(0, adjustedPtPortion - (idx === 0 ? amount : 0)),
        insPortion: patientCreditAmount > 0 ? 0 : insPortion,
        writeoff: pricingWriteOff,
        estimatedWriteOff: pricingWriteOff,
        appliedPayment: idx === 0 ? amount : 0,
      };
    });
  };

  // What the patient still owes on a line: the restated patient portion less
  // whatever the patient has already paid on it. payment.service keeps
  // `patientPaidAmount` per procedure on every allocation, so insurance money
  // is never subtracted from the patient's share.
  const remainingPatientBalance = (proc) => {
    const { ptPortion } = procedureAfterAdjustments(proc);
    const patientPaid = moneyNumber(
      proc.patientPaidAmount ?? proc.patientPaid ?? proc.ptPaid,
    );
    return Math.max(0, round2(ptPortion - patientPaid));
  };

  const remainingInsuranceBalance = (proc) =>
    Math.max(0, round2(procedureAfterAdjustments(proc).insPortion));

  const writeoffForProcedure = (proc) =>
    Math.max(0, round2(procedureAfterAdjustments(proc).writeoff));

  // The procedure-level adjustment/write-off amount alone (pricing write-off
  // excluded), which is what the ledger reports in its Adjustment column.
  const adjustmentForProcedure = (proc) =>
    Math.max(0, round2(procedureAfterAdjustments(proc).appliedAdjustment));

  return {
    proceduresByProcNum,
    procedureIsClaimed,
    procedureBaseAmounts,
    procedureAfterAdjustments,
    proceduresForAdjustment,
    proceduresForPayment,
    patientCreditAdjustmentForProcedure,
    appliedWriteOffByProc,
    remainingPatientBalance,
    remainingInsuranceBalance,
    writeoffForProcedure,
    adjustmentForProcedure,
  };
};

export { parseProcedureRefs, procedureTargetsOf, adjustmentIsInsuranceWriteOff };
