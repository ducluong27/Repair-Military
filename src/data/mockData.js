// ============================================================
// MOCK DATA + LOCALSTORAGE HELPERS
// Hệ thống Điều hành Nhà máy Sửa chữa Ô tô Quân sự (MARS-MES)
// ============================================================

const LS_KEY = 'mars_mes_db_v1';

// --------- 9 Công đoạn công nghệ chuẩn ---------
export const PROCESS_STAGES = [
  { id: 1, code: 'TN', name: 'Tiếp nhận', shortName: 'Tiếp nhận' },
  { id: 2, code: 'TR', name: 'Tháo rã',   shortName: 'Tháo rã' },
  { id: 3, code: 'LS', name: 'Làm sạch',  shortName: 'Làm sạch' },
  { id: 4, code: 'KT', name: 'Kiểm tra',  shortName: 'Kiểm tra' },
  { id: 5, code: 'GC', name: 'Gia công phục hồi', shortName: 'Gia công' },
  { id: 6, code: 'LR', name: 'Lắp ráp',   shortName: 'Lắp ráp' },
  { id: 7, code: 'CR', name: 'Chạy rã',   shortName: 'Chạy rã' },
  { id: 8, code: 'BT', name: 'Bệ thử',    shortName: 'Bệ thử' },
  { id: 9, code: 'NT', name: 'Nghiệm thu',shortName: 'Nghiệm thu' },
];

export const WORK_STATUS = [
  { key: 'pending',  label: 'Chưa thực hiện', color: 'bg-slate-200 text-slate-700' },
  { key: 'doing',    label: 'Đang thực hiện', color: 'bg-blue-100 text-blue-800' },
  { key: 'awaiting', label: 'Chờ kiểm tra',   color: 'bg-amber-100 text-amber-800' },
  { key: 'done',     label: 'Hoàn thành',     color: 'bg-emerald-100 text-emerald-800' },
  { key: 'paused',   label: 'Tạm dừng',       color: 'bg-rose-100 text-rose-800' },
];

export const PRIORITY = [
  { key: 'low', label: 'Thấp',         color: 'bg-slate-200 text-slate-700' },
  { key: 'med', label: 'Trung bình',   color: 'bg-amber-100 text-amber-800' },
  { key: 'high',label: 'Khẩn cấp',     color: 'bg-rose-100 text-rose-800' },
];

export const ROLES = [
  { key: 'leader',   label: 'Lãnh đạo / Chỉ huy', desc: 'Xem Dashboard & Báo cáo' },
  { key: 'engineer', label: 'Kỹ thuật',           desc: 'Cập nhật kế hoạch, tiến độ' },
  { key: 'kcs',      label: 'KCS',                desc: 'Nhập đo kiểm, duyệt công đoạn' },
  { key: 'material', label: 'Vật tư',             desc: 'Nhập xuất kho, phụ tùng' },
  { key: 'admin',    label: 'Admin',              desc: 'Toàn quyền quản trị' },
];

// ---------- Tiêu chuẩn KCS (định mức) ----------
export const KCS_STANDARDS = {
  gap:        { label: 'Khe hở lắp ghép (mm)',  min: 0.02,  max: 0.08 },
  taper:      { label: 'Độ côn (mm)',           min: 0.00,  max: 0.05 },
  oval:       { label: 'Độ ôvan (mm)',          min: 0.00,  max: 0.04 },
  pressure:   { label: 'Áp suất nén (bar)',     min: 28,    max: 35 },
  temperature:{ label: 'Nhiệt độ làm việc (°C)',min: 80,    max: 105 },
  roughness:  { label: 'Độ nhám bề mặt Ra (μm)',min: 0.4,   max: 1.6 },
  dimension:  { label: 'Kích thước chi tiết (mm)', min: 49.95, max: 50.05 }
};

