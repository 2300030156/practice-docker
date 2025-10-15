import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import config from './config.js';

function MarketManager() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({
    id: '',
    name: '',
    category: '',
    price: '',
    quantity: '',
    unit: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedItem, setFetchedItem] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const baseUrl = `${config.url}/marketapi`;

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setItems(res.data);
      setInitialLoad(false);
    } catch (error) {
      // Only show error if it's not the initial load or if there are no items
      if (!initialLoad || items.length === 0) {
        setMessage('Failed to fetch items.');
      }
      setInitialLoad(false);
    }
  };

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in item) {
      if (!item[key] || item[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addItem = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, item);
      setMessage('Item added successfully.');
      fetchAllItems();
      resetForm();
    } catch (error) {
      setMessage('Error adding item.');
    }
  };

  const updateItem = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, item);
      setMessage('Item updated successfully.');
      fetchAllItems();
      resetForm();
    } catch (error) {
      setMessage('Error updating item.');
    }
  };

  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllItems();
    } catch (error) {
      setMessage('Error deleting item.');
    }
  };

  const getItemById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedItem(res.data);
      setMessage('');
    } catch (error) {
      setFetchedItem(null);
      setMessage('Item not found.');
    }
  };

  const handleEdit = (itm) => {
    setItem(itm);
    setEditMode(true);
    setMessage(`Editing item with ID ${itm.id}`);
  };

  const resetForm = () => {
    setItem({
      id: '',
      name: '',
      category: '',
      price: '',
      quantity: '',
      unit: ''
    });
    setEditMode(false);
  };

  return (
    <div className="market-container">

      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>Market Management</h2>

      <div>
        <h3>{editMode ? 'Edit Item' : 'Add Item'}</h3>
        <div className="form-grid">
          <input type="number" name="id" placeholder="ID" value={item.id} onChange={handleChange} />
          <input type="text" name="name" placeholder="Item Name (e.g. Tomato)" value={item.name} onChange={handleChange} />

          <select name="category" value={item.category} onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Fruit">Fruit</option>
            <option value="Grain">Grain</option>
          </select>

          <input type="number" name="price" placeholder="Price" value={item.price} onChange={handleChange} />
          <input type="number" name="quantity" placeholder="Quantity" value={item.quantity} onChange={handleChange} />

          <select name="unit" value={item.unit} onChange={handleChange}>
            <option value="">Select Unit</option>
            <option value="Kg">Kg</option>
            <option value="Gram">Gram</option>
            <option value="Dozen">Dozen</option>
          </select>
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addItem}>Add Item</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateItem}>Update Item</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div>
        <h3>Get Item By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter ID"
        />
        <button className="btn-blue" onClick={getItemById}>Fetch</button>

        {fetchedItem && (
          <div>
            <h4>Item Found:</h4>
            <pre>{JSON.stringify(fetchedItem, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>All Items</h3>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(item).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((itm) => (
                  <tr key={itm.id}>
                    {Object.keys(item).map((key) => (
                      <td key={key}>{itm[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(itm)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteItem(itm.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default MarketManager;