import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';

const AllCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/categories');
                const data = await res.json();
                if (data.success) {
                    setCategories(data.data.filter(c => c.status === 'Active'));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#E51A22] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Breadcrumb items={[{ label: 'Categories', link: null }]} />
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-[#111] mb-4">Shop By Category</h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">Explore our wide range of toys, games, and educational materials categorized to help you find exactly what you're looking for.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                    {categories.map((cat, index) => (
                        <Link 
                            key={cat._id} 
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            className="group bg-white rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#E51A22]/30"
                        >
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="w-full"
                            >
                                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 bg-gray-50 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-500 shadow-md group-hover:shadow-xl border-4 border-white">
                                    {cat.image ? (
                                        <img src={cat.image.startsWith('http') || cat.image.startsWith('data:') || cat.image.startsWith('/gallery') ? cat.image : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${cat.image.startsWith('/') ? '' : '/'}${cat.image}`} alt={cat.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">No Image</div>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#E51A22] transition-colors">{cat.name}</h3>
                                {cat.productCount > 0 && (
                                    <p className="text-sm font-medium text-gray-400 mt-2">{cat.productCount} Products</p>
                                )}
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllCategories;
