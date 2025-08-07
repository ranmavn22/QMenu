# QMenu - Ứng dụng Gọi món Qua QR

Ứng dụng web cho phép khách hàng quét mã QR để truy cập menu nhà hàng và đặt món ăn.

## Tính năng

- **Quét QR Code**: Quét mã QR để truy cập menu nhà hàng
- **Nhập mã thủ công**: Nhập mã nhà hàng thủ công nếu không có QR code
- **Xem menu**: Hiển thị danh sách món ăn theo danh mục
- **Tìm kiếm**: Tìm kiếm món ăn theo tên
- **Giỏ hàng**: Thêm/bớt số lượng món ăn
- **Đặt món**: Đặt món và xem tổng tiền

## Công nghệ sử dụng

- **Vue 3** với Composition API
- **TypeScript** cho type safety
- **Tailwind CSS** cho styling
- **Vue Router** cho routing
- **Pinia** cho state management
- **Vue QR Code Reader** cho quét QR

## Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js 18.8.0 trở lên
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Chạy ứng dụng ở môi trường development

```bash
npm run dev
```

### Build ứng dụng cho production

```bash
npm run build
```

### Kiểm tra lỗi với ESLint

```bash
npm run lint
```

## Cấu trúc dự án

```
src/
├── assets/          # Static assets
├── components/      # Vue components
├── router/          # Vue Router configuration
├── stores/          # Pinia stores
├── views/           # Page components
│   ├── QRScanner.vue    # Màn hình quét QR
│   └── MenuView.vue     # Màn hình menu
└── main.ts          # Entry point
```

## Sử dụng

1. **Màn hình quét QR** (`/`):
   - Quét mã QR của nhà hàng
   - Hoặc nhập mã nhà hàng thủ công
   - Sau khi quét thành công, chuyển đến màn hình menu

2. **Màn hình menu** (`/menu/:id`):
   - Hiển thị danh sách món ăn
   - Lọc theo danh mục
   - Tìm kiếm món ăn
   - Thêm món vào giỏ hàng
   - Đặt món

## API Endpoints (Mock)

Ứng dụng hiện tại sử dụng dữ liệu mock. Trong thực tế, bạn cần tích hợp với API backend:

- `GET /api/restaurants/:id/menu` - Lấy menu của nhà hàng
- `POST /api/orders` - Tạo đơn hàng mới

## Tùy chỉnh

### Thay đổi màu sắc

Chỉnh sửa file `tailwind.config.js` để thay đổi màu sắc chủ đạo:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color-here',
        // ...
      }
    }
  }
}
```

### Thêm món ăn mới

Chỉnh sửa mảng `menuItems` trong `MenuView.vue`:

```javascript
const menuItems = [
  {
    id: 6,
    name: 'Tên món mới',
    price: 75000,
    unit: 'Phần',
    image: 'url-to-image',
    categoryId: 2,
  },
]
```

## Lưu ý

- Ứng dụng cần HTTPS để sử dụng camera (quét QR)
- Hỗ trợ các trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- Responsive design cho mobile và desktop

## License

MIT License
