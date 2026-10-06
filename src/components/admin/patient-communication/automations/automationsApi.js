import { communicationService } from '../../../../services/communication.service';
import { mockAutomationsService } from './mockAutomationsService';

// true = in-memory demo data (no backend calls), false = /communication/automations.
export const USE_MOCK_AUTOMATIONS = false;

// Same method signatures as mockAutomationsService, which the Automations page calls.
// The API addresses messages by id alone, so categoryId is only needed for list/create.
export const automationsApi = USE_MOCK_AUTOMATIONS
  ? mockAutomationsService
  : {
      getAutomations: (categoryId) => communicationService.getAutomations(categoryId),
      createAutomation: (categoryId, data) => communicationService.createAutomation(categoryId, data),
      updateAutomation: (_categoryId, id, data) => communicationService.updateAutomation(id, data),
      setAutomationActive: (_categoryId, id, active) => communicationService.setAutomationActive(id, active),
      deleteAutomation: (_categoryId, id) => communicationService.deleteAutomation(id),
    };