// --------- DỮ LIỆU MẪU ----------
const seed = () => ({
  users: [
    { id: 'U001', name: 'Đại tá Nguyễn Văn An',  role: 'leader',   unit: 'Ban Giám đốc Nhà máy', status: 'active' },
    { id: 'U002', name: 'Thượng úy Trần Đức Bình',role: 'engineer', unit: 'Phòng Kỹ thuật',       status: 'active' },
    { id: 'U003', name: 'Đại úy Lê Văn Cường',    role: 'kcs',      unit: 'Phòng KCS',            status: 'active' },
    { id: 'U004', name: 'Trung úy Phạm Thị Duyên',role: 'material', unit: 'Kho Vật tư',           status: 'active' },
    { id: 'U005', name: 'Đại úy Đỗ Đình Đạt',role:'admin',    unit: 'Trung tâm CNTT',       status: 'active' },
    { id: 'U006', name: 'Thiếu úy Vũ Quang Huy',  role: 'engineer', unit: 'Tổ Lắp ráp',           status: 'active' },
  ],

  vehicles: [
    { id: 'XE-001', qr:'QRX001', model:'Ural-4320', chassis:'URL432081290', engineNo:'YAMZ-238-77881', unit:'Sư đoàn 308',  km: 145200, initStatus:'Hư hộp số, kẹt côn', receivedAt:'2026-05-12', dossierStatus:'Đang sửa', currentStage: 4 },
    { id: 'XE-002', qr:'QRX002', model:'Kamaz-43114',chassis:'KMZ431142210',engineNo:'KAMAZ-740-11023',unit:'Lữ đoàn 144',   km: 98750,  initStatus:'Đại tu định kỳ',     receivedAt:'2026-04-28', dossierStatus:'Đang sửa', currentStage: 6 },
    { id: 'XE-003', qr:'QRX003', model:'Zil-131',    chassis:'ZIL131778820', engineNo:'ZIL-131-22934',  unit:'Trung đoàn 102',km:215430, initStatus:'Hư động cơ',        receivedAt:'2026-05-20', dossierStatus:'Đang sửa', currentStage: 2 },
    { id: 'XE-004', qr:'QRX004', model:'Gaz-66',     chassis:'GAZ66112233',  engineNo:'ZMZ-513-66801',  unit:'Sư đoàn 312',  km: 67200,  initStatus:'Phanh không ăn',     receivedAt:'2026-05-30', dossierStatus:'Đang sửa', currentStage: 1 },
    { id: 'XE-005', qr:'QRX005', model:'Ural-4320',  chassis:'URL432089912', engineNo:'YAMZ-238-77998',  unit:'Lữ đoàn 273',  km: 178900, initStatus:'Khói đen, yếu công suất', receivedAt:'2026-05-08', dossierStatus:'Chờ nghiệm thu', currentStage: 9 },
    { id: 'XE-006', qr:'QRX006', model:'Kamaz-43114',chassis:'KMZ431146789', engineNo:'KAMAZ-740-11456', unit:'Sư đoàn 308',  km: 122100, initStatus:'Bảo dưỡng cấp II',  receivedAt:'2026-06-01', dossierStatus:'Đang sửa', currentStage: 3 },
    { id: 'XE-007', qr:'QRX007', model:'Hyundai HD120',chassis:'HD12044578', engineNo:'D6AB-44120',     unit:'Quân khu 4',   km: 56700,  initStatus:'Nâng cấp thùng',    receivedAt:'2026-05-25', dossierStatus:'Đang sửa', currentStage: 5 },
    { id: 'XE-008', qr:'QRX008', model:'Ural-4320',  chassis:'URL432087712', engineNo:'YAMZ-238-77723', unit:'Lữ đoàn 144',  km: 188300, initStatus:'Tai nạn nhẹ, móp đầu', receivedAt:'2026-04-15', dossierStatus:'Hoàn thành', currentStage: 9 },
  ],

  engines: [
    { id: 'DC-001', qr:'QRE001', model:'YAMZ-238', serial:'YAMZ238-99812', vehicleRef:'XE-001', unit:'Sư đoàn 308', initStatus:'Cong tay biên', receivedAt:'2026-05-12', dossierStatus:'Đang sửa', currentStage:4 },
    { id: 'DC-002', qr:'QRE002', model:'KAMAZ-740',serial:'KMZ740-77123',  vehicleRef:'XE-002', unit:'Lữ đoàn 144',  initStatus:'Mòn xéc-măng',  receivedAt:'2026-04-28', dossierStatus:'Đang sửa', currentStage:6 },
    { id: 'DC-003', qr:'QRE003', model:'ZIL-131',  serial:'ZIL131-22221',  vehicleRef:'XE-003', unit:'Trung đoàn 102',initStatus:'Lọt khí buồng đốt',receivedAt:'2026-05-21', dossierStatus:'Đang sửa', currentStage:3 },
    { id: 'DC-004', qr:'QRE004', model:'D6AB',     serial:'D6AB-441120',   vehicleRef:'XE-007', unit:'Quân khu 4',   initStatus:'Kiểm tra hiệu suất',receivedAt:'2026-05-26', dossierStatus:'Đang sửa', currentStage:5 },
    { id: 'DC-005', qr:'QRE005', model:'YAMZ-238', serial:'YAMZ238-77723', vehicleRef:'XE-008', unit:'Lữ đoàn 144',  initStatus:'Đại tu hoàn toàn',  receivedAt:'2026-04-15', dossierStatus:'Hoàn thành',currentStage:9 },
  ],

  // Kế hoạch công việc - cho phép xem theo ngày/tuần/tháng
  plans: [
    { id:'KH-001', task:'Đại tu động cơ YAMZ-238',     vehicleId:'XE-001', stage:5, assignee:'Thượng úy Trần Đức Bình', equipment:'Máy doa K-15', startDate:'2026-06-04', dueDate:'2026-06-08', actualEnd:'', priority:'high',  status:'doing' },
    { id:'KH-002', task:'Lắp ráp hộp số Kamaz',        vehicleId:'XE-002', stage:6, assignee:'Thiếu úy Vũ Quang Huy', equipment:'Cẩu trục 5 tấn', startDate:'2026-06-05', dueDate:'2026-06-07', actualEnd:'', priority:'med',   status:'doing' },
    { id:'KH-003', task:'Tháo rã động cơ ZIL-131',     vehicleId:'XE-003', stage:2, assignee:'Thiếu úy Vũ Quang Huy', equipment:'Bộ cờ-lê chuyên dụng', startDate:'2026-06-02', dueDate:'2026-06-04', actualEnd:'', priority:'med',  status:'awaiting' },
    { id:'KH-004', task:'Tiếp nhận, lập hồ sơ Gaz-66', vehicleId:'XE-004', stage:1, assignee:'Đại úy Lê Văn Cường', equipment:'Bàn nâng kiểm tra', startDate:'2026-06-06', dueDate:'2026-06-06', actualEnd:'', priority:'low',   status:'pending' },
    { id:'KH-005', task:'Chạy rà động cơ Ural-4320',   vehicleId:'XE-005', stage:7, assignee:'Thượng úy Trần Đức Bình', equipment:'Bệ thử động lực DT-200', startDate:'2026-06-03', dueDate:'2026-06-05', actualEnd:'2026-06-05', priority:'high', status:'done' },
    { id:'KH-006', task:'Làm sạch khoang động cơ Kamaz',vehicleId:'XE-006',stage:3, assignee:'Trung úy Phạm Thị Duyên', equipment:'Máy phun rửa áp lực', startDate:'2026-06-06', dueDate:'2026-06-07', actualEnd:'', priority:'low',  status:'doing' },
    { id:'KH-007', task:'Gia công phục hồi Piston HD120', vehicleId:'XE-007', stage:5, assignee:'Thượng úy Trần Đức Bình', equipment:'Máy mài tròn ngoài', startDate:'2026-06-05', dueDate:'2026-06-09', actualEnd:'', priority:'high', status:'paused' },
    { id:'KH-008', task:'Nghiệm thu xuất xưởng XE-008',vehicleId:'XE-008', stage:9, assignee:'Đại tá Nguyễn Văn An', equipment:'Bộ kiểm định thủ công', startDate:'2026-06-02', dueDate:'2026-06-02', actualEnd:'2026-06-02', priority:'med', status:'done' },
  ],

  // Trạng thái 9 công đoạn cho mỗi xe (key = vehicleId)
  processFlow: {
    'XE-001': [
      { stage:1, progress:100, status:'done',     assignee:'Đại úy Lê Văn Cường', equipment:'Bàn nâng', time:'2026-05-12', approvedKCS:true },
      { stage:2, progress:100, status:'done',     assignee:'Thiếu úy Vũ Quang Huy',equipment:'Cờ-lê chuyên dụng', time:'2026-05-14', approvedKCS:true },
      { stage:3, progress:100, status:'done',     assignee:'Trung úy Phạm Thị Duyên',equipment:'Máy phun rửa', time:'2026-05-16', approvedKCS:true },
      { stage:4, progress:65,  status:'doing',    assignee:'Đại úy Lê Văn Cường', equipment:'Thước cặp, panme', time:'2026-05-20', approvedKCS:false },
      { stage:5, progress:0,   status:'pending',  assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:6, progress:0,   status:'pending',  assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:7, progress:0,   status:'pending',  assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:8, progress:0,   status:'pending',  assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:9, progress:0,   status:'pending',  assignee:'-', equipment:'-', time:'-', approvedKCS:false },
    ],
    'XE-002': [
      { stage:1, progress:100, status:'done', assignee:'Đại úy Lê Văn Cường', equipment:'Bàn nâng', time:'2026-04-28', approvedKCS:true },
      { stage:2, progress:100, status:'done', assignee:'Thiếu úy Vũ Quang Huy',equipment:'Cờ-lê', time:'2026-04-30', approvedKCS:true },
      { stage:3, progress:100, status:'done', assignee:'Trung úy Phạm Thị Duyên',equipment:'Máy phun rửa', time:'2026-05-02', approvedKCS:true },
      { stage:4, progress:100, status:'done', assignee:'Đại úy Lê Văn Cường', equipment:'Panme', time:'2026-05-06', approvedKCS:true },
      { stage:5, progress:100, status:'done', assignee:'Thượng úy Trần Đức Bình',equipment:'Máy doa', time:'2026-05-20', approvedKCS:true },
      { stage:6, progress:55,  status:'doing',assignee:'Thiếu úy Vũ Quang Huy',equipment:'Cẩu trục 5 tấn', time:'2026-06-05', approvedKCS:false },
      { stage:7, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:8, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:9, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
    ],
    'XE-003': [
      { stage:1, progress:100, status:'done', assignee:'Đại úy Lê Văn Cường', equipment:'Bàn nâng', time:'2026-05-20', approvedKCS:true },
      { stage:2, progress:40,  status:'doing',assignee:'Thiếu úy Vũ Quang Huy',equipment:'Cờ-lê', time:'2026-06-02', approvedKCS:false },
      { stage:3, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:4, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:5, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:6, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:7, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:8, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:9, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
    ],
    'XE-004': [
      { stage:1, progress:20,  status:'doing',assignee:'Đại úy Lê Văn Cường', equipment:'Bàn nâng', time:'2026-06-06', approvedKCS:false },
      { stage:2, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:3, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:4, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:5, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:6, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:7, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:8, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:9, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
    ],
    'XE-005': [
      { stage:1, progress:100, status:'done', assignee:'Đại úy Lê Văn Cường', equipment:'Bàn nâng', time:'2026-05-08', approvedKCS:true },
      { stage:2, progress:100, status:'done', assignee:'Thiếu úy Vũ Quang Huy',equipment:'Cờ-lê', time:'2026-05-10', approvedKCS:true },
      { stage:3, progress:100, status:'done', assignee:'Trung úy Phạm Thị Duyên',equipment:'Máy phun rửa', time:'2026-05-12', approvedKCS:true },
      { stage:4, progress:100, status:'done', assignee:'Đại úy Lê Văn Cường', equipment:'Panme', time:'2026-05-16', approvedKCS:true },
      { stage:5, progress:100, status:'done', assignee:'Thượng úy Trần Đức Bình',equipment:'Máy doa', time:'2026-05-26', approvedKCS:true },
      { stage:6, progress:100, status:'done', assignee:'Thiếu úy Vũ Quang Huy',equipment:'Cẩu trục', time:'2026-05-30', approvedKCS:true },
      { stage:7, progress:100, status:'done', assignee:'Thượng úy Trần Đức Bình',equipment:'Bệ thử động lực DT-200', time:'2026-06-03', approvedKCS:true },
      { stage:8, progress:80,  status:'doing',assignee:'Đại úy Lê Văn Cường', equipment:'Bệ thử áp suất', time:'2026-06-05', approvedKCS:false },
      { stage:9, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
    ],
    'XE-006': [
      { stage:1, progress:100, status:'done', assignee:'Đại úy Lê Văn Cường', equipment:'Bàn nâng', time:'2026-06-01', approvedKCS:true },
      { stage:2, progress:100, status:'done', assignee:'Thiếu úy Vũ Quang Huy',equipment:'Cờ-lê', time:'2026-06-03', approvedKCS:true },
      { stage:3, progress:55,  status:'doing',assignee:'Trung úy Phạm Thị Duyên',equipment:'Máy phun rửa', time:'2026-06-06', approvedKCS:false },
      { stage:4, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:5, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:6, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:7, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:8, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:9, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
    ],
    'XE-007': [
      { stage:1, progress:100, status:'done', assignee:'Đại úy Lê Văn Cường', equipment:'Bàn nâng', time:'2026-05-25', approvedKCS:true },
      { stage:2, progress:100, status:'done', assignee:'Thiếu úy Vũ Quang Huy',equipment:'Cờ-lê', time:'2026-05-27', approvedKCS:true },
      { stage:3, progress:100, status:'done', assignee:'Trung úy Phạm Thị Duyên',equipment:'Máy phun rửa', time:'2026-05-29', approvedKCS:true },
      { stage:4, progress:100, status:'done', assignee:'Đại úy Lê Văn Cường', equipment:'Panme', time:'2026-06-02', approvedKCS:true },
      { stage:5, progress:40,  status:'paused',assignee:'Thượng úy Trần Đức Bình', equipment:'Máy mài tròn ngoài', time:'2026-06-05', approvedKCS:false },
      { stage:6, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:7, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:8, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
      { stage:9, progress:0,   status:'pending',assignee:'-', equipment:'-', time:'-', approvedKCS:false },
    ],
    'XE-008': [
      { stage:1, progress:100, status:'done', assignee:'Đại úy Lê Văn Cường', equipment:'Bàn nâng', time:'2026-04-15', approvedKCS:true },
      { stage:2, progress:100, status:'done', assignee:'Thiếu úy Vũ Quang Huy',equipment:'Cờ-lê', time:'2026-04-17', approvedKCS:true },
      { stage:3, progress:100, status:'done', assignee:'Trung úy Phạm Thị Duyên',equipment:'Máy phun rửa', time:'2026-04-19', approvedKCS:true },
      { stage:4, progress:100, status:'done', assignee:'Đại úy Lê Văn Cường', equipment:'Panme', time:'2026-04-23', approvedKCS:true },
      { stage:5, progress:100, status:'done', assignee:'Thượng úy Trần Đức Bình',equipment:'Máy doa', time:'2026-05-05', approvedKCS:true },
      { stage:6, progress:100, status:'done', assignee:'Thiếu úy Vũ Quang Huy',equipment:'Cẩu trục', time:'2026-05-12', approvedKCS:true },
      { stage:7, progress:100, status:'done', assignee:'Thượng úy Trần Đức Bình',equipment:'Bệ thử động lực', time:'2026-05-22', approvedKCS:true },
      { stage:8, progress:100, status:'done', assignee:'Đại úy Lê Văn Cường', equipment:'Bệ thử áp suất', time:'2026-05-30', approvedKCS:true },
      { stage:9, progress:100, status:'done', assignee:'Đại tá Nguyễn Văn An', equipment:'Bộ kiểm định', time:'2026-06-02', approvedKCS:true },
    ],
  },

  // Kết quả đo kiểm KCS
  kcsResults: [
    { id:'KCS-001', vehicleId:'XE-008', stage:9, date:'2026-06-02', inspector:'Đại úy Lê Văn Cường',
      readings:{ gap:0.04, taper:0.02, oval:0.01, pressure:32, temperature:92, roughness:0.8, dimension:50.01 },
      verdict:'pass', note:'Đạt toàn bộ tiêu chuẩn xuất xưởng' },
    { id:'KCS-002', vehicleId:'XE-005', stage:7, date:'2026-06-03', inspector:'Đại úy Lê Văn Cường',
      readings:{ gap:0.05, taper:0.03, oval:0.02, pressure:30, temperature:95, roughness:1.0, dimension:50.00 },
      verdict:'pass', note:'Chạy rà ổn định, không rung giật' },
    { id:'KCS-003', vehicleId:'XE-002', stage:5, date:'2026-05-20', inspector:'Đại úy Lê Văn Cường',
      readings:{ gap:0.06, taper:0.04, oval:0.03, pressure:31, temperature:98, roughness:1.2, dimension:50.02 },
      verdict:'pass', note:'Gia công cổ trục đạt' },
  ],

  // Vật tư – Phụ tùng
  inventory: [
    { id:'VT-001', name:'Piston YAMZ-238', code:'PIS-YMZ238', qty: 12, min: 8,  unit:'cái',  supplier:'Cty CP Phụ tùng Quân đội', lastIO:'2026-05-25' },
    { id:'VT-002', name:'Xéc-măng Kamaz-740', code:'SEG-KMZ740', qty: 3, min: 6,  unit:'bộ',  supplier:'Đối tác Liên bang Nga',   lastIO:'2026-06-01' },
    { id:'VT-003', name:'Gioăng cao su nắp máy', code:'GSK-RUB-01', qty: 25, min: 10, unit:'cái', supplier:'Cty TNHH Cao su Đà Nẵng', lastIO:'2026-05-28' },
    { id:'VT-004', name:'Lọc dầu YAMZ',          code:'OIL-FLT-YMZ', qty: 4, min: 8, unit:'cái', supplier:'Cty CP Phụ tùng Quân đội', lastIO:'2026-06-04' },
    { id:'VT-005', name:'Bạc lót trục khuỷu Kamaz', code:'BRG-KMZ-CR', qty: 16, min: 6, unit:'bộ', supplier:'Đối tác Liên bang Nga',   lastIO:'2026-05-30' },
    { id:'VT-006', name:'Bộ phớt chắn dầu',       code:'SEAL-OIL-01', qty: 42, min: 15,unit:'cái', supplier:'Cty TNHH Cao su Đà Nẵng', lastIO:'2026-06-03' },
    { id:'VT-007', name:'Bugi sấy ZIL-131',       code:'GLO-ZIL131',  qty: 7, min: 12, unit:'cái', supplier:'Cty CP Phụ tùng Quân đội',lastIO:'2026-06-02' },
    { id:'VT-008', name:'Bơm cao áp Hyundai HD',  code:'INJ-PMP-HD',  qty: 2, min: 2,  unit:'cái', supplier:'Hyundai Mobis Vietnam',   lastIO:'2026-05-22' },
    { id:'VT-009', name:'Dầu nhớt động cơ 15W-40',code:'OIL-15W40',   qty:120, min: 50, unit:'lít', supplier:'Petrolimex',             lastIO:'2026-06-05' },
  ],

  // Lịch sử nhập – xuất kho
  inventoryLog: [
    { id:'IO-001', itemId:'VT-001', type:'out', qty:2, date:'2026-05-25', user:'Trung úy Phạm Thị Duyên', ref:'Cấp cho XE-001' },
    { id:'IO-002', itemId:'VT-003', type:'in',  qty:30,date:'2026-05-28', user:'Trung úy Phạm Thị Duyên', ref:'Nhập kho NCC Đà Nẵng' },
    { id:'IO-003', itemId:'VT-002', type:'out', qty:3, date:'2026-06-01', user:'Trung úy Phạm Thị Duyên', ref:'Cấp cho XE-002' },
    { id:'IO-004', itemId:'VT-009', type:'in',  qty:200,date:'2026-06-05', user:'Trung úy Phạm Thị Duyên', ref:'Nhập kho Petrolimex' },
  ],

  // Lịch sử sửa chữa (cho hồ sơ điện tử)
  repairHistory: [
    { vehicleId:'XE-001', date:'2024-08-12', work:'Đại tu cấp III', parts:['Piston YAMZ-238 (4)','Gioăng nắp máy (1)'], result:'Đạt' },
    { vehicleId:'XE-001', date:'2025-03-20', work:'Bảo dưỡng cấp II', parts:['Lọc dầu (2)','Dầu nhớt (12L)'], result:'Đạt' },
    { vehicleId:'XE-002', date:'2024-11-05', work:'Đại tu hộp số', parts:['Bạc đạn hộp số (2)','Dầu nhớt (8L)'], result:'Đạt' },
    { vehicleId:'XE-005', date:'2024-05-18', work:'Sửa chữa cấp I',  parts:['Lọc gió','Bugi sấy (8)'], result:'Đạt' },
    { vehicleId:'XE-008', date:'2025-09-20', work:'Sửa chữa định kỳ',parts:['Phớt chắn dầu','Lọc nhiên liệu'], result:'Đạt' },
  ],

  // Nhật ký hệ thống
  activityLog: [
    { id:'LOG-001', date:'2026-06-06 08:15', user:'Thượng úy Trần Đức Bình', action:'Cập nhật tiến độ XE-001 công đoạn Kiểm tra (65%)' },
    { id:'LOG-002', date:'2026-06-06 09:02', user:'Đại úy Lê Văn Cường', action:'Phê duyệt KCS công đoạn Chạy rã - XE-005' },
    { id:'LOG-003', date:'2026-06-06 09:45', user:'Trung úy Phạm Thị Duyên', action:'Xuất kho 3 bộ xéc-măng Kamaz-740' },
    { id:'LOG-004', date:'2026-06-06 10:30', user:'Trung tá Hoàng Minh Quân', action:'Cấp tài khoản mới: Thiếu úy Vũ Quang Huy' },
    { id:'LOG-005', date:'2026-06-06 11:10', user:'Đại tá Nguyễn Văn An', action:'Xem báo cáo tổng hợp tháng 5/2026' },
  ],
});

// ---------- LocalStorage helpers ----------
export function loadDB() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      const data = seed();
      localStorage.setItem(LS_KEY, JSON.stringify(data));
      return data;
    }
    return JSON.parse(raw);
  } catch (e) {
    const data = seed();
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    return data;
  }
}

export function saveDB(db) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

export function resetDB() {
  const data = seed();
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  return data;
}

// ID generator
export const genId = (prefix='ID') =>
  `${prefix}-${Math.floor(100 + Math.random() * 900)}${Date.now().toString().slice(-3)}`;

// Định dạng ngày VN
export const fmtDate = (d) => {
  if (!d) return '-';
  try {
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString('vi-VN');
  } catch { return d; }
};
