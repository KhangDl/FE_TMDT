import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../css/UserManager.css";

// Form ban đầu cho việc thêm người dùng mới
const initialNewUser = {
    id: 0, // Sẽ được tự động tạo
    name: "",
    email: "",
    role: "buyer", // Mặc định là buyer
    status: "active",
};

export default function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState(initialNewUser);
    const [isEditing, setIsEditing] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // ✅ STATE MỚI CHO TÌM KIẾM

    // --- LOGIC LẤY DỮ LIỆU TỪ BACKEND ---
    const fetchUsers = async () => {
        try {
            const res = await api.get("/user");
            setUsers(res.data);
        } catch (err) {
            console.error("Lỗi tải người dùng:", err);
            // setUsers([ /* Dữ liệu giả lập */ ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- CHỨC NĂNG SỬA TRẠNG THÁI (UPDATE STATUS) ---
    // Lưu ý: Đây là cập nhật local, bạn nên thêm gọi API PUT lên Backend tại đây
    const updateLocalStatus = (id, newStatus) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === id
                    ? { ...user, status: newStatus }
                    : user
            )
        );
    };

    // --- CHỨC NĂNG THÊM (CREATE) (Tạm thời là Local) ---
    const handleAddUser = (e) => {
        e.preventDefault();
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        setUsers(prev => [
            ...prev,
            { ...newUser, id: newId }
        ]);
        setNewUser(initialNewUser); // Reset form
        alert(`Đã thêm người dùng: ${newUser.name}`);
    };

    // --- CHỨC NĂNG CHỈNH SỬA (UPDATE INFO) (Tạm thời là Local) ---
    const handleStartEdit = (user) => {
        setIsEditing(true);
        setEditUser(user);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();

        setUsers(prev =>
            prev.map(user =>
                user.id === editUser.id ? editUser : user
            )
        );
        setIsEditing(false);
        setEditUser(null);
        alert(`Đã sửa thông tin người dùng ID: ${editUser.id}`);
    };

    // --- CHỨC NĂNG XÓA (DELETE) (Tạm thời là Local) ---
    const handleDeleteUser = (id) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ID ${id} không?`)) {
            setUsers(prev => prev.filter(user => user.id !== id));
            alert(`Đã xóa người dùng ID: ${id}`);
        }
    };

    // ✅ LOGIC LỌC DANH SÁCH NGƯỜI DÙNG
    const filteredUsers = users.filter(user => {
        const term = searchTerm.toLowerCase();
        const userIdString = user.id ? user.id.toString() : "";
        const userName = user.name ? user.name.toLowerCase() : "";
        const userEmail = user.email ? user.email.toLowerCase() : "";

        return (
            userName.includes(term) || 
            userEmail.includes(term) || 
            userIdString.includes(term)
        );
    });
    // ------------------------------------

    // --- RENDER GIAO DIỆN ---
    return (
        <div className="admin-page-content">
            <h2>👥 Quản lý người dùng ({users.length} tài khoản)</h2>

            <hr />
            
            {/* ✅ KHU VỰC TÌM KIẾM */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm theo ID, Tên, hoặc Email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    // Sử dụng class đã định nghĩa trong ShopManager.css
                    className="search-input" 
                />
            </div>
            {/* ------------------------- */}

            {loading && <p>Đang tải danh sách người dùng...</p>}

            {filteredUsers.length === 0 && searchTerm && !loading ? (
                <p>Không tìm thấy người dùng nào khớp với từ khóa "{searchTerm}".</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="th-sm">ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th className="th-action">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* ✅ SỬ DỤNG DANH SÁCH ĐÃ LỌC */}
                        {filteredUsers.map((u) => (
                            <tr key={u.id} className={u.status === 'banned' ? 'row-banned' : ''}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`role-tag role-${u.role}`}>
                                        {u.role}
                                    </span>
                                </td>

                                {/* CỘT TRẠNG THÁI & CHỈNH SỬA LOCAL */}
                                <td>
                                    <select
                                        value={u.status}
                                        onChange={(e) => updateLocalStatus(u.id, e.target.value)}
                                        className={`status-select status-${u.status}`}
                                    >
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="banned">Banned</option>
                                    </select>
                                </td>

                                {/* CỘT THAO TÁC */}
                                <td className="action-cell">
                                    <button
                                        className="btn btn-action btn-edit"
                                        onClick={() => handleStartEdit(u)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-action btn-delete"
                                        onClick={() => handleDeleteUser(u.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal/Form Sửa thông tin - Giữ nguyên */}
            {isEditing && editUser && (
                <div className="modal-backdrop" onClick={() => setIsEditing(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>✏️ Sửa Người Dùng ID: {editUser.id}</h3>
                        <form onSubmit={handleSaveEdit}>
                            <label>Tên:</label>
                            <input
                                value={editUser.name}
                                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                required
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                value={editUser.email}
                                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                required
                            />
                            <label>Vai trò:</label>
                            <select
                                value={editUser.role}
                                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                            >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="btn-group">
                            <button type="submit" className="btn btn-primary">Lưu</button>
                            <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}