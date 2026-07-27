# MyChart Configuration Components

This directory contains reusable components for the MyChart Configuration page. These components help organize and structure the configuration settings for MyChart integration.

## Components

### ConfigRow
A reusable component for configuration rows with toggle switch and required/optional status.
- **Props:**
  - `label` - The label text for the configuration row
  - `hasInfo` - Whether to show an info icon (optional)
  - `showStatus` - Whether to show required/optional status options (default: true)
  - `checked` - Current toggle state
  - `requiredStatus` - 'required' or 'optional'
  - `onChange` - Callback when toggle is changed
  - `onRequiredStatusChange` - Callback when required status is changed

### ColorsSection
Manages color customization for MyChart interface.
- **Props:**
  - `colors` - Object containing color values
  - `onColorChange` - Callback for color updates
  - `onResetColors` - Callback to reset colors to defaults

### PatientPaymentSection
Manages patient payment settings and Google Measurement ID.
- **Props:**
  - `patientPayment` - Payment configuration object
  - `googleMeasurementId` - Google Measurement ID
  - `onPaymentChange` - Callback for payment settings
  - `onGoogleIdChange` - Callback for Google ID changes

### ConfidentialInfoSection
Manages confidential information settings (legal name, pronouns, marital status).
- **Props:**
  - `confidentialInfo` - Confidential information settings
  - `onConfidentialInfoChange` - Callback for changes

### PatientInformationSection
Manages patient information including gender identity options.
- **Props:**
  - `patientInfo` - Patient information settings
  - `confidentialInfo` - Confidential information settings
  - `onPatientInfoChange` - Callback for patient info changes
  - `onGenderIdentityChange` - Callback for gender identity changes
  - `onGenderOptionChange` - Callback for gender option changes
  - `onConfidentialInfoChange` - Callback for confidential info changes

### PhoneNumberSection
Manages phone number configuration (home and work phone).
- **Props:**
  - `phoneNumber` - Phone number settings
  - `onPhoneNumberChange` - Callback for phone number changes

### GeneralSectionsConfiguration
Manages general section settings (additional info, emergency contact, release info, spouse info).
- **Props:**
  - `generalSections` - General sections settings
  - `onGeneralSectionsChange` - Callback for changes

### DentalInsuranceFinancialSection
Manages dental insurance and financial information settings.
- **Props:**
  - `dentalInsuranceFinancial` - Dental insurance settings
  - `onDentalInsuranceFinancialChange` - Callback for changes

### MyChartConfigurationHeader
Header component with breadcrumb navigation and save button.
- **Props:**
  - `onSave` - Callback when save button is clicked

## Usage

These components are designed to work together in the main MyChart Configuration page:

```jsx
import {
  ConfigRow,
  ColorsSection,
  PatientPaymentSection,
  MyChartConfigurationHeader
} from '../../components/admin/mychart-configuration';

// Use in your page component
<MyChartConfigurationHeader onSave={handleSave} />
<ColorsSection colors={colors} onColorChange={handleColorChange} onResetColors={handleResetColors} />
```

## Default Settings

The default settings structure is defined in the main MyChart Configuration page and includes:
- Colors (primary font, secondary font, page background, section background, primary, secondary)
- Patient Payment (ACH, quick deposit, edit amount)
- Google Measurement ID
- Confidential Information
- Patient Information with Gender Identity
- Phone Numbers
- General Sections
- Dental Insurance and Financial Information
