import React from "react";
import jsPDF from "jspdf";

const PDFGenerator = ({ machines }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: "Machine ID", width: 10 },
      { header: "Machine Name", width: 25 },
      { header: "Model", width: 30 },
      { header: "Work Order ID", width: 30 },
      { header: "Last Maintenance", width: 30 },
      { header: "Status", width: 34 }
    ];

    const startX = 20;
    let startY = 20;

    // Draw header row
    doc.setFontSize(12);
    columns.forEach((col, index) => {
      doc.text(col.header, startX + col.width * index, startY);
    });

    // Draw separator line after header
    startY += 5;
    doc.line(startX, startY, startX + columns.reduce((sum, col) => sum + col.width, 0), startY);

    // Draw data rows
    startY += 10;
    machines.forEach(row => {
      columns.forEach((col, index) => {
        const textValue = String(row[col.header.toLowerCase().replace(/ /g, "_")] || "N/A");
        doc.text(textValue, startX + col.width * index, startY);
      });
      startY += 10;
    });

    // Add summary section
    startY += 10;
    doc.setFontSize(14);
    doc.text("Summary Statistics", startX, startY);

    const totalMachines = machines.length;
    const operationalCount = machines.filter(m => m.machine_status === "Operational").length;
    const maintenanceDueCount = machines.filter(m => {
      if (!m.last_maintenance_date) return false;
      const lastMaintenance = new Date(m.last_maintenance_date);
      const daysSinceMaintenance = (new Date() - lastMaintenance) / (1000 * 60 * 60 * 24);
      return daysSinceMaintenance > 90;
    }).length;

    // Draw summary
    startY += 10;
    doc.setFontSize(12);
    doc.text(`Total Machines: ${totalMachines}`, startX, startY);
    startY += 10;
    doc.text(`Operational Machines: ${operationalCount}`, startX, startY);
    startY += 10;
    doc.text(`Machines Overdue for Maintenance: ${maintenanceDueCount}`, startX, startY);

    // Save the PDF
    doc.save("machines.pdf");
  };

  return (
    <div>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default PDFGenerator;
