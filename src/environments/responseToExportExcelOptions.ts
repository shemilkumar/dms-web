// types (adjust or import if you already have these defined)
type PackageRow = {
    slNo?: number;
    description?: string;
    specification?: string;
    moc?: string;
    quantity?: number | string;
    dispatchedStickers?: number | string;
    uom?: string;
    remarks?: string;
};

type ExportOptions = {
    packageListData: PackageRow[];
    meta?: {
        companyName?: string;
        companyAddress?: string;
        companyLogoDataUri?: string;
        showHeaderFooter?: boolean;
    };
    invoice?: {
        invoiceNo?: string;
        invoiceDate?: string | null;
    };
    customer?: {
        title?: string;
        address?: string;
    };
    poDetails?: {
        poNo?: string;
        vehicleNo?: string;
    };
    fileName?: string;
};

// helper: format epoch (ms or seconds) or ISO string -> dd/mm/yyyy
function formatDateToDDMMYYYY(value: number | string | null | undefined): string | null {
    if (value === null || typeof value === 'undefined' || value === '') return null;

    // if number — may be seconds (10 digits) or ms (13 digits)
    if (typeof value === 'number') {
        let ms = value;
        if (String(value).length === 10) ms = value * 1000;
        const d = new Date(ms);
        if (isNaN(d.getTime())) return null;
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    // if string: try parse as ISO or numeric
    const asNumber = Number(value);
    if (!isNaN(asNumber) && value.trim() !== '') {
        return formatDateToDDMMYYYY(asNumber);
    }

    const d = new Date(String(value));
    if (isNaN(d.getTime())) return null;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

/**
 * Convert API response to ExportOptions
 * @param apiResponse — object exactly like the backend response you posted
 * @param opts.fileName (optional) prefered filename
 */
function apiResponseToExportOptions(apiResponse: any, opts?: { fileName?: string; companyLogoDataUri?: string; showHeaderFooter?: boolean }): ExportOptions {
    const data = apiResponse?.data ?? {};

    // package_list → packageListData
    const packageList: any[] = Array.isArray(data.package_list) ? data.package_list : [];

    const packageListData: PackageRow[] = packageList.map((r, idx) => ({
        slNo: idx + 1,
        description: r.description ?? '',
        specification: r.specification ?? '',
        moc: r.moc ?? '',
        quantity: typeof r.quantity !== 'undefined' ? r.quantity : '',
        dispatchedStickers: typeof r.dispatched_stickers !== 'undefined' ? r.dispatched_stickers : '',
        uom: r.uom ?? '',
        remarks: r.remarks ?? r.remark ?? '', // fallback if backend uses different key
    }));

    // project_details → supplier/company + customer
    const proj = data.project_details ?? {};

    const companyName = proj.supplier_name ?? proj.companyName ?? '';
    // supplier_address might contain newlines; keep as-is
    const companyAddress = proj.supplier_address ?? proj.supplierAddress ?? '';
    const customerTitle = proj.customer_name ?? proj.client_name ?? '';
    const customerAddress = proj.customer_address ?? proj.customerAddress ?? '';

    // box_details → invoice/po/vehicle
    const box = data.box_details ?? {};

    const invoiceNo = box.invoice_no ?? box.invoiceNo ?? '';
    const invoiceDateRaw = box.invoice_date ?? box.invoiceDate ?? null;
    const invoiceDate = formatDateToDDMMYYYY(invoiceDateRaw);

    const poNo = box.po_no ?? box.poNo ?? '';
    const vehicleNo = box.vehicle_no ?? box.vehicleNo ?? '';

    // filename
    const fileName = opts?.fileName ?? `package-list-${new Date().toISOString().slice(0, 10)}.xlsx`;

    // company logo if provided via opts or backend (not present in your sample; fallback to empty)
    const companyLogoDataUri = opts?.companyLogoDataUri ?? '';

    const showHeaderFooter = typeof opts?.showHeaderFooter === 'boolean' ? opts!.showHeaderFooter : true;

    const exportOptions: ExportOptions = {
        packageListData,
        meta: {
            companyName,
            companyAddress,
            companyLogoDataUri,
            showHeaderFooter,
        },
        invoice: {
            invoiceNo,
            invoiceDate,
        },
        customer: {
            title: customerTitle,
            address: customerAddress,
        },
        poDetails: {
            poNo,
            vehicleNo,
        },
        fileName,
    };

    return exportOptions;
}

/* ---------- Example usage with your provided API response ---------- */

// Suppose `apiResp` is the object you showed in the prompt

// const options = apiResponseToExportOptions(apiResp, {
//     fileName: 'package-list-example.xlsx',
//     // companyLogoDataUri: logoBase64 if you have one
// });

// console.log('ExportOptions ready:', options);

/* Expected result (structure):
{
  packageListData: [
    { slNo: 1, description: 'Bend 45°', specification: 'Ø100_R150_1thk', moc: 'GI', quantity: 12, uom: 'NOS', remarks: '' },
    { slNo: 2, description: 'Air Controller', specification: 'Ø250_200H_1thk', moc: 'GI', quantity: 4, uom: 'NOS', remarks: '' }
  ],
  meta: { companyName: '', companyAddress: '', companyLogoDataUri: '', showHeaderFooter: true },
  invoice: { invoiceNo: '', invoiceDate: null },
  customer: { title: '', address: '' },
  poDetails: { poNo: '', vehicleNo: '' },
  fileName: 'package-list-example.xlsx'
}
*/

export { apiResponseToExportOptions, ExportOptions, PackageRow };
