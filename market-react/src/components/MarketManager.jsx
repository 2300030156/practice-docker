import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './style.css';
import config from './config.js';

function MarketManager() {
  // State
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null); // item selected for view/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const baseUrl = `${config.url}/marketapi`;

  // API helpers
  const fetchAllItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setItems(res.data || []);
    } catch (error) {
      console.error(error);
      setMessage('Unable to load items.');
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchAllItems();
  }, [fetchAllItems]);

  const addItem = async (itm) => {
    try {
      await axios.post(`${baseUrl}/add`, itm);
      setMessage('Item added.');
      fetchAllItems();
      closeModal();
    } catch (error) {
      console.error(error);
      setMessage('Failed to add item.');
    }
  };

  const updateItem = async (itm) => {
    try {
      await axios.put(`${baseUrl}/update`, itm);
      setMessage('Item updated.');
      fetchAllItems();
      closeModal();
    } catch (error) {
      console.error(error);
      setMessage('Failed to update item.');
    }
  };

  const deleteItem = async (id) => {
    if (!confirm(`Delete item with ID ${id}?`)) return;
    try {
      await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage('Item deleted.');
      fetchAllItems();
    } catch (error) {
      console.error(error);
      setMessage('Failed to delete item.');
    }
  };

  // Modal controls
  const openCreate = () => {
    setSelected({ id: '', name: '', category: '', price: '', quantity: '', unit: '' });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEdit = (itm) => {
    setSelected({ ...itm });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setIsModalOpen(false);
    setIsEdit(false);
  };

  // Form submit
  const submitForm = (e) => {
    e.preventDefault();
    if (!selected) return;
    // basic validation
    const keys = ['id', 'name', 'category', 'price', 'quantity', 'unit'];
    for (let k of keys) {
      if (selected[k] === undefined || selected[k] === null || selected[k].toString().trim() === '') {
        setMessage(`Please fill ${k}`);
        return;
      }
    }

    if (isEdit) updateItem(selected);
    else addItem(selected);
  };

  return (
    <div className="market-app">
      <header className="app-header">
        <h1>Market Manager</h1>
        <div className="header-actions">
          <button className="btn primary" onClick={openCreate}>New Item</button>
          <button className="btn" onClick={fetchAllItems}>Refresh</button>
        </div>
      </header>

      {message && <div className="toast">{message}</div>}

      <main>
        <section className="grid">
          {loading ? (
            <div className="empty">Loading...</div>
          ) : items.length === 0 ? (
            <div className="empty">No items yet — click New Item to add one.</div>
          ) : (
            items.map(itm => (
              <article className="card" key={itm.id}>
                <div className="card-header">
                  <h4>{itm.name}</h4>
                  <div className="chip">{itm.category}</div>
                </div>
                <div className="card-body">
                  <div><strong>Price:</strong> {itm.price}</div>
                  <div><strong>Qty:</strong> {itm.quantity} {itm.unit}</div>
                  <div className="muted">ID: {itm.id}</div>
                </div>
                <div className="card-footer">
                  <button className="btn" onClick={() => openEdit(itm)}>Edit</button>
                  <button className="btn danger" onClick={() => deleteItem(itm.id)}>Delete</button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{isEdit ? 'Edit Item' : 'Create Item'}</h3>
            <form onSubmit={submitForm} className="modal-form">
              <label>ID<input type="number" name="id" value={selected.id} onChange={(e) => setSelected({ ...selected, id: e.target.value })} /></label>
              <label>Name<input type="text" name="name" value={selected.name} onChange={(e) => setSelected({ ...selected, name: e.target.value })} /></label>
              <label>Category
                <select value={selected.category} onChange={(e) => setSelected({ ...selected, category: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Grain">Grain</option>
                </select>
              </label>
              <label>Price<input type="number" name="price" value={selected.price} onChange={(e) => setSelected({ ...selected, price: e.target.value })} /></label>
              <label>Quantity<input type="number" name="quantity" value={selected.quantity} onChange={(e) => setSelected({ ...selected, quantity: e.target.value })} /></label>
              <label>Unit
                <select value={selected.unit} onChange={(e) => setSelected({ ...selected, unit: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Kg">Kg</option>
                  <option value="Gram">Gram</option>
                  <option value="Dozen">Dozen</option>
                </select>
              </label>

              <div className="modal-actions">
                <button className="btn primary" type="submit">{isEdit ? 'Update' : 'Create'}</button>
                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketManager;