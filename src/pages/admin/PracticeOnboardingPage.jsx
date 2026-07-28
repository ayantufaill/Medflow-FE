import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Link as LinkIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useRoles } from "../../hooks/queries/useRoles";
import { roomService } from "../../services/room.service";
import { fontSize, fontWeight } from "../../constants/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  createPracticeInfo,
  updateOfficeTimings,
  updateScheduleConfig,
  updatePracticeInfo,
} from "../../store/slices/practiceInfoSlice";
import {
  fetchProviders,
  createProvider,
  selectProviderList,
  selectProviderListLoading,
} from "../../store/slices/providerSlice";
import {
  fetchUsers,
  createUser,
  selectUserList,
  selectUserListLoading,
} from "../../store/slices/userSlice";
import {
  fetchRooms,
  selectRoomList,
  selectRoomListLoading,
} from "../../store/slices/roomSlice";
import PracticeInformationForm from "../../components/practice-onboarding/practice-info/PracticeInformationForm";
import AddressLocationForm from "../../components/practice-onboarding/practice-info/AddressLocationForm";
import OfficeLogoUpload from "../../components/practice-onboarding/practice-info/OfficeLogoUpload";
import SocialMediaLinksForm from "../../components/practice-onboarding/practice-info/SocialMediaLinksForm";
import ProvidersSetup from "../../components/practice-onboarding/providers/ProvidersSetup";
import UsersSetup from "../../components/practice-onboarding/users/UsersSetup";
import OpeningHoursSetup from "../../components/practice-onboarding/opening-hours/OpeningHoursSetup";
import ScheduleSetup from "../../components/practice-onboarding/schedule-setup/ScheduleSetup";
import BillingConfig from "../../components/practice-onboarding/billing-configuration/BillingConfig";

// ─── Constants ───────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Practice Info" },
  { label: "Providers" },
  { label: "Users" },
  { label: "Opening Hours" },
  { label: "Schedule Setup" },
  { label: "Billing Configuration" },
];

const NAVY = "#1976d2";
const GRAY_INACTIVE = "#d0d5dd";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
];

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "New Zealand",
  "Ireland",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Switzerland",
  "Austria",
  "Belgium",
  "Portugal",
  "Poland",
  "Japan",
  "South Korea",
  "China",
  "India",
  "Singapore",
  "Malaysia",
  "Philippines",
  "United Arab Emirates",
  "Saudi Arabia",
  "South Africa",
  "Brazil",
  "Mexico",
  "Argentina",
];

const SOCIAL_MEDIA_FIELDS = [
  { name: "facebookUrl", label: "Facebook Page URL" },
  { name: "googleBusinessUrl", label: "Google Business URL" },
  { name: "linkedInUrl", label: "LinkedIn URL" },
  { name: "twitterUrl", label: "Twitter Page URL" },
  { name: "instagramUrl", label: "Instagram Page URL" },
  { name: "yelpUrl", label: "Yelp URL" },
];

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const WizardProgressBar = ({ activeStep }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 1, // Adjusted since we are adding padding-bottom
        mt: 1,
        overflowX: "auto",
        overflowY: "hidden", // Hide vertical overflow explicitly
        pb: 6, // Added enough padding to fit the absolute labels
        pt: 1, // Add padding top so the box-shadow is not clipped
        px: 2,
        fontFamily: "'Manrope', 'Segoe UI', sans-serif",
      }}
    >
      {STEPS.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;

        const elements = [];

        // Connector line before this step
        if (index > 0) {
          elements.push(
            <Box
              key={`line-${index}`}
              sx={{
                height: 1.5,
                flexGrow: 1,
                minWidth: { xs: 30, sm: 50, md: 80 },
                maxWidth: 100,
                bgcolor: "#D0D5DD",
              }}
            />
          );
        }

        // Step circle + label
        elements.push(
          <Box
            key={`circle-${index}`}
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: isCompleted || isActive ? "#4A7BF7" : "transparent",
                border: isCompleted || isActive ? "none" : "2px solid #D0D5DD",
                boxShadow: isActive ? "0 0 0 4px rgba(74, 123, 247, 0.25)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                transition: "all 0.3s ease",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: 28, // Position below the circle
                left: "50%",
                transform: "translateX(-50%)",
                color: "#6B7280",
                fontWeight: 500,
                fontSize: "0.7rem",
                textAlign: "center",
                width: 90, // Fixed width to allow proper centering
                lineHeight: 1.2,
                whiteSpace: "pre-wrap",
              }}
            >
              {step.label}
            </Typography>
          </Box>
        );

        return elements;
      })}
    </Box>
  );
};

// ─── Form Field Wrapper ───────────────────────────────────────────────────

