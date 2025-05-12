import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";
import { Button } from "reactstrap";

const PDFGenerator = ({ employees }) => {
  const generatePDF = () => {
    if (!employees || employees.length === 0) {
      return;
    }

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text("Employee Report", 14, 15);
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Define table columns
    const columns = [
      { header: "Employee ID", dataKey: "employee_Id" },
      { header: "Full Name", dataKey: "fullName" },
      { header: "Job Role", dataKey: "jobRole" },
      { header: "Shift", dataKey: "shift" },
      { header: "Assigned Machine", dataKey: "assignedMachineID" },
      { header: "Attendance", dataKey: "attendanceRecord" }
    ];

    // Add the table
    doc.autoTable({
      head: [columns.map(col => col.header)],
      body: employees.map(emp => [
        emp.employee_Id || 'N/A',
        emp.fullName || 'N/A',
        emp.jobRole || 'N/A',
        emp.shift || 'N/A',
        emp.assignedMachineID || 'N/A',
        emp.attendanceRecord || 'N/A'
      ]),
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      }
    });

    // Add summary section
    const finalY = doc.lastAutoTable.finalY || 30;
    doc.setFontSize(12);
    doc.text("Summary Statistics", 14, finalY + 10);
    
    doc.setFontSize(10);
    doc.text(`Total Employees: ${employees.length}`, 14, finalY + 20);
    
    // Count employees by shift
    const shiftCounts = employees.reduce((acc, emp) => {
      acc[emp.shift] = (acc[emp.shift] || 0) + 1;
      return acc;
    }, {});
    
    let yPos = finalY + 30;
    Object.entries(shiftCounts).forEach(([shift, count]) => {
      doc.text(`${shift} Shift: ${count} employees`, 14, yPos);
      yPos += 7;
    });

    // Save the PDF
    doc.save("employee_report.pdf");
  };

  return (
    <Button
      color="success"
      size="sm"
      onClick={generatePDF}
      disabled={!employees || employees.length === 0}
      title={!employees || employees.length === 0 ? "No employees to generate PDF" : "Generate PDF report"}
    >
      <FaFilePdf className="me-1" /> Generate PDF
    </Button>
  );
};

export default PDFGenerator;
