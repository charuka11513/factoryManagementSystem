import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PdfGenerator {
  static generatePdf = (data, title, headers, numberOfItems, generatedDate) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Number of Appoinmet: ${numberOfItems}`, 10, 20);
    doc.text(`Generated on: ${generatedDate}`, 10, 25);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
    });

    doc.save(`${title}.pdf`);
  };
}

export default PdfGenerator;