const FormFieldWrapper = ({ label, children, required, error, helperText }) => (
  <Grid container spacing={2} sx={{ mb: 1, alignItems: "center" }}>
    <Grid size={{ xs: 12, sm: 4 }}>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          fontSize: fontSize.sm,
          fontFamily: "'Manrope', 'Segoe UI', sans-serif",
        }}
      >
        {label}
        {required && (
          <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
            *
          </Box>
        )}
      </Typography>
    </Grid>
    <Grid size={{ xs: 12, sm: 8 }}>
      {children}
      {error && helperText && (
        <FormHelperText error sx={{ mt: 0.5, fontSize: fontSize.xs }}>
          {helperText}
        </FormHelperText>
      )}
    </Grid>
  </Grid>
);

// ─── Section Heading ──────────────────────────────────────────────────────────

const SectionHeading = ({ children }) => (
  <Typography
    variant="h6"
    sx={{
      color: "#1976d2",
      fontWeight: fontWeight.bold,
      mb: 2,
      mt: 1,
      fontSize: fontSize.md,
      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    }}
  >
    {children}
  </Typography>
);

// ─── Bottom Action Buttons ────────────────────────────────────────────────────

const WizardActions = ({
  onFinishLater,
  onNext,
  nextLabel = "Next",
  loading = false,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      gap: 1.5,
      mt: 3,
      pt: 2,
      borderTop: "1px solid",
      borderColor: "divider",
    }}
  >
    <Button
      variant="outlined"
      onClick={onFinishLater}
      disabled={loading}
      size="small"
      sx={{
        borderColor: "#1976d2",
        color: "#1976d2",
        "&:hover": { borderColor: "#1976d2", bgcolor: "rgba(25,118,210,0.04)" },
        fontSize: "0.8rem",
        px: 2,
        py: 0.5,
      }}
    >
      Finish Later
    </Button>
    <Button
      variant="contained"
      onClick={onNext}
      disabled={loading}
      size="small"
      sx={{
        bgcolor: "#1976d2",
        "&:hover": { bgcolor: "#1565c0" },
        minWidth: 100,
        fontSize: "0.8rem",
        px: 2.5,
        py: 0.6,
      }}
      startIcon={
        loading ? <CircularProgress size={16} color="inherit" /> : null
      }
    >
      {loading ? "Saving..." : nextLabel}
    </Button>
  </Box>
);

// ─── Step 1: Practice Info ────────────────────────────────────────────────────

