import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock("../config/api", () => ({
  default: {
    get: mockGet,
  },
}));

import apiClient from "../config/api";
import { invoiceService } from "./invoice.service";

describe("invoiceService", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("requests voided procedure rows when includeVoided is true", async () => {
    mockGet.mockResolvedValue({
      data: {
        data: {
          invoice: { _id: "123", id: "123" },
          items: [],
        },
      },
    });

    await invoiceService.getInvoiceById("123", true);

    expect(apiClient.get).toHaveBeenCalledWith(
      "/invoices/123?includeVoided=true",
    );
  });
});
