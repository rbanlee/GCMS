import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { User, UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Trash, Key, X, Shield, User as UserIcon } from 'lucide-react';

const ManageUsers: React.FC = () => {
  const { t } = useLanguage();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = async () => {
    const list = await db.getUsers();
    setUsers(list);
  };

  const handleCreate = () => {
    setEditForm({
      id: Math.random().toString(36).substr(2, 9),
      username: '',
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    setPassword('');
    setIsEditing(true);
  };

  const handleEdit = (user: User) => {
    setEditForm(user);
    setPassword(''); // Empty means don't change
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.username || !editForm.role) return;

    // Check if username exists (if creating new)
    if (!editForm.id) {
       // logic for new id is in init, but checks here just in case
    } else {
        const existing = users.find(u => u.username === editForm.username && u.id !== editForm.id);
        if (existing) {
            alert(t({ en: 'Username already taken.', zh: '用户名已存在。' }));
            return;
        }
    }

    const userToSave: User = {
        id: editForm.id!,
        username: editForm.username,
        role: editForm.role,
        createdAt: editForm.createdAt || new Date().toISOString(),
        password: password ? password : undefined // db.saveUser handles undefined password
    };

    await db.saveUser(userToSave);
    setIsEditing(false);
    refreshUsers();
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      alert(t({ en: 'You cannot delete yourself.', zh: '不能删除自己。' }));
      return;
    }
    if (window.confirm(t({ en: 'Delete this user?', zh: '删除此用户？' }))) {
      await db.deleteUser(id);
      refreshUsers();
    }
  };

  if (currentUser?.role !== 'super_admin') {
      return <div className="p-8 text-red-600">{t({ en: 'Access Denied', zh: '无权访问' })}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t({ en: 'Manage Users', zh: '用户管理' })}</h1>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> {t({ en: 'Add User', zh: '添加用户' })}
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold">
                   {users.find(u => u.id === editForm.id) 
                        ? t({ en: 'Edit User / Reset Password', zh: '编辑用户 / 重置密码' }) 
                        : t({ en: 'New User', zh: '新建用户' })}
               </h2>
               <button onClick={() => setIsEditing(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t({ en: 'Username', zh: '用户名' })}</label>
                    <input 
                        type="text" 
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={editForm.username}
                        onChange={e => setEditForm({...editForm, username: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">{t({ en: 'Role', zh: '角色' })}</label>
                    <select 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={editForm.role}
                        onChange={e => setEditForm({...editForm, role: e.target.value as UserRole})}
                    >
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {t({ en: 'Password', zh: '密码' })} 
                        {users.find(u => u.id === editForm.id) && <span className="text-xs text-gray-500 ml-2 font-normal">({t({ en: 'Leave blank to keep current', zh: '不修改请留空' })})</span>}
                    </label>
                    <input 
                        type="password" 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required={!users.find(u => u.id === editForm.id)}
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
                        {t({ en: 'Cancel', zh: '取消' })}
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {t({ en: 'Save User', zh: '保存用户' })}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map(u => (
            <li key={u.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                 <div className={`p-2 rounded-full mr-4 ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role === 'super_admin' ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                 </div>
                 <div>
                   <p className="text-sm font-medium text-gray-900">{u.username}</p>
                   <p className="text-xs text-gray-500 capitalize">{u.role.replace('_', ' ')}</p>
                 </div>
              </div>
              <div className="flex gap-2">
                <button 
                    onClick={() => handleEdit(u)} 
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1 text-sm bg-blue-50 px-2 py-1 rounded" 
                    title={t({ en: 'Edit / Reset Password', zh: '编辑 / 重置密码' })}
                >
                    <Key className="w-4 h-4" /> {t({ en: 'Edit', zh: '编辑' })}
                </button>
                {u.id !== currentUser?.id && (
                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-900 ml-2" title={t({ en: 'Delete', zh: '删除' })}>
                        <Trash className="w-5 h-5" />
                    </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageUsers;