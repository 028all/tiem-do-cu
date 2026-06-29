# tiệm đồ cũ — web bán đồ cũ

Web tĩnh (HTML/CSS/JS thuần), không cần build, deploy thẳng lên **GitHub + Cloudflare Pages**
giống project portfolio của bạn.

## Cấu trúc

```
index.html        ← trang chính
config.js         ← TÊN SHOP + THÔNG TIN THANH TOÁN  (sửa ở đây)
products.js       ← DANH SÁCH SẢN PHẨM  (thêm/bớt món ở đây)
assets/
  styles.css      ← giao diện
  app.js          ← logic (lọc, giỏ hàng, thanh toán)
  img/            ← bỏ ảnh sản phẩm vào đây
```

## 1. Thêm sản phẩm

Mở `products.js`, copy một khối `{ ... }`, dán xuống và sửa lại:

```js
{
  id: "ao-05",
  name: "Áo len cổ lọ",
  category: "ao",        // "ao" | "giay" | "tui"
  price: 200000,         // dùng mốc: 50000/100000/200000/500000/2000000
  note: "Size M · len mềm · còn mới",
  images: ["assets/img/ao-len-1.jpg", "assets/img/ao-len-2.jpg"],
},
```

- Ảnh **đầu** là ảnh chính, ảnh **thứ hai** hiện khi rê chuột.
- Chưa có ảnh thì để `images: []` → web tự vẽ ảnh giữ chỗ.
- Sản phẩm **luôn hiển thị ngẫu nhiên** mỗi lần tải trang (đúng yêu cầu).

## 2. Cấu hình thanh toán

Mở `config.js`:

- `bank.bankCode` / `accountNumber` / `accountName`: tài khoản nhận tiền.
- `momo.phone`: số MoMo (để trống `""` nếu không dùng).
- `shippingFee`: phí ship cố định.

**Cách thanh toán đang chạy thật:** khách bấm mua → quét **VietQR**. Mã này
mọi app ngân hàng **và cả MoMo** đều quét được, **tự điền sẵn số tiền + nội dung
(mã đơn)**. Chỉ cần một tài khoản ngân hàng, không cần đăng ký cổng, miễn phí.
Đây là cách nhanh & gọn nhất cho shop nhỏ.

## 3. Deploy lên GitHub + Cloudflare Pages

1. Tạo repo mới trên GitHub, đẩy toàn bộ thư mục này lên (giữ nguyên cấu trúc).
2. Vào **Cloudflare → Workers & Pages → Create → Pages → Connect to Git**.
3. Chọn repo. Phần build để **trống**:
   - Framework preset: **None**
   - Build command: *(để trống)*
   - Build output directory: `/`
4. Deploy. Cloudflare cho bạn link `*.pages.dev`.
5. Khi mua được tên miền: **Pages → Custom domains → Set up a domain** → nhập tên miền,
   làm theo hướng dẫn trỏ DNS (nếu mua domain qua Cloudflare thì tự động).

## 4. Nâng cấp VNPay / thẻ tín dụng / Apple Pay (khi cần)

VietQR đã lo phần “chuyển khoản + MoMo quét”. Còn **VNPay, thẻ tín dụng, Apple Pay**
bắt buộc phải có **tài khoản merchant + một backend nhỏ để ký giao dịch** — web tĩnh
không tự làm được vì không được để lộ khoá bí mật.

Đường nâng cấp gọn nhất, vẫn ở trên Cloudflare:

- Bật **Cloudflare Pages Functions** (thêm thư mục `/functions`).
- Đăng ký merchant VNPay → lấy `vnp_TmnCode` + `vnp_HashSecret`.
- Viết 1 function tạo URL thanh toán VNPay (ký HMAC-SHA512) và 1 function nhận
  IPN/return để xác nhận đơn.
- Trong `app.js`, hàm `payMethods()` đã tách sẵn — chỉ cần thêm một method mới
  trỏ tới function đó.

Khi bạn có merchant rồi báo mình, mình ráp phần backend này vào cho.

---
*Lưu ý font:* hartcopy dùng một font grotesque có bản quyền (theme Shopify trả phí),
không tái sử dụng tự do được. Mình thay bằng **Inter** — neo-grotesque miễn phí, sạch,
nhìn gần như y hệt và **hỗ trợ tiếng Việt đầy đủ** cho giao diện; **IBM Plex Sans**
dùng cho mô tả/chú thích sản phẩm như bạn yêu cầu.
