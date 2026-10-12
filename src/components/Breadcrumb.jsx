import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
    return (
        <div className="w-full bg-gray-50/50 py-3 px-4 md:px-8 border-b border-gray-100">
            <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-[13px] font-medium text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <Link to="/" className="hover:text-[#E51A22] transition-colors">Home</Link>
                {items && items.map((item, index) => (
                    <React.Fragment key={index}>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {item.link ? (
                            <Link to={item.link} className="hover:text-[#E51A22] transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-800 font-semibold">{item.label}</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Breadcrumb;
