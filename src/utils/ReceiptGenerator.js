import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const generateReceipt = (payment) => {
    console.log('--- Generating Premium Academic Invoice v3 ---');

    try {
        const doc = new jsPDF();
        const campusName = payment.students?.campuses?.name || 'MINDMOVER ACADEMY';
        const student = payment.students || {};

        // --- Color Palette ---
        const primaryBlue = [0, 109, 255]; // Brand Blue (#006dff)
        const textMain = [30, 41, 59]; // Deep Slate (#1e293b)
        const textMuted = [100, 116, 139]; // Slate (#64748b)
        const bgLight = [248, 250, 252]; // Soft Gray (#f1f5f9)

        // --- 1. Background & Modern Header ---
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');

        // Top Header Section
        doc.setFillColor(...bgLight);
        doc.rect(0, 0, 210, 60, 'F');
        doc.setFillColor(...primaryBlue);
        doc.rect(0, 0, 210, 4, 'F');

        // Stylized Academic Logo
        const logoX = 20;
        const logoY = 25;
        doc.setFillColor(...primaryBlue);
        doc.rect(logoX, logoY, 12, 8, 'F');
        doc.triangle(logoX - 4, logoY + 4, logoX + 16, logoY + 4, logoX + 6, logoY - 4, 'F');

        doc.setTextColor(...primaryBlue);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text(campusName.toUpperCase(), 40, 30);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(148, 163, 184);
        doc.text('OFFICIAL ACADEMIC RECORD & RECEIPT', 40, 36);

        // Header Right: Invoice Summary
        doc.setTextColor(...textMain);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Reference:`, 190, 25, { align: 'right' });
        doc.setFont('helvetica', 'bold');
        doc.text(`INV-${String(payment.id || '001').toUpperCase().slice(0, 8)}`, 190, 30, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.text(`${format(new Date(payment.created_at || new Date()), 'dd MMM yyyy')}`, 190, 36, { align: 'right' });

        // --- 2. Information Blocks ---
        const startY = 80;

        // Student Detail Block
        doc.setFillColor(...bgLight);
        doc.roundedRect(20, startY, 80, 45, 2, 2, 'F');

        doc.setTextColor(...primaryBlue);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('STUDENT INFORMATION', 25, startY + 10);

        doc.setTextColor(...textMain);
        doc.setFontSize(11);
        doc.text(student.full_name || 'Anonymous Student', 25, startY + 20);

        doc.setTextColor(...textMuted);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Email: ${student.email || 'N/A'}`, 25, startY + 28);
        doc.text(`Campus: ${campusName}`, 25, startY + 34);
        doc.text(`ID: PID-${String(student.id || '000').slice(0, 6)}`, 25, startY + 40);

        // Transaction Block
        doc.setFillColor(...bgLight);
        doc.roundedRect(110, startY, 80, 45, 2, 2, 'F');

        doc.setTextColor(...primaryBlue);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('TRANSACTION DETAILS', 115, startY + 10);

        doc.setTextColor(...textMain);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Method: ${payment.method || 'Standard Deposit'}`, 115, startY + 20);
        doc.text(`Currency: Sri Lankan Rupee (LKR)`, 115, startY + 26);
        doc.text(`Status: Verified & Cleared`, 115, startY + 32);

        // Success Indicator
        doc.setFillColor(34, 197, 94);
        doc.circle(118, startY + 39, 2.5, 'F');
        doc.setTextColor(22, 101, 52);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('GENUINE TRANSACTION', 123, startY + 40);

        // --- 3. Itemized Charges Table ---
        const tableData = [
            [
                '01',
                payment.note || 'Full Semester Tuition / Admission Fees',
                '1 Unit',
                `LKR ${Number(payment.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            ]
        ];

        autoTable(doc, {
            startY: 140,
            head: [['#', 'DESCRIPTION', 'QTY', 'AMOUNT']],
            body: tableData,
            theme: 'plain',
            headStyles: {
                textColor: [...textMuted],
                fontSize: 8,
                fontStyle: 'bold',
                fillColor: [255, 255, 255],
                cellPadding: 5
            },
            bodyStyles: {
                fontSize: 10,
                textColor: [...textMain],
                cellPadding: 10
            },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 110 },
                2: { cellWidth: 25 },
                3: { halign: 'right', fontStyle: 'bold' }
            },
            didDrawCell: (data) => {
                if (data.section === 'body') {
                    doc.setDrawColor(241, 245, 249);
                    doc.setLineWidth(0.1);
                    doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
                }
            }
        });

        // --- 4. Total Area ---
        const finalY = (doc.lastAutoTable?.finalY || 180) + 15;

        doc.setTextColor(148, 163, 184);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Subtotal:', 150, finalY);
        doc.text(`LKR ${Number(payment.amount || 0).toLocaleString()}`, 190, finalY, { align: 'right' });

        doc.text('Institutional Discount:', 150, finalY + 7);
        doc.text('LKR 0.00', 190, finalY + 7, { align: 'right' });

        doc.setFillColor(...primaryBlue);
        doc.rect(130, finalY + 12, 60, 15, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('NET TOTAL:', 135, finalY + 22);
        doc.setFontSize(11);
        doc.text(`LKR ${Number(payment.amount || 0).toLocaleString()}`, 185, finalY + 22, { align: 'right' });

        // --- 5. Footer Modernization ---
        const footerStartY = 245;

        // Security Placeholder
        doc.setDrawColor(241, 245, 249);
        doc.rect(20, footerStartY, 25, 25, 'D');
        doc.setTextColor(226, 232, 240);
        doc.setFontSize(6);
        doc.text('CODE AUTH', 25, footerStartY + 15);

        // Support Message
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('This is a computer-verified statement of account.', 55, footerStartY + 10);
        doc.text(`For any queries: support@${campusName.toLowerCase()}-academy.com`, 55, footerStartY + 16);

        // Academic Seal
        doc.setDrawColor(...primaryBlue);
        doc.setLineWidth(0.5);
        doc.circle(170, footerStartY + 12, 12, 'D');
        doc.setFontSize(5);
        doc.setTextColor(...primaryBlue);
        doc.setFont('helvetica', 'bold');
        doc.text('VERIFIED', 170, footerStartY + 11, { align: 'center' });
        doc.text('ACADEMIC', 170, footerStartY + 14, { align: 'center' });

        // Bottom Accent
        doc.setFillColor(...primaryBlue);
        doc.rect(0, 290, 210, 7, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.text(`${campusName.toUpperCase()} ACADEMY PORTAL | OFFICIAL RECORD`, 105, 295, { align: 'center' });

        // --- 6. Save ---
        const safeName = (student.full_name || 'Invoice').replace(/\s+/g, '_');
        doc.save(`${campusName}_INV_${safeName}.pdf`);

    } catch (err) {
        console.error('Receipt Generation Error:', err);
        alert('Receipt Generation Failed: ' + err.message);
    }
};
