 # Task Management API Documentation

## Project Structure

### 1. Core Modules

#### 1.1 App Module (`src/app.module.ts`)
- **Mục đích**: Module gốc của ứng dụng, nơi cấu hình và kết nối tất cả các module khác
- **Cấu hình chính**:
  - ConfigModule: Quản lý biến môi trường
  - TypeOrmModule: Kết nối database MySQL
  - JwtModule: Cấu hình JWT cho authentication
- **Lưu ý**: Không nên thêm business logic vào module này

#### 1.2 Database Configuration (`src/config/database.config.ts`)
- **Mục đích**: Cấu hình kết nối database
- **Các tham số**:
  - type: 'mysql'
  - host, port, username, password: Thông tin kết nối
  - database: Tên database
  - entities: Đường dẫn đến các entity
  - synchronize: true (chỉ dùng trong development)
- **Lưu ý**: 
  - Không nên set synchronize: true trong production
  - Nên sử dụng connection pooling cho production

### 2. Authentication Module (`src/modules/auth/`)

#### 2.1 Auth Module (`auth.module.ts`)
- **Mục đích**: Quản lý authentication và authorization
- **Cấu hình**:
  - JwtModule: Cấu hình JWT
  - TypeOrmModule: Kết nối với AccessToken entity
- **Lưu ý**: Module này nên được import đầu tiên trong AppModule

#### 2.2 Auth Service (`auth.service.ts`)
- **Mục đích**: Xử lý logic đăng ký và đăng nhập
- **Các phương thức**:
  - register(): Đăng ký user mới
  - login(): Đăng nhập và tạo access token
- **Lưu ý**: 
  - Luôn hash password trước khi lưu
  - Kiểm tra email tồn tại trước khi đăng ký

#### 2.3 Auth Controller (`auth.controller.ts`)
- **Mục đích**: Xử lý các request liên quan đến authentication
- **Các endpoint**:
  - POST /auth/register: Đăng ký
  - POST /auth/login: Đăng nhập
- **Lưu ý**: Không cần @UseGuards vì là public endpoint

#### 2.4 Access Token Entity (`entities/access-token.entity.ts`)
- **Mục đích**: Lưu trữ thông tin access token
- **Các trường**:
  - token: JWT token
  - user_id: ID của user
  - expires_at: Thời gian hết hạn
- **Lưu ý**: Nên có index trên token và user_id

### 3. Users Module (`src/modules/users/`)

#### 3.1 Users Module (`users.module.ts`)
- **Mục đích**: Quản lý thông tin người dùng
- **Cấu hình**:
  - TypeOrmModule: Kết nối với User entity
  - JwtModule: Cấu hình JWT
- **Lưu ý**: Nên export UsersService để các module khác sử dụng

#### 3.2 Users Service (`users.service.ts`)
- **Mục đích**: Xử lý logic liên quan đến user
- **Các phương thức**:
  - create(): Tạo user mới
  - findByEmail(): Tìm user bằng email
  - findOne(): Tìm user bằng ID
- **Lưu ý**: 
  - Luôn hash password trước khi lưu
  - Không trả về password trong response

#### 3.3 User Entity (`entities/user.entity.ts`)
- **Mục đích**: Định nghĩa cấu trúc bảng users
- **Các trường**:
  - id: Primary key
  - email: Email (unique)
  - password: Password (đã hash)
  - name: Tên người dùng
- **Quan hệ**:
  - OneToMany với Task
  - OneToMany với Note
  - OneToMany với AccessToken
- **Lưu ý**: Nên có index trên email

### 4. Tasks Module (`src/modules/tasks/`)

#### 4.1 Tasks Module (`tasks.module.ts`)
- **Mục đích**: Quản lý các task
- **Cấu hình**:
  - TypeOrmModule: Kết nối với Task và Subtask entity
  - UsersModule: Sử dụng UsersService
  - CategoriesModule: Sử dụng CategoriesService
- **Lưu ý**: Nên import UsersModule và CategoriesModule

