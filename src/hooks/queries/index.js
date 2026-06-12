/**
 * useAllergies(patientId) — Query allergies by patient. Returns { data: Allergy[], isLoading, error }.
 * useAllergy(allergyId) — Query single allergy. Returns { data: Allergy, isLoading, error }.
 * useCreateAllergy() — Mutation to create allergy. Returns { mutate, mutateAsync, isPending }.
 * useUpdateAllergy() — Mutation to update allergy. Returns { mutate, mutateAsync, isPending }.
 * useDeleteAllergy() — Mutation to delete allergy. Returns { mutate, mutateAsync, isPending }.
 */
export * from './useAllergies';

/**
 * useAppointmentTypes() — Query appointment types.
 */
export * from './useAppointmentTypes';

/**
 * usePatients(options) — Query patients list.
 * usePatient(patientId) — Query single patient.
 * useCreatePatient() — Mutation to create a patient.
 * useUpdatePatient() — Mutation to update a patient.
 */
export * from './usePatients';

/**
 * useProviders() — Query providers list.
 */
export * from './useProviders';

/**
 * useRoles() — Query user roles.
 */
export * from './useRoles';

/**
 * useUsers() — Query system users.
 */
export * from './useUsers';

/**
 * useVitalSigns(patientId) — Query vital signs.
 */
export * from './useVitalSigns';

/**
 * useAppointments(options) — Query appointments list.
 * useAppointmentCalendar(startDate, endDate) — Query calendar schedule.
 * useAppointmentDetails(appointmentId) — Query single appointment.
 * useCreateAppointment() — Mutation to create an appointment.
 * useUpdateAppointment() — Mutation to update an appointment.
 * useCancelAppointment() — Mutation to cancel an appointment.
 */
export * from './useAppointments';

/**
 * useServices(options) — Query services list.
 * useService(serviceId) — Query single service.
 * useServiceCategories() — Query service categories.
 * useCreateService() — Mutation to create a service.
 * useUpdateService() — Mutation to update a service.
 * useToggleServiceActive() — Mutation to toggle service status.
 */
export * from './useServices';

/**
 * usePracticeInfo() — Query practice info.
 */
export * from './usePracticeInfo';

/**
 * useDocuments() — Query documents.
 */
export * from './useDocuments';

// Stub exports for future sprints
/**
 * useClaims() — (Stub) Query insurance claims.
 */
export * from './useClaims';

/**
 * useInvoices() — (Stub) Query invoices.
 */
export * from './useInvoices';

/**
 * usePayments() — (Stub) Query payments.
 */
export * from './usePayments';

/**
 * useCommunications() — (Stub) Query communications.
 */
export * from './useCommunications';

/**
 * useLabCases() — (Stub) Query lab cases.
 */
export * from './useLabCases';

/**
 * useEstimates() — (Stub) Query treatment estimates.
 */
export * from './useEstimates';