/* =========================================================================
   CẤU HÌNH SHOP  —  Sửa file này là xong, không cần đụng vào code khác.
   ========================================================================= */

window.SHOP_CONFIG = {
  // Tên hiển thị trên logo (viết thường cho giống phong cách tối giản)
  name: "PAST OR PASS",

  // Câu mô tả ngắn dưới logo (để trống "" nếu không muốn hiện)
  tagline: "CŨ NGƯỜI · THÀNH CỦA NGƯỜI TA",

  // Liên hệ chốt đơn (hiện ở màn hình thanh toán)
  contact: {
    zalo: "0902 35 2108",        // số Zalo / điện thoại
    instagram: "nnhanlee",             // ví dụ "tiemdocu" (không cần @), để trống nếu không có
  },

  // ---- THANH TOÁN: CHUYỂN KHOẢN QR (VietQR) ----
  // Đây là cách nhanh nhất, miễn phí, chỉ cần 1 tài khoản ngân hàng.
  // Khách quét QR bằng app ngân hàng HOẶC MoMo là tiền tự điền sẵn số & nội dung.
  bank: {
    // Mã ngân hàng theo VietQR. Một số mã hay dùng:
    // Vietcombank: "VCB" | Techcombank: "TCB" | MB Bank: "MB" | ACB: "ACB"
    // BIDV: "BIDV" | VietinBank: "ICB" | VPBank: "VPB" | Sacombank: "STB"
    // Agribank: "VBA" | TPBank: "TPB" | OCB: "OCB" | VIB: "VIB"
    bankCode: "TECHCOMBANK",
    accountNumber: "2250686868",
    accountName: "LE DUC MINH NHAN",   // viết HOA không dấu
  },

  // ---- MOMO (tùy chọn) ----
  // Số điện thoại đăng ký MoMo. Để trống "" nếu không dùng.
  momo: {
    phone: "0902352108",
    name: "LE DUC MINH NHAN",
  },

  // Phí ship cố định (đồng). Đặt 0 nếu freeship hoặc tính sau.
  shippingFee: 35000,
};
