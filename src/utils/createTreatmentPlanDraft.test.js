import { afterEach, describe, expect, it, vi } from 'vitest';
import { DRAFT_REQUEST_TIMEOUT_MS, saveTreatmentPlanDraft, withDraftRequestDeadline } from './createTreatmentPlanDraft';

const input = () => ({
  service: { update: vi.fn().mockResolvedValue({ treatmentPlan: { _id: '72', items: [] } }), create: vi.fn().mockResolvedValue({ treatmentPlan: { _id: '73', items: [] } }) },
  attempt: {}, patientId: '2', title: 'New draft', activePlanId: '72',
  items: [{ id: '5', charge: 100 }], savedItems: [], totals: { totalAmount: 100 }, onPlanSaved: vi.fn(),
});

afterEach(() => vi.useRealTimers());

describe('draft save recovery', () => {
  it('skips an unchanged source plan and creates copied rows without old IDs', async () => {
    const args = input();
    args.savedItems = args.items;
    await saveTreatmentPlanDraft(args);
    expect(args.service.update).not.toHaveBeenCalled();
    expect(args.service.create.mock.calls[0][0].items).toEqual([{ charge: 100 }]);
  });

  it('does not create a draft if saving the source plan fails', async () => {
    const args = input();
    args.service.update.mockRejectedValue(new Error('save failed'));
    await expect(saveTreatmentPlanDraft(args)).rejects.toThrow('save failed');
    expect(args.service.create).not.toHaveBeenCalled();
    expect(args.items).toEqual([{ id: '5', charge: 100 }]);
  });

  it('retries an uncertain POST with the same key and payload, without repeating the PATCH', async () => {
    const args = input();
    args.service.create.mockRejectedValueOnce(new Error('response lost'));
    await expect(saveTreatmentPlanDraft(args)).rejects.toThrow('response lost');
    const original = args.service.create.mock.calls[0][0];
    await saveTreatmentPlanDraft({ ...args, title: 'Edited while recovering' });
    expect(args.service.create.mock.calls[1][0]).toBe(original);
    expect(original.creationRequestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(args.service.update).toHaveBeenCalledOnce();
    expect(args.attempt.payload).toBeNull();
  });

  it('releases the caller and aborts even when an interceptor never settles', async () => {
    vi.useFakeTimers();
    let signal;
    const pending = withDraftRequestDeadline(config => {
      signal = config.signal;
      return new Promise(() => {});
    });
    const rejection = expect(pending).rejects.toMatchObject({ code: 'ETIMEDOUT' });
    await vi.advanceTimersByTimeAsync(DRAFT_REQUEST_TIMEOUT_MS);
    await rejection;
    expect(signal.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps the original key if access fails while recovering a lost response', async () => {
    const args = input();
    args.service.create.mockRejectedValueOnce(new Error('response lost'));
    await expect(saveTreatmentPlanDraft(args)).rejects.toThrow();
    const original = args.attempt.payload;
    args.service.create.mockRejectedValueOnce({ response: { status: 403 } });
    await expect(saveTreatmentPlanDraft(args)).rejects.toEqual({ response: { status: 403 } });
    expect(args.attempt.payload).toBe(original);
  });
});
