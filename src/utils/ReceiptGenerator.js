import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const generateReceipt = (payment) => {
    console.log('--- Generating Ultra-Modern Minimal Receipt ---');

    try {
        const doc = new jsPDF();
        const campusName = payment.students?.campuses?.name || 'NORTHEX CAMPUS';
        const student = payment.students || {};

        // --- Design Tokens (Soft Neutrals + Accent) ---
        const colors = {
            accent: [0, 109, 255],     // #006aff
            textDark: [15, 23, 42],    // #0f172a
            textMuted: [100, 116, 139], // #64748b
            neutralBg: [248, 250, 252], // #f8fafc
            border: [226, 232, 240]    // #e2e8f0
        };

        // --- 1. Header Section ---
        const isNorthex = campusName.toLowerCase().includes('northex');

        // Minimalist Logo (Left)
        doc.setFillColor(isNorthex ? 0 : 15, isNorthex ? 109 : 23, isNorthex ? 255 : 42);
        doc.roundedRect(20, 15, 12, 12, 3, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(isNorthex ? 'N' : 'U', 25, 23, { align: 'center' });

        // Institution Name (Right - Bold Modern Font)
        doc.setTextColor(...colors.textDark);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(campusName.toUpperCase(), 190, 24, { align: 'right' });

        // Thin Horizontal Divider
        doc.setDrawColor(...colors.border);
        doc.setLineWidth(0.2);
        doc.line(20, 35, 190, 35);

        // --- 2. Student Details (Rounded Container) ---
        const detailsY = 45;
        doc.setFillColor(...colors.neutralBg);
        doc.roundedRect(20, detailsY, 170, 42, 4, 4, 'F');

        doc.setTextColor(...colors.textMuted);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('STUDENT INFORMATION', 28, detailsY + 10);

        doc.setTextColor(...colors.textDark);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(student.full_name || 'N/A', 28, detailsY + 20);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.textMuted);
        doc.text(`${student.course || 'Independent Study'} Program`, 28, detailsY + 28);

        // Contact Row (Minimalist Icons representation)
        doc.setFontSize(8);
        doc.text(`Email: ${student.email || 'N/A'}`, 28, detailsY + 36);
        doc.text(`Phone: ${student.phone || 'N/A'}`, 100, detailsY + 36);

        // --- 3. Payment Items Table (Clean, Borderless) ---
        const tableStartY = 100;
        const subtotal = Number(payment.amount);

        autoTable(doc, {
            startY: tableStartY,
            head: [['Description / Fee Type', 'Price', 'Total']],
            body: [
                [
                    payment.note || 'Full Academic Tuition Payment',
                    `LKR ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                    `LKR ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                ]
            ],
            theme: 'plain',
            headStyles: {
                textColor: colors.textMuted,
                fontSize: 8,
                fontStyle: 'bold',
                fillColor: [255, 255, 255],
                cellPadding: { bottom: 5, top: 0, left: 0, right: 0 }
            },
            bodyStyles: {
                fontSize: 10,
                textColor: colors.textDark,
                cellPadding: { top: 8, bottom: 8, left: 0, right: 0 }
            },
            columnStyles: {
                0: { cellWidth: 110 },
                1: { halign: 'right' },
                2: { halign: 'right', fontStyle: 'bold' }
            },
            didDrawCell: (data) => {
                if (data.section === 'body') {
                    doc.setDrawColor(...colors.border);
                    doc.setLineWidth(0.1);
                    doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
                }
            }
        });

        // --- 4. Amount Summary (Right-Aligned Highlighted Box) ---
        const summaryY = doc.lastAutoTable.finalY + 15;

        // Highlight Box for Grand Total
        doc.setFillColor(...colors.neutralBg);
        doc.roundedRect(130, summaryY, 60, 25, 3, 3, 'F');

        doc.setTextColor(...colors.textMuted);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Subtotal:', 138, summaryY + 8);
        doc.text(`LKR ${subtotal.toLocaleString()}`, 182, summaryY + 8, { align: 'right' });

        doc.setTextColor(...colors.accent);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Grand Total:', 138, summaryY + 18);
        doc.setFontSize(12);
        doc.text(`LKR ${subtotal.toLocaleString()}`, 182, summaryY + 18, { align: 'right' });

        // --- 5. Payment Method & Transaction (Minimalist Section) ---
        const metaY = summaryY + 8;
        doc.setTextColor(...colors.textMuted);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('PAYMENT DETAILS', 20, metaY);

        doc.setTextColor(...colors.textDark);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Method: ${payment.method || 'Standard'}`, 20, metaY + 8);
        doc.text(`ID: TXN-${String(payment.id).padStart(6, '0')}`, 20, metaY + 15);
        doc.text(`Date: ${format(new Date(payment.created_at), 'dd MMM yyyy')}`, 20, metaY + 22);

        // --- 6. Footer ---
        const footerY = 270;
        doc.setDrawColor(...colors.border);
        doc.line(20, footerY, 190, footerY);

        doc.setTextColor(...colors.textMuted);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Thank you for your payment.', 105, footerY + 10, { align: 'center' });

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('This is a computer-generated receipt.', 105, footerY + 16, { align: 'center' });

        const safeName = (student.full_name || 'Receipt').replace(/\s+/g, '_');
        doc.save(`Receipt_Minimal_${safeName}.pdf`);

    } catch (err) {
        console.error('Minimal Receipt Generation Error:', err);
        alert('Could not generate minimal receipt: ' + err.message);
    }
};
