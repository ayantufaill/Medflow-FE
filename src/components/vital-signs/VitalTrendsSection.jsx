import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  TablePagination,
  TextField,
  Paper,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TableChart as TableIcon,
  TrendingUp as TrendIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import SectionCard from '../shared/SectionCard';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius, standardFieldSx, roundedSelectMenuProps } from '../../constants/styles';

const SegmentedTabs = ({ value, onChange }) => (
  <Box sx={{ display: "inline-flex", backgroundColor: COLORS.SURFACE_INPUT, borderRadius: radius.pill, p: 0.5 }}>
    {["Chart View", "Table View"].map((label, index) => {
      const itemValue = index === 0 ? "chart" : "table";
      const active = value === itemValue;
      return (
        <Box
          key={label}
          onClick={() => onChange(itemValue)}
          sx={{
            px: 2,
            py: 0.75,
            borderRadius: radius.pill,
            cursor: "pointer",
            backgroundColor: active ? COLORS.SURFACE_CARD : "transparent",
            boxShadow: active ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
          }}
        >
          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.bold, color: active ? COLORS.TEXT_PRIMARY : COLORS.TEXT_MUTED }}>
            {label}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: '#fff',
          p: 1.5,
          border: `1px solid ${COLORS.BORDER}`,
          borderRadius: radius.md,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, mb: 1, fontWeight: fontWeight.medium }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: index !== payload.length - 1 ? 0.5 : 0 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color }} />
            <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY }}>
              {entry.name}: <span style={{ fontWeight: fontWeight.bold }}>{entry.value}</span>
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const VitalTrendsSection = ({
  chartData,
  trendDays,
  setTrendDays,
  viewMode,
  setViewMode,
  vitalSigns,
  totalVitals,
  pagination,
  handlePageChange,
  handleRowsPerPageChange,
  normalRanges,
  formatDate,
  formatBloodPressure,
  CustomDot,
  onViewClick,
}) => {
  const navigate = useNavigate();

  const HeaderActions = (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
      <SegmentedTabs value={viewMode} onChange={(val) => val && setViewMode(val)} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Time Period:</Typography>
        <TextField
          select
          variant="outlined"
          size="small"
          value={trendDays}
          onChange={(e) => setTrendDays(e.target.value)}
          SelectProps={{ MenuProps: roundedSelectMenuProps }}
          sx={{ ...standardFieldSx, width: 140 }}
        >
          <MenuItem value={7}>Last 7 days</MenuItem>
          <MenuItem value={30}>Last 30 days</MenuItem>
          <MenuItem value={90}>Last 90 days</MenuItem>
          <MenuItem value={180}>Last 6 months</MenuItem>
          <MenuItem value={365}>Last year</MenuItem>
        </TextField>
      </Box>
    </Box>
  );

  return (
    <SectionCard icon={TrendIcon} title="Trends" sx={{ mb: 0 }}>
      <Box sx={{ mb: 3 }}>
        {HeaderActions}
      </Box>
      {viewMode === 'chart' && chartData.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: radius.lg,
              border: `1px solid ${COLORS.BORDER}`,
              backgroundColor: COLORS.SURFACE_CARD,
            }}
          >
            <Typography sx={{ fontFamily: 'Inter', fontWeight: fontWeight.semibold, fontSize: fontSize.md, color: COLORS.TEXT_PRIMARY, mb: 3 }}>
              Blood Pressure & Heart Rate
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: COLORS.TEXT_MUTED, fontSize: 11, fontFamily: 'Inter' }} dy={10} />
              <YAxis yAxisId="left" domain={[40, 200]} axisLine={false} tickLine={false} tick={{ fill: COLORS.TEXT_MUTED, fontSize: 11, fontFamily: 'Inter' }} dx={-10} />
              <YAxis yAxisId="right" orientation="right" domain={[40, 120]} axisLine={false} tickLine={false} tick={{ fill: COLORS.TEXT_MUTED, fontSize: 11, fontFamily: 'Inter' }} dx={10} />
              <ChartTooltip content={<CustomChartTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: 12, paddingTop: '20px' }} />
              {normalRanges?.bloodPressureSystolic && (
                <ReferenceArea
                  yAxisId="left"
                  y1={normalRanges.bloodPressureSystolic.min}
                  y2={normalRanges.bloodPressureSystolic.max}
                  fill="#22c55e"
                  fillOpacity={0.06}
                  label=""
                />
              )}
              {normalRanges?.heartRate && (
                <ReferenceArea
                  yAxisId="right"
                  y1={normalRanges.heartRate.min}
                  y2={normalRanges.heartRate.max}
                  fill="#22c55e"
                  fillOpacity={0.06}
                  label=""
                />
              )}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="systolic"
                stroke="#2262ef"
                name="Systolic"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 6 }}
                iconType="circle"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="diastolic"
                stroke="#60a5fa"
                name="Diastolic"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 6 }}
                iconType="circle"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="heartRate"
                stroke="#ef4444"
                name="Heart Rate"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 6 }}
                iconType="circle"
              />
            </LineChart>
          </ResponsiveContainer>
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: radius.lg,
              border: `1px solid ${COLORS.BORDER}`,
              backgroundColor: COLORS.SURFACE_CARD,
            }}
          >
            <Typography sx={{ fontFamily: 'Inter', fontWeight: fontWeight.semibold, fontSize: fontSize.md, color: COLORS.TEXT_PRIMARY, mb: 3 }}>
              Weight & Temperature
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: COLORS.TEXT_MUTED, fontSize: 11, fontFamily: 'Inter' }} dy={10} />
              <YAxis yAxisId="left" domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: COLORS.TEXT_MUTED, fontSize: 11, fontFamily: 'Inter' }} dx={-10} />
              <YAxis yAxisId="right" orientation="right" domain={[93, 105]} axisLine={false} tickLine={false} tick={{ fill: COLORS.TEXT_MUTED, fontSize: 11, fontFamily: 'Inter' }} dx={10} />
              <ChartTooltip content={<CustomChartTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: 12, paddingTop: '20px' }} />
              {normalRanges?.temperature && (
                <ReferenceArea
                  yAxisId="right"
                  y1={normalRanges.temperature.min}
                  y2={normalRanges.temperature.max}
                  fill="#22c55e"
                  fillOpacity={0.06}
                  label=""
                />
              )}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="weight"
                stroke="#8b5cf6"
                name="Weight (lbs)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                iconType="circle"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="temperature"
                stroke="#f59e0b"
                name="Temp (°F)"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 6 }}
                iconType="circle"
              />
            </LineChart>
          </ResponsiveContainer>
          </Box>
        </Box>
      ) : viewMode === 'chart' ? (
        <Alert severity="info" sx={{ fontFamily: 'Inter' }}>No trend data available for the selected period</Alert>
      ) : null}

      {viewMode === 'table' && (
        <>
          {vitalSigns.length === 0 ? (
            <Alert severity="info" sx={{ fontFamily: 'Inter' }}>No vital sign records found</Alert>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: radius.md, border: `1px solid ${COLORS.BORDER}`, overflow: 'hidden', boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: COLORS.SURFACE_TINT }}>
                      {['Date', 'Time', 'BP (mmHg)', 'HR (bpm)', 'Temp (°F)', 'SpO2 (%)', 'Weight (lbs)', 'BMI'].map(col => (
                        <TableCell key={col} sx={{ borderColor: COLORS.BORDER, py: 1.5 }}>
                          <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                            {col}
                          </Typography>
                        </TableCell>
                      ))}
                      <TableCell align="right" sx={{ borderColor: COLORS.BORDER, py: 1.5 }}>
                        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vitalSigns.map((vital) => {
                      const isOutOfRange = normalRanges && (
                        (vital.bloodPressureSystolic && (vital.bloodPressureSystolic < normalRanges.bloodPressureSystolic?.min || vital.bloodPressureSystolic > normalRanges.bloodPressureSystolic?.max)) ||
                        (vital.bloodPressureDiastolic && (vital.bloodPressureDiastolic < normalRanges.bloodPressureDiastolic?.min || vital.bloodPressureDiastolic > normalRanges.bloodPressureDiastolic?.max)) ||
                        (vital.heartRate && (vital.heartRate < normalRanges.heartRate?.min || vital.heartRate > normalRanges.heartRate?.max)) ||
                        (vital.temperature && (vital.temperature < normalRanges.temperature?.min || vital.temperature > normalRanges.temperature?.max)) ||
                        (vital.oxygenSaturation && vital.oxygenSaturation < normalRanges.oxygenSaturation?.min)
                      );

                      const rowSx = {
                        "&:last-child td, &:last-child th": { borderBottom: 0 },
                        ...(isOutOfRange && { bgcolor: 'rgba(239, 68, 68, 0.05)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } })
                      };

                      const cellProps = { sx: { borderColor: COLORS.BORDER, py: 1.75, fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY } };

                      return (
                        <TableRow
                          key={vital._id}
                          hover
                          sx={rowSx}
                        >
                          <TableCell {...cellProps}>{formatDate(vital.recordedDate)}</TableCell>
                          <TableCell {...cellProps}>{vital.recordedTime || '-'}</TableCell>
                          <TableCell {...cellProps}>
                            {formatBloodPressure(vital.bloodPressureSystolic, vital.bloodPressureDiastolic)}
                          </TableCell>
                          <TableCell {...cellProps}>{vital.heartRate || '-'}</TableCell>
                          <TableCell {...cellProps}>{vital.temperature || '-'}</TableCell>
                          <TableCell {...cellProps}>{vital.oxygenSaturation || '-'}</TableCell>
                          <TableCell {...cellProps}>{vital.weight || '-'}</TableCell>
                          <TableCell {...cellProps}>{vital.bmi || '-'}</TableCell>
                          <TableCell align="right" {...cellProps}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => onViewClick(vital._id)}
                                sx={{ color: COLORS.TEXT_SECONDARY }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={totalVitals}
                page={pagination.page - 1}
                onPageChange={handlePageChange}
                rowsPerPage={pagination.limit}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                  '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                    fontFamily: 'Inter',
                  }
                }}
              />
            </>
          )}
        </>
      )}
    </SectionCard>
  );
};

export default VitalTrendsSection;
