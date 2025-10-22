import { db } from '../config/firebase';
import { collection, getDocs, query, where, updateDoc, doc, addDoc } from 'firebase/firestore';
import { StudyResource, ResourceVerificationLog } from '../types';
import { checkUrlAccessibility } from './linkVerificationUtils';

/**
 * Run periodic verification of all study resources
 * This function would typically be run as a scheduled Firebase Function
 * @returns Verification summary
 */
export const runPeriodicVerification = async (): Promise<{
  totalResources: number;
  verifiedCount: number;
  brokenCount: number;
  redirectedCount: number;
  errorCount: number;
}> => {
  try {
    console.log('Starting periodic resource verification...');
    
    // Fetch all resources
    const resourcesSnapshot = await getDocs(collection(db, 'study_resources'));
    const resources: StudyResource[] = [];
    
    resourcesSnapshot.forEach((doc) => {
      resources.push({
        id: doc.id,
        ...doc.data()
      } as StudyResource);
    });
    
    let verifiedCount = 0;
    let brokenCount = 0;
    let redirectedCount = 0;
    let errorCount = 0;
    
    // Check each resource
    for (const resource of resources) {
      try {
        // Check URL accessibility
        const result = await checkUrlAccessibility(resource.downloadUrl);
        
        // Create verification log
        const verificationLog: ResourceVerificationLog = {
          id: '',
          resource_id: resource.id,
          verified_at: new Date(),
          verification_status: result.isAccessible ? 'valid' : 'broken',
          http_status_code: result.statusCode,
          redirect_url: result.redirectUrl,
          notes: result.errorMessage || `Verified at ${new Date().toISOString()}`
        };
        
        // Add to Firestore
        const logRef = await addDoc(collection(db, 'resource_verification_logs'), verificationLog);
        verificationLog.id = logRef.id;
        
        // Update resource status
        const resourceRef = doc(db, 'study_resources', resource.id);
        await updateDoc(resourceRef, {
          is_verified: result.isAccessible,
          last_verified: new Date(),
          ...(result.redirectUrl && { source_url: result.redirectUrl })
        });
        
        // Update counters
        if (result.isAccessible) {
          if (result.redirectUrl) {
            redirectedCount++;
          } else {
            verifiedCount++;
          }
        } else {
          brokenCount++;
        }
      } catch (error) {
        errorCount++;
        console.error(`Error verifying resource ${resource.id}:`, error);
      }
    }
    
    // Log summary
    const summary = {
      totalResources: resources.length,
      verifiedCount,
      brokenCount,
      redirectedCount,
      errorCount
    };
    
    console.log('Periodic verification completed:', summary);
    
    // In a real implementation, you would send a report to admins
    // sendVerificationReport(summary);
    
    return summary;
  } catch (error) {
    throw new Error(`Failed to run periodic verification: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Send verification report to admins
 * @param summary Verification summary
 */
export const sendVerificationReport = async (summary: {
  totalResources: number;
  verifiedCount: number;
  brokenCount: number;
  redirectedCount: number;
  errorCount: number;
}): Promise<void> => {
  try {
    // In a real implementation, this would:
    // 1. Generate a detailed report
    // 2. Send email to admins
    // 3. Create admin dashboard notifications
    // 4. Log to audit trail
    
    console.log('Verification report sent to admins:', summary);
    
    // Example: Add to admin notifications collection
    await addDoc(collection(db, 'admin_notifications'), {
      type: 'resource_verification_report',
      title: 'Study Resources Verification Report',
      message: `Verified ${summary.verifiedCount} resources, found ${summary.brokenCount} broken links`,
      summary: summary,
      created_at: new Date(),
      read: false
    });
  } catch (error) {
    console.error('Failed to send verification report:', error);
  }
};

/**
 * Auto-fix broken resources where possible
 * @returns Fix summary
 */
export const autoFixBrokenResources = async (): Promise<{
  totalBroken: number;
  fixedCount: number;
  replacementCount: number;
  unresolvedCount: number;
}> => {
  try {
    console.log('Starting auto-fix for broken resources...');
    
    // Find resources with broken links
    const brokenResourcesQuery = query(
      collection(db, 'study_resources'),
      where('is_verified', '==', false)
    );
    
    const brokenResourcesSnapshot = await getDocs(brokenResourcesQuery);
    const brokenResources: StudyResource[] = [];
    
    brokenResourcesSnapshot.forEach((doc) => {
      brokenResources.push({
        id: doc.id,
        ...doc.data()
      } as StudyResource);
    });
    
    let fixedCount = 0;
    let replacementCount = 0;
    let unresolvedCount = 0;
    
    // Attempt to fix each broken resource
    for (const resource of brokenResources) {
      try {
        // Check if there are replacement suggestions in broken link reports
        const reportsQuery = query(
          collection(db, 'broken_links'),
          where('resource_id', '==', resource.id),
          where('status', '==', 'reported')
        );
        
        const reportsSnapshot = await getDocs(reportsQuery);
        
        // If we have reports with replacement URLs, try to use them
        let fixed = false;
        for (const reportDoc of reportsSnapshot.docs) {
          const report = reportDoc.data();
          if (report.replacement_url) {
            // Test the replacement URL
            const result = await checkUrlAccessibility(report.replacement_url);
            if (result.isAccessible) {
              // Update the resource with the new URL
              const resourceRef = doc(db, 'study_resources', resource.id);
              await updateDoc(resourceRef, {
                downloadUrl: report.replacement_url,
                source_url: report.replacement_url,
                is_verified: true,
                last_verified: new Date()
              });
              
              // Update the report status
              const reportRef = doc(db, 'broken_links', reportDoc.id);
              await updateDoc(reportRef, {
                status: 'fixed',
                resolved_at: new Date(),
                resolved_by: 'auto-fix-system'
              });
              
              replacementCount++;
              fixed = true;
              break;
            }
          }
        }
        
        if (!fixed) {
          // Try to find a cached copy or alternative source
          // This would be implementation-specific
          unresolvedCount++;
        }
      } catch (error) {
        console.error(`Error auto-fixing resource ${resource.id}:`, error);
        unresolvedCount++;
      }
    }
    
    const summary = {
      totalBroken: brokenResources.length,
      fixedCount,
      replacementCount,
      unresolvedCount
    };
    
    console.log('Auto-fix completed:', summary);
    
    return summary;
  } catch (error) {
    throw new Error(`Failed to auto-fix broken resources: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default {
  runPeriodicVerification,
  sendVerificationReport,
  autoFixBrokenResources
};