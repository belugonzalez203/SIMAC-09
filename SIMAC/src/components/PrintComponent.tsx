import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import OrderToPrinted from '../views/OrderView/PrintView';
import { useParams } from 'react-router-dom';

const PrintOrder = () => {
    const { id } = useParams();
    const componentRef = useRef<HTMLDivElement>(null);
    const [isReadyToPrint, setIsReadyToPrint] = useState(false);

    useEffect(() => {
        if (isReadyToPrint && componentRef.current) {
            setTimeout(() => {
                html2canvas(componentRef.current!, { scale: 2 }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'px',
                        format: [canvas.width, canvas.height]
                    });

                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Orden_${id}.pdf`);
                    pdf.autoPrint();
                    window.open(pdf.output('bloburl'), '_blank');

                });
            }, 1000);
        }
    }, [isReadyToPrint, id]);

    const handleDataReady = () => {
        setIsReadyToPrint(true);
    };

    return (
        <div>
            <OrderToPrinted ref={componentRef} onReady={handleDataReady} />
        </div>
    );
};

export default PrintOrder;
