/* =========================================================================
   SẢN PHẨM  —  Thêm/bớt món ở đây.
   ---------------------------------------------------------------------------
   Mỗi món là một { ... }. Copy nguyên một khối, dán xuống dưới, sửa lại.

   Các trường:
     id       : mã riêng, không trùng (vd "ao-01")
     name     : tên hiển thị
     category : "ao" (quần áo) | "giay" (giày dép) | "tui" (túi xách)
     price    : giá bán, ĐƠN VỊ ĐỒNG (vd 100000). Nên dùng đúng các mốc
                đồng giá: 50000, 100000, 200000, 500000, 2000000 để lọc cho gọn.
     note     : chú thích ngắn (tình trạng, size, chất liệu...). Có thể để "".
     images   : danh sách link ảnh. Ảnh ĐẦU là ảnh chính, ảnh THỨ HAI hiện
                khi rê chuột. Để [] thì web tự vẽ ảnh giữ chỗ.
                -> Bỏ ảnh vào thư mục assets/img/ rồi ghi "assets/img/ten-anh.jpg"
                -> Hoặc dán link ảnh trên mạng đều được.
   ========================================================================= */

window.PRODUCTS = [
  {
    id: "ao-01",
    name: "Áo sơ mi denim bạc màu",
    category: "ao",
    price: 100000,
    note: "Size L · cotton dày · còn 95%, không lỗi",
    images: [],
  },
  {
    id: "ao-02",
    name: "Áo khoác da nâu vintage",
    category: "ao",
    price: 500000,
    note: "Size M · da thật mềm · vài vết xước nhẹ tự nhiên",
    images: [],
  },
  {
    id: "ao-03",
    name: "Áo thun in graphic 90s",
    category: "ao",
    price: 50000,
    note: "Freesize · cotton mỏng mát · giặt sạch sẵn",
    images: [],
  },
  {
    id: "ao-04",
    name: "Hoodie nỉ bông oversize",
    category: "ao",
    price: 200000,
    note: "Size XL · nỉ bông dày · form rộng",
    images: [],
  },
  {
    id: "giay-01",
    name: "Sneaker canvas trắng cổ thấp",
    category: "giay",
    price: 200000,
    note: "Size 41 · đế còn bám · vệ sinh kỹ",
    images: [],
  },
  {
    id: "giay-02",
    name: "Boots da cổ lửng",
    category: "giay",
    price: 500000,
    note: "Size 39 · da bò · đã thay đế mới",
    images: [],
  },
  {
    id: "giay-03",
    name: "Dép lê da quai ngang",
    category: "giay",
    price: 100000,
    note: "Size 42 · da PU · ít sử dụng",
    images: [],
  },
  {
    id: "tui-01",
    name: "Túi tote vải canvas",
    category: "tui",
    price: 50000,
    note: "Đựng được laptop 14\" · vải dày · còn mới",
    images: [],
  },
  {
    id: "tui-02",
    name: "Túi đeo chéo da nhỏ",
    category: "tui",
    price: 200000,
    note: "Da thật · dây điều chỉnh · 1 ngăn chính",
    images: [],
  },
  {
    id: "tui-03",
    name: "Túi xách da hàng hiệu (auth)",
    category: "tui",
    price: 2000000,
    note: "Full box · còn 90% · có thẻ bảo hành",
    images: [],
  },
  {
    id: "tui-04",
    name: "Balo vải chống nước",
    category: "tui",
    price: 100000,
    note: "Ngăn laptop riêng · khoá kéo êm · ít dùng",
    images: [],
  },
];
