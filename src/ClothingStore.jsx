import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './cloth.css';

const ClothingStore = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [products, setProducts] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        displayProducts(selectedCategories,searchQuery);
    }, [categories, selectedCategories, searchQuery]);

    const displayProducts = (selectedCategories, searchQuery) => {
        const filteredProducts = categories.flatMap(category => {
            if (selectedCategories.length === 0 || selectedCategories.includes(category.category_name)) {
                return category.category_products.filter(product =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(product => (
                    <div className="productItems" key={product.title}>
                        <h6>{product.vendor}</h6>
                        <hr />
                        <img src={product.image} alt={product.title} />
                        <h6>{product.badge_text || ""}</h6>
                        <h6>Price Rs. <span className='price'>{product.price}</span> | <span className='danger'><s>{product.compare_at_price}</s></span></h6>
                        <h5>{product.title}</h5>
                    </div>
                ));
            }
            return [];
        });
        setProducts(filteredProducts);
    };

    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedCategories(prev => [...prev, value]);
        } else {
            setSelectedCategories(prev => prev.filter(category => category !== value));
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };
      
    return (
        <div className="container">
            <h1>Clothing E-Store</h1>
            <nav className="navbar navbar-light bg-light justify-content-between d-flex">
                <h2><a className="navbar-brand">category</a></h2>
                <form className="form-inline">
                    <input
                        className="form-control mr-sm-2"
                        type="search"
                        placeholder="Search by product title"
                        aria-label="Search"
                        onChange={handleSearch}/>
                </form>
            </nav>
            <div className="categoryList">
                {categories.map(category => (
                    <label key={category.category_name}>
                        <input type="checkbox" onChange={handleCategoryChange} value={category.category_name} /> &nbsp; {category.category_name}&nbsp;&nbsp;
                    </label>
                ))}
            </div>
            <div className="product">
                {products}
            </div>
        </div>
    );
};

export default ClothingStore;
