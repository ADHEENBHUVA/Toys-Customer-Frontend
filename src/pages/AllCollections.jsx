import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';

const AllCollections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const res = await fetch(`${apiUrl}/collections`);
                const data = await res.json();
                if (data.success) {
                    setCollections(data.data.filter(c => c.status === 'Active'));
                }
            } catch (error) {
                console.error("Error fetching collections:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCollections();
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
            <Breadcrumb items={[{ label: 'Collections', link: null }]} />
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-[#111] mb-4">Shop By Collection</h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">Discover our specially curated collections featuring the most popular and exciting products for every occasion.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collections.map((col, index) => (
                        <Link 
                            key={col._id} 
                            to={`/products?collection=${col._id}`}
                            className="group relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                        >
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="w-full h-full relative"
                            >
                                {col.image ? (
                                    <img src={col.image.startsWith('http') || col.image.startsWith('data:') || col.image.startsWith('/gallery') ? col.image : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${col.image.startsWith('/') ? '' : '/'}${col.image}`} alt={col.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                ) : (
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                                )}
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <h3 className="text-3xl font-black text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{col.name}</h3>
                                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 delay-75">
                                        <span className="text-white font-medium bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm">
                                            {col.productCount > 0 ? `${col.productCount} Items` : 'Explore Collection'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllCollections;