const Step1PracticeInfo = ({ onNext, onFinishLater }) => {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [phoneCountry, setPhoneCountry] = useState(null);
  const [faxCountry, setFaxCountry] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      practiceName: "",
      phone: "",
      email: "",
      website: "",
      businessRegistrationNumber: "",
      businessLegalName: "",
      fax: "",
      address: {
        street: "",
        country: "United States",
        state: "",
        city: "",
        postalCode: "",
      },
      timezone: "America/New_York",
      logo: null,
      facebookUrl: "",
      googleBusinessUrl: "",
      linkedInUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      yelpUrl: "",
    },
  });

  const dispatch = useDispatch();

  const sanitize = (v) => (typeof v === "string" ? v.trim() : v);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        practiceName: sanitize(data.practiceName),
        phone: data.phone ? `+${sanitize(data.phone)}` : undefined,
        email: sanitize(data.email) || undefined,
        website: sanitize(data.website) || undefined,
        businessRegistrationNumber:
          sanitize(data.businessRegistrationNumber) || undefined,
        businessLegalName: sanitize(data.businessLegalName) || undefined,
        fax: data.fax ? `+${sanitize(data.fax)}` : undefined,
        address: {
          line1: sanitize(data.address?.street) || undefined,
          city: sanitize(data.address?.city) || undefined,
          state: sanitize(data.address?.state) || undefined,
          postalCode: sanitize(data.address?.postalCode) || undefined,
          country: sanitize(data.address?.country) || undefined,
        },
        timezone: data.timezone || "UTC",
        logo: data.logo instanceof File ? data.logo : undefined,
        facebookUrl: sanitize(data.facebookUrl) || undefined,
        googleBusinessUrl: sanitize(data.googleBusinessUrl) || undefined,
        linkedInUrl: sanitize(data.linkedInUrl) || undefined,
        twitterUrl: sanitize(data.twitterUrl) || undefined,
        instagramUrl: sanitize(data.instagramUrl) || undefined,
        yelpUrl: sanitize(data.yelpUrl) || undefined,
      };

      const created = await dispatch(createPracticeInfo(payload)).unwrap();
      showSnackbar("Practice information saved successfully!", "success");
      onNext(created?._id || created?.id);
    } catch (err) {
      showSnackbar(err || "Failed to save practice info.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e, rhfOnChange) => {
    const file = e.target.files?.[0];
    if (!file) {
      setLogoPreview(null);
      rhfOnChange(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("Logo must be under 5 MB", "error");
      return;
    }
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      showSnackbar("Only JPEG, PNG, GIF, or WebP images are allowed", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
    rhfOnChange(file);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <PracticeInformationForm
        register={register}
        errors={errors}
        control={control}
        setPhoneCountry={setPhoneCountry}
        setFaxCountry={setFaxCountry}
      />

      <AddressLocationForm
        register={register}
        errors={errors}
        control={control}
      />

      <OfficeLogoUpload
        control={control}
        logoPreview={logoPreview}
        handleLogoChange={handleLogoChange}
        handleRemoveLogo={(rhfOnChange) => {
          setLogoPreview(null);
          rhfOnChange(null);
        }}
      />

      <SocialMediaLinksForm
        register={register}
        errors={errors}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 4, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={onFinishLater}
          disabled={loading}
          sx={{
            borderColor: "#d1d5db",
            color: "#374151",
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            fontWeight: 600,
            "&:hover": { borderColor: "#9ca3af", bgcolor: "#f3f4f6" },
          }}
        >
          Finish Later
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          sx={{
            bgcolor: "#3b82f6",
            textTransform: "none",
            borderRadius: "8px",
            px: 4,
            fontWeight: 600,
            boxShadow: 'none',
            "&:hover": { bgcolor: "#2563eb", boxShadow: 'none' },
          }}
        >
          {loading ? "Saving..." : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

// The InlineProviderForm and Step2Providers components have been extracted
// to src/components/practice-onboarding/providers/ProvidersSetup.jsx

// The InlineUserForm and Step3Users components have been extracted
// to src/components/practice-onboarding/users/UsersSetup.jsx

// ─── Step 4: Opening Hours ────────────────────────────────────────────────────

// The Step4OpeningHours, TimeInput components, and related constants have been extracted
// to src/components/practice-onboarding/opening-hours/OpeningHoursSetup.jsx

// ─── Step 5: Schedule Setup ───────────────────────────────────────────────────

// The Step5ScheduleSetup component and related constants have been extracted
// to src/components/practice-onboarding/schedule-setup/ScheduleSetup.jsx

// ─── Step 6: Billing Configuration ───────────────────────────────────────────

// The Step6BillingConfig component has been extracted
// to src/components/practice-onboarding/billing-configuration/BillingConfig.jsx

// ─── Coming Soon Placeholder ──────────────────────────────────────────────────

const ComingSoonStep = ({ stepNumber, title, onNext, onFinishLater }) => (
  <Box sx={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
    <SectionHeading>
      {stepNumber}. {title}
    </SectionHeading>
    <Paper
      variant="outlined"
      sx={{ py: 8, textAlign: "center", bgcolor: "grey.50", borderRadius: 2 }}
    >
      <Typography
        variant="h6"
        color="text.secondary"
        gutterBottom
        sx={{ fontSize: fontSize.lg }}
      >
        Coming Soon
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: fontSize.sm }}
      >
        This step will be available in a future update.
      </Typography>
    </Paper>
    <WizardActions onFinishLater={onFinishLater} onNext={onNext} />
  </Box>
);

// ─── Main Wizard Page ─────────────────────────────────────────────────────────

const PracticeOnboardingPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [practiceInfoId, setPracticeInfoId] = useState(null);

  const handleFinishLater = () => navigate("/admin");
  const advance = (id) => {
    if (id && typeof id === "string") {
      setPracticeInfoId(id);
    }
    setActiveStep((s) => s + 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Step1PracticeInfo
            onNext={advance}
            onFinishLater={handleFinishLater}
          />
        );
      case 1:
        return (
          <ProvidersSetup
            onNext={advance}
            onFinishLater={handleFinishLater}
            practiceInfoId={practiceInfoId}
          />
        );
      case 2:
        return (
          <UsersSetup
            onNext={advance}
            onFinishLater={handleFinishLater}
            practiceInfoId={practiceInfoId}
          />
        );
      case 3:
        return (
          <OpeningHoursSetup
            onNext={advance}
            onFinishLater={handleFinishLater}
            practiceInfoId={practiceInfoId}
          />
        );
      case 4:
        return (
          <ScheduleSetup
            onNext={advance}
            onFinishLater={handleFinishLater}
            practiceInfoId={practiceInfoId}
          />
        );
      case 5:
        return (
          <BillingConfig
            onNext={() => navigate("/admin")}
            onFinishLater={handleFinishLater}
            practiceInfoId={practiceInfoId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        px: { xs: 2, sm: 4 },
        py: { xs: 3, sm: 5 },
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1400,
          mx: "auto",
          bgcolor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          p: { xs: 3, sm: 5, md: 6 },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#111827",
            fontWeight: 700,
            mb: 0.5,
            textAlign: "center",
            fontSize: "1.25rem",
          }}
        >
          Practice Onboarding
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", textAlign: "center", mb: 4, fontSize: "0.85rem" }}
        >
          Complete the steps below to setup your practice
        </Typography>

        <WizardProgressBar activeStep={activeStep} />

        <Box sx={{ mt: 6 }}>
          {renderStepContent()}
        </Box>
      </Paper>
    </Box>
  );
};

export default PracticeOnboardingPage;
