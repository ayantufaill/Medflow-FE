import { communicationService } from '../../../services/communication.service';
import { mockEmailDomainService } from './email-services/mockEmailDomainService';
import { mockEmailPreferencesService } from './email-preferences/mockEmailPreferencesService';
import { mockMessagingService } from './messaging-services/mockMessagingService';

// Single switch for the Email & Messaging section. true = in-memory demo data
// (no backend calls), false = the /communication email-domain, email-preferences
// and messaging-service endpoints.
export const USE_MOCK_EMAIL_MESSAGING = false;

export const emailDomainApi = USE_MOCK_EMAIL_MESSAGING
  ? mockEmailDomainService
  : {
      getEmailDomain: communicationService.getEmailDomain,
      setEmailDomain: communicationService.setEmailDomain,
      verifyEmailDomain: communicationService.verifyEmailDomain,
    };

export const emailPreferencesApi = USE_MOCK_EMAIL_MESSAGING
  ? mockEmailPreferencesService
  : {
      getEmailPreferences: communicationService.getEmailPreferences,
      updateEmailPreferences: communicationService.updateEmailPreferences,
    };

// Same method names as mockMessagingService, which NumberSelectionWizard calls.
export const messagingApi = USE_MOCK_EMAIL_MESSAGING
  ? mockMessagingService
  : {
      getMessagingService: communicationService.getMessagingService,
      getPracticeDetails: communicationService.getMessagingPracticeDetails,
      savePracticeDetails: communicationService.updateMessagingPracticeDetails,
      searchAvailableNumbers: communicationService.searchMessagingNumbers,
      selectMessagingNumber: communicationService.selectMessagingNumber,
    };
