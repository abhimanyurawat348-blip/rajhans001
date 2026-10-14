import React from 'react';
import StaffApp from '../StaffApp';

// Legacy entry point. Authentication and authorization are centralized in
// StaffApp so duplicate credential checks cannot drift out of sync.
const StaffPortal: React.FC = () => <StaffApp />;

export default StaffPortal;