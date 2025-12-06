import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ExamData } from "../types";

export const downloadPDF = async (data: ExamData, elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found");
    return;
  }

  try {
    // Generate filename: [WordCount]Date
    const filename = `[${data.meta.wordCount}]${data.meta.date}.pdf`;

    // High quality scale
    const scale = 2; 
    
    // Capture the DOM
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Initialize PDF (A4)
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Subsequent pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("PDF generation failed. Please check console for details.");
  }
};