#### 4.2 Tasks Service (`tasks.service.ts`)
- **Mục đích**: Xử lý logic liên quan đến task
- **Các phương thức**:
  - create(): Tạo task mới
  - findAll(): Lấy tất cả task của user
  - findOne(): Tìm task theo ID
  - update(): Cập nhật task
  - remove(): Xóa task
- **Lưu ý**: 
  - Luôn kiểm tra quyền sở hữu task
  - Xử lý cascade khi xóa task

#### 4.3 Tasks Controller (`tasks.controller.ts`)
- **Mục đích**: Xử lý các request liên quan đến task
- **Các endpoint**:
  - POST /users/:user_id/tasks: Tạo task mới
  - GET /users/:user_id/tasks: Lấy tất cả task
  - GET /users/:user_id/tasks/:id: Lấy task theo ID
  - PATCH /users/:user_id/tasks/:id: Cập nhật task
  - DELETE /users/:user_id/tasks/:id: Xóa task
- **Lưu ý**: 
  - Sử dụng @UseGuards(AuthGuard)
  - Validate user_id trong param

#### 4.4 Task Entity (`entities/task.entity.ts`)
- **Mục đích**: Định nghĩa cấu trúc bảng tasks
- **Các trường**:
  - id: Primary key
  - title: Tiêu đề task
  - description: Mô tả task
  - is_completed: Trạng thái hoàn thành
  - due_date: Ngày hết hạn
  - priority: Độ ưu tiên
  - status: Trạng thái (todo, in_progress, done)
- **Quan hệ**:
  - ManyToOne với User
  - ManyToOne với Category
  - OneToMany với Subtask
- **Lưu ý**: 
  - Nên có index trên user_id và category_id
  - Sử dụng enum cho status

#### 4.5 Subtask Entity (`entities/subtask.entity.ts`)
- **Mục đích**: Định nghĩa cấu trúc bảng subtasks
- **Các trường**:
  - id: Primary key
  - title: Tiêu đề subtask
  - is_completed: Trạng thái hoàn thành
- **Quan hệ**:
  - ManyToOne với Task
- **Lưu ý**: Nên có index trên task_id

### 5. Notes Module (`src/modules/notes/`)

#### 5.1 Notes Module (`notes.module.ts`)
- **Mục đích**: Quản lý các note
- **Cấu hình**:
  - TypeOrmModule: Kết nối với Note entity
  - UsersModule: Sử dụng UsersService
- **Lưu ý**: Nên import UsersModule

#### 5.2 Notes Service (`notes.service.ts`)
- **Mục đích**: Xử lý logic liên quan đến note
- **Các phương thức**:
  - create(): Tạo note mới
  - findAll(): Lấy tất cả note của user
  - findOne(): Tìm note theo ID
  - update(): Cập nhật note
  - remove(): Xóa note
- **Lưu ý**: 
  - Luôn kiểm tra quyền sở hữu note
  - Xử lý cascade khi xóa note

#### 5.3 Notes Controller (`notes.controller.ts`)
- **Mục đích**: Xử lý các request liên quan đến note
- **Các endpoint**:
  - POST /users/:user_id/notes: Tạo note mới
  - GET /users/:user_id/notes: Lấy tất cả note
  - GET /users/:user_id/notes/:id: Lấy note theo ID
  - PATCH /users/:user_id/notes/:id: Cập nhật note
  - DELETE /users/:user_id/notes/:id: Xóa note
- **Lưu ý**: 
  - Sử dụng @UseGuards(AuthGuard)
  - Validate user_id trong param

#### 5.4 Note Entity (`entities/note.entity.ts`)
- **Mục đích**: Định nghĩa cấu trúc bảng notes
- **Các trường**:
  - id: Primary key
  - title: Tiêu đề note
  - content: Nội dung note
- **Quan hệ**:
  - ManyToOne với User
- **Lưu ý**: Nên có index trên user_id

### 6. Categories Module (`src/modules/categories/`)

#### 6.1 Categories Module (`categories.module.ts`)
- **Mục đích**: Quản lý các category
- **Cấu hình**:
  - TypeOrmModule: Kết nối với Category entity
- **Lưu ý**: Không cần AuthGuard vì là public endpoint

#### 6.2 Categories Service (`categories.service.ts`)
- **Mục đích**: Xử lý logic liên quan đến category
- **Các phương thức**:
  - create(): Tạo category mới
  - findAll(): Lấy tất cả category
  - findOne(): Tìm category theo ID
  - update(): Cập nhật category
  - remove(): Xóa category
- **Lưu ý**: 
  - Kiểm tra ràng buộc khi xóa category
  - Không cần kiểm tra quyền sở hữu

#### 6.3 Categories Controller (`categories.controller.ts`)
- **Mục đích**: Xử lý các request liên quan đến category
- **Các endpoint**:
  - POST /categories: Tạo category mới
  - GET /categories: Lấy tất cả category
  - GET /categories/:id: Lấy category theo ID
  - PATCH /categories/:id: Cập nhật category
  - DELETE /categories/:id: Xóa category
- **Lưu ý**: Không cần @UseGuards vì là public endpoint

#### 6.4 Category Entity (`entities/category.entity.ts`)
- **Mục đích**: Định nghĩa cấu trúc bảng categories
- **Các trường**:
  - id: Primary key
  - name: Tên category
  - color: Màu sắc category
- **Quan hệ**:
  - OneToMany với Task
- **Lưu ý**: Nên có index trên name

### 7. Guards (`src/guards/`)

#### 7.1 Auth Guard (`auth.guard.ts`)
- **Mục đích**: Bảo vệ các route cần authentication
- **Cách sử dụng**:
  - @UseGuards(AuthGuard) trên controller hoặc route
- **Lưu ý**: 
  - Kiểm tra token trong header
  - Validate token với JwtService
  - Gán user vào request

### 8. DTOs (Data Transfer Objects)

#### 8.1 Auth DTOs
- **RegisterDto**: Định nghĩa dữ liệu đăng ký
- **LoginDto**: Định nghĩa dữ liệu đăng nhập

#### 8.2 Task DTOs
- **CreateTaskDto**: Định nghĩa dữ liệu tạo task
- **UpdateTaskDto**: Định nghĩa dữ liệu cập nhật task

#### 8.3 Note DTOs
- **CreateNoteDto**: Định nghĩa dữ liệu tạo note
- **UpdateNoteDto**: Định nghĩa dữ liệu cập nhật note

#### 8.4 Category DTOs
- **CreateCategoryDto**: Định nghĩa dữ liệu tạo category
- **UpdateCategoryDto**: Định nghĩa dữ liệu cập nhật category

## Best Practices

1. **Security**:
   - Luôn hash password
   - Sử dụng JWT với thời gian hết hạn
   - Validate input data
   - Kiểm tra quyền sở hữu resource

2. **Performance**:
   - Sử dụng index cho các trường thường query
   - Tránh N+1 query trong quan hệ
   - Sử dụng pagination cho list API

3. **Code Organization**:
   - Tách biệt business logic vào service
   - Sử dụng DTOs cho input/output
   - Đặt tên rõ ràng và nhất quán

4. **Error Handling**:
   - Sử dụng HTTP status code phù hợp
   - Trả về error message rõ ràng
   - Log lỗi để debug

## Limitations

1. **Authentication**:
   - Chưa có refresh token
   - Chưa có rate limiting
   - Chưa có blacklist token

2. **Authorization**:
   - Chỉ có role-based access control đơn giản
   - Chưa có permission system

3. **Performance**:
   - Chưa có caching
   - Chưa có connection pooling
   - Chưa có query optimization

4. **Security**:
   - Chưa có input sanitization
   - Chưa có CSRF protection
   - Chưa có rate limiting

## Future Improvements

1. **Authentication**:
   - Thêm refresh token
   - Thêm rate limiting
   - Thêm blacklist token

2. **Authorization**:
   - Thêm role-based access control
   - Thêm permission system

3. **Performance**:
   - Thêm caching
   - Thêm connection pooling
   - Thêm query optimization

4. **Security**:
   - Thêm input sanitization
   - Thêm CSRF protection
   - Thêm rate limiting

5. **Features**:
   - Thêm file upload
   - Thêm real-time notifications
   - Thêm search functionality