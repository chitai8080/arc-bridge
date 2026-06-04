Bạn là một AI coding agent. Hãy xây dựng giao diện web Bridge tài sản theo hướng dẫn App Kit Bridge tại link sau:
https://docs.arc.io/app-kit/bridge

Mục tiêu:
- Chỉ làm frontend (không viết backend server, không tạo API riêng).
- Dùng App Kit của Circle để triển khai luồng bridge theo đúng docs.
- Tạo duy nhất 1 màn hình đơn giản, gọn, dễ dùng.

Yêu cầu chức năng bắt buộc:
1. Kết nối ví (Connect Wallet).
2. Ngắt kết nối ví (Disconnect Wallet).
3. Hiển thị số dư token khả dụng của ví (ưu tiên USDC) theo chain đang chọn.
4. Có form bridge cơ bản trên cùng màn hình:
	- Chọn chain nguồn.
	- Chọn chain đích.
	- Nhập số lượng.
	- Nút Bridge.
5. Hiển thị trạng thái giao dịch theo từng bước (ví dụ: approve, burn, fetchAttestation, mint) nếu SDK trả về.

Ràng buộc kỹ thuật:
- Chỉ frontend, không thêm backend.
- Sử dụng package chính: @circle-fin/app-kit.
- Ưu tiên adapter frontend/browser wallet phù hợp với docs App Kit Bridge.
- Code tách rõ component, tránh dồn toàn bộ logic vào một file duy nhất.
- Có xử lý state loading, error, success rõ ràng.
- UI text phải dùng tiếng Anh.

Yêu cầu UI/UX:
- Một trang duy nhất.
- Bố cục tối giản: vùng kết nối ví + vùng thông tin số dư + vùng thao tác bridge + vùng log trạng thái.
- Responsive cơ bản cho desktop và mobile.
- Không cần thiết kế phức tạp.

Kết quả đầu ra mong muốn:
1. Mã nguồn frontend chạy được.
2. Hướng dẫn chạy ngắn gọn (install + run).
3. Danh sách biến môi trường cần thiết (nếu có) và cách cấu hình tối thiểu.
4. Nêu rõ phần nào đang mock (nếu có) và phần nào đã hoạt động thật theo ví người dùng.

Tiêu chí hoàn thành:
- Người dùng có thể connect/disconnect ví.
- Người dùng thấy được số dư.
- Người dùng thao tác bridge ngay trên một màn hình.
- Không có backend code.
