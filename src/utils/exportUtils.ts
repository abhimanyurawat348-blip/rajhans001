import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { Complaint, Registration } from '../types';

export const exportToCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: any[], filename: string, title: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  
  let yPosition = 50;
  
  data.forEach((item, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.text(`${index + 1}. ${item.name || item.studentName || 'N/A'}`, 20, yPosition);
    yPosition += 10;
    
    Object.entries(item).forEach(([key, value]) => {
      if (key !== 'name' && key !== 'studentName' && yPosition < 270) {
        doc.setFontSize(10);
        doc.text(`${key}: ${String(value)}`, 25, yPosition);
        yPosition += 7;
      }
    });
    
    yPosition += 5;
  });
  
  doc.save(`${filename}.pdf`);
};

export const exportComplaintsToCSV = (complaints: Complaint[]) => {
  const data = complaints.map(complaint => ({
    'Student Name': complaint.studentName,
    'Class': complaint.class,
    'Section': complaint.section,
    'Email': complaint.email,
    'Father Name': complaint.fatherName,
    'Complaint': complaint.complaint,
    'Status': complaint.status,
    'IP Address': complaint.ipAddress || 'N/A',
    'Submitted At': new Date(complaint.submittedAt).toLocaleString()
  }));
  
  exportToCSV(data, 'complaints_report');
};

export const exportRegistrationsToCSV = (registrations: Registration[]) => {
  const data = registrations.map(reg => ({
    'Student Name': reg.studentName,
    'Class': reg.class,
    'Section': reg.section,
    'Date of Birth': new Date(reg.dateOfBirth).toLocaleDateString(),
    'Gender': reg.gender,
    'Father Name': reg.fatherName,
    'Mother Name': reg.motherName,
    'Category': reg.category,
    'Activity Type': reg.activityType,
    'Eligibility Category': reg.eligibilityCategory,
    'Registered At': new Date(reg.registeredAt).toLocaleString()
  }));
  
  exportToCSV(data, 'registrations_report');
};