import React from 'react';
import StaffApp from '../StaffApp';

// Legacy route kept for compatibility. Authentication and authorization are
// handled centrally by StaffApp + Firebase Authentication + Firestore rules.
const NewStaffPortal: React.FC = () => <StaffApp />;

export default NewStaffPortal;