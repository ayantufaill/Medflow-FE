import { Component } from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * Catches React rendering errors and displays a fallback.
 * Supports an optional `onReset` prop for external cleanup (e.g., React Query cache reset).
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3 }}>
          <Typography color="error" sx={{ mb: 2 }}>
            Something went wrong: {this.state.error?.message || 'Unknown error'}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              if (this.props.onReset) this.props.onReset();
              this.setState({ hasError: false, error: null });
            }}
          >
            Try again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
