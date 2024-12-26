import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import './UserManagement.css';

type User = {
  id: number;
  name: string;
  email: string;
};

type FormData = {
  name: string;
  email: string;
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); 
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const duplicate = users.some(
      (user) =>
        user.id !== editingUser?.id && 
        (user.name.toLowerCase() === data.name.toLowerCase() ||
          user.email.toLowerCase() === data.email.toLowerCase())
    );

    if (duplicate) {
      alert('User with the same name or email already exists.');
      return;
    }

    if (editingUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, name: data.name, email: data.email } : user
        )
      );
      setEditingUser(null);
    } else {
      setUsers((prevUsers) => [...prevUsers, { id: Date.now(), name: data.name, email: data.email }]);
    }

    reset();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset(user);
  };

  const handleDelete = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    if (editingUser?.id === id) {
      reset();
      setEditingUser(null);
    }
  };

  const handleSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });

    setUsers((prevUsers) => {
      const sortedUsers = [...prevUsers].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
        return 0;
      });
      return sortedUsers;
    });
  };


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="user-management">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <button type="submit">{editingUser ? 'Update User' : 'Add User'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>
              <button onClick={() => handleSort('name')}>
                Name {sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </button>
            </th>
            <th>
              <button onClick={() => handleSort('email')}>
                Email {sortConfig?.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td className="actions">
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        {[...Array(Math.ceil(users.length / usersPerPage))].map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} disabled={currentPage === index + 1}>
            {index + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(users.length / usersPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
