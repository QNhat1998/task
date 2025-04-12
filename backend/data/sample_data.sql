-- Thêm dữ liệu mẫu cho categories
INSERT INTO categories (name, description, color) VALUES
('Công việc', 'Các công việc hàng ngày', '#FF5733'),
('Học tập', 'Các nhiệm vụ liên quan đến học tập', '#33FF57'),
('Cá nhân', 'Các việc riêng tư', '#3357FF'),
('Mua sắm', 'Danh sách mua sắm', '#F033FF'),
('Sức khỏe', 'Các hoạt động liên quan đến sức khỏe', '#33FFF3');

-- Thêm dữ liệu mẫu cho tasks
INSERT INTO tasks (title, description, is_completed, due_date, priority, status, category_id, user_id) VALUES
('Hoàn thành báo cáo', 'Viết báo cáo cuối kỳ', false, '2024-03-15', 'high', 'in_progress', 1, 1),
('Học TypeScript', 'Học về decorators và dependency injection', false, '2024-03-20', 'medium', 'todo', 2, 1),
('Đi khám răng', 'Hẹn khám răng định kỳ', false, '2024-03-25', 'low', 'todo', 5, 1),
('Mua sắm thực phẩm', 'Mua rau, thịt, trứng', false, '2024-03-10', 'medium', 'todo', 4, 1),
('Tập thể dục', 'Chạy bộ 30 phút', true, '2024-03-05', 'low', 'done', 5, 1);

-- Thêm dữ liệu mẫu cho subtasks
INSERT INTO subtasks (title, is_completed, task_id) VALUES
('Thu thập dữ liệu', false, 1),
('Viết phần giới thiệu', false, 1),
('Viết phần kết luận', false, 1),
('Học về decorators', false, 2),
('Học về dependency injection', false, 2),
('Mua rau xanh', false, 4),
('Mua thịt gà', false, 4),
('Mua trứng', false, 4);

-- Thêm dữ liệu mẫu cho notes
INSERT INTO notes (title, content, user_id) VALUES
('Ghi chú về TypeScript', 'TypeScript là một superset của JavaScript, cung cấp static typing và các tính năng OOP', 1),
('Công thức nấu ăn', '1. Rửa sạch rau\n2. Thái nhỏ\n3. Xào với tỏi\n4. Nêm gia vị vừa ăn', 1),
('Lịch tập thể dục', 'Thứ 2, 4, 6: Chạy bộ\nThứ 3, 5: Tập gym\nThứ 7: Yoga\nChủ nhật: Nghỉ ngơi', 1),
('Mục tiêu năm 2024', '1. Học xong TypeScript\n2. Hoàn thành dự án cá nhân\n3. Cải thiện sức khỏe', 1),
('Ghi chú về NestJS', 'NestJS là một framework Node.js được xây dựng trên TypeScript, sử dụng kiến trúc module và dependency injection', 1);