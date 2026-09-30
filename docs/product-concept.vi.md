# Hệ thống gọi món và quản lý nhà hàng — Ý tưởng sản phẩm

Trạng thái: bản nháp ý tưởng để thảo luận. Tài liệu mô tả sản phẩm, chưa lựa chọn công nghệ hay xác định kế hoạch triển khai.

[English](product-concept.md)

## Các sơ đồ đề xuất

- [Sơ đồ ca sử dụng UML chuẩn](diagrams/standard-use-case.svg): các tác nhân và mục tiêu của từng vai trò, thể hiện bằng quan hệ liên kết và quan hệ bắt buộc `«include»`. Sơ đồ mô tả trách nhiệm, không mô tả thứ tự thực hiện công việc.
- [Sơ đồ tổng quan thành phần UML chuẩn](diagrams/standard-component.svg): toàn bộ 17 thành phần logic cùng các quan hệ phụ thuộc chính, được bố trí với khoảng cách rộng. Mũi tên nét đứt đi từ thành phần phụ thuộc đến thành phần cung cấp chức năng, không thể hiện thứ tự thực thi.
- Các sơ đồ thành phần theo nhóm giữ đầy đủ 41 quan hệ phụ thuộc: [Gọi món và phục vụ](diagrams/standard-component-ordering.svg), [Thực đơn, công thức và tồn kho](diagrams/standard-component-stock.svg), [Hoá đơn, hồ sơ và phân tích](diagrams/standard-component-reporting.svg). Mã quan hệ ngắn được giải thích trong bảng chú giải riêng bên dưới mỗi sơ đồ và tài liệu quan hệ phụ thuộc đầy đủ trong project.
- [Project StarUML có thể chỉnh sửa](diagrams/restaurant-management.mdj): gồm sơ đồ ca sử dụng, tổng quan thành phần và ba sơ đồ thành phần theo nhóm. Cấu trúc gốc tuân theo [mô hình ví dụ chính thức của StarUML](https://github.com/staruml/staruml-samples/blob/main/UMLExample.mdj). Đã kiểm tra ID, quyền sở hữu đối tượng, tham chiếu và các đầu nối quan hệ; các sơ đồ thành phần không có nút chồng lấn hoặc đường nối đi xuyên qua thành phần không liên quan. Chưa thử mở project đã tạo lại bằng StarUML trong môi trường này.

Các sơ đồ đề xuất trách nhiệm của các phần trong sản phẩm và ranh giới logic, chưa lựa chọn công nghệ hay kiến trúc triển khai. Các sơ đồ dùng chung hiện có nội dung bằng tiếng Anh.

## Tầm nhìn sản phẩm

Kết nối khách hàng, nhân viên phục vụ, đầu bếp và quản lý trong cùng một quy trình vận hành nhà hàng: đơn hàng được chuyển đến bếp, món ăn sử dụng nguyên liệu, tồn kho quyết định khả năng bán và quản lý theo dõi được tình hình hoạt động.

Giá trị cốt lõi là thực đơn phản ánh đúng những món bếp có thể chế biến, đồng thời nhân viên có thể truy vết từng đơn hàng và từng biến động tồn kho.

## Kết quả mong muốn và giới hạn

- **Kết quả:** kết nối gọi món, chế biến, bàn, thực đơn, tồn kho, công thức và báo cáo quản lý trong một hệ thống.
- **Ràng buộc:** đơn do nhân viên phục vụ nhập và đơn do khách đặt phải tuân theo cùng quy tắc về khả năng bán; lượng nguyên liệu sử dụng đơn vị nhất quán; biến động tồn kho phải truy vết được; màn hình hiển thị rõ trạng thái đơn hàng và kết nối; quyền truy cập phù hợp với trách nhiệm của từng nhân viên.
- **Ngoài phạm vi tài liệu:** các giai đoạn triển khai, lựa chọn công nghệ, ước tính thời gian bàn giao và thiết kế triển khai. Tích hợp nhà cung cấp thanh toán, kế toán, tiền lương, khách hàng thân thiết và đặt bàn là những quyết định sản phẩm riêng.
- **Tiêu chí chấp nhận:** mỗi mô-đun được yêu cầu đều có người sử dụng, mục đích và mối liên hệ rõ ràng với các mô-đun khác. Tài liệu giải thích tác động của đơn hàng đồng thời, huỷ món, hoạt động bếp và cập nhật tồn kho đến khả năng bán món.

Bắt đầu với một địa điểm nhà hàng. Gọi món, bếp, bàn, thực đơn, tồn kho, công thức và báo cáo được phân chia thành các mô-đun sản phẩm rõ ràng để sau này có thể mở rộng sang nhiều địa điểm trong cùng doanh nghiệp. Khi mở rộng, cần phân biệt bàn, tồn kho, phân công nhân viên và báo cáo vận hành của từng địa điểm. Vận hành nhiều địa điểm thuộc phạm vi tương lai; các yêu cầu về ngôn ngữ, tiền tệ, múi giờ và bản địa hoá nằm ngoài bản nháp này.

Sản phẩm yêu cầu kết nối trực tuyến. Đơn hàng và thao tác làm thay đổi tồn kho chỉ được chấp nhận khi hệ thống xác nhận; màn hình mất kết nối phải hiển thị rõ rằng các thao tác này không khả dụng. Nếu mất kết nối sau khi gửi, nhân viên hoặc khách hàng phải kiểm tra kết quả của lần gửi đó khi kết nối lại trước khi thử gửi lại.

## Người dùng và trải nghiệm

| Người dùng | Trải nghiệm chính | Trách nhiệm chính |
|---|---|---|
| Khách hàng | Thực đơn trên điện thoại, mở qua mã QR tại bàn | Xem món còn bán được, chọn tuỳ chọn, gửi đơn, theo dõi tiến độ |
| Nhân viên phục vụ | POS hỗ trợ thao tác cảm ứng và màn hình bàn theo khu vực được phân công | Mở lượt phục vụ tại bàn, nhập đơn, xử lý thay đổi, nhận thông báo đơn QR, phục vụ món đã sẵn sàng, chuyển hoá đơn cho thu ngân |
| Thu ngân | Màn hình hoá đơn và xác nhận thanh toán | Kiểm tra hoá đơn đã tính, xử lý thanh toán ngoài hệ thống, xác nhận đã thanh toán |
| Đầu bếp | Màn hình bếp | Xem phiếu món, bắt đầu chế biến, đánh dấu món đã sẵn sàng, báo thiếu nguyên liệu và hao hụt |
| Quản lý | Tổng quan bàn và màn hình quản lý | Quản lý thực đơn và công thức, giám sát tồn kho và nhà cung cấp, phê duyệt điều chỉnh, phân tích hoạt động |
| Nhân viên kho, nếu có vai trò riêng | Màn hình tồn kho | Nhập nguyên liệu, ghi nhận xuất kho và hao hụt, kiểm kê |

Khách hàng chỉ xem được lượt phục vụ tại bàn mà họ được cấp quyền truy cập. Quyền nhân viên giới hạn các thao tác nhạy cảm như sửa giá, huỷ đơn, điều chỉnh tồn kho và thay đổi xác nhận thanh toán.

## Phạm vi chức năng

### 1. Gọi món qua nhân viên phục vụ và POS

- Duyệt món theo danh mục, tìm kiếm nhanh và xem số lượng hiện còn bán được.
- Tạo đơn cho một lượt phục vụ tại bàn; nhập số lượng, tuỳ chọn món được hỗ trợ và ghi chú chế biến.
- Chuyển món mới đến bếp và theo dõi trạng thái chế biến, phục vụ.
- Phân biệt món gọi thêm với món đã bắt đầu chế biến.
- Xử lý thay đổi và huỷ món với xác nhận rõ ràng từ bếp, kèm phê duyệt khi cần.
- Tính hoá đơn tại bàn theo giá và số lượng đã được chấp nhận; loại trừ món đã huỷ theo quyết định tính tiền đã được phê duyệt.
- Chuyển hoá đơn cho thu ngân. Thu ngân xử lý thanh toán ngoài hệ thống và xác nhận đã thanh toán để đóng hoá đơn và lượt phục vụ. Hệ thống không xử lý giao dịch thanh toán.
- Ưu tiên bàn và thông báo trong khu vực được phân công cho nhân viên phục vụ.

### 1.1. Khách hàng gọi món qua QR

- Quét mã QR tại bàn để mở thực đơn và truy cập lượt phục vụ hiện tại đã được cấp quyền.
- Xem mô tả món, giá, tuỳ chọn được hỗ trợ và khả năng bán.
- Gửi đơn và nhận kết quả rõ ràng: được chấp nhận hoặc bị từ chối.
- Kiểm tra quyền truy cập lượt phục vụ, lựa chọn món, giá hiện tại, số lượng và nguyên liệu khả dụng trước khi chấp nhận. Đơn QR được chấp nhận chuyển thẳng đến bếp và thông báo cho nhân viên phục vụ được phân công; không cần nhân viên phục vụ duyệt đơn.
- Theo dõi tiến độ các đơn của khách. Nhấn nhiều lần hoặc gửi lại không được tạo đơn trùng.
- Mã QR bị sao chép không được cho phép truy cập lượt phục vụ của khách đến sau. Nhân viên kiểm soát quyền truy cập lượt phục vụ riêng với việc kiểm tra đơn; cơ chế này không được yêu cầu nhân viên phục vụ duyệt từng đơn.

### 2. Hệ thống màn hình bếp

- Hiển thị phiếu món mới với bàn, món, số lượng, tuỳ chọn, ghi chú và thời gian đã chờ.
- Hỗ trợ trạng thái từng món: chờ chế biến, đang chế biến, sẵn sàng và đã huỷ. Nhân viên phục vụ đánh dấu món sẵn sàng là đã phục vụ.
- Làm nổi bật món gọi thêm và yêu cầu huỷ, không âm thầm xoá công việc đang thực hiện.
- Cho phép đầu bếp báo nguyên liệu không khả dụng, phần món bị hao hụt hoặc sự cố chế biến.
- Hiển thị trạng thái kết nối và tải lại trạng thái phiếu món hiện tại sau khi kết nối lại.

### 3. Quản lý bàn

- Quản lý bàn, sức chứa và khu vực phục vụ; mỗi bàn thuộc một khu vực.
- Hiển thị các trạng thái bàn trống, có khách, chờ thanh toán và đang dọn, cùng đơn đang mở và tiến độ phục vụ.
- Gắn toàn bộ đơn hàng và hoá đơn với một lượt phục vụ, thay vì gắn cố định với bàn vật lý.
- Chuyển lượt phục vụ đang hoạt động sang bàn khác, giữ lịch sử đơn và thông báo cho bếp.
- Đóng lượt phục vụ đã thanh toán và thu hồi quyền truy cập của khách trước khi sử dụng bàn cho lượt tiếp theo.

### 3.1. Phân công khu vực cho nhân viên phục vụ

- Quản lý phân công nhân viên phục vụ theo khu vực cho ca hoặc khoảng thời gian phục vụ hiện tại.
- Mỗi khu vực gồm một nhóm bàn có số lượng giới hạn. Quản lý cấu hình số bàn tối đa cho mỗi nhân viên; phân công vượt giới hạn bị chặn cho đến khi quản lý thay đổi phân bổ hoặc giới hạn.
- Mặc định, mỗi khu vực đang hoạt động có một nhân viên phụ trách để xác định rõ người nhận thông báo. Một nhân viên có thể phụ trách nhiều khu vực nếu tổng số bàn được giao không vượt giới hạn.
- Chuyển thông báo đơn QR được chấp nhận và món sẵn sàng phục vụ đến nhân viên đang phụ trách.
- Cho phép quản lý phân công lại khi nghỉ giữa ca, đổi ca hoặc cân bằng khối lượng công việc. Nhân viên thay thế nhận đầy đủ thông tin bàn đang mở và thông báo chưa xử lý.
- Khi chuyển lượt phục vụ sang khu vực khác, trách nhiệm phục vụ và các thông báo tiếp theo được chuyển cho nhân viên của khu vực đích; lịch sử được giữ nguyên.
- Hiển thị khu vực đang hoạt động chưa có người phụ trách cho quản lý. Nếu có đơn mới ở khu vực chưa được phân công, vẫn giữ phiếu món tại bếp và thông báo cho quản lý để phân công.

Phân công khu vực xác định trách nhiệm phục vụ, không cấp quyền quản lý hoặc thu ngân cho nhân viên phục vụ.

### 4. Quản lý thực đơn

- Quản lý danh mục, món, mô tả, hình ảnh, giá, biến thể được hỗ trợ và trạng thái hiển thị.
- Liên kết mọi món hoặc biến thể có kiểm soát tồn kho với công thức tương ứng.
- Tính số phần bán được từ tồn kho nguyên liệu sử dụng được và lượng đã giữ cho đơn hàng.
- Tính lại khả năng bán sau khi đặt món, nhập kho, sử dụng nguyên liệu, ghi nhận hao hụt, kiểm kê và thay đổi công thức.
- Cho phép quản lý hoặc đầu bếp tạm ngừng bán món dù vẫn đủ nguyên liệu, kèm lý do được ghi nhận.
- Giữ nguyên giá, biến thể đã chọn và phiên bản công thức tại thời điểm chấp nhận đơn.

### 5. Tồn kho và nhà cung cấp

- Quản lý nguyên liệu, đơn vị cơ sở, quy đổi đơn vị mua hàng, vị trí lưu trữ và ngưỡng tồn kho tối thiểu.
- Quản lý nhà cung cấp; ghi nhận nhập nguyên liệu với số lượng, đơn giá, ngày nhập và tham chiếu nhà cung cấp.
- Theo dõi lô nguyên liệu nhập và hạn sử dụng khi áp dụng; tồn kho hết hạn hoặc bị cách ly không được dùng để bán. Theo dõi mẻ sơ chế là mô-đun tuỳ chọn riêng.
- Ghi nhận nhập kho, xuất kho, nguyên liệu dùng tại bếp, hao hụt, trả nhà cung cấp và điều chỉnh kiểm kê, kèm lý do.
- Hiển thị riêng tồn kho thực có, lượng đã giữ cho đơn, lượng sử dụng được và lượng còn khả dụng.
- Cảnh báo thiếu nguyên liệu, tồn kho thấp và nguyên liệu sắp hết hạn.
- Lưu lịch sử biến động tồn kho. Sửa sai bằng bút toán đảo hoặc điều chỉnh có thể truy vết.

“Xuất” ở đây là đưa hàng ra khỏi tồn kho, không phải xuất tệp báo cáo. Chuyển nguyên liệu sang kho bếp là điều chuyển, không được đồng thời tính là sử dụng nguyên liệu theo công thức.

### 6. Quản lý công thức

- Xác định lượng nguyên liệu và đơn vị cho mỗi phần, hướng dẫn chế biến và sản lượng dự kiến.
- Hỗ trợ công thức cho từng biến thể thực tế được bán; tuỳ chọn làm thay đổi nguyên liệu phải có tác động tồn kho được xác định rõ.
- Thể hiện lượng sử dụng được sau hao hụt sơ chế dự kiến để tránh tính dư số phần bán được.
- Ước tính chi phí nguyên liệu mỗi phần từ chi phí tồn kho đã ghi nhận.
- Quản lý phiên bản công thức để đơn đã có giữ nguyên nhu cầu nguyên liệu tại thời điểm chấp nhận.
- Gắn thông tin chất gây dị ứng với nguyên liệu và hiển thị thông tin liên quan trên món; ghi chú tự do không tự động thay đổi công thức.
- Mặc định dùng công thức trực tiếp; cho phép công thức sử dụng tồn kho đã sơ chế khi bật mô-đun mẻ sơ chế.

### 7. Bảng tổng quan cho quản lý

- Hiển thị doanh thu theo kỳ, món, danh mục và kênh đặt món; phân biệt doanh thu đã thanh toán với hoá đơn còn mở.
- Hiển thị số đơn, giá trị hoá đơn trung bình, món huỷ và đơn huỷ.
- Hiển thị thời gian chế biến, mức sử dụng bàn và thời lượng mỗi lượt phục vụ.
- Hiển thị tồn kho, lượng sử dụng, hao hụt, mua hàng từ nhà cung cấp và nguyên liệu có tồn kho thấp.
- So sánh doanh thu với chi phí nguyên liệu ước tính để thể hiện biên lợi nhuận món ăn ước tính; ghi nhãn rõ đây không phải lợi nhuận ròng.
- Cho phép xem các đơn hoặc biến động tồn kho cấu thành một chỉ số và lọc theo ngày.

## Luồng vận hành liên kết

| Sự kiện | Kết quả trong hệ thống |
|---|---|
| Nhập nguyên liệu | Tồn kho sử dụng được tăng; các món liên quan có thể được bán trở lại |
| Chấp nhận đơn từ nhân viên hoặc QR | Giữ nguyên liệu cần dùng; số phần bán được giảm; tạo phiếu món tại bếp; đơn QR được chấp nhận thông báo cho nhân viên phụ trách |
| Đầu bếp bắt đầu chế biến | Nguyên liệu đã giữ chuyển thành nguyên liệu đã sử dụng; tồn kho thực có giảm |
| Món sẵn sàng | Nhân viên đang phụ trách khu vực nhận thông báo phục vụ; tiến độ hiển thị cho khách được cập nhật |
| Huỷ món trước khi chế biến | Giải phóng lượng nguyên liệu đã giữ; tính lại khả năng bán |
| Huỷ món sau khi bắt đầu chế biến | Nguyên liệu đã dùng vẫn được ghi nhận là đã dùng; ghi nhận hao hụt khi áp dụng |
| Nguyên liệu hết hạn hoặc kiểm kê cho thấy thiếu | Khả năng bán giảm; nhân viên phải xử lý các lượng nguyên liệu đã giữ bị ảnh hưởng |
| Thu ngân xác nhận thanh toán ngoài hệ thống và đóng lượt phục vụ | Cập nhật báo cáo doanh thu; bàn chuyển sang trạng thái đang dọn; quyền truy cập lượt phục vụ kết thúc |

Chính sách gọi món đề xuất: giữ nguyên liệu khi chấp nhận đơn và ghi nhận sử dụng khi bắt đầu chế biến. Cách này thể hiện lượng nguyên liệu đã dành cho đơn nhưng vẫn cho phép giải phóng nếu huỷ trước khi chế biến. Trừ nguyên liệu ngay khi chấp nhận đơn đơn giản hơn nhưng làm lẫn tồn kho thực tế với lượng dành cho món chưa chế biến; chỉ trừ khi phục vụ thì quá muộn để phản ánh nguyên liệu đang chế biến, trừ khi vẫn duy trì cơ chế giữ nguyên liệu.

## Quy tắc tự động tính số lượng món

Với mỗi nguyên liệu:

`lượng khả dụng = tồn kho thực có sử dụng được − lượng đã giữ cho các đơn được chấp nhận`

Với một công thức:

`số phần bán được = giá trị nhỏ nhất của floor(lượng nguyên liệu khả dụng / lượng nguyên liệu cho mỗi phần)`

Tính bằng các đơn vị cơ sở tương thích và giả định sản lượng của công thức. Món bị tạm ngừng bán có số phần bán được bằng 0.

Khi bật theo dõi mẻ sơ chế, quy tắc tương tự áp dụng cho tồn kho đã sơ chế mà công thức tham chiếu. Nguyên liệu thô có thể làm thêm mẻ mới không được tính là tồn kho đã sơ chế hiện có.

Ví dụ: một món cần 150 g thịt gà và 100 g gạo. Với 900 g thịt gà và 1.000 g gạo khả dụng, có thể bán sáu phần. Chấp nhận hai phần sẽ giữ 300 g thịt gà và 200 g gạo, còn lại bốn phần bán được.

Các món dùng chung nguyên liệu có khả năng bán phụ thuộc lẫn nhau. Hai món có thể cùng hiển thị sáu phần nhưng đều dùng cùng lượng thịt gà; số lượng hiển thị không phải phần tồn kho được phân bổ riêng. Hệ thống phải kiểm tra lại và giữ nguyên liệu cho toàn bộ đơn trong một thao tác thống nhất trước khi chấp nhận. Nếu hai người cùng đặt phần cuối, chỉ một đơn được chấp nhận.

Khi bắt đầu chế biến, việc chuyển nguyên liệu đã giữ sang đã sử dụng chỉ được thực hiện một lần. Thao tác này giảm tồn kho thực có và lượng đã giữ cùng một lượng, nên không làm giảm lượng khả dụng thêm lần nữa.

Thiếu hụt thực tế có thể khiến đơn đã chấp nhận không còn đủ nguyên liệu. Hệ thống phải xác định phiếu món bị ảnh hưởng và yêu cầu nhân viên bổ sung nguyên liệu, thay thế với sự đồng ý của khách hoặc huỷ món; chỉ thay đổi thực đơn không giải quyết được các đơn này.

## Các tình huống xác nhận sản phẩm đáp ứng mục tiêu

- Đơn do nhân viên nhập và đơn QR xuất hiện trong cùng hàng đợi tại bếp và tuân theo cùng quy tắc tồn kho.
- Các yêu cầu đồng thời mua phần cuối không thể khiến bán vượt lượng còn lại.
- Nhập một nguyên liệu khôi phục khả năng bán của mọi món bị ảnh hưởng.
- Huỷ món chưa chế biến giải phóng nguyên liệu; huỷ món đã chế biến không tự động hoàn lại nguyên liệu.
- Chuyển lượt phục vụ sang bàn khác giữ nguyên phiếu món và hoá đơn; đóng lượt phục vụ thu hồi quyền truy cập của khách.
- Quản lý truy vết được tổng doanh thu hoặc hao hụt hiển thị đến bản ghi nguồn.
- Kết nối lại hoặc gửi lại thao tác không tạo đơn trùng hay trừ nguyên liệu nhiều lần.
- Đơn QR được chấp nhận chuyển đến bếp ngay sau khi kiểm tra và thông báo cho nhân viên phụ trách bàn.
- Phân công nhân viên tuân theo giới hạn số bàn; phân công lại và chuyển bàn khác khu vực vẫn duy trì việc phục vụ liên tục.
- Khi mất kết nối, màn hình không thể chấp nhận đơn hoặc thay đổi tồn kho nếu chưa có xác nhận trực tuyến.
- Thu ngân xác nhận thanh toán được xử lý ngoài hệ thống mà không cần tích hợp nhà cung cấp thanh toán.
- Khi tắt theo dõi mẻ sơ chế, công thức trực tiếp hoạt động mà không cần bước sản xuất theo mẻ. Khi bật, sản xuất trừ nguyên liệu thô một lần và món ăn sử dụng tồn kho đã sơ chế được tạo ra.

## Mô-đun tuỳ chọn: mẻ sơ chế và công thức thành phần

Quản lý có thể bật hoặc tắt theo dõi mẻ sơ chế cho nhà hàng. Mặc định mô-đun này bị tắt. Khi tắt, màn hình sản xuất và tuỳ chọn công thức sử dụng tồn kho đã sơ chế được ẩn; món ăn dùng công thức trực tiếp. Khi bật, nhà hàng có thể dùng công thức trực tiếp, công thức sử dụng tồn kho đã sơ chế hoặc kết hợp cả hai.

Công thức trực tiếp sử dụng nguyên liệu thô cho mỗi món được đặt. Công thức thành phần mô tả một chế phẩm trung gian dùng trong công thức khác, như sốt cà chua, bột nhào, nước dùng hoặc thịt gà đã ướp. Mẻ sơ chế là lượng chế phẩm thực tế được làm trước và lưu trong tồn kho.

Ví dụ: bếp dùng 2 kg cà chua cùng các nguyên liệu khác để làm 1,5 lít sốt. Ghi nhận mẻ này sẽ trừ nguyên liệu thô và thêm 1,5 lít sốt đã sơ chế, kèm sản lượng thực tế, ngày sản xuất, chi phí và hạn sử dụng. Một phần mì Ý sau đó giữ và sử dụng 100 ml sốt. Mẻ này đủ cho 15 phần nếu các nguyên liệu khác cũng còn đủ.

Không được trừ cà chua thô thêm lần nữa khi đặt mì Ý. Nếu bếp còn nguyên liệu để làm sốt nhưng hết sốt đã sơ chế, khả năng bán ngay bị giới hạn bởi lượng sốt đã sơ chế cho đến khi ghi nhận mẻ mới. Sốt bị hỏng làm giảm tồn kho sốt, không hoàn lại nguyên liệu thô.

Chức năng này phù hợp khi lượng sơ chế trước quyết định món bếp có thể phục vụ ngay, hoặc khi cần theo dõi sản lượng thực tế và hạn sử dụng theo mẻ. Nếu món được chế biến trực tiếp từ nguyên liệu thô, công thức trực tiếp có thể đáp ứng đủ. Công thức thành phần dùng lại được nhưng không theo dõi tồn kho đã sơ chế có thể giúp tổ chức hướng dẫn, song không thể phản ánh lượng sốt sẵn sàng phục vụ.

Tắt mô-đun phải giữ nguyên lịch sử sản xuất và tồn kho. Trước khi tắt, cần xử lý lượng tồn kho đã sơ chế đang giữ cho đơn, hạch toán lượng còn lại và thay các quan hệ phụ thuộc vào tồn kho đã sơ chế trong công thức đang dùng bằng công thức trực tiếp hợp lệ. Hệ thống không được âm thầm coi tồn kho đã sơ chế là nguyên liệu thô hoặc thay đổi đơn đã chấp nhận.
