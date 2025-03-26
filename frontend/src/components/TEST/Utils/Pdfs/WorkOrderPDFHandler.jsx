// WorkOrderPDFHandler.jsx
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const WorkOrderPDFHandler = ({ workOrders }) => {
  // Validate input
  const validWorkOrders = Array.isArray(workOrders) ? workOrders : [];

  // Calculate statistics
  const totalProcesses = validWorkOrders.length;
  const pendingProcesses = validWorkOrders.filter(order => 
    order?.order_status === 'Pending').length;
  const processedProcesses = validWorkOrders.filter(order => 
    order?.order_status === 'Processed').length;
  const processingProcesses = validWorkOrders.filter(order => 
    order?.order_status === 'processing').length;

  const generatePDF = () => {
    try {
      // Initialize jsPDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      if (!doc || typeof doc.setFontSize !== 'function') {
        throw new Error('jsPDF instance not properly initialized');
      }

      // Prepare data
      const headers = ['Work Order ID', 'Product', 'Quantity', 'Machine', 'Deadline Date', 'Order Status'];
      const data = validWorkOrders.map(order => [
        order?.work_order_Id || 'N/A',
        order?.product || 'N/A',
        order?.quentity || '0',
        order?.machine || 'N/A',
        order?.deadline_date ? new Date(order.deadline_date).toLocaleDateString() : 'N/A',
        order?.order_status || 'N/A'
      ]);

      const title = 'Work Order Report';
      const generatedDate = new Date().toLocaleString();
      const stats = {
        total: totalProcesses,
        pending: pendingProcesses,
        processed: processedProcesses,
        processing: processingProcesses
      };

      // Header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 15, 20);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${generatedDate}`, 15, 28);

      // Statistics
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Process Statistics:', 15, 40);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const statsText = [
        `Total Processes: ${stats.total}`,
        `Pending Processes: ${stats.pending}`,
        `Processed Processes: ${stats.processed}`,
        `Processing Processes: ${stats.processing}`
      ];
      
      statsText.forEach((text, index) => {
        doc.text(text, 15, 48 + (index * 8));
      });

      // Table - Use autoTable as a function instead of assigning to doc
      if (data.length > 0) {
        autoTable(doc, {
          startY: 80,
          head: [headers],
          body: data,
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 40 },
            2: { cellWidth: 20 },
            3: { cellWidth: 30 },
            4: { cellWidth: 35 },
            5: { cellWidth: 30 }
          }
        });
      } else {
        doc.text('No data available', 15, 80);
      }

      doc.save(`${title.replace(/\s+/g, '_')}_${generatedDate.replace(/[:]/g, '-')}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error('Failed to generate PDF: ' + error.message);
    }
  };

  return {
    generatePDF,
    stats: {
      totalProcesses,
      pendingProcesses,
      processedProcesses,
      processingProcesses
    }
  };
};

export default WorkOrderPDFHandler;